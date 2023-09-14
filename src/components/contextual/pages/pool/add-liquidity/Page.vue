<script setup lang="ts">
import { usePoolHelpers } from '@/composables/usePoolHelpers';
import useBreakpoints from '@/composables/useBreakpoints';
import MyWallet from './MyWallet.vue';
import Accordion from './Accordion.vue';
import AddLiquidityCard from './AddLiquidityCard.vue';
import { provideJoinPool } from '@/providers/local/join-pool.provider';
import Col2Layout from '@/components/layouts/Col2Layout.vue';
import useDisabledJoinsGuard from '@/composables/contextual/add-liquidity/useDisabledJoinsGuard';
import { Pool } from '@/services/pool/types';

type Props = {
  pool: Pool;
  hanldeClose?: any;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const pool = toRef(props, 'pool');

/**
 * PROVIDERS
 */
provideJoinPool(pool);

/**
 * COMPOSABLES
 */
useDisabledJoinsGuard(props.pool);
const { isDeepPool } = usePoolHelpers(pool);
const { isMobile } = useBreakpoints();
</script>

<template>
  <div>
    <AddLiquidityCard :pool="pool" :hanldeClose="props.hanldeClose" />
    <Accordion
      v-if="isMobile"
      :pool="pool"
      class="mt-4"
      :isDeepPool="isDeepPool"
    />
  </div>
</template>
