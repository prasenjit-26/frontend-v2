<script lang="ts" setup>
import { RouterLinkProps } from 'vue-router';
import PrefetchLinks from '@/components/links/PrefetchLinks.vue';

interface Props extends RouterLinkProps {
  active: boolean;
  prefetch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  prefetch: false,
});

const classes = computed(() => ({
  'border-white dark:border-gray-400 font-[500] text-black dark:text-gray-400 text-[16px] not-selected':
    !props.active,
  'text-white dark:text-white active-button font-[500]': props.active,
}));
</script>

<template>
  <router-link v-bind="props" :class="['desktop-link-item', classes]">
    <slot />
    <PrefetchLinks v-if="prefetch" :to="$attrs.to" />
  </router-link>
</template>

<style scoped>
.desktop-link-item {
  @apply h-full flex-col justify-center cursor-pointer hover:text-purple-600 dark:hover:text-yellow-500 flex relative
    overflow-hidden p-0;
}

.desktop-link-item::before {
  content: '';

  @apply top-0 left-0 w-full block absolute overflow-hidden transition-all;

  /* border-top: 4px solid theme('colors.purple.600'); */
  /* transform: translate3d(0%, -101%, 0); */
}

.dark .desktop-link-item::before {
  /* border-color: theme('colors.yellow.500'); */
}

.desktop-link-item.router-link-active::before {
  content: '';

  @apply w-full block absolute top-0 left-0;

  /* transform: translate3d(0, 0, 0); */
}
.not-selected:last-child {
  @apply mr-[44px];
}
.not-selected:first-child {
  @apply ml-[44px];
}
.desktop-link-item.router-link-active {
  @apply transition-colors;
}

.desktop-link-item:hover::before {
  /* transform: translate3d(0, 0, 0); */
}
.active-button {
  border-radius: 30px;
  padding: 16px 32px;
  min-width: fit-content;
  max-height: 43px;
  background: #fff;
  border: 1px solid;
  color: #000;
  font-family: Plus Jakarta Sans;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: center;

  /* linear-gradient(180deg, #8b8dfc 0%, rgba(0, 0, 0, 0) 66.64%); */
}
</style>
