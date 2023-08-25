<template>
  <div class="group bal-toggle" @click="onClick">
    <input
      type="checkbox"
      :name="name"
      :checked="modelValue"
      v-bind="$attrs"
      :disabled="disabled"
      class="bal-toggle-checkbox"
    />
    <label :for="name" class="bal-toggle-track" />
  </div>
  <label v-if="label" class="ml-2 text-xs dark:text-white">
    {{ label }}
  </label>
</template>

<script lang="ts">
export default defineComponent({
  name: 'BalToggle',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    color: {
      type: String,
      default: 'green',
      validator: (val: string): boolean => ['green'].includes(val),
    },
  },
  emits: ['update:modelValue', 'toggle'],
  setup(props, { emit }) {
    /**
     * METHODS
     */
    function onClick(event) {
      if (!props.disabled) {
        emit('update:modelValue', event.target.checked);
        emit('toggle', event.target.checked);
      }
    }
    return {
      // methods
      onClick,
    };
  },
});
</script>

<style>
.bal-toggle {
  @apply relative inline-block w-10 align-middle select-none transition duration-200 ease-out;
}

.bal-toggle-checkbox {
  @apply absolute block w-6 h-6 rounded-full border-4
    dark:appearance-none cursor-pointer transition-colors;
  border-color: #111133;
  background-color: #8b8dfc;
}

.bal-toggle-track {
  @apply block overflow-hidden h-6 rounded-full
    dark:group-hover:cursor-pointer transition-colors;
  background-color: #111133;
  box-shadow: 0px 0px 0px 2px #8b8dfc;
}

.bal-toggle-checkbox:checked {
  @apply right-0
    dark:transition-colors;
  border-color: #484897;
}

.bal-toggle-track[for='swapGasless'] {
  @apply h-8;
}

.bal-toggle-checkbox[name='swapGasless'] {
  @apply w-8 h-8 flex items-center justify-center;
}

.bal-toggle-checkbox[name='swapGasless']::before {
  content: '⛽';
}

.bal-toggle-checkbox[name='swapGasless']:checked::before {
  content: '✍️';
}

.bal-toggle-checkbox:checked + .bal-toggle-track {
  background-color: #484897;
}

.bal-toggle-checkbox[disabled] {
  @apply border-gray-300 dark:border-gray-700 cursor-not-allowed;
}

.bal-toggle-checkbox[disabled] + .bal-toggle-track {
  @apply bg-gray-300 dark:bg-gray-700 cursor-not-allowed;
}
</style>
