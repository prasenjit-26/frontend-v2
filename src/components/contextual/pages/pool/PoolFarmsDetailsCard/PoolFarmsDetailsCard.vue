<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { MaxUint256 } from '@ethersproject/constants';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import { useTokens } from '@/providers/tokens.provider';
import RelicBreakdown from './components/RelicBreakdown.vue';
import useTransactions from '@/composables/useTransactions';
import { Contract } from 'ethers';
import useWeb3 from '@/services/web3/useWeb3';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';
import { configService } from '@/services/config/config.service';
import ReliqueryAbi from '@/lib/abi/Reliquery.json';
import ERC20_ABI from '@/lib/abi/ERC20.json';

import { getMulticaller } from '@/dependencies/Multicaller';
import BigNumber from 'bignumber.js';

type FarmData = {
  amount: any;
  relicId: string;
  entry: any;
  level: any;
  pendingReward: any;
};
const emit = defineEmits(['close', 'success']);
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
const { stakedShares } = usePoolStaking();
const { balanceFor } = useTokens();
const bptBalance = bnum(balanceFor(pool.value.address)).plus(
  stakedShares.value
);
/**
 * COMPOSABLES
 */
const { account, getSigner } = useWeb3();
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
const isApproveLoading = ref(false);
const showCreateModal = ref(false);
const isCreateRelicLoading = ref(false);
const amount = ref<string>('0');
const allowence = ref<string>('0');
/**
 * LIFECYCLE
 */
const getTokenAllowence = async () => {
  const signer = getSigner();
  const tokenContract = new Contract(props.pool.address, ERC20_ABI, signer);
  const allowenceOnChain = await tokenContract.allowance(
    account.value,
    configService.network.addresses.reliquery
  );
  console.log('allowenceOnChain', allowenceOnChain);
  const deciamls = await tokenContract.decimals();
  const allowenceAmount = new BigNumber(allowenceOnChain.toString())
    .dividedBy(10 ** parseFloat(deciamls.toString()))
    .toString();
  console.log('allowenceAmount', allowenceAmount);
  return allowenceAmount;
};
let allowanceState = computed(async () => {
  return await getTokenAllowence();
});
const getFarmDetails = async () => {
  const Multicaller = getMulticaller();
  const multicaller = new Multicaller();
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
const { addTransaction } = useTransactions();
const isMaxed = computed(() => {
  return amount.value === bptBalance.toString();
});
const setMax = () => {
  amount.value = bptBalance ? bptBalance.toString() : '0';
};
const isFarmsPresnt = computed(() => {
  return configService.network.pools.Farms?.includes(props.pool.id);
});
const handleApprove = async () => {
  try {
    const signer = getSigner();
    const reliqueryAddress = configService.network.addresses.reliquery;
    if (reliqueryAddress) {
      isApproveLoading.value = true;
      const tokenContract = new Contract(props.pool.address, ERC20_ABI, signer);
      const approveTx = await tokenContract.approve(
        reliqueryAddress,
        MaxUint256.toString()
      );
      addTransaction({
        id: approveTx.hash,
        type: 'tx',
        action: 'approve',
        summary: `Approving Reliquery`,
      });
      await approveTx.wait();
      const allowenceOnChain = await tokenContract.allowance(
        account.value,
        configService.network.addresses.reliquery
      );
      const deciamls = await tokenContract.decimals();
      allowence.value = new BigNumber(allowenceOnChain.toString())
        .dividedBy(10 ** parseFloat(deciamls.toString()))
        .toString();
    }
    isApproveLoading.value = false;
  } catch (error) {
    isApproveLoading.value = false;
    console.log('error', error);
  }
};
const handleCreateRelic = async () => {
  try {
    const signer = getSigner();
    const reliqueryAddress = configService.network.addresses.reliquery;
    if (reliqueryAddress) {
      isCreateRelicLoading.value = true;
      const reliqueryContract = new Contract(
        reliqueryAddress,
        ReliqueryAbi,
        signer
      );
      const depositAmount = new BigNumber(amount.value)
        .multipliedBy(10 ** 18)
        .toString();
      const depostTx = await reliqueryContract.createRelicAndDeposit(
        account.value,
        0,
        depositAmount
      );
      addTransaction({
        id: depostTx.hash,
        type: 'tx',
        action: 'createRelic',
        summary: `Creating Relic and Depositint Amount ${amount.value}`,
        details: {
          amount: amount.value,
        },
      });
      await depostTx.wait();
    }
    isCreateRelicLoading.value = false;
    handleHideCreateModal();
  } catch (error) {
    isCreateRelicLoading.value = false;
    handleHideCreateModal();
    console.log('error', error);
  }
};
const handleShowCreateModal = () => {
  showCreateModal.value = true;
};
const handleHideCreateModal = () => {
  showCreateModal.value = false;
  emit('close');
};
onMounted(() => {
  if (isFarmsPresnt.value) {
    getFarmDetails();
  }
});
console.log('allowence', allowence.value);
</script>

<template v-if="isFarmsPresnt.value">
  <BalModal :show="showCreateModal" @close="handleHideCreateModal">
    <template #header>
      <h4>Create New Relic</h4>
    </template>
    <div class="flex flex-col justify-center items-center">
      <span
        class="group-hover:text-purple-500 dark:group-hover:text-yellow-500 transition-colors xs:text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[20px] font-[500]"
      >
        Create new relic Poistion
      </span>
      <div class="w-full mt-[20px] mb-[20px]">
        <BalTextInput
          name="amount"
          :modelValue="amount"
          placeholder="Enter amount to deposit"
          size="sm"
          class="w-full"
          type="number"
          autoFocus
          val
          :fontSize="18"
          @input="val => (amount = val)"
        >
        </BalTextInput>
        <div class="flex flex-col pt-1 mt-[5px]">
          <div
            class="flex justify-between items-center text-sm leading-none text-gray-600 dark:text-gray-400"
          >
            <button class="flex items-center" @click="setMax">
              {{ $t('balance') }}:

              <span class="mx-1">
                {{ bptBalance.toString() }}
              </span>
              <div>
                <span
                  v-if="!isMaxed"
                  class="text-blue-600 hover:text-purple-600 focus:text-purple-600 dark:text-blue-400 dark:hover:text-yellow-500 dark:focus:text-yellow-500 transition-colors"
                >
                  {{ $t('max') }}
                </span>
                <span
                  v-else
                  class="text-gray-400 dark:text-gray-600 cursor-not-allowed"
                >
                  {{ $t('maxed') }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <BalBtn
          :disabled="isApproveLoading || parseFloat(allowence) <= 0"
          :onClick="handleApprove"
          class="mr-[30px] min-w-[150px]"
        >
          {{ isApproveLoading ? 'Processing...' : 'Approve' }}
        </BalBtn>
        <BalBtn
          class="min-w-[150px]"
          :disabled="isCreateRelicLoading || parseFloat(allowence) > 0"
          :onClick="handleCreateRelic"
        >
          {{ isCreateRelicLoading ? 'Processing...' : 'Create' }}
        </BalBtn>
      </div>
    </div>
  </BalModal>
  <div class="flex justify-between items-center">
    <h3
      class="px-4 lg:px-0 mb-3 xs:text-[18px] sm:text-[18px] font-[500] mt-[40px] mb-[40px]"
      v-text="'Reliquery Farm Details'"
    />
    <BalBtn :onClick="handleShowCreateModal" color="gradient">
      Create new Relic Position
    </BalBtn>
  </div>
  <BalCard
    class="overflow-x-auto whitespace-nowrap table-conatiner"
    noBorder
    noPad
  >
    <template #header>
      <div class="grid grid-cols-6 p-4 w-full text-base font-semibold">
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
        <div
          class="justify-self-center xs:text-[16px] sm:text-[18px] text-[20px] font-[500]"
        >
          Action
        </div>
      </div>
    </template>

    <div
      v-if="farmData.positions && farmData.positions.length > 0"
      class="grid table-container"
    >
      <div
        v-for="position in farmData.positions"
        :key="position.relicId"
        class="grid row-bg nested-group h-[auto]"
      >
        <RelicBreakdown
          :bptBalance="bptBalance.toString()"
          :position="position"
        />
      </div>
    </div>
  </BalCard>
</template>
<style scoped>
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