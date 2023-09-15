<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isSwapPage = ref(false);
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
</script>
<!-- background-image: url('../assets/images/swapBG.png'); -->
<template>
  <div>
    <div class="app-body">
      <AppNav />
      <div v-if="isSwapPage" class="swap-bg">
        <div class="mt-[100px]">
          <div class="pb-16">
            <slot />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="pb-16">
          <slot />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

.app-body {
  @apply bg-cover dark:bg-black;
  background: #e2e3ff;

  min-height: calc(100vh - 2rem);
}
.dark .app-body {
  background-image: url('@/assets/images/bgGradiant.png');
}
.swap-bg {
  background-size: 101vw 100%;
  background-repeat: no-repeat;
  @apply bg-center;
  transition: all 0.3s ease-in-out;
  background-image: url('@/assets/images/swapBG.png');
}
</style>
