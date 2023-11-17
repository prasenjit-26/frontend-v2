<script setup lang="ts">
import WithdrawForm from '@/components/forms/pool_actions/WithdrawForm/WithdrawForm.vue';
import SwapSettingsPopover, {
  SwapSettingsContext,
} from '@/components/popovers/SwapSettingsPopover.vue';
import useWithdrawPageTabs from '@/composables/pools/useWithdrawPageTabs';
import WithdrawPageTabs from './WithdrawPageTabs.vue';
import { provideExitPool } from '@/providers/local/exit-pool.provider';
import { Pool } from '@/services/pool/types';

type Props = {
  pool: Pool;
  handleClose?: any;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const pool = toRef(props, 'pool');

/**
 * PROVIDERS
 */
provideExitPool(pool);

/**
 * COMPOSABLES
 */
const { resetTabs } = useWithdrawPageTabs();

onMounted(() => resetTabs());
</script>

<template>
  <BalCard shadow="xl" exposeOverflow noBorder class="scroll-card">
    <BalStack
      horizontal
      align="center"
      spacing="xs"
      class="justify-between mb-4"
    >
      <h4 class="text-[24px] font-[600]">{{ $t('withdrawFromPool') }}</h4>
      <div class="flex items-center">
        <SwapSettingsPopover :context="SwapSettingsContext.invest" />
        <button
          class="flex close-button-modal ml-[10px]"
          @click="props.handleClose"
        >
          Close
        </button>
      </div>
    </BalStack>
    <WithdrawPageTabs
      v-if="!(pool.isInRecoveryMode && pool.isPaused)"
      class="mb-[20px]"
    />
    <WithdrawForm :pool="pool" :handleClose="handleClose" />
  </BalCard>
</template>
<style>
@media (max-width: 768px) {
  .scroll-card {
    min-height: 80vh;
  }
}
</style>