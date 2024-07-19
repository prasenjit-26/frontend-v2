<script setup lang="ts">
import { PoolToken } from '@/services/pool/types';
import BalanceTooltip from './BalanceTooltip.vue';

type Props = {
  hasBalance: boolean;
  symbol: string;
  weight: string;
  isSelected: boolean;
  isPicked: boolean;
  token: PoolToken;
  isOnMigrationCard?: boolean;
  isHovered?: boolean;
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
    class="last:mr-0 leading-normal cursor-pointer mr-[5px] pill-bg mb-[5px]"
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
            'pill-migration': isOnMigrationCard,
            'pill-hovered': isHovered,
          },
        ]"
      >
        <div v-if="hasBalance" class="balance-indicator" />
        <span
          :class="[
            'xs:text-[12px] sm:text-[14px] lg:text-[16px] font-[500]',
            {
              'font-medium': isSelected,
            },
          ]"
        >
          {{ symbol }}
        </span>
        <span
          v-if="weight !== '0%'"
          :class="[
            'pill-weight',
            'text-[12px] font-[500]',
            {
              'pill-weight-migration': isOnMigrationCard,
            },
          ]"
        >
          {{ weight }}
        </span>
      </div>
    </template>
    <BalanceTooltip :token="token" :symbol="symbol" />
  </BalTooltip>
</template>

<style>
.pill {
  @apply flex items-center relative  items-center;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.pill-migration {
  @apply cursor-pointer;

  background-color: rgb(31 41 55 / 60%);
}

.pill-hovered {
  @apply bg-gray-600;
}

.pill-selected {
  @apply ring-2 ring-blue-500 dark:ring-blue-400;
}

.pill-picked {
  @apply bg-blue-50 dark:bg-blue-500 dark:bg-opacity-20;
}

.pill-weight {
  @apply font-medium text-black dark:text-white text-xs  mt-px ml-1;
}

.pill-weight-migration {
  @apply text-gray-400;
}

.balance-indicator {
  @apply w-3 h-3;
  @apply rounded-full border-2 border-white dark:border-gray-850 group-hover:border-gray-50
    dark:group-hover:border-gray-800;
  @apply bg-green-400 dark:bg-green-500;
  @apply absolute top-0 right-0 -mt-1 -mr-1;
}

.pill-hoverable:hover,
.pill-hoverable:focus {
  background: #5a5a6763;
}
.dark .pill-bg {
  @apply sm:p-[5px] xs:p-[5px] lg:pt-[12px] lg:pl-[16px] lg:pr-[16px] lg:pb-[12px] lg:min-h-[46px] min-h-[30px];
  background: #333333;
  border: 1px solid #2e2e2e;
  border-radius: 6px;
}
.pill-bg {
  @apply sm:p-[5px] xs:p-[5px] lg:pt-[12px] lg:pl-[16px] lg:pr-[16px] lg:pb-[12px] lg:min-h-[46px] min-h-[30px];
  border: 1px solid #e6e6e6;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 6px;
}
</style>
