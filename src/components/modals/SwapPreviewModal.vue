<script setup lang="ts">
import { SubgraphPoolBase } from '@auroblocks/chimp-sdk';
import { formatUnits } from '@ethersproject/units';
import { mapValues } from 'lodash';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import SwapRoute from '@/components/cards/SwapCard/SwapRoute.vue';
import { SwapQuote } from '@/composables/swap/types';
import useRelayerApproval, {
  RelayerType,
} from '@/composables/approvals/useRelayerApproval';
import useRelayerApprovalTx from '@/composables/approvals/useRelayerApprovalTx';
import useTokenApprovalActions from '@/composables/approvals/useTokenApprovalActions';
import { ApprovalAction } from '@/composables/approvals/types';
import { UseSwapping } from '@/composables/swap/useSwapping';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useNetwork from '@/composables/useNetwork';
import { useTokens } from '@/providers/tokens.provider';
import { useUserSettings } from '@/providers/user-settings.provider';
import { FiatCurrency } from '@/constants/currency';
import { bnum, bnumZero } from '@/lib/utils';
import { isStETH } from '@/lib/utils/balancer/lido';
import { getWrapAction, WrapType } from '@/lib/utils/balancer/wrapper';
import useWeb3 from '@/services/web3/useWeb3';
import { TransactionActionInfo } from '@/types/transactions';

const PRICE_UPDATE_THRESHOLD = 0.02;

type Props = {
  swapping: UseSwapping;
  error?: any;
  warning?: any;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emit = defineEmits(['swap', 'close']);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { fNum, toFiat } = useNumbers();
const { balanceFor } = useTokens();
const { blockNumber, account, startConnectWithInjectedProvider } = useWeb3();
const { slippage } = useUserSettings();
const { networkConfig } = useNetwork();

/**
 * STATE
 */
const lastQuote = ref<SwapQuote | null>(
  props.swapping.isWrapUnwrapSwap.value ? null : props.swapping.getQuote()
);
const priceUpdated = ref(false);
const priceUpdateAccepted = ref(false);
const showSummaryInFiat = ref(false);
const loadingApprovals = ref(true);

/**
 * COMPUTED
 */
const slippageRatePercent = computed(() =>
  fNum(slippage.value, FNumFormats.percent)
);

const addressIn = computed(() => props.swapping.tokenIn.value.address);

const tokenInFiatValue = computed(() =>
  fNum(
    toFiat(
      props.swapping.tokenInAmountInput.value,
      props.swapping.tokenIn.value.address
    ),
    FNumFormats.fiat
  )
);

const tokenOutFiatValue = computed(() =>
  fNum(
    toFiat(
      props.swapping.tokenOutAmountInput.value,
      props.swapping.tokenOut.value.address
    ),
    FNumFormats.fiat
  )
);

const showSwapRoute = computed(() => props.swapping.isBalancerSwap.value);

const zeroFee = computed(() =>
  showSummaryInFiat.value ? fNum('0', FNumFormats.fiat) : '0.0 ETH'
);

const exceedsBalance = computed(() => {
  return (
    account.value &&
    bnum(props.swapping.tokenInAmountInput.value).isGreaterThan(
      balanceFor(props.swapping.tokenInAddressInput.value)
    )
  );
});

const disableSubmitButton = computed(() => {
  return !!exceedsBalance.value || !!props.error || !!loadingApprovals.value;
});

const summary = computed(() => {
  const summaryItems = {
    amountBeforeFees: '',
    swapFees: '',
    totalWithoutSlippage: '',
    totalWithSlippage: '',
  };

  const exactIn = props.swapping.exactIn.value;

  const tokenIn = props.swapping.tokenIn.value;
  const tokenOut = props.swapping.tokenOut.value;

  const tokenInAmountInput = props.swapping.tokenInAmountInput.value;
  const tokenOutAmountInput = props.swapping.tokenOutAmountInput.value;

  if (props.swapping.isWrapUnwrapSwap.value) {
    summaryItems.amountBeforeFees = tokenOutAmountInput;
    summaryItems.swapFees = '0';
    summaryItems.totalWithoutSlippage = tokenOutAmountInput;
    summaryItems.totalWithSlippage = tokenOutAmountInput;
  } else {
    const quote = props.swapping.getQuote();

    if (exactIn) {
      summaryItems.amountBeforeFees = tokenOutAmountInput;
      summaryItems.swapFees = formatUnits(
        quote.feeAmountOutToken,
        tokenOut.decimals
      );
      summaryItems.totalWithoutSlippage = bnum(summaryItems.amountBeforeFees)
        .minus(summaryItems.swapFees)
        .toString();
      summaryItems.totalWithSlippage = formatUnits(
        quote.minimumOutAmount,
        tokenOut.decimals
      );
    } else {
      summaryItems.amountBeforeFees = tokenInAmountInput;
      summaryItems.swapFees = formatUnits(
        quote.feeAmountInToken,
        tokenIn.decimals
      );
      summaryItems.totalWithoutSlippage = bnum(summaryItems.amountBeforeFees)
        .plus(summaryItems.swapFees)
        .toString();
      summaryItems.totalWithSlippage = formatUnits(
        quote.maximumInAmount,
        tokenIn.decimals
      );
    }
  }

  if (showSummaryInFiat.value) {
    return mapValues(
      summaryItems,
      itemValue =>
        `${fNum(
          toFiat(itemValue, exactIn ? tokenOut.address : tokenIn.address),
          FNumFormats.fiat
        )}`
    );
  } else {
    return mapValues(
      summaryItems,
      itemValue =>
        `${fNum(itemValue, FNumFormats.token)} ${
          exactIn || props.swapping.isWrapUnwrapSwap.value
            ? tokenOut.symbol
            : tokenIn.symbol
        }`
    );
  }
});

const labels = computed(() => {
  if (props.swapping.isWrap.value) {
    return {
      modalTitle: t('previewWrap', [props.swapping.tokenIn.value.symbol]),
      confirmSwap: t('confirmWrap', [props.swapping.tokenIn.value.symbol]),
      swapSummary: {
        title: t('swapSummary.wrap.title'),
        swapFees: t('swapSummary.wrap.swapFees'),
        totalBeforeFees: t('swapSummary.wrap.totalBeforeFees'),
        totalAfterFees: t('swapSummary.wrap.totalAfterFees'),
        totalWithSlippage: t('swapSummary.wrap.totalWithSlippage', [
          props.swapping.tokenIn.value.symbol,
        ]),
      },
    };
  } else if (props.swapping.isUnwrap.value) {
    return {
      modalTitle: t('previewUnwrap', [props.swapping.tokenOut.value.symbol]),
      confirmSwap: t('confirmUnwrap', [props.swapping.tokenOut.value.symbol]),
      swapSummary: {
        title: t('swapSummary.unwrap.title'),
        swapFees: t('swapSummary.unwrap.swapFees'),
        totalBeforeFees: t('swapSummary.unwrap.totalBeforeFees'),
        totalAfterFees: t('swapSummary.unwrap.totalAfterFees'),
        totalWithSlippage: t('swapSummary.unwrap.totalWithSlippage', [
          props.swapping.tokenOut.value.symbol,
        ]),
      },
    };
  } else if (props.swapping.exactIn.value) {
    return {
      modalTitle: t('previewSwap'),
      confirmSwap: t('confirmSwap'),
      swapSummary: {
        title: t('swapSummary.exactIn.title', [
          props.swapping.tokenIn.value.symbol,
        ]),
        swapFees: t('swapSummary.exactIn.swapFees'),
        totalBeforeFees: t('swapSummary.exactIn.totalBeforeFees'),
        totalAfterFees: t('swapSummary.exactIn.totalAfterFees'),
        totalWithSlippage: t('swapSummary.exactIn.totalWithSlippage', [
          slippageRatePercent.value,
        ]),
      },
    };
  }
  // exact out
  return {
    modalTitle: t('previewSwap'),
    confirmSwap: t('confirmSwap'),
    swapSummary: {
      title: t('swapSummary.exactOut.title', [
        props.swapping.tokenOut.value.symbol,
      ]),
      swapFees: t('swapSummary.exactOut.swapFees'),
      totalBeforeFees: t('swapSummary.exactOut.totalBeforeFees'),
      totalAfterFees: t('swapSummary.exactOut.totalAfterFees'),
      totalWithSlippage: t('swapSummary.exactOut.totalWithSlippage', [
        slippageRatePercent.value,
      ]),
    },
  };
});

const wrapType = computed(() =>
  getWrapAction(
    props.swapping.tokenIn.value.address,
    props.swapping.tokenOut.value.address
  )
);

const isStETHSwap = computed(
  () =>
    isStETH(addressIn.value, props.swapping.tokenOut.value.address) &&
    wrapType.value === WrapType.NonWrap
);

const { getTokenApprovalActions } = useTokenApprovalActions();
const tokenApprovalActions = ref<TransactionActionInfo[]>([]);

const {
  relayerSignature: batchRelayerSignature,
  relayerApprovalAction: batchRelayerApprovalAction,
} = useRelayerApproval(RelayerType.BATCH);

const batchRelayerApproval = useRelayerApprovalTx(RelayerType.BATCH);

const cowswapRelayerApproval = useRelayerApprovalTx(
  RelayerType.COWSWAP,
  props.swapping.isCowswapSwap
);

const lidoRelayerApproval = useRelayerApprovalTx(RelayerType.LIDO, isStETHSwap);

const pools = computed<SubgraphPoolBase[]>(() => {
  return props.swapping.sor.pools.value;
});

const requiresBatchRelayerApproval = computed(
  () =>
    props.swapping.isJoinExitSwap.value &&
    !batchRelayerApproval.isUnlocked.value &&
    !batchRelayerSignature.value
);

const requiresCowswapRelayerApproval = computed(
  () =>
    props.swapping.isCowswapSwap.value &&
    props.swapping.requiresTokenApproval.value &&
    !cowswapRelayerApproval.isUnlocked.value
);

const requiresLidoRelayerApproval = computed(
  () =>
    props.swapping.isBalancerSwap.value && !lidoRelayerApproval.isUnlocked.value
);

const showBatchRelayerApprovalStep = computed(
  () =>
    props.swapping.isJoinExitSwap.value &&
    !batchRelayerApproval.isUnlocked.value
);

const showCowswapRelayerApprovalStep = computed(
  () =>
    requiresCowswapRelayerApproval.value ||
    cowswapRelayerApproval.init.value ||
    cowswapRelayerApproval.approved.value ||
    cowswapRelayerApproval.approving.value
);

const showLidoRelayerApprovalStep = computed(
  () =>
    !props.swapping.isJoinExitSwap.value &&
    (requiresLidoRelayerApproval.value ||
      lidoRelayerApproval.init.value ||
      lidoRelayerApproval.approved.value ||
      lidoRelayerApproval.approving.value)
);

const requiresApproval = computed(
  () =>
    requiresBatchRelayerApproval.value ||
    requiresCowswapRelayerApproval.value ||
    requiresLidoRelayerApproval.value
);

const showPriceUpdateError = computed(
  () =>
    !requiresApproval.value && priceUpdated.value && !priceUpdateAccepted.value
);

const actions = computed((): TransactionActionInfo[] => {
  const actions: TransactionActionInfo[] = [];

  if (showCowswapRelayerApprovalStep.value) {
    actions.push(cowswapRelayerApproval.action.value);
  } else if (showLidoRelayerApprovalStep.value) {
    actions.push(lidoRelayerApproval.action.value);
  } else if (showBatchRelayerApprovalStep.value) {
    actions.push(batchRelayerApprovalAction.value);
  }

  if (tokenApprovalActions.value.length > 0) {
    actions.push(...tokenApprovalActions.value);
  }

  actions.push({
    label: labels.value.confirmSwap,
    loadingLabel: t('actionSteps.swap.loadingLabel'),
    confirmingLabel: t('confirming'),
    action: swap as () => Promise<any>,
    stepTooltip:
      props.swapping.isCowswapSwap.value && !props.swapping.isJoinExitSwap
        ? t('swapSummary.transactionTypesTooltips.sign.content')
        : t('swapSummary.transactionTypesTooltips.swap.content'),
  });

  return actions;
});

/**
 * METHODS
 */
async function swap() {
  return props.swapping.swap(() => {
    props.swapping.resetAmounts();
    emit('close');
  });
}

function onClose() {
  emit('close');
}

function cofirmPriceUpdate() {
  priceUpdated.value = false;
  priceUpdateAccepted.value = true;
  lastQuote.value = props.swapping.getQuote();
}

function handlePriceUpdate() {
  if (lastQuote.value != null) {
    const newQuote = props.swapping.getQuote();

    /**
     * The bignumber returned via the quotes for some reason throw underflow
     * errors when attempting to use the gt function with the threshold value.
     * For that reason, the price difference has to be cast to our bignumber type.
     */
    if (props.swapping.exactIn.value) {
      const lastQuoteMin = bnum(lastQuote.value.minimumOutAmount.toString());
      const newQuoteMin = bnum(newQuote.minimumOutAmount.toString());
      if (lastQuoteMin.eq(bnumZero)) {
        if (newQuoteMin.eq(bnumZero)) {
          priceUpdated.value = false;
        } else {
          priceUpdated.value = true;
        }
      } else {
        const priceDiff = lastQuoteMin
          .minus(newQuoteMin)
          .abs()
          .div(lastQuoteMin);

        priceUpdated.value = priceDiff.gt(PRICE_UPDATE_THRESHOLD);
      }
    } else {
      const lastQuoteMax = bnum(lastQuote.value.maximumInAmount.toString());
      const newQuoteMax = bnum(newQuote.maximumInAmount.toString());
      if (lastQuoteMax.eq(bnumZero)) {
        if (newQuoteMax.eq(bnumZero)) {
          priceUpdated.value = false;
        } else {
          priceUpdated.value = true;
        }
      } else {
        const priceDiff = lastQuoteMax
          .minus(newQuoteMax)
          .abs()
          .div(lastQuoteMax);

        priceUpdated.value = priceDiff.gt(PRICE_UPDATE_THRESHOLD);
      }
    }

    if (priceUpdated.value) {
      priceUpdateAccepted.value = false;
    }
  }
}

const tokenApprovalSpender = computed<string>(() => {
  if (props.swapping.isWrap.value && !props.swapping.isNativeAssetSwap.value) {
    // If we're wrapping a token other than native ETH
    // we need to approve the underlying on the wrapper
    return props.swapping.tokenOut.value.address;
  } else {
    return networkConfig.addresses.vault;
  }
});

/**
 * WATCHERS
 */
watch(blockNumber, () => {
  handlePriceUpdate();
});

/**
 * LIFECYCLE
 */
onBeforeMount(async () => {
  tokenApprovalActions.value = await getTokenApprovalActions({
    amountsToApprove: [
      {
        address: addressIn.value,
        amount: props.swapping.tokenInAmountInput.value,
      },
    ],
    spender: tokenApprovalSpender.value,
    actionType: ApprovalAction.Swapping,
  });
  loadingApprovals.value = false;
});
</script>

<template>
  <BalModal show :minWidth="500" @close="onClose">
    <div>
      <BalStack
        horizontal
        align="center"
        spacing="xs"
        class="justify-between mb-4"
      >
        <h4 class="text-[24px] font-[600]">
          {{ labels.modalTitle }}
        </h4>
        <button class="flex close-button-modal" @click="onClose">Close</button>
      </BalStack>
      <BalCard noPad class="overflow-auto relative mb-6" shadow="none" noBorder>
        <template #header>
          <div class="w-full">
            <div>
              <BalAlert
                v-if="error"
                class="p-3 mb-2"
                type="error"
                size="sm"
                :title="error.header"
                :description="error.body"
                :actionLabel="error.label"
                block
              />
              <BalAlert
                v-else-if="warning"
                class="p-3 mb-2"
                type="warning"
                size="sm"
                :title="warning.header"
                :description="warning.body"
                block
              />
            </div>
            <div class="w-full rounded-t-lg p-[22px] text-[18px] font-[400]">
              <span>
                {{ $t('effectivePrice') }}
                {{
                  swapping.exactIn.value
                    ? swapping.effectivePriceMessage.value.tokenIn
                    : swapping.effectivePriceMessage.value.tokenOut
                }}
              </span>
            </div>
          </div>
        </template>
        <div class="preview-details">
          <BalAlert
            v-if="exceedsBalance"
            class="p-3"
            type="error"
            size="sm"
            :title="`${t('exceedsBalance')} ${fNum(
              balanceFor(props.swapping.tokenInAddressInput.value),
              FNumFormats.token
            )} ${props.swapping.tokenIn.value.symbol}`"
            block
            square
          />
          <div class="relative p-3 border-b first-row">
            <div class="flex items-center">
              <div class="mr-3">
                <BalAsset
                  :address="swapping.tokenIn.value.address"
                  :size="36"
                />
              </div>
              <div>
                <div class="font-medium">
                  {{
                    fNum(swapping.tokenInAmountInput.value, FNumFormats.token)
                  }}
                  {{ swapping.tokenIn.value.symbol }}
                </div>
                <div class="text-sm text-secondary">
                  {{ tokenInFiatValue }}
                </div>
              </div>
            </div>
          </div>
          <div class="arrow-down">
            <ArrowDownIcon />
          </div>
          <div class="p-3">
            <div class="flex items-center">
              <div class="mr-3">
                <BalAsset
                  :address="swapping.tokenOut.value.address"
                  :size="36"
                />
              </div>
              <div>
                <div class="font-medium">
                  {{
                    fNum(swapping.tokenOutAmountInput.value, FNumFormats.token)
                  }}
                  {{ swapping.tokenOut.value.symbol }}
                </div>
                <div class="text-sm text-secondary">
                  {{ tokenOutFiatValue }}
                  <span
                    v-if="
                      swapping.isBalancerSwap.value ||
                      swapping.isWrapUnwrapSwap.value
                    "
                  >
                    / {{ $t('priceImpact') }}:
                    {{
                      fNum(swapping.sor.priceImpact.value, FNumFormats.percent)
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BalCard>
      <div class="border-bottom" />
      <BalCard noPad shadow="none" class="mb-3">
        <template #header>
          <div
            class="flex justify-between items-center p-3 w-full border-b dark:border-gray-900"
          >
            <div class="text-[20px] font-[600]">
              {{ labels.swapSummary.title }}
            </div>
            <div class="flex items-center toggle-select text-[14px]">
              <div
                :class="[
                  'pr-2 cursor-pointer font-medium toggle-button-default ',
                  { 'selected-toggle': !showSummaryInFiat },
                ]"
                @click="showSummaryInFiat = false"
              >
                {{ $t('tokens') }}
              </div>
              <div
                :class="[
                  'pl-2 cursor-pointer font-medium uppercase toggle-button-default ',
                  { 'selected-toggle': showSummaryInFiat },
                ]"
                @click="showSummaryInFiat = true"
              >
                {{ FiatCurrency.usd }}
              </div>
            </div>
          </div>
        </template>
        <div v-if="swapping.isCowswapSwap.value" class="p-3 text-sm">
          <div class="summary-item-row mb-[16px]">
            <div>
              {{ labels.swapSummary.totalBeforeFees }}
            </div>
            <div v-html="summary.amountBeforeFees" />
          </div>
          <div class="summary-item-row mb-[16px]">
            <div>{{ $t('swapSummary.gasCosts') }}</div>
            <div class="text-green-400">-{{ zeroFee }}</div>
          </div>
          <div class="summary-item-row">
            <div>{{ labels.swapSummary.swapFees }}</div>
            <div
              v-html="
                swapping.isWrapUnwrapSwap.value
                  ? zeroFee
                  : swapping.exactIn.value
                  ? `-${summary.swapFees}`
                  : `+${summary.swapFees}`
              "
            />
          </div>
        </div>
        <template #footer>
          <div
            class="p-3 w-full text-sm bg-white dark:bg-gray-800 rounded-b-lg summary-bg"
          >
            <div
              class="font-medium summary-item-row text-[16px] font-[500] mb-[20px]"
            >
              <div class="w-64 font-[500]">
                {{ labels.swapSummary.totalAfterFees }}
              </div>
              <div v-html="summary.totalWithoutSlippage" />
            </div>
            <div class="summary-item-row text-secondary text-[16px] font-[500]">
              <div class="w-64 font-[500]">
                {{ labels.swapSummary.totalWithSlippage }}
              </div>
              <div
                v-html="
                  swapping.isWrapUnwrapSwap.value
                    ? ''
                    : summary.totalWithSlippage
                "
              />
            </div>
          </div>
        </template>
      </BalCard>
      <BalAlert
        v-if="showPriceUpdateError"
        class="p-3 mb-4"
        type="error"
        size="md"
        :title="$t('priceUpdatedAlert.title')"
        :description="
          $t('priceUpdatedAlert.description', [
            fNum(PRICE_UPDATE_THRESHOLD, FNumFormats.percent),
          ])
        "
        :actionLabel="$t('priceUpdatedAlert.actionLabel')"
        block
        @action-click="cofirmPriceUpdate"
      />
      <BalBtn
        v-if="!account"
        color="gradient"
        block
        @click.prevent="startConnectWithInjectedProvider"
      >
        {{ $t('connectWallet') }}
      </BalBtn>
      <BalActionSteps
        v-else
        :actions="actions"
        primaryActionType="swap"
        :disabled="disableSubmitButton || showPriceUpdateError"
      />
      <BalAlert
        v-if="swapping.submissionError.value != null"
        class="p-3 mt-4"
        type="error"
        size="md"
        :title="$t('swapSubmissionError.title')"
        :description="swapping.submissionError.value"
        block
        :actionLabel="$t('swapSubmissionError.actionLabel')"
        @action-click="swapping.resetSubmissionError"
      />
      <BalAlert
        v-if="swapping.isJoinExitSwap.value"
        class="p-3 mt-4"
        type="tip"
        size="md"
        :title="''"
        :description="
          showBatchRelayerApprovalStep
            ? $t('isJoinExitTipDescription.withApproval')
            : $t('isJoinExitTipDescription.withoutApproval')
        "
        block
      />
    </div>
    <SwapRoute
      v-if="showSwapRoute"
      :addressIn="swapping.tokenIn.value.address"
      :amountIn="swapping.tokenInAmountInput.value"
      :addressOut="swapping.tokenOut.value.address"
      :amountOut="swapping.tokenOutAmountInput.value"
      :pools="pools"
      :sorReturn="swapping.sor.sorReturn.value"
      class="mt-3"
    />
  </BalModal>
</template>

<style scoped>
.dark .arrow-down {
  @apply absolute  rounded-full  flex items-center h-8 w-8 justify-center  mr-3;
  right: 0px;
  left: 0px;
  margin-right: auto;
  margin-left: auto;
  border: 0.9px solid #8b8dfc;
  background: #34355f;
  transform: translateY(-50%);
}
.arrow-down {
  @apply absolute  rounded-full  flex items-center h-8 w-8 justify-center  mr-3;
  right: 0px;
  left: 0px;
  margin-right: auto;
  margin-left: auto;
  border: 0.9px solid #8b8dfc;
  background: #dadbff;
  transform: translateY(-50%);
}

.summary-item-row {
  @apply flex justify-between mb-[10px];
}

.step {
  @apply rounded-full w-7 h-7 border border-gray-100 dark:border-gray-700 flex items-center
    justify-center text-purple-500 relative;
}

.step-seperator {
  @apply bg-gray-200 dark:bg-gray-700 h-px w-6;
}

.step-active {
  @apply border-purple-500 dark:border-purple-500;
}

.step-approved {
  @apply border-green-500 dark:border-green-500;
}
.dark .close-button-modal {
  border: 0.9px solid #8b8dfc;
  background: #34355f;
  border-radius: 25px;
  padding: 4px;
  font-size: 14px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
}
.close-button-modal {
  border: 1px solid #4e529c;
  background: rgba(229, 230, 255, 0.4);
  border-radius: 25px;
  padding: 4px;
  font-size: 14px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
}
.header-border {
  border: 1px solid #3f4083;
}
.dark .preview-details {
  background: #282853;
  border: 1px solid #3f4083;
  border-radius: 0px 0px 12px 12px;
}
.preview-details {
  border: 1px solid #3f4083;
  background: linear-gradient(
      0deg,
      rgba(139, 141, 252, 0.15) 0%,
      rgba(139, 141, 252, 0.15) 100%
    ),
    #d5d6ff;
  border-radius: 0px 0px 12px 12px;
}
.first-row {
  border-bottom: 1px solid #454680;
  border-radius: 0px 0px 1px 0px;
}
.border-bottom {
  border: 1px solid #8b8dfc66;
  background: #8b8dfc66;
  margin-bottom: 20px;
}
.dark .summary-bg {
  background: #3f4083;
}
.summary-bg {
  background: #e1e2ff;
}
.dark .toggle-select {
  border: 1px solid #8b8dfc;
  box-shadow: inset 0px 4px 4px 0px #00000040;
  background: #3f4083;
  border-radius: 37px;
  padding: 8px;
  min-width: 170px;
  max-height: 40px;
}
.toggle-select {
  border-radius: 37px;
  border: 1px solid #8b8dfc;
  background: #dadbff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
  padding: 8px;
  min-width: 170px;
  max-height: 40px;
}
.toggle-button-default {
  width: 50%;
  text-align: center;
  padding: 10px;
}
.dark .selected-toggle {
  box-shadow: inset 0px -1px 0px 0px #7b82f6, 0px 0px 4px -4px #00000040;
  border-radius: 24px;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #8b8dfc;
  max-height: 20px;
}
.selected-toggle {
  border-radius: 24px;
  background: #8b8dfc;
  box-shadow: 0px 0px 4px -4px rgba(0, 0, 0, 0.25),
    inset 0px -1px 0px 0px #7b82f6;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 20px;
  color: #ffffff;
}
</style>
