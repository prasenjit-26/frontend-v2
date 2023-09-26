<script lang="ts" setup>
import { computed } from 'vue';

import DarkModeToggle from '@/components/btns/DarkModeToggle.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { useSidebar } from '@/composables/useSidebar';
import useWeb3 from '@/services/web3/useWeb3';

import AppNavAccountBtn from './AppNavAccountBtn.vue';
// import AppNavActivityBtn from './AppNavActivityBtn/AppNavActivityBtn.vue';
import AppNavNetworkSelect from './AppNavNetworkSelect.vue';
import { Goals, trackGoal } from '@/composables/useFathom';

/**
 * COMPOSABLES
 */
const { isMobile, isDesktop } = useBreakpoints();
const { account, connector, startConnectWithInjectedProvider } = useWeb3();
const { setSidebarOpen } = useSidebar();

/**
 * COMPUTED
 */
const hideNetworkSelect = computed(() => connector.value?.id === 'gnosis');

/**
 * METHODS
 */
function connectWalletHandler() {
  trackGoal(Goals.ClickNavConnectWallet);
  startConnectWithInjectedProvider();
}
</script>

<template>
  <div class="grid grid-rows-1 grid-flow-col gap-2">
    <DarkModeToggle v-if="isDesktop" />
    <!-- <AppNavActivityBtn v-if="account" /> -->
    <AppNavNetworkSelect v-if="isDesktop" />
    <!-- <BalBtn
      v-if="isMobile"
      color="white"
      flat
      circle
      @click="setSidebarOpen(true)"
    >
      <BalIcon name="menu" size="lg" />
    </BalBtn> -->
    <AppNavAccountBtn v-if="account" />
    <BalBtn
      v-else
      color="white"
      class="ml-5 connect-button"
      :size="isMobile ? 'md' : 'sm'"
      @click="connectWalletHandler"
    >
      <!-- <WalletIcon class="mr-2" /> -->
      <span class="hidden lg:inline-block" v-text="$t('connectWallet')" />
      <span class="lg:hidden" v-text="$t('connect')" />
    </BalBtn>
  </div>
</template>
<style>
.connect-button {
  @apply text-white font-[500] p-[15px] text-[20px];
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0px 0px 0px 2px #8b8dfc, 0px 0px 3px 2px #00000040;
  border: 1px solid #9b9b9b;
  border-radius: 60px;
  min-height: 50px;
}
</style>
