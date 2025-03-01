<script setup lang="ts">
import { PoolToken } from '@auroblocks/chimp-sdk';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { ColumnDefinition } from '@/components/_global/BalTable/types';

import BalChipNew from '@/components/chips/BalChipNew.vue';
import BalChipExpired from '@/components/chips/BalChipExpired.vue';
import TokenPills from '@/components/tables/PoolsTable/TokenPills/TokenPills.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { getNetworkSlug } from '@/composables/useNetwork';
import {
  isStableLike,
  isUnknownType,
  poolURLFor,
} from '@/composables/usePoolHelpers';
import { VotingGaugeWithVotes } from '@/services/balancer/gauges/gauge-controller.decorator';
import useWeb3 from '@/services/web3/useWeb3';

import GaugesTableVoteBtn from './GaugesTableVoteBtn.vue';
import GaugeVoteInfo from './GaugeVoteInfo.vue';
import GaugesTableMyVotes from './GaugesTableMyVotes.vue';
import BalAssetSet from '@/components/_global/BalAsset/BalAssetSet.vue';
import {
  orderedTokenURIs,
  orderedGaugeTokens,
} from '@/composables/useVotingGauges';
import IconLimit from '@/components/icons/IconLimit.vue';
import { differenceInWeeks } from 'date-fns';
import { oneSecondInMs } from '@/composables/useTime';
import { buildNetworkIconURL } from '@/lib/utils/urls';
import { poolMetadata } from '@/lib/config/metadata';
import { isGaugeExpired } from './voting-utils';

/**
 * TYPES
 */
type Props = {
  expiredGauges?: Readonly<string[]>;
  data?: VotingGaugeWithVotes[];
  isLoading?: boolean;
  noPoolsLabel?: string;
  isPaginated?: boolean;
  filterText?: string;
  renderedRowsIdx: number;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  expiredGauges: () => [] as never[],
  showPoolShares: false,
  noPoolsLabel: 'No pools',
  filterText: '',
  isPaginated: false,
  data: () => [],
});

const emit = defineEmits<{
  (e: 'clickedVote', value: VotingGaugeWithVotes): void;
}>();

/**
 * COMPOSABLES
 */
const router = useRouter();
const { t } = useI18n();
const { upToLargeBreakpoint } = useBreakpoints();
const { isWalletReady } = useWeb3();

/**
 * DATA
 */
const columns = computed((): ColumnDefinition<VotingGaugeWithVotes>[] => [
  {
    name: t('veBAL.liquidityMining.table.chain'),
    id: 'chain',
    accessor: '',
    Header: 'chainColumnHeader',
    Cell: 'networkColumnCell',
    width: 50,
    noGrow: true,
  },
  {
    name: t('veBAL.liquidityMining.table.assets'),
    id: 'icons',
    accessor: 'uri',
    Header: 'iconColumnHeader',
    Cell: 'iconColumnCell',
    width: 100,
    noGrow: true,
  },
  {
    name: t('veBAL.liquidityMining.table.composition'),
    id: 'poolComposition',
    accessor: 'id',
    Cell: 'poolCompositionCell',
    width: 350,
  },
  {
    name: t('veBAL.liquidityMining.table.nextPeriodVotes'),
    accessor: 'id',
    align: 'right',
    id: 'nextPeriodVotes',
    Cell: 'nextPeriodVotesCell',
    sortKey: gauge => Number(gauge.votesNextPeriod),
    width: 160,
    cellClassName: 'font-numeric',
  },
  {
    name: t('veBAL.liquidityMining.table.myVotes'),
    accessor: 'myVotes',
    align: 'right',
    id: 'myVotes',
    sortKey: gauge => Number(gauge.userVotes),
    width: 100,
    Cell: 'myVotesCell',
    cellClassName: 'font-numeric',
    hidden: !isWalletReady.value,
  },
  {
    name: t('veBAL.liquidityMining.table.vote'),
    id: 'vote',
    accessor: 'id',
    align: 'right',
    Cell: 'voteColumnCell',
    width: 100,
    hidden: !isWalletReady.value,
  },
]);

/**
 * METHODS
 */
function isInternalUrl(url: string): boolean {
  return url.includes('balancer.fi') || url.includes('localhost');
}

function redirectToPool(gauge: VotingGaugeWithVotes, inNewTab) {
  const redirectUrl = poolURLFor(gauge.pool, gauge.network);
  if (!isInternalUrl(redirectUrl)) {
    window.location.href = redirectUrl;
  } else {
    const route = router.resolve({
      name: 'pool',
      params: { id: gauge.pool.id, networkSlug: getNetworkSlug(gauge.network) },
    });
    inNewTab ? window.open(route.href) : router.push(route);
  }
}

function getPoolExternalUrl(gauge: VotingGaugeWithVotes) {
  const poolUrl = poolURLFor(gauge.pool, gauge.network);
  return isInternalUrl(poolUrl) ? null : poolUrl;
}

function getIsGaugeNew(addedTimestamp: number): boolean {
  return differenceInWeeks(Date.now(), addedTimestamp * oneSecondInMs) < 2;
}

function getIsGaugeExpired(gaugeAddress: string): boolean {
  return isGaugeExpired(props.expiredGauges, gaugeAddress);
}

function getHasUserVotes(userVotes: string): boolean {
  return !!Number(userVotes);
}

function getTableRowClass(gauge: VotingGaugeWithVotes): string {
  return getHasUserVotes(gauge.userVotes) && getIsGaugeExpired(gauge.address)
    ? 'expired-gauge-row'
    : '';
}

function getSelectedTokens(tokens: PoolToken[]) {
  return tokens
    .filter(
      token => token.symbol?.toLowerCase() === props.filterText?.toLowerCase()
    )
    .map(item => item.address);
}

function getPickedTokens(tokens: PoolToken[]) {
  return tokens
    .filter(
      token =>
        props.filterText &&
        token.symbol?.toLowerCase().includes(props.filterText?.toLowerCase())
    )
    .map(item => item.address);
}
</script>

<template>
  <BalCard
    shadow="lg"
    class="mt-4"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="columns"
      :data="data"
      :isLoading="isLoading"
      skeletonClass="h-64"
      sticky="both"
      :square="upToLargeBreakpoint"
      :isPaginated="isPaginated"
      :href="{ getHref: gauge => getPoolExternalUrl(gauge) }"
      :onRowClick="redirectToPool"
      :getTableRowClass="getTableRowClass"
      :initialState="{
        sortColumn: 'nextPeriodVotes',
        sortDirection: 'desc',
      }"
      :pin="{
        pinOn: 'address',
        pinnedData: ['0xE867AD0a48e8f815DC0cda2CDb275e0F163A480b'],
      }"
      :renderedRowsIdx="renderedRowsIdx"
    >
      <template #chainColumnHeader>
        <div class="flex items-center">
          <NetworkIcon />
        </div>
      </template>
      <template #networkColumnCell="{ network }">
        <div v-if="!isLoading" class="py-4 px-6">
          <div
            class="flex justify-center items-center w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded shadow-sm"
          >
            <img
              :src="buildNetworkIconURL(getNetworkSlug(network))"
              :alt="network"
              class="w-6 h-6"
            />
          </div>
        </div>
      </template>
      <template #iconColumnHeader>
        <div class="flex items-center">
          <CompositionIcon />
        </div>
      </template>
      <template #iconColumnCell="gauge">
        <div v-if="!isLoading" class="py-4 px-6">
          <BalAssetSet :logoURIs="orderedTokenURIs(gauge)" :width="100" />
        </div>
      </template>
      <template #poolCompositionCell="{ pool, address, addedTimestamp }">
        <div v-if="!isLoading" class="flex items-center py-4 px-6">
          <div v-if="poolMetadata(pool.id)" class="text-left">
            {{ poolMetadata(pool.id)?.name }}
          </div>
          <TokenPills
            v-else
            :tokens="orderedGaugeTokens(pool)"
            :isStablePool="
              isStableLike(pool.poolType) || isUnknownType(pool.poolType)
            "
            :selectedTokens="getSelectedTokens(pool.tokens)"
            :pickedTokens="getPickedTokens(pool.tokens)"
          />
          <BalChipNew v-if="getIsGaugeNew(addedTimestamp)" class="ml-2" />
          <BalChipExpired v-if="getIsGaugeExpired(address)" class="ml-2" />
        </div>
      </template>
      <template #nextPeriodVotesCell="gauge">
        <!-- Put to BalLazy the most expensive to render component -->
        <BalLazy>
          <div v-if="!isLoading" class="flex justify-end py-4 px-6">
            <GaugeVoteInfo :gauge="gauge" />
            <div class="flex justify-end w-6">
              <IconLimit
                v-if="gauge.pool.symbol === 'veBAL'"
                size="sm"
                amount="10"
                :tooltip="
                  $t(
                    'veBAL.liquidityMining.limitsTooltip.distributionsCappedVeBAL'
                  )
                "
              />
              <IconLimit
                v-else-if="
                  gauge.relativeWeightCap !== 'null' &&
                  gauge.relativeWeightCap !== '1'
                "
                size="sm"
                :amount="(Number(gauge.relativeWeightCap) * 100).toFixed()"
                :tooltip="
                  $t(
                    'veBAL.liquidityMining.limitsTooltip.distributionsCappedAt',
                    [(Number(gauge.relativeWeightCap) * 100).toFixed()]
                  )
                "
              />
            </div>
          </div>
        </BalLazy>
      </template>
      <template #myVotesCell="gauge">
        <div v-if="!isLoading" class="py-4 px-6 text-right">
          <GaugesTableMyVotes :gauge="gauge"></GaugesTableMyVotes>
        </div>
      </template>
      <template #voteColumnCell="gauge">
        <div v-if="isWalletReady" class="px-4">
          <GaugesTableVoteBtn
            :hasUserVotes="getHasUserVotes(gauge.userVotes)"
            :isGaugeExpired="getIsGaugeExpired(gauge.address)"
            @click.stop.prevent="emit('clickedVote', gauge)"
          />
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>

<style>
tr.expired-gauge-row {
  @apply bg-red-50  hover:bg-red-100 dark:border-red-600 dark:border;
}
</style>
