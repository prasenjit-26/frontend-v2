<template>
  <div class="flex">
    <BalBtn
      v-for="option in options"
      :key="option.value"
      outline
      size="sm"
      :class="[
        'mr-2 capitalize w18 text-[18px]',
        {
          'select-button-selected': modelValue === option.value,
          'select-button': modelValue !== option.value,
        },
      ]"
      v-bind="attrs_"
      :color="modelValue === option.value ? 'blue' : 'gray'"
      @click="onSelect(option)"
    >
      {{ 'best' === option.label ? $t(option.label) : option.label }}
    </BalBtn>
  </div>
</template>

<script lang="ts">
import omit from 'lodash/omit';

interface Option {
  value: string | number;
  label: string;
}

export default defineComponent({
  name: 'BalBtnGroup',

  inheritAttrs: false,

  props: {
    modelValue: { type: [String, Number], required: true },
    options: { type: Array as PropType<Option[]>, required: true },
  },

  emits: ['update:modelValue'],

  setup(props, { emit, attrs }) {
    // COMPUTED
    const attrs_ = computed(() => omit(attrs, 'options'));

    // METHODS
    function onSelect(option: Option) {
      emit('update:modelValue', option.value);
    }

    return {
      // computed
      attrs_,

      // methods
      onSelect,
    };
  },
});
</script>
<style>
.dark .select-button-selected {
  border: 1px solid #8b8dfc;
  background: #3f3f75;
  border-radius: 12px;
  padding: 11px;
  color: #8b8dfc !important;
  border-color: #8b8dfc !important;
  font-size: 18px;
  height: 48px;
}
.select-button-selected {
  border: 1px solid #4e529c;
  background: #8b8dfc;
  border-radius: 12px;
  padding: 11px;
  color: #ffffff !important;
  border-color: #4e529c !important;
  font-size: 18px;
  height: 48px;
}
.dark .select-button {
  border: 1px solid #818181;
  background: #2b2b3e;
  border-radius: 12px;
  padding: 11px;
  color: #818181 !important;
  border-color: #818181 !important;
  font-size: 18px;
  height: 48px;
}
.select-button {
  border: 1px solid #818181;
  background: rgba(156, 156, 156, 0.2);
  border-radius: 12px;
  padding: 11px;
  color: #818181 !important;
  border-color: #818181 !important;
  font-size: 18px;
  height: 48px;
}
</style>
