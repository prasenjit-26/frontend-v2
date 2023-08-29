<script setup lang="ts">
type Props = {
  title: string;
  description: string;
};

defineProps<Props>();
const features = [
  {
    title: 'Add Liquidity',
    image: 'src/assets/images/AddLiquidity.png',
  },
  {
    title: 'Stake your LP',
    image: 'src/assets/images/StakeLp.png',
  },
  {
    title: 'Get a boost',
    image: 'src/assets/images/boost.png',
  },
  {
    title: 'Claim anytime',
    image: 'src/assets/images/claim.png',
  },
];
</script>

<template>
  <div class="md:container md:mx-auto mt-[50px]">
    <div class="m-[25px] columns-2 md:columns-2 sm:columns-1">
      <div class="hero-text fade-in-slow">
        <h1 class="mb-[36px] font-[600] text-[48px] font-montserrat">
          {{ title }}
        </h1>
        <p class="max-w-3xl font-[400] text-[24px] font-montserrat">
          {{ description }}
        </p>
      </div>
      <div class="flex justify-end">
        <img src="~@/assets/images/claimHero.gif" alt="logo" />
      </div>
    </div>
    <div class="m-[25px] columns-4 md:columns-4 sm:columns-1">
      <div
        v-for="(feature, i) in features"
        :key="i"
        class="flex justify-center items-center feature-container"
      >
        <img
          :src="feature.image"
          :alt="feature.title"
          class="mr-[20px]"
          width="20"
        />
        <span>{{ feature.title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  @apply bg-gradient-to-r from-pink-500 to-yellow-500 relative;

  @apply bg-no-repeat bg-cover bg-center;
}

.hero-container {
  @apply grid grid-cols-1 lg:grid-cols-3 xl:container xl:mx-auto px-4;
}

.hero-graphic-container {
  @apply w-full px-4 py-8 xl:p-8 flex items-center lg:col-span-2;
}

.hero-content {
  @apply pt-8 lg:py-4 flex items-center w-full relative;
}

.hero-text {
  @apply opacity-0;
}

.body-text {
  @apply text-white pb-0 font-medium;

  text-shadow: 0 1px 0 rgb(0 0 0 / 15%), 4px 4px 8px rgb(0 0 0 / 15%);
}

.tip {
  /*
  group removed to avoid error in vite migration
  @apply flex flex-col items-center text-center group;
  */
  @apply flex flex-col items-center text-center;
}

.tip-icon {
  @apply pb-4 transition-transform duration-300 w-20 md:w-24 lg:w-full;
}

.tip-label {
  @apply text-white leading-5 transition-colors;
}

.tip:hover .tip-icon {
  /* Tailwind class -translate-y-2 not working for some reason here */
  transform: translateY(-8px);
}

.tip-number {
  @apply block pb-1;
}
.feature-container {
  box-shadow: 0px 0px 0px 2.25px #8b8dfc99, 0px 0px 0px 4.5px #8b8dfc40;
  background: linear-gradient(
    rgba(139, 141, 252, 0.26),
    rgba(139, 141, 252, 0.32)
  );
  border-radius: 27px;
  padding: 25px;
  font-size: 24px;
  font-weight: 500;
}
</style>