<script setup lang="ts">
import { Pool } from '@/services/pool/types';
import WithdrawPage from './WithdrawPage.vue';

/**
 * TYPES
 */
type Props = {
  isVisible: boolean;
  pool: Pool;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emit = defineEmits(['close', 'success']);

/**
 * STATE
 */
const showFireworks = ref(false);

/**
 * COMPOSABLES
 */

/**
 * METHODS
 */
function handleClose() {
  showFireworks.value = false;
  emit('close');
}
</script>

<template>
  <teleport to="#modal">
    <BalModal :show="isVisible" :minWidth="510" @close="handleClose">
      <WithdrawPage :pool="props.pool" :handleClose="handleClose" />
    </BalModal>
  </teleport>
</template>
