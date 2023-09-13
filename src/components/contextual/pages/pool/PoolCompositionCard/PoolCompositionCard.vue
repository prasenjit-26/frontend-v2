<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import { removeBptFrom } from '@/composables/usePoolHelpers';
import { Pool } from '@/services/pool/types';
import { computed, nextTick, onMounted, ref, toRefs } from 'vue';

import { isWeightedLike } from '@/composables/usePoolHelpers';
import { useUserPoolPercentage } from '@/composables/useUserPoolPercentage';
import { useI18n } from 'vue-i18n';
import TokenBreakdown from './components/TokenBreakdown.vue';
import { useTokenBreakdown } from './components/composables/useTokenBreakdown';
import PercentagePill from './components/PercentagePill.vue';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
};

/**
 * PROPS
 */
const props = defineProps<Props>();
const { pool } = toRefs(props);
const isWeighted = isWeightedLike(pool.value.poolType);

/**
 * COMPOSABLES
 */
const { upToLargeBreakpoint } = useBreakpoints();
const { userPoolPercentage, userPoolPercentageLabel } =
  useUserPoolPercentage(pool);
const { t } = useI18n();
const rootPool = computed(() => removeBptFrom(pool.value));
const tokenData = useTokenBreakdown(rootPool);

/**
 * STATE
 */
const TOTAL_COMPOSITION = 'TOTAL_COMPOSITION';
const MY_POOL_SHARE = 'MY_POOL_SHARE';

const compositionTab = {
  value: TOTAL_COMPOSITION,
  label: t('poolComposition.tabs.totalComposition'),
};
const mySharesTab = {
  value: MY_POOL_SHARE,
  label: t('poolComposition.tabs.myPoolShare'),
};
const activeTab = ref(TOTAL_COMPOSITION);

/**
 * COMPUTED
 */
const userHasShares = computed(() => userPoolPercentage.value.gt(0));
// Hide my pool share tab when user does not have shares
const tabs = computed(() =>
  userHasShares.value ? [compositionTab, mySharesTab] : [compositionTab]
);
const showUserShares = computed(() => activeTab.value === MY_POOL_SHARE);

/**
 * LIFECYCLE
 */
onMounted(async () => {
  await nextTick();

  if (userHasShares.value) {
    activeTab.value = MY_POOL_SHARE;
  }
});
</script>

<template>
  <div
    class="flex justify-start items-center mx-4 lg:mx-0 mb-6 border-b dark:border-gray-900"
  >
    <BalTabs v-model="activeTab" :tabs="tabs" noPad class="-mb-px">
      <PercentagePill v-if="userHasShares" :isActive="showUserShares">
        {{ userPoolPercentageLabel }}
      </PercentagePill>
    </BalTabs>
  </div>
  <BalCard
    class="overflow-x-auto whitespace-nowrap table-conatiner"
    :square="upToLargeBreakpoint"
    noBorder
    noPad
  >
    <template #header>
      <div
        class="grid p-4 w-full text-base font-semibold"
        :class="[isWeighted ? 'grid-cols-5' : 'grid-cols-4']"
      >
        <div class="text-[20px] font-[500]">{{ $t('token') }}</div>
        <div v-if="isWeighted" class="justify-self-end text-[20px] font-[500]">
          {{ $t('weight') }}
        </div>
        <div class="justify-self-end text-[20px] font-[500]">
          {{ $t('balance') }}
        </div>
        <div class="justify-self-end text-[20px] font-[500]">
          {{ $t('value') }}
        </div>
        <div class="justify-self-end text-[20px] font-[500]">
          {{ $t('poolComposition.token%') }}
        </div>
      </div>
    </template>

    <div class="grid table-container">
      <div
        v-for="token in rootPool.tokens"
        :key="token.address"
        class="grid row-bg nested-group h-[78px]"
      >
        <TokenBreakdown
          :token="token"
          :showUserShares="showUserShares"
          :rootPool="pool"
          :tokensData="tokenData"
        />
      </div>
    </div>
  </BalCard>
</template>
<style scoped>
:deep(.card-container) {
  min-width: 600px;
}

.nested-group:has(.level-2) {
  @apply dark:border-gray-900 border-t first:border-0;
}
.table-conatiner {
  box-shadow: 0px 0px 0px 5px #8b8dfc99, 0px 0px 0px 10px #8b8dfc40,
    0px 0px 149px -46px #8b8dfccc;
}
.dark .row-bg {
  background-color: #282853;
  border-bottom: 1px solid #8b8dfc99;
}
.row-bg {
  border-bottom: 1px solid #a5a5fd;
  background: #d5d6ff;
}
.table-row-container {
  background: #171635;
}
</style>