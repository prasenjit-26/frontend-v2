<!-- eslint-disable vue/require-valid-default-prop -->
<script setup lang="ts">
import { toRefs } from 'vue';
import BigNumber from 'bignumber.js';

/**
 * TYPES
 */
type FarmData = {
  amount: any;
  relicId: any;
  entry: any;
  level: any;
  pendingReward: any;
};
type Props = {
  position: FarmData;
};

const props = withDefaults(defineProps<Props>(), {
  position: {
    amount: 0,
    relicId: null,
    entry: '',
    level: '0',
    pendingReward: '0',
  },
});
const { position } = toRefs(props);
</script>

<template>
  <div
    :class="[
      'grid gap-y-4 px-4 w-full items-center border-b dark:border-b-gray-900 last:border-0 transition-all ease-in duration-300 grid-cols-5',
    ]"
  >
    <div class="group flex items-center">
      <span
        class="group-hover:text-purple-500 dark:group-hover:text-yellow-500 transition-colors xs:text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[20px] font-[500]"
        >{{ position.relicId }}</span
      >
    </div>
    <div class="justify-self-center">
      {{ new BigNumber(position.amount).dividedBy(10 ** 18).toString() }}
    </div>
    <div class="justify-self-center">
      {{ new Date(parseFloat(position.entry) * 1000).toDateString() }}
    </div>
    <div class="justify-self-center">{{ position.level }}</div>
    <div class="justify-self-center">
      {{ new BigNumber(position.pendingReward).dividedBy(10 ** 18).toString() }}
    </div>
  </div>
</template>
<style scoped>
.nested-token {
  @apply flex-shrink-0 mr-2 relative ml-1 sm:ml-0;
}

.level-1 {
  @apply py-4 font-medium hover:bg-gray-50 hover:dark:bg-gray-800;
}

.level-2 {
  @apply py-3.5 bg-gray-100/20 hover:bg-gray-50 dark:bg-gray-850 hover:dark:bg-gray-800;
}

.level-3 {
  @apply py-3 text-sm text-secondary bg-gray-100/50 hover:bg-gray-100/70 dark:bg-gray-900/50 hover:dark:bg-gray-800;
}

.level-4 {
  @apply py-2.5 text-sm text-secondary bg-gray-100 hover:bg-gray-100/50 dark:bg-gray-900 hover:dark:bg-gray-800;
}

.level-2 > a {
  @apply pl-8;
}

.level-3 > a {
  @apply pl-16;
}

.level-4 > a {
  @apply pl-20;
}
</style>
