<script lang="ts">
// https://v3.vuejs.org/api/sfc-script-setup.html#usage-alongside-normal-script
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { omit } from 'lodash';

import { Rules } from '@/types';

import useInputEvents from './composables/useInputEvents';
import useInputStyles from './composables/useInputStyles';
import useInputValidation from './composables/useInputValidation';

import { InputValue, InputType, InputSize, ValidationTrigger } from './types';

type Props = {
  name: string;
  modelValue: InputValue;
  isValid?: boolean;
  type?: InputType;
  size?: InputSize;
  disabled?: boolean;
  label?: string;
  inputAlignRight?: boolean;
  decimalLimit?: number;
  validateOn?: ValidationTrigger;
  rules?: Rules;
  noRadius?: boolean;
  noShadow?: boolean;
  noBorder?: boolean;
  autoFocus?: boolean;
  format?: (input: string | number) => string | number;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  isValid: true,
  size: 'md',
  disabled: false,
  inputAlignRight: false,
  decimalLimit: 18,
  validateOn: 'blur',
  rules: () => [],
  noRadius: false,
  noShadow: false,
  noBorder: false,
  autoFocus: false,
});

const emit = defineEmits<{
  (e: 'blur', value: string): void;
  (e: 'input', value: string): void;
  (e: 'update:modelValue', value: string): void;
  (e: 'update:isValid', value: boolean): void;
  (e: 'keydown', value: KeyboardEvent);
  (e: 'mouseOver', value: Event);
  (e: 'mouseLeave', value: Event);
  (e: 'focus', value: Event);
}>();

/**
 * STATE
 */
const textInput = ref<HTMLInputElement>();

/**
 * COMPOSABLES
 */
const attrs = useAttrs();
const { isInvalid, validate } = useInputValidation(props, emit);
const { isActive, isHover, onInput, onKeydown, onBlur, onClick, onFocus } =
  useInputEvents(props, emit, validate);
const { inputClasses } = useInputStyles(
  props,
  isInvalid,
  isActive,
  isHover,
  attrs
);

/**
 * COMPUTED
 */
// We don't want to pass on parent level classes to the html
// input element. So we need to remove it from the attrs object.
const inputAttrs = computed(() => omit(attrs, 'class'));

/**
 * LIFECYCLE
 */
onMounted(() => {
  if (props.autoFocus) {
    textInput.value?.focus();
  }
});
</script>

<template>
  <div class="custom-percentage-input-container">
    <input
      ref="textInput"
      :type="type"
      :name="name"
      :value="modelValue"
      v-bind="inputAttrs"
      :disabled="disabled"
      :class="['custom-percentage-input text-right text-[16px]']"
      @blur="onBlur"
      @input="onInput"
      @keydown="onKeydown"
      @click="onClick"
      @focus="onFocus"
    />
    <span class="ml-[5px]">%</span>
  </div>
</template>

<style scoped>
.input-container {
  @apply transition-colors;
  background: #212139;
}

.input-group {
  @apply flex;
}

.input {
  @apply grow bg-transparent overflow-hidden w-full;
}

.label {
  @apply text-sm;
}

.error {
  @apply text-xs text-red-500 mt-1 ml-1;
}
.bal-text-input-container {
  box-shadow: 0px 0px 0px 2px #8b8dfc99;
  background: #212139;
}
.custom-text-input {
  font-weight: 600;
  font-size: 36px;
}
.custom-percentage-input {
  background: transparent;
  width: 100%;
  font-size: 18px;
}
.custom-percentage-input::placeholder {
  font-size: 18px;
}
.custom-percentage-input-container {
  border: 1px solid #5d5ea0;
  padding: 11px 16px 11px 16px;
  border-radius: 12px;
  background: #282853;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
</style>
