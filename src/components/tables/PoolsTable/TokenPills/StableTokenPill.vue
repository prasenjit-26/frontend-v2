<script setup lang="ts">
import { PoolToken } from '@/services/pool/types';
import BalanceTooltip from './BalanceTooltip.vue';

type Props = {
  hasBalance: boolean;
  symbol: string;
  isSelected: boolean;
  isPicked: boolean;
  token: PoolToken;
};

withDefaults(defineProps<Props>(), {
  hasBalance: false,
  isSelected: false,
  isPicked: false,
});
</script>

<template>
  <BalTooltip
    :disabled="!hasBalance"
    class="py-1 px-1 mr-1 last:mr-0 leading-normal cursor-pointer pill-container"
    textAlign="left"
    :delayMs="50"
  >
    <template #activator>
      <div
        :class="[
          'pill bg-transparent',
          {
            'pill-selected': isSelected,
            'pill-picked': isPicked,
            'pill-hoverable': hasBalance,
          },
        ]"
      >
        <div v-if="hasBalance" class="balance-indicator" />
        <div
          :class="[
            'pill-text',
            {
              'font-medium': isSelected,
            },
          ]"
        >
          {{ symbol }}
        </div>
      </div>
    </template>
    <BalanceTooltip :token="token" :symbol="symbol" />
  </BalTooltip>
</template>

<style>
.pill {
  @apply flex;
  @apply relative;
  @apply max-h-10 items-center;
}

.pill:first-child::before {
  border-radius: 4px 0 0 4px;
}

.pill:last-child::before {
  border-radius: 0 4px 4px 0;
}

.pill:only-child::before {
  border-radius: 4px;
}

.pill-text {
  @apply text-[16px] font-[500];

  z-index: 1;
}

.pill-selected::before {
  @apply ring-2 ring-blue-500 dark:ring-blue-400;
}

.pill.pill-picked::before {
  @apply bg-blue-50 dark:bg-blue-500 dark:bg-opacity-20;
}

.balance-indicator {
  @apply w-3 h-3;
  @apply rounded-full border-2 border-white dark:border-gray-850 group-hover:border-gray-50
    dark:group-hover:border-gray-800;
  @apply bg-green-200 dark:bg-green-500;
  @apply absolute top-0 right-0 -mt-1 -mr-2;
}

.pill-container:hover,
.pill-container:focus {
  background: #5a5a6763;
}
.pill-container {
  border: 1px solid #e6e6e6;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 5px;
  min-height: 46px;
}
.dark .pill-container {
  background: #333333;
  border: 1px solid #2e2e2e;
  border-radius: 5px;
  min-height: 46px;
}
</style>
