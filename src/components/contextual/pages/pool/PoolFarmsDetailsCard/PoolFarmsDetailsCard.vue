<script setup lang="ts">
import { onMounted, ref } from 'vue';

import RelicBreakdown from './components/RelicBreakdown.vue';
import useWeb3 from '@/services/web3/useWeb3';
import { configService } from '@/services/config/config.service';
import ReliqueryAbi from '@/lib/abi/Reliquery.json';
import { getMulticaller } from '@/dependencies/Multicaller';

type FarmData = {
  amount: any;
  relicId: any;
  entry: any;
  level: any;
  pendingReward: any;
};
/**
 * PROPS
 */

/**
 * COMPOSABLES
 */
const { account } = useWeb3();

// Hide my pool share tab when user does not have shares

const farmData = ref({
  pendingRewards: '0',
  positions: [
    {
      amount: '0',
      relicId: null,
      entry: null,
    },
  ],
});

/**
 * LIFECYCLE
 */
const getFarmDetails = async () => {
  console.log('fetch farm details', account.value);
  const Multicaller = getMulticaller();
  const multicaller = new Multicaller();
  console.log('configService', configService.network.addresses.reliquery);
  if (configService.network.addresses.reliquery) {
    multicaller.call({
      key: `relicposition-${account.value}`,
      address: configService.network.addresses.reliquery,
      function: 'relicPositionsOfOwner',
      abi: ReliqueryAbi,
      params: [account.value],
    });
    multicaller.call({
      key: `pendingRewardsOfOwner-${account.value}`,
      address: configService.network.addresses.reliquery,
      function: 'pendingRewardsOfOwner',
      abi: ReliqueryAbi,
      params: [account.value],
    });
    const result = await multicaller.execute();
    let positions: FarmData[] = [];
    if (result[`relicposition-${account.value}`].relicIds) {
      result[`relicposition-${account.value}`].relicIds.map((relic, index) => {
        const rewards = result[`pendingRewardsOfOwner-${account.value}`].find(
          rewards => rewards.relicId.toString() === relic.toString()
        );
        positions.push({
          amount:
            result[`relicposition-${account.value}`].positionInfos[
              index
            ].amount.toString(),
          relicId: relic.toString(),
          entry:
            result[`relicposition-${account.value}`].positionInfos[
              index
            ].entry.toString(),
          level:
            result[`relicposition-${account.value}`].positionInfos[
              index
            ].level.toString(),
          pendingReward: rewards.pendingReward.toString(),
        });
      });
      console.log('positions', positions);
    }
    farmData.value = {
      positions,
    };
  }
};
onMounted(() => getFarmDetails());
</script>

<template>
  <h3
    class="px-4 lg:px-0 mb-3 xs:text-[18px] sm:text-[18px] font-[500] mt-[40px] mb-[40px]"
    v-text="'Reliquery Farm Details'"
  />
  <BalCard
    class="overflow-x-auto whitespace-nowrap table-conatiner"
    noBorder
    noPad
  >
    <template #header>
      <div class="grid grid-cols-5 p-4 w-full text-base font-semibold">
        <div class="xs:text-[16px] sm:text-[18px] text-[20px] font-[500]">
          NFT ID
        </div>
        <div
          class="justify-self-center xs:text-[16px] sm:text-[18px] text-[20px] font-[500]"
        >
          Amount
        </div>
        <div
          class="justify-self-center xs:text-[16px] sm:text-[18px] text-[20px] font-[500]"
        >
          Entry Timestamp
        </div>
        <div
          class="justify-self-center xs:text-[16px] sm:text-[18px] text-[20px] font-[500]"
        >
          Level
        </div>
        <div
          class="justify-self-center xs:text-[16px] sm:text-[18px] text-[20px] font-[500]"
        >
          Rewards
        </div>
      </div>
    </template>

    <div class="grid table-container">
      <div
        v-for="position in farmData.positions"
        :key="position.relicId"
        class="grid row-bg nested-group h-[78px]"
      >
        <RelicBreakdown :position="position" />
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