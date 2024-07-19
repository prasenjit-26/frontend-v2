<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
  isJoinsDisabled,
  usePoolHelpers,
  deprecatedDetails,
} from '@/composables/usePoolHelpers';
import useNetwork from '@/composables/useNetwork';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import AddLiquidityModal from '@/components/contextual/pages/pool/add-liquidity/AddLiquidityModal.vue';
import RemoveLiquidityModal from '@/components/contextual/pages/pool/withdraw/RemoveLiquidityModal.vue';
import { Goals, trackGoal } from '@/composables/useFathom';
import { useDisabledJoinPool } from '@/composables/useDisabledJoinPool';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  missingPrices: boolean;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'risksClicked'): void;
}>();

/**
 * COMPOSABLES
 */
const { isMigratablePool, hasNonApprovedRateProviders } = usePoolHelpers(
  toRef(props, 'pool')
);
const { isWalletReady, startConnectWithInjectedProvider } = useWeb3();
const { networkSlug } = useNetwork();
const { shouldDisableJoins } = useDisabledJoinPool(props.pool);
const { balanceFor } = useTokens();
const isDepositModalVisible = ref(false);
const isWithdrawModalVisible = ref(false);
/**
 * COMPUTED
 */
const hasBpt = computed((): boolean =>
  bnum(balanceFor(props.pool.address)).gt(0)
);
const joinDisabled = computed(
  (): boolean =>
    !!deprecatedDetails(props.pool.id) ||
    isJoinsDisabled(props.pool.id) ||
    hasNonApprovedRateProviders.value ||
    isMigratablePool(props.pool) ||
    shouldDisableJoins.value
);

function handleAddLiquidityOpen() {
  trackGoal(Goals.ClickAddLiquidity);
  isDepositModalVisible.value = true;
}
function handleAddLiquidityClose() {
  isDepositModalVisible.value = false;
}
function handleRemoveLiquidityOpen() {
  trackGoal(Goals.ClickWithdraw);
  isWithdrawModalVisible.value = true;
}
function handleRemoveLiquidityClose() {
  isWithdrawModalVisible.value = false;
}
</script>

<template>
  <AddLiquidityModal
    :isVisible="isDepositModalVisible"
    :pool="props.pool"
    @close="handleAddLiquidityClose"
  />
  <RemoveLiquidityModal
    :isVisible="isWithdrawModalVisible"
    :pool="props.pool"
    @close="handleRemoveLiquidityClose"
  />
  <div class="p-4 w-full border-t border-gray-200 dark:border-gray-900">
    <BalBtn
      v-if="!isWalletReady"
      :label="$t('connectWallet')"
      color="gradient"
      block
      @click="startConnectWithInjectedProvider"
    />
    <div v-else>
      <div class="grid grid-cols-2 gap-2">
        <BalBtn
          :label="$t('withdraw.label')"
          :disabled="!hasBpt"
          class="text-[20px] font-[500] xs:min-h[40px] sm:min-h[40px] min-h-[40px] mr-[30px]"
          :style="{
            borderRadius: '22px',
          }"
          outline
          block
          @click="handleRemoveLiquidityOpen"
        />
        <BalBtn
          :label="$t('addLiquidity')"
          class="text-[#000] rounded-[12px] bg-[#FFFFFF] text-[20px] font-[500] xs:min-h[40px] sm:min-h[40px] min-h-[40px]"
          :style="{
            borderRadius: '22px',
          }"
          :disabled="joinDisabled"
          block
          @click="handleAddLiquidityOpen"
        />
      </div>
      <div class="pt-4 text-xs text-secondary">
        {{ $t('poolTransfer.myPoolBalancesCard.risksDisclaimer') }}

        <a class="font-medium link" @click="emit('risksClicked')">
          {{ $t('poolTransfer.myPoolBalancesCard.poolsRisks') }} </a
        >.
      </div>
    </div>
  </div>
</template>
