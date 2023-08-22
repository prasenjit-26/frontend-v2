<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useRouter } from 'vue-router';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import {
  fiatValueOf,
  isVeBalPool,
  usePoolHelpers,
} from '@/composables/usePoolHelpers';
import { useTokens } from '@/providers/tokens.provider';
import useNetwork from '@/composables/useNetwork';
import { bnum } from '@/lib/utils';
import { Pool, PoolToken } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import PoolActionsCard from './PoolActionsCard.vue';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';
import { useLock } from '@/composables/useLock';
import { configService } from '@/services/config/config.service';
import { removeBptFrom } from '@/composables/usePoolHelpers';
import { useTokenBreakdown } from './PoolCompositionCard/components/composables/useTokenBreakdown';
const { getToken } = useTokens();
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
const { balanceFor } = useTokens();
const { fNum } = useNumbers();
const { isWalletReady } = useWeb3();
const { isMigratablePool } = usePoolHelpers(toRef(props, 'pool'));
const { stakedShares } = usePoolStaking();
const { networkSlug } = useNetwork();
const router = useRouter();
const { totalLockedValue } = useLock({ enabled: isVeBalPool(props.pool.id) });

/**
 * COMPUTED
 */
const bptBalance = computed((): string =>
  bnum(balanceFor(props.pool.address)).plus(stakedShares.value).toString()
);
console.log({ pool: props.pool });
const rootPool = computed(() => removeBptFrom(props.pool));
const tokenData = useTokenBreakdown(rootPool);
console.log({ tokens: rootPool.value.tokens, tokenData });
const fiatValue = computed(() => {
  if (isVeBalPool(props.pool.id)) return totalLockedValue.value;

  return fiatValueOf(props.pool, bptBalance.value);
});

const showMigrateButton = computed(
  () =>
    (bnum(bptBalance.value).gt(0) || bnum(stakedShares.value).gt(0)) &&
    isMigratablePool(props.pool)
);

/**
 * METHODS
 */
function navigateToPoolMigration(pool: Pool) {
  router.push({
    name: 'migrate-pool',
    params: {
      from: pool.id,
      to: configService.network.pools.Migrations?.[pool.id].toPoolId,
    },
    query: {
      returnRoute: 'pool',
      returnParams: JSON.stringify({ id: pool.id, networkSlug }),
    },
  });
}
function symbolFor(token: PoolToken): string {
  return getToken(token.address)?.symbol || token.symbol || '---';
}
</script>

<template>
  <BalCard shadow="2xl" noPad class="postion-container">
    <template #header>
      <div class="card-header">
        <h5 class="text-[20px] font-[600]">
          {{ $t('poolTransfer.myPoolBalancesCard.title') }}
        </h5>
        <h5 class="text-[16px] font-[600]">
          {{ isWalletReady ? fNum(fiatValue, FNumFormats.fiat) : '-' }}
        </h5>
      </div>
    </template>
    <div
      class="grid table-container pl-[40px] pr-[40px] pt-[20px] pb-[20px] row-bg"
    >
      <div class="flex justify-between items-center mb-[20px]">
        <span class="text-[20px] font-[500]">
          {{ $t('poolTransfer.myPoolBalancesCard.stakedPosition') }}
        </span>
        <span class="text-[16px] font-[600]">
          {{ isWalletReady ? fNum(fiatValue, FNumFormats.fiat) : '-' }}
        </span>
      </div>
      <div
        v-for="token in rootPool.tokens"
        :key="token.address"
        class="flex justify-between items-center mb-[10px]"
      >
        <div class="flex items-center">
          <BalAsset
            :address="token.address"
            class="z-10 mr-2 shrink-0"
            :size="22"
          />
          <span class="text-[20px] font-[500]">
            {{ tokenData[token.address].userBalanceLabel }}
            {{ symbolFor(token) }}
          </span>
        </div>
        <span class="text-[16px] font-[600]">
          {{ tokenData[token.address].userFiatLabel }}
        </span>
      </div>
    </div>
    <div
      class="grid table-container pl-[40px] pr-[40px] pt-[20px] pb-[20px] row-bg"
    >
      <div class="flex justify-between items-center mb-[20px]">
        <span class="text-[20px] font-[500]">
          {{ $t('poolTransfer.myPoolBalancesCard.stakedPosition') }}
        </span>
        <span class="text-[16px] font-[600]">
          {{ isWalletReady ? fNum(fiatValue, FNumFormats.fiat) : '-' }}
        </span>
      </div>
      <div
        v-for="token in rootPool.tokens"
        :key="token.address"
        class="flex justify-between items-center mb-[10px]"
      >
        <div class="flex items-center">
          <BalAsset
            :address="token.address"
            class="z-10 mr-2 shrink-0"
            :size="22"
          />
          <span class="text-[20px] font-[500]">
            {{ tokenData[token.address].userBalanceLabel }}
            {{ symbolFor(token) }}
          </span>
        </div>
        <span class="text-[16px] font-[600]">
          {{ tokenData[token.address].userFiatLabel }}
        </span>
      </div>
    </div>
  </BalCard>
  <div class="mt-[40px]">
    <div v-if="showMigrateButton" class="py-2 px-4">
      <BalBtn
        color="blue"
        block
        @click.prevent="navigateToPoolMigration(props.pool)"
      >
        {{ $t('migratePool.migrateLiquidity') }}
      </BalBtn>
    </div>
    <div>
      <PoolActionsCard
        :pool="pool"
        :missingPrices="missingPrices"
        @risks-clicked="emit('risksClicked')"
      />
    </div>
  </div>
</template>

<style scoped>
.card-header {
  @apply p-4 w-full flex items-center justify-between;
  @apply dark:border-gray-700;
}

.asset-row {
  @apply py-3 flex justify-between items-center text-lg;
}
.postion-container {
  box-shadow: 0px 0px 0px 5px #8b8dfc99, 0px 0px 0px 10px #8b8dfc40,
    0px 0px 149px -46px #8b8dfccc;
  background-color: #00000029;
  border-radius: 12px;
}
.row-bg {
  background-color: #282853;
  border-bottom: 1px solid #8b8dfc99;
}
</style>
