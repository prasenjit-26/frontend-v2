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
  <div class="stars-bg">
    <div class="md:container md:mx-auto">
      <div
        class="lg:m-[25px] xs:ml-[25px] xs:mr-[25px] lg:columns-2 md:columns-2 sm:columns-1 sm:ml-[25px] sm:mr-[25px]"
      >
        <div class="lg:h-[625px] centeralign">
          <h2
            class="font-[600] mt-[58px] headline font-montserrat sm:text-[40px] xs:text-[38px] lg:text-[53px]"
            v-text="$t('headlineText')"
          />
          <p
            class="text-white dark:text-black subtext mt-[20px] mb-[30px] text-[24px] font-montserrat leading-[33px]"
            v-text="$t('headlineSubText')"
          />
          <button
            class="flex justify-center mt-5 create-button align-center universal-border"
            @click="navigateToCreatePool"
          >
            {{ $t('createAPool.title') }}
            <BalIcon class="ml-2 text-white-400" name="plus" />
          </button>
        </div>
        <div class="flex justify-end">
          <img src="~@/assets/images/cubic.gif" alt="logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media (max-width: 768px) {
  .headline {
    text-align: center !important;
  }
  .subtext {
    text-align: center !important;
  }
  .centeralign {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.headline {
  @apply text-primary-500 dark:text-white pb-2 pt-3;
  line-height: normal;
  text-align: left;
}
.subtext {
  text-align: left;
}
.create-button {
  @apply text-white text-[20px] font-[500] py-3 px-6 rounded-full;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 44px;
  min-height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
}
canvas {
  /* or some other selector */
  width: 500px;
  height: 400px;
}
.dark .stars-bg {
  background-image: url('@/assets/images/starsBg.png');
  background-size: contain;
}
</style>
