<script setup lang="ts">
import { computed } from 'vue';

import BalAsset from '@/components/_global/BalAsset/BalAsset.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { shortenLabel } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';
import { PoolToken } from '@auroblocks/chimp-sdk';

/**
 * TYPES
 */
type Props = {
  token: PoolToken;
  symbol: string;
};

const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { fNum, toFiat } = useNumbers();
const { account } = useWeb3();
const { balanceFor } = useTokens();

/**
 * COMPUTED
 */
const tokenBalance = computed(() => balanceFor(props.token.address));
const shortenedAccount = computed(() => shortenLabel(account.value));
</script>

<template>
  <div>
    <div class="mb-2 text-secondary">
      {{ $t('tokenPills.balanceTooltip.title', [shortenedAccount]) }}
    </div>
    <div class="flex">
      <BalAsset :address="token.address" :size="36" class="mr-2" />
      <div>
        <div class="text-sm font-semibold">
          {{ fNum(tokenBalance, FNumFormats.token) }}
          {{ symbol }}
        </div>
        <div class="text-secondary">
          {{ fNum(toFiat(tokenBalance, token.address), FNumFormats.fiat) }}
        </div>
      </div>
    </div>
  </div>
</template>
