<script setup lang="ts">
import { useRouter } from 'vue-router';

import HomePageHero from '@/components/heros/HomePageHero.vue';
import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useBreakpoints from '@/composables/useBreakpoints';
import useNetwork from '@/composables/useNetwork';
import usePools from '@/composables/pools/usePools';
import { lsGet, lsSet } from '@/lib/utils';
import LS_KEYS from '@/constants/local-storage.keys';
import { useIntersectionObserver } from '@vueuse/core';

const featuredProtocolsSentinel = ref<HTMLDivElement | null>(null);
const isFeaturedProtocolsVisible = ref(false);
useIntersectionObserver(featuredProtocolsSentinel, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    isFeaturedProtocolsVisible.value = true;
  }
});

/**
 * STATE
 */
const route = useRoute();
const urlSortParam = route.query?.sort as string | undefined;
const initSortCol =
  urlSortParam || lsGet(LS_KEYS.App.PoolSorting) || 'totalLiquidity';

/**
 * COMPOSABLES
 */
const router = useRouter();
const { appNetworkConfig } = useNetwork();
const isElementSupported = appNetworkConfig.supportsElementPools;
const { selectedTokens, addSelectedToken, removeSelectedToken } =
  usePoolFilters();

const poolsSortField = ref('totalLiquidity');

const { pools, isLoading, poolsIsFetchingNextPage, loadMorePools } = usePools(
  selectedTokens,
  poolsSortField
);
const { upToMediumBreakpoint, isMobile } = useBreakpoints();
const { networkSlug, networkConfig } = useNetwork();

const isPaginated = computed(() => pools.value.length >= 10);

/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool', params: { networkSlug } });
}

function onColumnSort(columnId: string) {
  poolsSortField.value = columnId;
  lsSet(LS_KEYS.App.PoolSorting, columnId);
}
console.log('pools', pools);
</script>

<template>
  <div>
    <HomePageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-8 xl:mx-auto">
      <BalStack vertical>
        <div class="px-4 xl:px-0 mb-[40px]">
          <div class="flex justify-between items-end mb-[30px] mr-[20px]">
            <h3 class="whitespace-nowrap">
              {{ networkConfig.chainName }}
              <span class="lowercase">{{ $t('pools') }}</span>
            </h3>
            <TokenSearchInput
              v-if="isMobile"
              v-model="selectedTokens"
              @add="addSelectedToken"
              @remove="removeSelectedToken"
            />
          </div>

          <div
            v-if="!isMobile"
            class="flex flex-col md:flex-row justify-between items-end lg:items-center w-full"
          >
            <TokenSearchInput
              v-model="selectedTokens"
              class="w-full md:w-2/3"
              @add="addSelectedToken"
              @remove="removeSelectedToken"
            />
          </div>
        </div>
        <PoolsTable
          :data="pools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoading="isLoading"
          :selectedTokens="selectedTokens"
          class="mb-8"
          :sortColumn="initSortCol"
          :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
          :isLoadingMore="poolsIsFetchingNextPage"
          :isPaginated="isPaginated"
          skeletonClass="pools-table-loading-height"
          @on-column-sort="onColumnSort"
          @load-more="loadMorePools"
        />
        <div ref="featuredProtocolsSentinel" />
        <div
          v-if="isElementSupported && isFeaturedProtocolsVisible"
          class="p-4 xl:p-0 mt-12"
        >
          <FeaturedProtocols />
        </div>
      </BalStack>
    </div>
  </div>
</template>

<style>
.pools-table-loading-height {
  height: 40rem;
}
</style>
