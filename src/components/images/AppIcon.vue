<script lang="ts" setup>
import { computed } from 'vue';

import useDarkMode from '@/composables/useDarkMode';

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

/**
 * COMPUTED
 */
const useDarkLogo = computed(() => (props.forceDark ? true : darkMode.value));
</script>

<template>
  <img
    v-if="useDarkLogo"
    src="~@/assets/images/ChimpLogo.png"
    class="mr-2 sm:w-[100px] xs:w-[80px] md:w-[150px] lg:w-[150px]"
  />
  <img
    v-else
    src="~@/assets/images/chimpLight.png"
    class="mr-2 sm:w-[100px] xs:w-[80px] md:w-[150px] lg:w-[150px]"
  />
</template>
