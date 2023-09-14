<script setup lang="ts">
import { Pool } from '@/services/pool/types';
import Page from './Page.vue';

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
      <Page :pool="props.pool" :hanldeClose="handleClose" />
    </BalModal>
  </teleport>
</template>
