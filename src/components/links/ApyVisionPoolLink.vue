<script lang="ts" setup>
import { useApyVisionHelpers } from '@/composables/external/useApyVisionHelpers';
import { getAddressFromPoolId } from '@/lib/utils';
import { PoolToken } from '@auroblocks/chimp-sdk';

/**
 * TYPES
 */
type Props = {
  poolId: string;
  tokens: PoolToken[];
};

/**
 * PROPS & EMITS
 */
defineProps<Props>();

/**
 * COMPOSABLES
 */
const { poolPathSymbolSegment, apyVisionNetworkName } = useApyVisionHelpers();
</script>

<template>
  <div
    v-if="apyVisionNetworkName"
    class="group flex items-center mt-6 mb-5 w-fit h-fit"
  >
    <BalLink
      :href="
        'https://app.apy.vision/pools/balancerv2_' +
        apyVisionNetworkName +
        '-' +
        poolPathSymbolSegment(tokens) +
        '-' +
        getAddressFromPoolId(poolId)
      "
      external
      noStyle
      class="flex items-center font-medium link link-black"
    >
      <img
        width="32"
        height="32"
        class="mr-2 rounded-full group-hover:shadow-lg transition"
        src="@/assets/images/icons/apy-vision.svg"
        alt=""
      />
      {{ $t('apyvisionPoolInsights') }}
      <BalIcon
        name="arrow-up-right"
        size="sm"
        class="ml-0.5 text-gray-500 group-hover:text-blue-500 hover:text-blue-400 transition-colors"
      />
    </BalLink>
  </div>
</template>
