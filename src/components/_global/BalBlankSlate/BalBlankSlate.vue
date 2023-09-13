<script lang="ts" setup>
type Props = {
  align?: 'start' | 'center' | 'end';
};

const props = withDefaults(defineProps<Props>(), {
  align: 'start',
});

const classes = computed(() => {
  return {
    'items-start': props.align === 'start',
    'items-center': props.align === 'center',
    'items-end': props.align === 'end',
  };
});
</script>

<template>
  <div :class="['bal-blank-slate text-secondary', classes]">
    <slot v-text="$t('noContent')" />
  </div>
</template>

<style>
.dark .bal-blank-slate {
  @apply border border-gray-700 border-dashed p-6 flex flex-col justify-center rounded-lg;

  min-height: 5px;
}
.bal-blank-slate {
  @apply border border-dashed p-6 flex flex-col justify-center rounded-lg;
  min-height: 5px;
  border: 1px solid #8b8dfc;
  background: #dedeff;
}
</style>
