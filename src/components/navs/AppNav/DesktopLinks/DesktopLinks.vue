<script lang="ts" setup>
import { useRoute } from 'vue-router';
import DesktopLinkItem from './DesktopLinkItem.vue';
import useNetwork from '@/composables/useNetwork';
import { Goals, trackGoal } from '@/composables/useFathom';

/**
 * COMPOSABLES
 */
const route = useRoute();
const { networkSlug } = useNetwork();

/**
 * METHODS
 */
function isActive(page: string): boolean {
  if (route.name === page) return true;
  return false;
}
</script>

<template>
  <div class="desktop-links">
    <DesktopLinkItem
      :to="{ name: 'home', params: { networkSlug } }"
      :active="isActive('home')"
      prefetch
      @click="trackGoal(Goals.ClickNavPools)"
    >
      {{ $t('pool') }}
    </DesktopLinkItem>
    <DesktopLinkItem
      :to="{ name: 'swap', params: { networkSlug } }"
      :active="isActive('swap')"
      prefetch
      @click="trackGoal(Goals.ClickNavSwap)"
    >
      {{ $t('swap') }}
    </DesktopLinkItem>
    <!-- <DesktopLinkItem
      :to="{ name: 'claim', params: { networkSlug } }"
      :active="isActive('claim')"
      prefetch
      @click="trackGoal(Goals.ClickNavClaim)"
    >
      <div class="flex items-center">
        {{ $t('claim') }}
      </div>
    </DesktopLinkItem>
    <DesktopLinkItem
      v-if="isGoerli"
      :to="{ name: 'faucet', params: { networkSlug } }"
      :active="isActive('faucet')"
    >
      Faucet
    </DesktopLinkItem> -->
    <DesktopLinkItem
      :to="{ name: 'portfolio', params: { networkSlug } }"
      :active="isActive('portfolio')"
      prefetch
      @click="trackGoal(Goals.ClickNavPortfolio)"
    >
      {{ $t('portfolio') }}
    </DesktopLinkItem>
    <!-- <DesktopLinkItem
      :to="{ name: 'slChimp', params: { networkSlug } }"
      :active="isActive('slChimp')"
      prefetch
      @click="trackGoal(Goals.ClickNavVebal)"
    >
      slChimp
    </DesktopLinkItem> -->
    <DesktopLinkItem
      :to="{ name: 'bridge', params: { networkSlug } }"
      :active="isActive('bridge')"
      prefetch
      @click="trackGoal(Goals.ClickNavVebal)"
    >
      Bridge
    </DesktopLinkItem>
  </div>
  <!-- <div class="container">
    <div class="tabs">
      <input id="radio-1" type="radio" name="tabs" checked />
      <label class="tab" for="radio-1"
        >Upcoming<span class="notification">2</span></label
      >
      <input id="radio-2" type="radio" name="tabs" />
      <label class="tab" for="radio-2">Development</label>
      <input id="radio-3" type="radio" name="tabs" />
      <label class="tab" for="radio-3">Completed</label>
      <span class="glider"></span>
    </div>
  </div> -->
</template>

<style scoped>
.desktop-links {
  @apply grid gap-8 grid-flow-col grid-rows-1 content-center p-[7px];
  box-shadow: inset 0px 4px 4px 0px #31313140, 0px 0px 0px 2px #8b8dfc;
  border-radius: 77px;
  background: #8b8dfc26;
}
</style>
