<!-- eslint-disable vue/require-valid-default-prop -->
<script setup lang="ts">
import { toRefs, ref } from 'vue';
import useTransactions from '@/composables/useTransactions';
import { configService } from '@/services/config/config.service';
import BigNumber from 'bignumber.js';
import useWeb3 from '@/services/web3/useWeb3';
import BalModal from '@/components/_global/BalModal/BalModal.vue';
import { Contract } from 'ethers';
import ReliqueryAbi from '@/lib/abi/Reliquery.json';
/**
 * TYPES
 */
type FarmData = {
  amount: any;
  relicId: any;
  entry: any;
  level: any;
  pendingReward: any;
};
type Props = {
  position: FarmData;
  bptBalance: string | null;
};

const emit = defineEmits(['close', 'success']);

const props = withDefaults(defineProps<Props>(), {
  position: {
    amount: '0',
    relicId: null,
    entry: '',
    level: '0',
    pendingReward: '0',
  },
  bptBalance: '0',
});
const { addTransaction } = useTransactions();
const { position } = toRefs(props);
const { account, getSigner } = useWeb3();
const showDepositModal = ref(false);
const showWithdrawModal = ref(false);
const isDepositLoading = ref(false);
const isWithdrawLoading = ref(false);
const isHarvestLoading = ref(false);
const amount = ref<string>('0');
const withdrawAmount = ref<string>('0');
const handleDeposit = async () => {
  try {
    const signer = getSigner();
    const reliqueryAddress = configService.network.addresses.reliquery;
    if (reliqueryAddress) {
      console.log('signer', signer);
      isDepositLoading.value = true;
      const reliqueryContract = new Contract(
        reliqueryAddress,
        ReliqueryAbi,
        signer
      );
      const depositAmount = new BigNumber(amount.value)
        .multipliedBy(10 ** 18)
        .toString();
      console.log('position', position.value.relicId);
      const depostTx = await reliqueryContract.deposit(
        depositAmount,
        position.value.relicId
      );
      addTransaction({
        id: depostTx.hash,
        type: 'tx',
        action: 'depositRelic',
        summary: `Depositing Amount ${amount.value} to the Reliquery`,
        details: {
          amount: amount.value,
        },
      });
      await depostTx.wait();
    }
    isDepositLoading.value = false;
    handleHideDepositModal();
  } catch (error) {
    isDepositLoading.value = false;
    handleHideDepositModal();
    console.log('error', error);
  }
};
const handleWithdraw = async () => {
  try {
    const signer = getSigner();
    const reliqueryAddress = configService.network.addresses.reliquery;
    if (reliqueryAddress) {
      console.log('signer', signer);
      isWithdrawLoading.value = true;
      const reliqueryContract = new Contract(
        reliqueryAddress,
        ReliqueryAbi,
        signer
      );
      const depositAmount = new BigNumber(withdrawAmount.value)
        .multipliedBy(10 ** 18)
        .toString();
      console.log('position', position.value.relicId);
      const depostTx = await reliqueryContract.withdraw(
        depositAmount,
        position.value.relicId
      );
      addTransaction({
        id: depostTx.hash,
        type: 'tx',
        action: 'withdrawRelic',
        summary: `Withdrawing Amount ${withdrawAmount.value} from the Reliquery`,
        details: {
          amount: withdrawAmount.value,
        },
      });
      await depostTx.wait();
    }
    isWithdrawLoading.value = false;
    handleHideWithdrawModal();
  } catch (error) {
    isWithdrawLoading.value = false;
    handleHideWithdrawModal();
    console.log('error', error);
  }
};
const handleHarvest = async () => {
  try {
    const signer = getSigner();
    const reliqueryAddress = configService.network.addresses.reliquery;
    if (reliqueryAddress) {
      isHarvestLoading.value = true;
      const reliqueryContract = new Contract(
        reliqueryAddress,
        ReliqueryAbi,
        signer
      );
      const depostTx = await reliqueryContract.harvest(
        position.value.relicId,
        account.value
      );
      addTransaction({
        id: depostTx.hash,
        type: 'tx',
        action: 'harvestRelic',
        summary: `Harvesting Rewards`,
        details: {
          amount: withdrawAmount.value,
        },
      });
      await depostTx.wait();
    }
    isHarvestLoading.value = false;
  } catch (error) {
    isHarvestLoading.value = false;
    console.log('error', error);
  }
};
const handleShowDepositModal = () => {
  showDepositModal.value = true;
};
const handleHideDepositModal = () => {
  showDepositModal.value = false;
  emit('close');
};
const handleShowWithdrawModal = () => {
  showWithdrawModal.value = true;
};
const handleHideWithdrawModal = () => {
  showWithdrawModal.value = false;
  emit('close');
};
const isMaxed = computed(() => {
  return amount.value === props.bptBalance;
});
const setMax = () => {
  amount.value = props.bptBalance ? props.bptBalance : '0';
};
const isMaxedWithdraw = computed(() => {
  return (
    withdrawAmount.value ===
    new BigNumber(position.value.amount).dividedBy(10 ** 18).toString()
  );
});
const setMaxWithdraw = () => {
  withdrawAmount.value = new BigNumber(position.value.amount)
    .dividedBy(10 ** 18)
    .toString()
    ? new BigNumber(position.value.amount).dividedBy(10 ** 18).toString()
    : '0';
};
</script>

<template>
  <BalModal :show="showDepositModal" @close="handleHideDepositModal">
    <template #header>
      <h4>Deposit into Existing Position</h4>
    </template>
    <div class="flex flex-col justify-center items-center">
      <span
        class="group-hover:text-purple-500 dark:group-hover:text-yellow-500 transition-colors xs:text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[20px] font-[500]"
      >
        Deposit into exisiting position with relic id {{ position.relicId }}
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
                {{ props.bptBalance }}
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
      <BalBtn
        :disabled="isDepositLoading"
        :onClick="handleDeposit"
        class="min-w-[250px]"
      >
        {{ isDepositLoading ? 'Processing...' : 'Depost' }}
      </BalBtn>
    </div>
  </BalModal>
  <BalModal :show="showWithdrawModal" @close="handleHideWithdrawModal">
    <template #header>
      <h4>Withdraw from Existing Position</h4>
    </template>
    <div class="flex flex-col justify-center items-center">
      <span
        class="group-hover:text-purple-500 dark:group-hover:text-yellow-500 transition-colors xs:text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[20px] font-[500]"
      >
        Withdraw from exisiting position with relic id {{ position.relicId }}
      </span>
      <div class="w-full mt-[20px] mb-[20px]">
        <BalTextInput
          name="withdrawAmount"
          :modelValue="withdrawAmount"
          placeholder="Enter amount to deposit"
          size="sm"
          class="w-full"
          type="number"
          autoFocus
          val
          :fontSize="18"
          @input="val => (withdrawAmount = val)"
        >
        </BalTextInput>
        <div class="flex flex-col pt-1 mt-[5px]">
          <div
            class="flex justify-between items-center text-sm leading-none text-gray-600 dark:text-gray-400"
          >
            <button class="flex items-center" @click="setMaxWithdraw">
              {{ $t('balance') }}:

              <span class="mx-1">
                {{
                  new BigNumber(position.amount).dividedBy(10 ** 18).toString()
                }}
              </span>
              <div>
                <span
                  v-if="!isMaxedWithdraw"
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
      <BalBtn
        :disabled="isWithdrawLoading"
        :onClick="handleWithdraw"
        class="min-w-[250px]"
      >
        {{ isWithdrawLoading ? 'Processing...' : 'Withdraw' }}
      </BalBtn>
    </div>
  </BalModal>
  <div
    :class="[
      'grid gap-y-4 px-4 w-full items-center border-b dark:border-b-gray-900 last:border-0 transition-all ease-in duration-300 grid-cols-6',
    ]"
  >
    <div class="group flex items-center">
      <span
        class="group-hover:text-purple-500 dark:group-hover:text-yellow-500 transition-colors xs:text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[20px] font-[500]"
        >{{ position.relicId }}</span
      >
    </div>
    <div class="justify-self-center">
      {{ new BigNumber(position.amount).dividedBy(10 ** 18).toString() }}
    </div>
    <div class="justify-self-center">
      {{ new Date(parseFloat(position.entry) * 1000).toDateString() }}
    </div>
    <div class="justify-self-center">{{ position.level }}</div>
    <div class="justify-self-center">
      <div
        class="flex flex-col justify-items-center items-center mb-[10px] mt-[10px]"
      >
        {{
          new BigNumber(position.pendingReward).dividedBy(10 ** 18).toFixed(4)
        }}
        <BalBtn
          class="mt-[5px]"
          size="sm"
          :disabled="isHarvestLoading"
          rounded
          :onclick="handleHarvest"
        >
          {{ isHarvestLoading ? 'Processing...' : 'Harvest' }}
        </BalBtn>
      </div>
    </div>
    <div class="justify-self-center">
      <div
        class="flex flex-col justify-items-center items-center mb-[10px] mt-[10px]"
      >
        <button
          class="action-conatine-join w-fit mb-[10px]"
          :onClick="handleShowDepositModal"
        >
          <div class="flex items-center">
            <div class="whitespace-nowrap text-[14px] font-[500]">Deposit</div>
            <div class="flex ml-2 center">
              <BalIcon name="plus" size="sm" />
            </div>
          </div>
        </button>
        <button
          class="action-conatiner-withdraw"
          :onClick="handleShowWithdrawModal"
        >
          <div class="flex items-center">
            <div class="whitespace-nowrap text-[14px] font-[500]">Withdraw</div>
            <div class="flex ml-2 center">
              <BalIcon name="minus" size="sm" />
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nested-token {
  @apply flex-shrink-0 mr-2 relative ml-1 sm:ml-0;
}

.level-1 {
  @apply py-4 font-medium hover:bg-gray-50 hover:dark:bg-gray-800;
}

.level-2 {
  @apply py-3.5 bg-gray-100/20 hover:bg-gray-50 dark:bg-gray-850 hover:dark:bg-gray-800;
}

.level-3 {
  @apply py-3 text-sm text-secondary bg-gray-100/50 hover:bg-gray-100/70 dark:bg-gray-900/50 hover:dark:bg-gray-800;
}

.level-4 {
  @apply py-2.5 text-sm text-secondary bg-gray-100 hover:bg-gray-100/50 dark:bg-gray-900 hover:dark:bg-gray-800;
}

.level-2 > a {
  @apply pl-8;
}

.level-3 > a {
  @apply pl-16;
}

.level-4 > a {
  @apply pl-20;
}
</style>
