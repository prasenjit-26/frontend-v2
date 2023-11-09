<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import { useRoute } from 'vue-router';
// import useWeb3 from '@/services/web3/useWeb3';
// import useBreakpoints from '@/composables/useBreakpoints';
// import whiteListedAddress from '@/data/whiteListedAddress.json';

const route = useRoute();
const isSwapPage = ref(false);
// const isUserAllowedToUse = ref(false);
// const { isMobile } = useBreakpoints();
// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
onMounted(() => {
  console.log('route fullPath mounted', route.fullPath);
  if (route.fullPath.includes('swap')) {
    isSwapPage.value = true;
  } else {
    isSwapPage.value = false;
  }
});
watch(
  () => route.fullPath,
  async () => {
    if (route.fullPath.includes('swap')) {
      isSwapPage.value = true;
    } else {
      isSwapPage.value = false;
    }
  }
);
// const { account } = useWeb3();
// const handleWhiteListedLogic = address => {
//   console.log('here', address);
//   if (account) {
//     if (import.meta.env.VITE_IS_ALPHA_WHITELISTENABLED) {
//       if (
//         whiteListedAddress
//           .toString()
//           .toLowerCase()
//           .includes(address.toLowerCase())
//       ) {
//         isUserAllowedToUse.value = true;
//       } else {
//         isUserAllowedToUse.value = false;
//       }
//     } else {
//       isUserAllowedToUse.value = true;
//     }
//   } else {
//     isUserAllowedToUse.value = true;
//   }
// };
// handleWhiteListedLogic(account.value);
// if (window.ethereum) {
//   window.ethereum.on('accountsChanged', function (accounts) {
//     console.log('accountsChanges', accounts[0]);
//     handleWhiteListedLogic(accounts[0]);
//   });
// }
</script>
<!-- background-image: url('../assets/images/swapBG.png'); -->
<template>
  <div>
    <div class="app-body">
      <AppNav />
      <!-- <div v-if="isMobile">
        <div class="flex flex-col justify-center items-center h-[50vh]">
          <p
            class="leading-normal text-center text-primary-600 dark:text-white font-[600] text-[35px] font-montserrat"
          >
            The Alpha Testnet is desktop only. Mobile version will be live on
            Beta Testnet.
          </p>
        </div>
      </div>
      <div v-else> -->
      <div>
        <div v-if="isSwapPage" class="swap-bg">
          <div class="mt-[100px]">
            <div class="sm:pb-3 lg:pb-16 xs:pb-3">
              <slot />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="sm:pb-3 lg:pb-16 xs:pb-3">
            <slot />
          </div>
        </div>
      </div>
      <!-- <div v-else>
        <div class="mt-[100px]">
          <div class="pb-16">
            <div class="flex flex-col justify-center items-center h-[50vh]">
              <img
                src="~@/assets/images/notwhitlisted.png"
                alt="chimp"
                width="250px"
              />
              <p
                class="leading-normal text-center text-primary-600 dark:text-white font-[600] text-[35px] font-montserrat mt-[20px]"
              >
                ALPHA Testnet Access: Limited User Preview for Chimp Exchange
              </p>
              <p
                class="max-w-3xl leading-normal text-center font-[400] text-[20px] font-montserrat mt-[25px]"
              >
                We're sorry, but it appears that your account is not currently
                whitelisted to access Chimp Exchange
              </p>
              <p
                class="max-w-3xl leading-normal text-center font-[400] text-[20px] font-montserrat mt-[25px]"
              >
                To get access to the alpha testnet please join our
                <a
                  href="https://discord.com/invite/EVFY8VhJkf"
                  target="_blank"
                  class="link-color font-[500]"
                  >Chimp Exchange discord</a
                >
              </p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
    <!-- </div> -->
    <Footer />
  </div>
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

.app-body {
  @apply bg-cover dark:bg-black;
  background: #ececfe;

  min-height: calc(100vh - 2rem);
}
.dark .app-body {
  background-image: url('@/assets/images/bgGradiant.png');
}
.dark .swap-bg {
  background-size: 101vw 100%;
  background-repeat: no-repeat;
  @apply bg-center;
  transition: all 0.3s ease-in-out;
  background-image: url('@/assets/images/swapBG.png');
}
.swap-bg {
  background-size: 101vw 100%;
  background-repeat: no-repeat;
  @apply bg-center;
  transition: all 0.3s ease-in-out;
  background-image: url('@/assets/images/starBgLight.png');
}
.link-color {
  color: #2575fc;
}
</style>
