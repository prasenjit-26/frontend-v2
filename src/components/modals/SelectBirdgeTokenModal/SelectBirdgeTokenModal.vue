<script setup lang="ts">
import { orderBy } from 'lodash';
import { computed, reactive, toRef, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import TokenListItem from '../../../components/lists/TokenListItem.vue';
import { useTokens } from '../../../providers/tokens.provider';
import { TokenInfoMap } from '../../../types/TokenList';
import { useMagicKeys } from '@vueuse/core';

interface Props {
  open?: boolean;
  excludedTokens?: string[];
  subset?: string[];
  includeEther?: boolean;
  disableInjection?: boolean;
  hideTokenLists?: boolean;
  ignoreBalances?: boolean;
  approvedTokenLists?: any[];
  rpcUrl?: string;
  account?: string;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  excludedTokens: () => [],
  subset: () => [],
  includeEther: false,
  disableInjection: false,
  hideTokenLists: false,
  ignoreBalances: false,
  rpcUrl: '',
  account: '',
  approvedTokenLists: () => [],
});

const emit = defineEmits(['close', 'selectTokenlist', 'select']);

interface ComponentState {
  loading: boolean;
  selectTokenList: boolean;
  query: string;
  results: TokenInfoMap;
  focussedToken: number;
  approvedTokenLists: any[];
}

/**
 * STATE
 */
const state: ComponentState = reactive({
  loading: false,
  selectTokenList: false,
  query: '',
  results: {},
  focussedToken: 0,
});

/**
 * COMPOSABLES
 */
const {
  getToken,
  searchTokens,
  dynamicDataLoading,
  nativeAsset,
  injectTokens,
} = useTokens();
const { t } = useI18n();

/**
 * COMPUTED
 */
const title = computed(() => {
  if (state.selectTokenList) return t('manageLists');
  return t('tokenSearch');
});

const tokens = computed(() => {
  const tokensWithValues = props.approvedTokenLists.map(token => {
    // const balance = await balanceForUsingRpc(
    //   token.address,
    //   props.rpcUrl,
    //   props.account,
    //   token.decimals
    // );
    // const price = priceFor(token.address);
    // const value = Number(balance) * price;
    return {
      ...token,
      price: '0',
      balance: '0',
      value: '0',
    };
  });

  if (props.ignoreBalances) return tokensWithValues;
  else return orderBy(tokensWithValues, ['value', 'balance'], ['desc', 'desc']);
});

const excludedTokens = computed(() => [
  ...props.excludedTokens,
  ...(props.includeEther ? [] : [nativeAsset.address]),
]);

const focussedTokenAddress = computed((): string => {
  console.log(state.results, state.focussedToken);
  const key = Object.keys(tokens.value)[state.focussedToken];
  return tokens.value[key].address;
});

/**
 * METHODS
 */
async function onSelectToken(token: string): Promise<void> {
  if (!getToken(token)) {
    await injectTokens([token]);
  }

  emit('select', token);
  emit('close');
}

/**
 * WATCHERS
 */
watch(
  toRef(state, 'query'),
  async newQuery => {
    state.loading = true;
    state.results = await searchTokens(newQuery, {
      excluded: excludedTokens.value,
      disableInjection: props.disableInjection,
      subset: props.subset,
    }).finally(() => {
      state.loading = false;
    });
  },
  { immediate: true }
);

const { ArrowDown, ArrowUp, Enter, Tab } = useMagicKeys();
watchEffect(() => {
  if (
    ArrowDown.value &&
    state.focussedToken < Object.keys(state.results).length
  )
    state.focussedToken++;
  if (Tab.value && state.focussedToken < Object.keys(state.results).length)
    state.focussedToken++;

  if (ArrowUp.value && state.focussedToken > 0) state.focussedToken--;

  if (Enter.value) onSelectToken(focussedTokenAddress.value);
});
</script>

<template>
  <BalModal show noContentPad @close="$emit('close')">
    <div class="px-4 pt-3 pb-3 mr-2">
      <BalStack
        horizontal
        align="center"
        spacing="xs"
        class="justify-between mb-4"
      >
        <h4 class="text-[24px] font-[600]">
          {{ title }}
        </h4>
        <button class="flex close-button-modal" @click="$emit('close')">
          Close
        </button>
      </BalStack>
    </div>
    <div class="overflow-hidden">
      <RecycleScroller
        v-if="tokens.length > 0"
        v-slot="{ item: token, index }"
        class="overflow-y-scroll list-height"
        :items="tokens"
        :itemSize="70"
        keyField="address"
        :buffer="100"
      >
        <a @click="onSelectToken(token.address)">
          <TokenListItem
            :token="token"
            :hideBalance="ignoreBalances"
            :balanceLoading="dynamicDataLoading"
            :focussed="index == state.focussedToken"
            tabIndex="0"
          />
        </a>
      </RecycleScroller>
      <div
        v-else-if="state.loading"
        class="flex justify-center items-center h-96"
      >
        <BalLoadingIcon />
      </div>
      <div
        v-else
        class="p-12 h-96 text-center text-secondary"
        v-text="$t('errorNoTokens')"
      />
    </div>
  </BalModal>
</template>

<style scoped>
.list-height {
  height: 70vh;
}
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


