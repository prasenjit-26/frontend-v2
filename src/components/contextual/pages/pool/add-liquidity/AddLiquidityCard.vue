<script setup lang="ts">
import { onMounted, watch } from 'vue';
import SwapSettingsPopover, {
  SwapSettingsContext,
} from '@/components/popovers/SwapSettingsPopover.vue';
// import { configService } from '@/services/config/config.service';
import AddLiquidityForm from '@/components/forms/pool_actions/AddLiquidityForm/AddLiquidityForm.vue';
import useAddLiquidityTabs, {
  Tab,
  tabs,
} from '@/composables/pools/useAddLiquidityTabs';
import { useJoinPool } from '@/providers/local/join-pool.provider';
import { usePoolHelpers } from '@/composables/usePoolHelpers';
import { Pool } from '@/services/pool/types';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  hanldeClose?: any;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const pool = toRef(props, 'pool');
// const emit = defineEmits(['close', 'success']);

/**
 * COMPOSABLES
 */
// const { network } = configService;
const { activeTab, resetTabs } = useAddLiquidityTabs();
const { setIsSingleAssetJoin } = useJoinPool();
const { isDeepPool, isPreMintedBptPool } = usePoolHelpers(pool);

/**
 * LIFECYCLE
 */
onMounted(() => resetTabs());

/**
 * WATCHERS
 */
watch(activeTab, value => {
  setIsSingleAssetJoin(value === Tab.SingleToken);
});
function handleClose() {
  console.log('props', props);
  props.hanldeClose();
}
</script>

<template>
  <BalCard shadow="xl" exposeOverflow noBorder>
    <BalStack
      horizontal
      align="center"
      spacing="xs"
      class="justify-between mb-4"
    >
      <h4 class="text-[24px] font-[600]">Deposit</h4>
      <div class="flex items-center">
        <SwapSettingsPopover :context="SwapSettingsContext.invest" />
        <button class="flex close-button-modal ml-[10px]" @click="handleClose">
          Close
        </button>
      </div>
    </BalStack>
    <BalTabs
      v-if="isDeepPool && isPreMintedBptPool"
      v-model="activeTab"
      :tabs="tabs"
      class="p-0 m-0 -mb-px whitespace-nowrap"
      noPad
    />
    <AddLiquidityForm :pool="pool" :handleClose="handleClose" />
  </BalCard>
</template>
<style>
.dark .close-button-modal {
  border: 0.9px solid #8b8dfc;
  background: #34355f;
  border-radius: 25px;
  padding: 4px;
  font-size: 14px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
}
.close-button-modal {
  border: 1px solid #4e529c;
  background: rgba(229, 230, 255, 0.4);
  border-radius: 25px;
  padding: 4px;
  font-size: 14px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
}
</style>

