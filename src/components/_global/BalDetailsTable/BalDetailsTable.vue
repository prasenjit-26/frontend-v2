<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import { BalDetailsTableData } from '@/services/pool/types';

/**
 * TYPES
 */
type Props = {
  tableData: (BalDetailsTableData | null)[];
};

/**
 * PROPS
 */
defineProps<Props>();

/**
 * COMPOSABLES
 */
const { upToLargeBreakpoint } = useBreakpoints();
</script>

<template>
  <BalCard
    class="overflow-x-auto table-details-container"
    noPad
    noBorder
    shadow="none"
  >
    <template v-for="(row, i) in tableData" :key="i">
      <div v-if="row" class="table-row">
        <div class="table-row-title">
          {{ row.title }}
        </div>
        <div class="table-row-value">
          {{ row.value }}
          <BalTooltip
            v-if="row.tooltip"
            :text="row.tooltip"
            iconSize="sm"
            class="mt-1 ml-2"
          />
          <BalLink v-if="row.link" :href="row.link" external noStyle>
            <BalIcon
              name="arrow-up-right"
              size="sm"
              class="mt-2 ml-2 text-gray-500 hover:text-blue-500 transition-colors"
            />
          </BalLink>
        </div>
      </div>
    </template>
  </BalCard>
</template>

<style scoped>
.table-row {
  @apply flex border-b font-[400] text-[20px] min-h-[78px] xs:min-h-[48px] sm:min-h-[58px];
  border-bottom: 1px solid #a5a5fd;
  background: #d5d6ff;
}
.dark .table-row {
  @apply flex border-b font-[400] text-[20px] min-h-[78px] xs:min-h-[48px] sm:min-h-[58px];
  border-bottom: 1px solid #8b8dfc99;
  background: #282853;
}

.dark .table-row:first-child {
  @apply font-[500] xs:text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[20px];
  background: #171635;
  border-bottom: 1px solid #8b8dfc99;
  border-radius: 12px 12px 0px 0px;
}
.table-row:first-child {
  @apply font-[500] xs:text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[20px];
  border-bottom: 1px solid #a5a5fd;
  background: #acb0ff;
  border-radius: 12px 12px 0px 0px;
}

.table-row:last-child {
  @apply border-b-0;
}

.table-row-title {
  @apply flex items-center py-3 px-4 flex-1 dark:border-gray-700 border-primary-500 xs:text-[12px] sm:text-[14px];

  border-right-width: 1px;
}

.table-row-value {
  @apply flex py-3 px-4 items-center xs:text-[12px] sm:text-[14px];

  word-break: break-all;
  flex: 2;
}
.table-details-container {
  box-shadow: 0px 0px 0px 5px #8b8dfc99, 0px 0px 0px 10px #8b8dfc40,
    0px 0px 149px -46px #8b8dfccc;
  background: #00000029;
}
</style>