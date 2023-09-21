<script lang="ts" setup>
import { computed } from 'vue';

import { useLock } from '@/composables/useLock';
import useNetwork from '@/composables/useNetwork';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useWeb3 from '@/services/web3/useWeb3';

import HeroConnectWalletButton from './HeroConnectWalletButton.vue';
import { useUserPools } from '@/providers/local/user-pools.provider';
import { isVeBalSupported } from '@/composables/useVeBAL';
import ProceedToSyncModal from '../contextual/pages/vebal/cross-chain-boost/ProceedToSyncModal.vue';
import configs, { Network } from '@/lib/config';
import {
  useCrossChainSync,
  veBalSyncSupportedNetworks,
} from '@/providers/cross-chain-sync.provider';
import { NetworkSyncState } from '@/providers/cross-chain-sync.provider';

/**
 * COMPOSABLES
 */
const showProceedModal = ref(false);
const { fNum } = useNumbers();
const { isWalletReady, isWalletConnecting } = useWeb3();
const { totalFiatValue, isLoading: isLoadingPools } = useUserPools();
const { totalLockedValue } = useLock();
const { networkId } = useNetwork();
const {
  l2VeBalBalances,
  isLoading: isLoadingSyncState,
  networksSyncState,
} = useCrossChainSync();
/**
 * COMPUTED
 */
const classes = computed(() => ({
  ['h-48']: !isWalletReady.value && !isWalletConnecting.value,
  ['h-44']: isWalletReady.value || isWalletConnecting.value,
}));

const totalInvestedLabel = computed((): string =>
  fNum(totalFiatValue.value, FNumFormats.fiat)
);

const totalVeBalLabel = computed((): string =>
  fNum(totalLockedValue.value, FNumFormats.fiat)
);

const isLoadingTotalValue = computed((): boolean => isLoadingPools.value);

const showVeBalBalanceTooltip = computed(() => {
  if (!veBalSyncSupportedNetworks.includes(networkId.value)) {
    return false;
  }

  if (networksSyncState.value[networkId.value] === NetworkSyncState.Synced) {
    return false;
  }

  return true;
});

const veBalBalanceTooltip = computed(() => {
  return `Sync your veBAL balance from Ethereum Mainnet (L1) to ${
    configs[networkId.value].chainName
  } to get your max staking boost. Sync via the veBAL page on L1. Note: If you have just synced on L1, it may take up to an hour to display here.`;
});
</script>

<template>
  <div
    class="md:container flex justify-center items-center md:mx-auto w-full mt-[50px]"
  >
    <div class="balance-container">
      <div class="flex justify-between items-center w-full">
        <h1
          class="text-white text-[32px] font-[600]"
          v-text="$t('myBalancerBalance')"
        />

        <template v-if="isWalletReady || isWalletConnecting">
          <BalLoadingBlock
            v-if="isLoadingTotalValue"
            class="mx-auto w-40 h-10"
            white
          />
          <div v-else class="text-white text-[32px] font-[600]">
            {{ totalInvestedLabel }}
          </div>
        </template>
        <template v-else>
          <div class="text-3xl font-semibold text-white">
            {{ fNum('0', FNumFormats.fiat) }}
          </div>
        </template>
      </div>
      <div v-if="!isWalletReady">
        <HeroConnectWalletButton class="mt-4" />
      </div>
      <ProceedToSyncModal
        :isVisible="showProceedModal"
        @close="showProceedModal = false"
      />
    </div>
  </div>
</template>

<style>
.vebal-banner::before {
  @apply border border-yellow-500;

  content: '';
  width: 16px;
  height: 6px;
  left: 0;
  top: -5px;
  position: absolute;
  border-top-left-radius: 8px;
}

.vebal-banner::after {
  @apply border border-yellow-500;

  content: '';
  width: 16px;
  height: 6px;
  bottom: -5px;
  right: 0;
  position: absolute;
  border-bottom-right-radius: 8px;
}
.dark .balance-container {
  box-shadow: 0px 0px 0px 5px #8b8dfc99, 0px 0px 0px 10px #8b8dfc40,
    0px 0px 149px -46px #8b8dfccc;
  background: #161627;
  border-radius: 20px;
  padding: 50px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
}
.balance-container {
  border-radius: 20px;
  background: #8b8dfc;
  box-shadow: 0px 0px 0px 5px rgba(139, 141, 252, 0.6),
    0px 0px 0px 10px rgba(139, 141, 252, 0.25),
    0px 0px 149px -46px rgba(139, 141, 252, 0.8);
  padding: 50px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
}
</style>
