<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
</script>
<!-- background-image: url('../assets/images/swapBG.png'); -->
<template>
  <div>
    <div class="app-body bg-[url('@/assets/images/bgGradiant.png')]">
      <AppNav />
      <div class="pb-16">
        <slot />
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
  @apply mb-8 bg-cover bg-black;

  min-height: calc(100vh - 2rem);
}
</style>
