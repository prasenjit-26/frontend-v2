<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useTokens } from '@/providers/tokens.provider';
import { TokenInfo } from '@/types/TokenList';
import MyWallet from '@/components/cards/MyWallet/MyWallet.vue';
import PairPriceGraph from '@/components/cards/PairPriceGraph/PairPriceGraph.vue';
import SwapCard from '@/components/cards/SwapCard/SwapCard.vue';
import { useSwapAssets } from '@/composables/swap/useSwapAssets';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useBreakpoints from '@/composables/useBreakpoints';
import BridgeLink from '@/components/links/BridgeLink.vue';
import { hasBridge } from '@/composables/useNetwork';
import { provideUserTokens } from '@/providers/local/user-tokens.provider';
import swapSymbol from '@/assets/images/swapSymbol.png';

/**
 * PROVIDERS
 */
provideUserTokens();

/**
 * COMPOSABLES
 */
const { setSelectedTokens } = usePoolFilters();
const { upToLargeBreakpoint } = useBreakpoints();

/**
 * COMPUTED
 */
const sections = computed(() => {
  const sections = [
    { title: 'My wallet', id: 'my-wallet' },
    { title: 'Price chart', id: 'price-chart' },
  ];
  if (hasBridge.value) sections.push({ title: 'Bridge assets', id: 'bridge' });
  return sections;
});

/**
 * CALLBACKS
 */
onMounted(() => {
  // selectedPoolTokens are only persisted between the Home/Pool pages
  setSelectedTokens([]);
});
const { getToken } = useTokens();
const { inputAsset, outputAsset } = useSwapAssets();
const inputTokentoken = computed<TokenInfo | undefined>(() =>
  inputAsset.value ? getToken(inputAsset.value) : undefined
);
const outputTokentoken = computed<TokenInfo | undefined>(() =>
  outputAsset.value ? getToken(outputAsset.value) : undefined
);
</script>

<template>
  <div>
    <div class="container mx-auto max-w-[1300px] h-[75vh]">
      <div class="grid grid-cols-2 gap-4">
        <!-- <template #gutterLeft>
        <MyWallet />
      </template> -->
        <div class="mt-[25px]">
          <div class="flex items-center mb-[20px]">
            <div class="flex items-center mr-[16px]">
              <BalAsset
                :address="inputTokentoken?.address"
                class="shadow"
                :size="30"
              />
              <span class="text-[20px] font-[600] ml-[10px]">{{
                inputTokentoken?.symbol
              }}</span>
            </div>
            <div class="swapsymbol-container mr-[16px]">
              <img :src="swapSymbol" alt="swap" width="20" />
            </div>
            <div class="flex items-center">
              <BalAsset
                :address="outputTokentoken?.address"
                class="shadow"
                :size="30"
              />
              <span class="text-[20px] font-[600] ml-[10px]">{{
                outputTokentoken?.symbol
              }}</span>
            </div>
          </div>
          <!-- <MyWallet /> -->
          <PairPriceGraph />
          <!-- <BridgeLink v-if="hasBridge" class="mt-4" /> -->
        </div>
        <div>
          <SwapCard />
          <div class="p-4 sm:p-0 lg:p-0 mt-8">
            <BalAccordion
              v-if="upToLargeBreakpoint"
              class="w-full"
              :sections="sections"
            >
              <template #my-wallet>
                <MyWallet />
              </template>
              <template #price-chart>
                <PairPriceGraph />
              </template>
              <template v-if="hasBridge" #bridge>
                <BridgeLink />
              </template>
            </BalAccordion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.graph-modal {
  height: 450px;
}
.max-width-custom {
  max-width: 90% !important;
}
.dark .swapsymbol-container {
  border-radius: 25px;
  border: 1px solid #8b8dfc;
  background: #34355f;
  display: flex;
  width: 32px;
  height: 32px;
  padding: 3.6px;
  justify-content: center;
  align-items: center;
}
.swapsymbol-container {
  border-radius: 25px;
  border: 1px solid #8b8dfc;
  background: #dadbff;
  display: flex;
  width: 32px;
  height: 32px;
  padding: 3.6px;
  justify-content: center;
  align-items: center;
}
</style>
