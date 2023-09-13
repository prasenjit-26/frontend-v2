<script setup lang="ts">
import { getAddress } from '@ethersproject/address';
import { formatDistanceToNow } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ColumnDefinition } from '@/components/_global/BalTable/types';

import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';
import { Pool, PoolActivity, PoolActivityType } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { preMintedBptIndex } from '@/composables/usePoolHelpers';

/**
 * TYPES
 */
type TokenAmount = {
  address: string;
  symbol: string;
  amount: string;
};

type ActivityRow = {
  label: string;
  formattedValue: string;
  value: number;
  timestamp: number;
  formattedDate: string;
  tx: string;
  type: PoolActivityType;
  tokenAmounts: TokenAmount[];
};

type Props = {
  tokens: string[];
  pool: Pool;
  poolActivities: PoolActivity[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  loadMore?: () => void;
  isPaginated?: boolean;
  noResultsLabel?: string;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isLoadingMore: false,
  isPaginated: false,
  noResultsLabel: '',
});

const emit = defineEmits(['loadMore']);

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { t } = useI18n();
const { explorerLinks } = useWeb3();
const { upToLargeBreakpoint } = useBreakpoints();
const { getToken, priceFor } = useTokens();
/**
 * COMPUTED
 */
const columns = computed<ColumnDefinition<ActivityRow>[]>(() => [
  {
    name: t('tokens'),
    id: 'details',
    accessor: '',
    Cell: 'detailsCell',
    width: 325,
    sortable: false,
  },
  {
    name: t('value'),
    id: 'value',
    accessor: 'value',
    Cell: 'valueCell',
    align: 'right',
    className: 'align-center w-40',
    sortKey: pool => pool.value,
    width: 125,
  },
  {
    name: t('time'),
    id: 'timeAgo',
    accessor: 'timestamp',
    Cell: 'timeCell',
    align: 'right',
    sortKey: pool => pool.timestamp,
    width: 200,
  },
  {
    name: t('action'),
    id: 'action',
    accessor: 'tx',
    Cell: 'actionCell',
    width: 150,
    sortable: false,
  },
]);

const activityRows = computed<ActivityRow[]>(() =>
  props.isLoading
    ? []
    : props.poolActivities.map(({ type, timestamp, tx, amounts }) => {
        const poolTokenItselfIndex = preMintedBptIndex(props.pool);

        const amountExcludedPoolTokenItself = amounts.filter(
          (amount, index) => index !== poolTokenItselfIndex
        );

        const isJoin = type === 'Join';
        const value = getJoinExitValue(amountExcludedPoolTokenItself);

        return {
          label: isJoin ? t('addTokens') : t('withdraw.label'),
          value,
          formattedValue:
            value > 0
              ? fNum(value, { style: 'currency', abbreviate: true })
              : '-',
          timestamp,
          formattedDate: t('timeAgo', [formatDistanceToNow(timestamp)]),
          tx,
          type,
          tokenAmounts: getJoinExitDetails(amountExcludedPoolTokenItself),
        };
      })
);

/**
 * METHODS
 */
function getJoinExitValue(amounts: PoolActivity['amounts']) {
  let total = bnum(0);

  for (let i = 0; i < amounts.length; i++) {
    const amount = amounts[i];
    const address = getAddress(props.tokens[i]);
    const token = getToken(address);
    const price = priceFor(token?.address);
    const amountNumber = Math.abs(parseFloat(amount));
    // If the price is unknown for any of the positive amounts - the value cannot be computed.
    if (amountNumber > 0 && price === 0) {
      return 0;
    }
    total = total.plus(bnum(amountNumber).times(price));
  }
  return total.toNumber();
}

function getJoinExitDetails(amounts: PoolActivity['amounts']) {
  return amounts.map((amount, i) => {
    const address = getAddress(props.tokens[i]);
    const token = getToken(address);
    const symbol = token ? token.symbol : address;
    const amountNumber = parseFloat(amount);
    return {
      address,
      symbol,
      amount: fNum(amountNumber, FNumFormats.token),
    };
  });
}
</script>

<template>
  <BalCard
    class="overflow-x-auto"
    :square="upToLargeBreakpoint"
    noBorder
    noPad
    shadow="none"
  >
    <BalTable
      :columns="columns"
      :data="activityRows"
      :isLoading="isLoading"
      :isLoadingMore="isLoadingMore"
      :isPaginated="isPaginated"
      skeletonClass="h-64"
      sticky="both"
      :noResultsLabel="noResultsLabel"
      :initialState="{
        sortColumn: 'timeAgo',
        sortDirection: 'desc',
      }"
      @load-more="emit('loadMore')"
    >
      <template #actionCell="action">
        <div
          :class="{
            'py-2 px-6 action-conatine-join w-fit mr-[20px]':
              action.type === 'Join',
            'py-2 px-6 action-conatiner-withdraw w-fit mr-[20px]':
              action.type !== 'Join',
          }"
        >
          <div class="flex items-center">
            <div class="whitespace-nowrap text-[14px] font-[500]">
              {{ action.label }}
            </div>
            <div class="flex ml-2 center">
              <BalIcon v-if="action.type === 'Join'" name="plus" size="sm" />
              <BalIcon v-else name="minus" size="sm" />
            </div>
          </div>
        </div>
      </template>

      <template #detailsCell="action">
        <div class="flex flex-wrap py-4 px-6 -mt-1">
          <template v-for="(tokenAmount, i) in action.tokenAmounts" :key="i">
            <div
              v-if="tokenAmount.amount !== '0'"
              class="flex items-center m-1 token-conatiner"
            >
              <BalAsset :address="tokenAmount.address" class="mr-2 shrink-0" />
              <span class="font-numeric text-[16px] font-[500]">
                {{ tokenAmount.symbol }}
                <span class="ml-[5px]">
                  {{ tokenAmount.amount }}
                </span>
              </span>
            </div>
          </template>
        </div>
      </template>

      <template #valueCell="action">
        <div class="flex justify-end py-4 px-6 font-numeric text-[20px]">
          {{ action.formattedValue }}
        </div>
      </template>
      <template #timeCell="action">
        <div class="py-4 px-6">
          <div
            class="flex justify-end items-center text-right whitespace-nowrap wrap text-[20px]"
          >
            {{ action.formattedDate }}
            <BalLink
              :href="explorerLinks.txLink(action.tx)"
              external
              class="flex items-center ml-2"
            >
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="text-gray-500 hover:text-blue-500 transition-colors"
              />
            </BalLink>
          </div>
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>
<style>
.action-conatine-join {
  background: #16a34a;
  border-radius: 26px;
  padding: 10px 16px;
  color: white;
}
.action-conatiner-withdraw {
  border-radius: 26px;
  background: #dd524c;
  padding: 10px 16px;
  color: white;
}
.dark .token-conatiner {
  background-color: #343563;
  border: 1px solid #8b8dfc;
  padding: 10px 5px;
  border-radius: 6px;
}
.token-conatiner {
  border-radius: 6px;
  border: 1px solid #8b8dfc;
  background: #bec0ff;
  padding: 10px 5px;
}
</style>