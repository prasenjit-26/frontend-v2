<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import coin1 from '@/assets/images/chimpLogo1.png';
import coin2 from '@/assets/images/chimpLogo2.png';
import coin3 from '@/assets/images/chimpLogo3.png';

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const router = useRouter();

/**
 * COMPUTED
 */
const benefits = computed(() => [
  t('veBAL.hero.benefits.boost'),
  t('veBAL.hero.benefits.vote'),
  t('veBAL.hero.benefits.earn'),
]);

/**
 * METHODS
 */
function navigateToGetVeBAL() {
  router.push({
    name: 'get-slChimp',
    query: {
      returnRoute: 'slChimp',
    },
  });
}
</script>

<template>
  <div class="hero-container">
    <div class="hero-content">
      <div
        class="py-8 lg:py-4 px-4 lg:px-8 2xl:px-0 xl:pt-0 max-w-xl hero-text"
      >
        <p
          class="font-medium sm:text-center lg:text-left xs:text-center eyebrow"
        >
          slCHIMP
        </p>
        <h1
          class="mb-5 sm:text-center lg:text-left xs:text-center text-black dark:text-white title lg:text-[48px] sm:text-[30px] sm:text-[28px]"
        >
          {{ $t('veBAL.hero.title') }}
        </h1>
        <ul>
          <li
            v-for="(benefit, i) in benefits"
            :key="i"
            class="flex sm:justify-center lg:justify-start xs:justify-center items-center mb-2 text-center sm:text-center lg:text-left xs:text-center text-black dark:text-white bullet-points lg:text-[24px] sm:text-[16px] sm:text-[14px]"
          >
            – {{ benefit }}
          </li>
        </ul>
        <div class="flex mt-6">
          <BalBtn
            class="mr-3 btn-gold min-w-[140px]"
            @click="navigateToGetVeBAL"
          >
            {{ $t('veBAL.hero.buttons.getVeBAL') }}
          </BalBtn>
          <BalBtn
            tag="a"
            href="https://docs.balancer.fi/concepts/governance/veBAL/"
            target="_blank"
            rel="noreferrer"
            color="white"
            class="hero-btn"
            outline
          >
            {{ $t('veBAL.hero.buttons.learnMore') }}
            <BalIcon
              name="arrow-up-right"
              size="sm"
              class="ml-px group-hover:text-pink-500 transition-colors"
            />
          </BalBtn>
        </div>
      </div>
      <div class="justify-center w-full coins">
        <img
          :src="coin1"
          alt="slchimp"
          class="object-contain lg:max-w-[200px] sm:max-w-[100px] xs:max-w-[100px]"
        />
        <img
          :src="coin2"
          alt="slchimp"
          class="object-contain lg:max-w-[200px] sm:max-w-[100px] xs:max-w-[100px]"
        />
        <img
          :src="coin3"
          alt="slchimp"
          class="object-contain max-w-[200px] sm:max-w-[100px] xs:max-w-[100px]"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.hero-container {
  @apply flex content-center relative w-full;

  min-height: 440px;
  z-index: 0;
  background-color: #ececff;
}
.dark .hero-container {
  @apply flex content-center relative w-full;

  min-height: 440px;
  z-index: 0;
  background-color: transparent;
}
.dark .hero-container {
  background-color: transparent;
}

.hero-content {
  @apply grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 max-w-screen-2xl mx-auto md:gap-4 lg:gap-8 py-4 md:py-8
    xl:pl-4 w-full z-10;
}

.eyebrow {
  @apply mb-4;

  color: #8b8dfc;
  font-family: Montserrat Alternates;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
}

.hero-text {
  @apply opacity-0;

  animation: fadeIn 1s ease-out 0.1s both;
}

.title {
  @apply max-w-sm;
  font-family: Montserrat Alternates;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.hero-btn {
  min-width: 140px;
  border-radius: 44px;
  border: 1px solid #9b9b9b;
  box-shadow: 0px 0px 0px 2px rgba(175, 175, 175, 0.25),
    0px 0px 0px 3px rgba(140, 142, 255, 0.51) inset;
}

.btn-gold {
  border-radius: 44px;
  border: 1px solid #9b9b9b;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  box-shadow: 0px 0px 0px 2px rgba(175, 175, 175, 0.25),
    0px 0px 0px 3px rgba(140, 142, 255, 0.51) inset;
  color: #fff;
  font-family: Plus Jakarta Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
}

.coins {
  @apply flex lg:gap-8 px-1 lg:px-0;

  flex-grow: 1;
}

.coin-wrapper {
  aspect-ratio: 7 / 8;
}

.coin {
  @apply w-full flex flex-col items-center justify-end relative;
}

.graphic {
  @apply transition-transform duration-300 relative;
}

.coin:hover .graphic {
  transform: translateY(-8px);
}

.caption {
  @apply text-sm md:text-base text-gray-400 transition-colors text-center group-hover:text-white;

  animation: fadeInMoveUp 0.5s ease-out 0.15s both;
}

@media (min-width: 768px) {
  .hero-text {
    min-width: 400px;
  }
}

.caption .bal-icon {
  animation: fadeInMoveUp 0.5s ease-out 0.15s both;
}
.bullet-points {
  font-family: Plus Jakarta Sans;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
}
</style>
