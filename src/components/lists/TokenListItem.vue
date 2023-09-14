<template>
  <div
    ref="animateRef"
    :class="[
      `flex items-center py-3  ml-4 mr-2 px-2 text-base opacity-0  token-item-default transition-colors ease-in duration-300`,
      {
        'token-item': focussed,
      },
    ]"
  >
    <BalAsset
      :address="token.address"
      :iconURI="token.logoURI"
      :size="34"
      class="mr-3"
    />
    <div
      :class="['flex-auto', { 'text-blue-500 dark:text-blue-200': focussed }]"
    >
      {{ token.symbol }}
      <div class="w-40 md:w-60 text-sm truncate text-gray">
        {{ token.name }}
      </div>
    </div>
    <span
      v-if="!hideBalance"
      class="flex flex-col items-end font-medium text-right"
    >
      <BalLoadingBlock v-if="balanceLoading" class="w-14 h-4" />
      <template v-else>
        <template v-if="balance > 0">
          <template v-if="balance >= 0.0001">
            {{ fNum(balance, FNumFormats.token) }}
          </template>
          <template v-else> &#60; 0.0001 </template>
        </template>
        <div v-if="value > 0" class="text-sm font-normal text-secondary">
          {{ fNum(value, FNumFormats.fiat) }}
        </div>
      </template>
    </span>
  </div>
</template>

<script lang="ts">
import anime from 'animejs';
import { computed, onMounted, onUnmounted, PropType, ref } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { TokenInfo } from '@/types/TokenList';

export default {
  name: 'TokenListItem',

  props: {
    token: { type: Object as PropType<TokenInfo>, required: true },
    balanceLoading: { type: Boolean, default: true },
    hideBalance: { type: Boolean, default: false },
    focussed: { type: Boolean, default: false },
  },

  setup(props) {
    /**
     * COMPOSABLES
     */
    const { fNum } = useNumbers();
    const animateRef = ref();
    const { priceFor, balanceFor } = useTokens();

    /**
     * COMPUTED
     */
    const balance = computed(() => Number(balanceFor(props.token.address)));
    const value = computed(() => balance.value * priceFor(props.token.address));

    /**
     * CALLBACKS
     */
    onMounted(() => {
      anime({
        opacity: 1,
        targets: animateRef.value,
        delay: anime.stagger(100),
      });
    });

    onUnmounted(() => {
      anime({
        opacity: 0,
        targets: animateRef.value,
      });
    });

    return {
      fNum,
      FNumFormats,
      animateRef,
      balance,
      value,
    };
  },
};
</script>
<style>
.token-item {
  border-radius: 12px;
  background: rgba(139, 141, 252, 0.6);
  box-shadow: 0px 0px 0px 2px #8b8dfc;
  margin-top: 5px;
}
.token-item-default {
  border-radius: 12px;
}
.token-item-default:hover {
  border-radius: 12px;
  border: 1px solid #8b8dfc;
  background: rgba(64, 65, 113, 0.6);
}
</style>