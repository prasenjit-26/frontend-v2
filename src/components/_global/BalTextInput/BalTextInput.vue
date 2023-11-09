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
  fontSize?: number;
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
  fontSize: 36,
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
const { errors, isInvalid, validate } = useInputValidation(props, emit);
const {
  isActive,
  isHover,
  onInput,
  onKeydown,
  onBlur,
  onClick,
  onFocus,
  onMouseOver,
  onMouseLeave,
} = useInputEvents(props, emit, validate);
const {
  parentClasses,
  inputContainerClasses,
  inputGroupClasses,
  headerClasses,
  footerClasses,
  inputClasses,
  prependClasses,
  appendClasses,
  borderRadiusClasses,
} = useInputStyles(props, isInvalid, isActive, isHover, attrs);

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
  <div
    :class="[
      'bal-text-input bal-text-input-container',
      parentClasses,
      borderRadiusClasses,
    ]"
  >
    <div
      :class="['input-container', inputContainerClasses, borderRadiusClasses]"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
    >
      <div v-if="$slots.header || label" :class="['header', headerClasses]">
        <slot name="header">
          <span class="label text-secondary">
            {{ label }}
          </span>
        </slot>
      </div>
      <div :class="['input-group', inputGroupClasses]">
        <div v-if="$slots.before" :class="['before', prependClasses]">
          <slot name="before" />
        </div>
        <input
          ref="textInput"
          :type="type"
          :name="name"
          :value="modelValue"
          v-bind="inputAttrs"
          :disabled="disabled"
          :class="[
            'text-input-placeholder-calass input  font-[600]  text-white',
            inputClasses,
          ]"
          :style="{
            fontSize: props.fontSize ? `${props.fontSize}px` : '36px',
          }"
          @blur="onBlur"
          @input="onInput"
          @keydown="onKeydown"
          @click="onClick"
          @focus="onFocus"
        />
        <div v-if="$slots.prepend" :class="['prepend', prependClasses]">
          <slot name="prepend" />
        </div>
        <div v-if="$slots.append" :class="['append', appendClasses]">
          <slot name="append" />
        </div>
      </div>
      <div v-if="$slots.footer" :class="['footer', footerClasses]">
        <slot name="footer" />
      </div>
      <div v-if="isInvalid && !!errors[0]" :class="['error']">
        {{ errors[0] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dark .input-container {
  @apply transition-colors;
  background: #212139;
}
.input-container {
  @apply transition-colors;
  border-radius: 12px;
  background: linear-gradient(
      0deg,
      rgba(139, 141, 252, 0.15) 0%,
      rgba(139, 141, 252, 0.15) 100%
    ),
    #8b8dfc;
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
.dark .bal-text-input-container {
  box-shadow: 0px 0px 0px 2px #8b8dfc99;
  background: #212139;
}
.bal-text-input-container {
  background: rgba(139, 141, 252, 0.15);
  box-shadow: 0px 2px 9px 4px rgba(6, 6, 6, 0.15) inset,
    0px 0px 0px 3px rgba(139, 141, 252, 0.6),
    0px 0px 0px 6px rgba(139, 141, 252, 0.25);
}
.custom-text-input {
  font-weight: 600;
  font-size: 36px;
}
.text-input-placeholder-calass::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #fff;
}
.text-input-placeholder-calass:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #fff;
  opacity: 1;
}
.text-input-placeholder-calass::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #fff;
  opacity: 1;
}
.text-input-placeholder-calass:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #fff;
}
</style>
