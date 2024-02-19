<script lang="ts" setup>
import useDarkMode from '@/composables/useDarkMode';
import useTailwind from '@/composables/useTailwind';

/**
 * TYPES
 */
type Props = {
  forceDark?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  forceDark: false,
});

/**
 * COMPOSABLES
 */
const { darkMode } = useDarkMode();
const tailwind = useTailwind();

/**
 * COMPUTED
 */
const fillColor = computed(() => {
  if (props.forceDark) return tailwind.theme.colors.white;

  return darkMode.value
    ? tailwind.theme.colors.white
    : tailwind.theme.colors.gray['900'];
});
const useDarkLogo = computed(() => (props.forceDark ? true : darkMode.value));
</script>

<template>
  <div class="flex items-center sm:mr-4 app-logo">
    <img
      v-if="useDarkLogo"
      src="~@/assets/images/ChimpLogo.png"
      alt="logo"
      width="230"
    />
    <img v-else src="~@/assets/images/logoLight.png" alt="logo" width="280" />
  </div>
</template>

<style scoped>
.app-logo :deep(.logotype) {
  @apply origin-top-left relative;

  transform: scale(1.1);
}

.svg-path {
  transition: fill 0.2s ease-out;
}

.logo-svg:hover .svg-path {
  fill: theme('colors.purple.700');
}

.dark .logo-svg:hover .svg-path {
  fill: theme('colors.yellow.500');
}
</style>
