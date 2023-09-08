<script setup lang="ts">
// import { computed } from 'vue';

// import Avatar from '@/components/images/Avatar.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useWeb3 from '@/services/web3/useWeb3';
import { shorten } from '@/lib/utils';

import AppNavSettings from './AppNavSettings.vue';

const { upToLargeBreakpoint, isMobile } = useBreakpoints();
const { isLoadingProfile, profile, account } = useWeb3();

// const avatarSize = computed(() => {
//   if (bp.value === 'sm') {
//     return 35;
//   } else if (['md', 'lg'].includes(bp.value)) {
//     return 40;
//   } else {
//     return 20;
//   }
// });
</script>

<template>
  <BalPopover
    noPad
    :align="isMobile ? 'center' : undefined"
    :detached="isMobile ? true : undefined"
  >
    <template #activator>
      <BalBtn
        class="text-base ml-[40px] account-button"
        :class="{ btn: upToLargeBreakpoint }"
        :loading="isLoadingProfile"
        :loadingLabel="upToLargeBreakpoint ? '' : $t('connecting')"
        color="white"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <!-- <Avatar
          :iconURI="profile?.avatar || ''"
          :address="account"
          :size="avatarSize"
        /> -->
        <span
          v-if="profile && profile.ens"
          class="hidden lg:inline-block text-[15px]"
          v-text="profile && profile.ens"
        />
        <span
          v-else
          class="hidden lg:inline-block pl-2 eth-address text-[20px] font-[500]"
          v-text="shorten(account)"
        />
      </BalBtn>
    </template>
    <AppNavSettings />
  </BalPopover>
</template>

<style>
.account-button {
  @apply text-white font-[500] p-[15px] text-[20px];
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0px 0px 0px 3px #8b8dfc, 0px 0px 3px 2px #00000040;
  border: 1px solid #9b9b9b;
  border-radius: 60px;
  min-height: 50px;
}
</style>
