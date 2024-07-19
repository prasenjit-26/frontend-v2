<script lang="ts" setup>
import BigNumber from 'bignumber.js';
import { useI18n } from 'vue-i18n';

import AnimatePresence from '@/components/animate/AnimatePresence.vue';
import CreateActions from '@/components/cards/CreatePool/CreateActions.vue';
import usePoolCreation from '@/composables/pools/usePoolCreation';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { bnum, isSameAddress, shortenLabel } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';
import useNetwork from '@/composables/useNetwork';
import useBreakpoints from '@/composables/useBreakpoints';

/**
 * PROPS & EMITS
 */
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

/**
 * STATE
 */

const poolCreated = ref(false);

/**
 * COMPOSABLES
 */
const {
  seedTokens,
  poolLiquidity,
  poolTypeString,
  initialFee,
  name: poolName,
  symbol: poolSymbol,
  useNativeAsset,
  feeManagementType,
  feeController,
  thirdPartyFeeController,
  createPoolTxHash,
  goBack,
  setActiveStep,
  sortSeedTokens,
  getAmounts,
  saveState,
  getPoolSymbol,
} = usePoolCreation();

const { getToken, priceFor, nativeAsset, wrappedNativeAsset, balanceFor } =
  useTokens();
const { fNum } = useNumbers();
const { t } = useI18n();
const { account } = useWeb3();
const { networkConfig } = useNetwork();

/**
 * LIFECYCLE
 */
onBeforeMount(() => {
  sortSeedTokens();
  poolName.value = poolName.value || getPoolSymbol();
  poolSymbol.value = poolSymbol.value || getPoolSymbol();
});

/**
 * COMPUTED
 */
const title = computed((): string =>
  poolCreated.value
    ? t('poolCreated')
    : t('previewPool', [poolTypeString.value])
);

// translations are breaking when directly using this label
const initialWeightLabel = computed(() => t('initialWeight'));

const tokenAddresses = computed((): string[] => {
  return seedTokens.value.map(token => {
    if (
      token.tokenAddress == wrappedNativeAsset.value.address &&
      useNativeAsset.value
    ) {
      return nativeAsset.address;
    }
    return token.tokenAddress;
  });
});

const tokenAmounts = computed((): string[] => {
  return getAmounts();
});

const hasMissingPoolNameOrSymbol = computed(() => {
  return poolSymbol.value === '' || poolName.value === '';
});

const initialWeights = computed(() => {
  const _initialWeights: Record<string, BigNumber> = {};
  for (const seedToken of seedTokens.value) {
    _initialWeights[seedToken.tokenAddress] = bnum(seedToken.amount)
      .times(priceFor(seedToken.tokenAddress))
      .div(poolLiquidity.value);
  }
  return _initialWeights;
});

// an invalid initial weight is one where the the weight
// is less than 1% of the pools value
const hasInvalidInitialWeight = computed(() => {
  return Object.values(initialWeights.value).some(initialWeight =>
    initialWeight.lt(0.01)
  );
});

const showNativeAssetWarning = computed(() => {
  const nativeAssetBalance = balanceFor(nativeAsset.address);
  const wrappedNativeAssetBalance = balanceFor(
    wrappedNativeAsset.value.address
  );

  const seedAmount =
    seedTokens.value.find(token =>
      isSameAddress(token.tokenAddress, wrappedNativeAsset.value.address)
    )?.amount || '0';
  // when the UI is set to use the native asset and the user does
  // not have the required native asset amount to cover the fund
  if (useNativeAsset.value && bnum(nativeAssetBalance).lt(seedAmount)) {
    return true;
    // in the reverse case, if the user does not have the required
    // wrapped amount as well
  }
  if (!useNativeAsset.value && bnum(wrappedNativeAssetBalance).lt(seedAmount)) {
    return true;
  }
  return false;
});

/**
 * METHODS
 */
function handleSuccess(): void {
  poolCreated.value = true;
  emit('success');
}

function navigateToPoolFee() {
  setActiveStep(1);
}

function getSwapFeeManager() {
  if (feeManagementType.value === 'governance') {
    return t('balancerGovernance');
  } else {
    if (feeController.value === 'self') {
      return `${t('myWallet')}: ${shortenLabel(account.value)}`;
    } else {
      return shortenLabel(thirdPartyFeeController.value);
    }
  }
}

function getInitialWeightHighlightClass(tokenAddress: string) {
  return {
    'text-secondary': initialWeights[tokenAddress]?.gte(0.01),
    'text-orange-500': initialWeights[tokenAddress]?.lt(0.01),
  };
}
const { isDesktop } = useBreakpoints();
</script>

<template>
  <div class="flex">
    <button
      v-if="!createPoolTxHash && isDesktop"
      class="flex text-blue-500 hover:text-blue-700 mr-[25px] back-button"
      @click="goBack"
    >
      <BalIcon class="flex" name="chevron-left" />
    </button>
    <BalStack vertical spacing="xs" class="mb-24 center-col-container">
      <BalCard shadow="xl" noBorder>
        <BalStack vertical spacing="xs">
          <span class="text-xs text-secondary">{{ networkConfig?.name }}</span>
        </BalStack>
        <BalStack vertical>
          <div class="flex items-center mt-2">
            <BalCircle
              v-if="poolCreated"
              size="8"
              color="green"
              class="mr-2 text-white"
            >
              <BalIcon name="check" />
            </BalCircle>
            <BalStack horizontal align="center" spacing="xs">
              <h5
                class="font-semibold dark:text-gray-300 sm:text-[20px] xs:text-[18px] lg:text-[24px] mt-[10px] mb-[30px]"
              >
                {{ title }}
              </h5>
            </BalStack>
          </div>
          <BalCard shadow="none" noPad class="info-container">
            <!-- <div class="p-2 bg-gray-50 dark:bg-gray-700">
            <h6 class="text-sm">
              {{ $t('createAPool.tokensAndSeedLiquidity') }}
            </h6>
          </div> -->
            <BalStack vertical spacing="lg">
              <div
                v-for="token in seedTokens"
                :key="`tokenpreview-${token.tokenAddress}`"
              >
                <BalStack horizontal justify="between">
                  <BalStack horizontal align="center" class="asset-container">
                    <BalAsset
                      :address="token.tokenAddress"
                      :size="isDesktop ? 36 : 20"
                    />
                    <BalStack vertical spacing="none">
                      <span
                        class="font-semibold text-white sm:text-[14px] xs:text-[12px] lg:text-[19px]"
                      >
                        {{ getToken(token.tokenAddress)?.symbol }}
                        {{ fNum(token.weight / 100, FNumFormats.percent) }}
                      </span>
                    </BalStack>
                  </BalStack>
                  <BalStack vertical spacing="none" align="end">
                    <span
                      :class="[
                        'text-[14px] font-[500]',
                        getInitialWeightHighlightClass(token.tokenAddress),
                      ]"
                    >
                      {{ initialWeightLabel }}:
                      <!-- {{
                      fNum(
                        initialWeights[token.tokenAddress].toString(),
                        FNumFormats.percent
                      )
                    }} -->
                    </span>
                    <span class="font-semibold">
                      {{ fNum(token.amount, FNumFormats.token) }}
                      <!-- ( -->
                      <!-- <span class="text-sm text-secondary">
                      {{
                        fNum(
                          bnum(token.amount)
                            .times(priceFor(token.tokenAddress))
                            .toString(),
                          FNumFormats.fiat
                        )
                      }}
                      )
                    </span> -->
                    </span>
                  </BalStack>
                </BalStack>
              </div>
            </BalStack>
          </BalCard>
          <BalStack horizontal justify="between" class="info-container">
            <h6
              class="text-white sm:text-[16px] xs:text-[14px] lg:text-[20px] font-[600]"
            >
              {{ $t('total') }}
            </h6>
            <h6
              class="text-white sm:text-[16px] xs:text-[14px] lg:text-[20px] font-[600]"
            >
              {{ fNum(poolLiquidity.toString(), FNumFormats.fiat) }}
            </h6>
          </BalStack>
          <BalCard shadow="none" noPad>
            <div class="summary-header">
              <h6
                class="sm:text-[18px] xs:text-[16px] lg:text-[20px] font-[600]"
              >
                {{ $t('summary') }}
              </h6>
            </div>
            <BalStack vertical spacing="base" class="info-section">
              <BalStack horizontal justify="between">
                <span
                  class="sm:text-[16px] xs:text-[14px] lg:text-[18px] font-[500]"
                  >{{ $t('poolName') }}:</span
                >
                <BalInlineInput
                  v-model="poolName"
                  name="poolName"
                  size="xs"
                  inputAlignRight
                  @save="saveState"
                />
              </BalStack>
              <BalStack horizontal justify="between">
                <span
                  class="sm:text-[16px] xs:text-[14px] lg:text-[18px] font-[500]"
                  >{{ $t('poolSymbol') }}:</span
                >
                <BalInlineInput
                  v-model="poolSymbol"
                  name="poolSymbol"
                  size="xs"
                  inputAlignRight
                  @save="saveState"
                />
              </BalStack>
              <BalStack horizontal justify="between">
                <span
                  class="sm:text-[16px] xs:text-[14px] lg:text-[18px] font-[500]"
                  >{{ $t('poolType') }}:</span
                >
                <span
                  class="capitalize sm:text-[12px] xs:text-[11px] lg:text-[14px] font-[500]"
                  >{{ poolTypeString }}</span
                >
              </BalStack>
              <BalStack horizontal justify="between" class="mt-1">
                <span
                  class="sm:text-[16px] xs:text-[14px] lg:text-[18px] font-[500]"
                  >{{ $t('swapFee') }}:</span
                >
                <BalStack horizontal spacing="sm">
                  <span
                    class="sm:text-[12px] xs:text-[11px] lg:text-[14px] font-[500]"
                    >{{ fNum(initialFee, FNumFormats.percent) }}</span
                  >
                  <button
                    class="hover:text-blue-500"
                    @click="navigateToPoolFee"
                  >
                    <BalIcon name="edit" size="xs" />
                  </button>
                </BalStack>
              </BalStack>
              <BalStack horizontal justify="between">
                <span
                  class="sm:text-[16px] xs:text-[14px] lg:text-[18px] font-[500]"
                  >{{ $t('swapFeeManager') }}:</span
                >
                <BalStack horizontal spacing="sm">
                  <span
                    class="sm:text-[12px] xs:text-[11px] lg:text-[14px] font-[500]"
                    >{{ getSwapFeeManager() }}</span
                  >
                  <button
                    class="hover:text-blue-500"
                    @click="navigateToPoolFee"
                  >
                    <BalIcon name="edit" size="xs" />
                  </button>
                </BalStack>
              </BalStack>
            </BalStack>
          </BalCard>
          <AnimatePresence
            :isVisible="hasMissingPoolNameOrSymbol"
            unmountInstantly
          >
            <BalAlert :title="$t('missingPoolNameOrSymbol')" type="error">
              {{ $t('missingPoolNameOrSymbolInfo') }}
            </BalAlert>
          </AnimatePresence>
          <AnimatePresence
            :isVisible="hasInvalidInitialWeight && createPoolTxHash !== ''"
            unmountInstantly
          >
            <BalAlert
              :title="$t('createAPool.invalidInitialWeightsTitle')"
              type="warning"
            >
              {{ $t('createAPool.invalidInitialWeightsInfo') }}
            </BalAlert>
          </AnimatePresence>
          <AnimatePresence :isVisible="showNativeAssetWarning" unmountInstantly>
            <BalAlert
              :title="$t('createAPool.invalidInitialWeightsTitle')"
              type="warning"
            >
              {{ $t('createAPool.nativeAssetWarning') }}
            </BalAlert>
          </AnimatePresence>

          <CreateActions
            :createDisabled="hasMissingPoolNameOrSymbol"
            :tokenAddresses="tokenAddresses"
            :amounts="tokenAmounts"
            @success="handleSuccess"
          />
        </BalStack>
      </BalCard>
    </BalStack>
  </div>
</template>
<style>
.center-col-container {
  box-shadow: 0px 0px 0px 5px #8b8dfc99, 0px 0px 0px 10px #8b8dfc40,
    0px 0px 149px -46px #8b8dfccc;
  border-radius: 12px;
  padding: 16px;
}
.dark .info-container {
  border: 1px solid #8b8dfc;
  background: #282853;
  border-radius: 12px;
  padding: 24px;
  border-color: #8b8dfc !important;
}
.info-container {
  border-radius: 12px;
  background: #c7f0fe;
  padding: 24px;
}
.asset-container {
  background: #474881;
  border-radius: 52px;
  padding: 10px;
}
.dark .asset-container {
  background: #474881;
  border-radius: 52px;
  padding: 10px;
}
.dark .summary-header {
  background: #0e0f35;
  border: 1px solid #3f4083;
  border-bottom: 1px solid #595bac;
  border-radius: 12px 12px 0px 0px;
  padding: 20px;
}
.summary-header {
  background: #acb0ff;
  border: 1px solid rgba(139, 141, 252, 0.6);
  border-bottom: 1px solid rgba(139, 141, 252, 0.6);
  border-radius: 12px 12px 0px 0px;
  padding: 20px;
}
.dark .info-section {
  background: #282853;
  border: 1px solid #3f4083;
  padding: 24px;
}
.info-section {
  border: 1px solid #3f4083;
  background: linear-gradient(
      0deg,
      rgba(139, 141, 252, 0.15) 0%,
      rgba(139, 141, 252, 0.15) 100%
    ),
    #d5d6ff;
  padding: 24px;
  border-radius: 0px 0px 12px 12px;
}
.back-button {
  border: 1px solid #8b8dfc;
  padding: 12px;
  border-radius: 12px;
  background: transparent !important;
  height: fit-content;
}
</style>