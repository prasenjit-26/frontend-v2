<script setup lang="ts">
import useWeb3 from '@/services/web3/useWeb3';
import { buildConnectorIconURL } from '@/lib/utils/urls';
import { Wallet, WalletNameMap } from '@/providers/wallet.provider';

const props = defineProps<{ wallet: Wallet }>();

const { connectWallet, toggleWalletSelectModal } = useWeb3();
function handleClick() {
  console.log('props.', props.wallet);
  connectWallet(props.wallet);
  toggleWalletSelectModal(false);
}
</script>

<template>
  <button class="wallet-connect-btn" @click="handleClick">
    <div class="flex items-center" style="width: 70%">
      <img
        :src="buildConnectorIconURL(wallet)"
        class="mr-4 w-[36px] h-[36px]"
      />
      <h5
        class="font-bold text-gray-700 dark:text-white text-[20px] font-[700]"
      >
        <span class="capitalize whitespace-nowrap">{{
          WalletNameMap[wallet]
        }}</span>
      </h5>
    </div>
  </button>
</template>

<style>
.wallet-connect-btn {
  @apply transition-all;
  @apply flex justify-start items-center w-full mb-[20px];
}
</style>
