<script setup lang="ts">
import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import { UseSwapping } from '@/composables/swap/useSwapping';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import useVeBal from '@/composables/useVeBAL';
import { bnum } from '@/lib/utils';

import SwapPairToggle from './SwapPairToggle.vue';

/**
 * TYPES
 */
type Props = {
  tokenInAmount: string;
  tokenInAddress: string;
  tokenOutAmount: string;
  tokenOutAddress: string;
  exactIn: boolean;
  priceImpact?: number;
  effectivePriceMessage?: UseSwapping['effectivePriceMessage'];
  swapLoading?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:tokenInAmount', value: string): void;
  (e: 'update:tokenInAddress', value: string): void;
  (e: 'update:tokenOutAmount', value: string): void;
  (e: 'update:tokenOutAddress', value: string): void;
  (e: 'update:exactIn', value: boolean): void;
  (e: 'amountChange'): void;
}>();

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { getToken } = useTokens();
const { veBalTokenInfo } = useVeBal();

/**
 * STATE
 */
const _tokenInAmount = ref<string>('');
const _tokenInAddress = ref<string>('');
const _tokenOutAmount = ref<string>('');
const _tokenOutAddress = ref<string>('');

const isInRate = ref<boolean>(true);

const typingTimeout = ref<any>(undefined);

/**
 * COMPUTED
 */
const missingToken = computed(
  () => !_tokenInAddress.value || !_tokenOutAddress.value
);

const missingAmount = computed(
  () => !_tokenInAmount.value || !_tokenOutAmount.value
);

const tokenIn = computed(() => getToken(_tokenInAddress.value));
const tokenOut = computed(() => getToken(_tokenOutAddress.value));

const rateLabel = computed(() => {
  if (missingToken.value || missingAmount.value) return '';

  if (props.effectivePriceMessage)
    return isInRate.value
      ? props.effectivePriceMessage.value.tokenIn
      : props.effectivePriceMessage.value.tokenOut;

  let rate, inSymbol, outSymbol;

  if (isInRate.value) {
    rate = bnum(_tokenOutAmount.value).div(_tokenInAmount.value).toString();
    inSymbol = tokenIn.value.symbol;
    outSymbol = tokenOut.value.symbol;
  } else {
    rate = bnum(_tokenInAmount.value).div(_tokenOutAmount.value).toString();
    inSymbol = tokenOut.value.symbol;
    outSymbol = tokenIn.value.symbol;
  }

  return `1 ${inSymbol} = ${fNum(rate, FNumFormats.token)} ${outSymbol}`;
});

/**
 * METHODS
 */
function preventUpdatesOnTyping(callback: () => void) {
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }
  typingTimeout.value = setTimeout(() => {
    callback();
  }, 300);
}

function handleInAmountChange(value: string): void {
  emit('update:tokenInAmount', value);
  preventUpdatesOnTyping(() => {
    emit('amountChange');
  });
}

function handleOutAmountChange(value: string): void {
  emit('update:tokenOutAmount', value);
  preventUpdatesOnTyping(() => {
    emit('amountChange');
  });
}

function handleTokenSwitch(): void {
  emit('update:exactIn', !props.exactIn);
  emit('update:tokenInAmount', _tokenOutAmount.value);
  emit('update:tokenInAddress', _tokenOutAddress.value);
  emit('update:tokenOutAmount', _tokenInAmount.value);
  emit('update:tokenOutAddress', _tokenInAddress.value);
  emit('amountChange');
}

async function handleInputTokenChange(newTokenIn: string) {
  if (newTokenIn === _tokenOutAddress.value) {
    handleTokenSwitch();
    return;
  }
  emit('update:tokenInAddress', newTokenIn);
}

async function handleOutputTokenChange(newTokenOut: string) {
  if (newTokenOut === _tokenInAddress.value) {
    handleTokenSwitch();
    return;
  }
  emit('update:tokenOutAddress', newTokenOut);
}

/**
 * CALLBACKS
 */
watchEffect(() => {
  _tokenInAmount.value = props.tokenInAmount;
  _tokenInAddress.value = props.tokenInAddress;
  _tokenOutAmount.value = props.tokenOutAmount;
  _tokenOutAddress.value = props.tokenOutAddress;
});
onMounted(() => {
  // populates initial tokenOutAmount
  if (props.tokenOutAmount) {
    handleOutAmountChange(props.tokenOutAmount);
  }
});
</script>

<template>
  <div>
    <TokenInput
      :amount="_tokenInAmount"
      :address="_tokenInAddress"
      name="tokenIn"
      :aria-label="$t('inputLabels.tokenIn')"
      :excludedTokens="veBalTokenInfo ? [veBalTokenInfo.address] : []"
      :ignoreWalletBalance="swapLoading"
      autoFocus
      @update:amount="handleInAmountChange"
      @update:address="handleInputTokenChange"
      @input="emit('update:exactIn', true)"
      @set-max="emit('update:exactIn', true)"
    />

    <div class="flex items-center my-2 align-center-toggle">
      <SwapPairToggle @toggle="handleTokenSwitch" />
      <!-- <div class="h-px mx-2 bg-gray-100 dark:bg-gray-700 grow" />
      <div
        v-if="rateLabel"
        class="flex items-center text-xs text-gray-600 cursor-pointer dark:text-gray-400"
        @click="isInRate = !isInRate"
        v-html="rateLabel"
      /> -->
    </div>
    <TokenInput
      class="mt-[20px]"
      :amount="_tokenOutAmount"
      :address="_tokenOutAddress"
      name="tokenOut"
      :aria-label="$t('inputLabels.tokenOut')"
      :priceImpact="priceImpact"
      noRules
      noMax
      disableNativeAssetBuffer
      :excludedTokens="veBalTokenInfo ? [veBalTokenInfo.address] : []"
      @update:amount="handleOutAmountChange"
      @update:address="handleOutputTokenChange"
      @input="emit('update:exactIn', false)"
    />
    <div v-if="rateLabel" class="info-conatiner">
      <div
        class="flex items-center text-white dark:text-black cursor-pointer text-[20px]"
        @click="isInRate = !isInRate"
        v-html="rateLabel"
      />
    </div>
  </div>
</template>
<style>
.dark .info-conatiner {
  box-shadow: 0px 0px 0px 2px #8b8dfc99;
  background: #212139;
  padding: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
}
.info-conatiner {
  background: #7476f3;
  box-shadow: 0px 0px 0px 2px rgba(139, 141, 252, 0.6);
  padding: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
}
.align-center-toggle {
  position: absolute;
  /* left: 0px; */
  /* right: 0px; */
  margin: auto;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  width: fit-content;
  top: 117px;
}
</style>