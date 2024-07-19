<script lang="ts" setup>
import useBreakpoints from '@/composables/useBreakpoints';
import useDarkMode from '@/composables/useDarkMode';

/**
 * COMPOSABLES
 */
const { isMobile } = useBreakpoints();
const { darkMode, toggleDarkMode } = useDarkMode();
</script>

<template>
  <BalBtn
    color="white"
    class="toggle-button"
    :size="isMobile ? 'md' : 'sm'"
    :circle="isMobile"
    @click="toggleDarkMode"
  >
    <MoonIcon v-if="darkMode" />
    <SunIcon v-else />
  </BalBtn>
</template>
<style>
.toggle-button {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
  border: 1px solid #e6e6e6;
}
.dark .toggle-button {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: linear-gradient(180deg, #282828 0%, #181818 100%);
  border: 1px solid #2e2e2e;
}
</style>