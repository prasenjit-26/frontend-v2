<script lang="ts" setup>
import useNetwork from '@/composables/useNetwork';

import AppLogo from '../images/AppLogo.vue';

const { networkSlug } = useNetwork();
</script>

<template>
  <footer v-once>
    <div
      class="xl:container lg:px-4 xl:mx-auto dark:border-t dark:border-gray-800"
    >
      <div
        class="flex flex-col md:flex-row gap-8 md:justify-between py-4 px-4 lg:px-0 text-primary"
      >
        <div class="flex flex-col gap-8">
          <router-link
            class="font-medium link"
            :to="{ name: 'home', params: { networkSlug } }"
          >
            <AppLogo class="mb-4" />
          </router-link>
        </div>
      </div>
      <div class="border-bottom" />
    </div>
  </footer>
</template>

<style scoped>
footer {
  @apply bg-gray-50 dark:bg-gray-900;
}

footer :deep(.logotype) {
  @apply origin-top-left;

  transform: scale(1.5);
}
.border-bottom {
  background: linear-gradient(
    90deg,
    rgba(139, 141, 252, 0) -0.67%,
    #8b8dfc 51.31%,
    rgba(255, 255, 255, 0) 101.18%,
    rgba(139, 141, 252, 0) 101.18%
  );
  border: 1px solid;

  border-image-source: linear-gradient(
    90deg,
    rgba(139, 141, 252, 0) -0.67%,
    #8b8dfc 51.31%,
    rgba(255, 255, 255, 0) 101.18%,
    rgba(139, 141, 252, 0) 101.18%
  );
  width: 100%;
  height: 2px;
  margin-bottom: 50px;
  margin-top: 20px;
}

.link {
  @apply text-black dark:text-white transition-colors flex items-center no-underline hover:text-purple-600;
}

.link--external {
  @apply text-sm;
}

.link:hover,
.link:focus-visible {
  @apply text-purple-600 dark:text-yellow-500 no-underline;
}

.link:focus:not(:focus-visible) {
  outline: none;
}

.policy {
  @apply text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-yellow-500;
}

.arrow {
  @apply text-gray-300 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-yellow-500;
}

.router-link-active {
  @apply text-blue-600 dark:text-blue-400;
}
</style>
