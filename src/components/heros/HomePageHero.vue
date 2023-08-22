<script lang="ts" setup>
import useNetwork from '@/composables/useNetwork';
import { useRouter } from 'vue-router';
const router = useRouter();
const { networkSlug } = useNetwork();
function navigateToCreatePool() {
  router.push({ name: 'create-pool', params: { networkSlug } });
}
</script>

<template>
  <div class="md:container md:mx-auto">
    <div class="m-[25px] columns-2 md:columns-2 sm:columns-1">
      <h2
        class="font-[600] mt-[58px] headline font-montserrat text[64px]"
        v-text="$t('headlineText')"
      />
      <p
        class="text-white mt-[36px] mb-[36px] text-[24px] font-montserrat leading-[33px]"
        v-text="$t('headlineSubText')"
      />
      <button
        class="flex justify-center mt-5 create-button align-center"
        @click="navigateToCreatePool"
      >
        {{ $t('createAPool.title') }}
        <BalIcon class="ml-2 text-white-400" name="plus" />
      </button>
      <div class="flex justify-end">
        <img src="~@/assets/images/landingPage.gif" alt="logo" width="500" />
      </div>
    </div>
  </div>
</template>

<style>
.headline {
  @apply text-white text-left text-6xl pb-2 pt-3;
}
.create-button {
  @apply text-white text-[20px] font-[500] py-3 px-6 rounded-full;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: inset 0px 0px 0px 3px #8c8eff82, 0px 0px 0px 2px #afafaf40;
  border: 1px solid #9b9b9b;
  border-radius: 44px;
  min-height: 55px;
}
</style>
