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
    <AppNavNetworkSelect />
    <AppNavAccountBtn v-if="account" />
    <BalBtn
      v-if="isMobile && account"
      color="white"
      flat
      circle
      class="h-[24px]"
      @click="setSidebarOpen(true)"
    >
      <img src="~@/assets/images/hamBurgerMenu.png" alt="menu" width="30" />
    </BalBtn>
    <BalBtn
      v-if="!account"
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
  @apply text-white font-[500] xs:p-[10px] sm:p-[12px] p-[15px] xs:text-[12px] xs:text-[14px] text-[20px] lg:min-h-[40px] lg:h-[40px] xs:min-h-[30px] sm:min-h-[30px] h-[30px];
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0px 0px 0px 2px #8b8dfc, 0px 0px 3px 2px #00000040;
  border: 1px solid #9b9b9b;
  border-radius: 60px;
}
</style>
