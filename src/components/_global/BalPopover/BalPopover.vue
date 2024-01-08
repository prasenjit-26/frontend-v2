<script setup lang="ts">
type PopoverTrigger = 'click' | 'hover';

type Props = {
  trigger?: PopoverTrigger;
  align?: string;
  detached?: boolean;
  overrideClasses?: string;
};

const props = withDefaults(defineProps<Props>(), {
  trigger: 'click',
  align: 'right',
  detached: false,
});

const emit = defineEmits<{
  (e: 'show'): void;
  (e: 'hide'): void;
}>();

/**
 * STATE
 */
const popoverOpened = ref(false);
const activatorWrapper = ref<HTMLDivElement>();

/**
 * COMPUTED
 */
const popoverWrapperClasses = computed(() => ({
  'bal-popover-wrapper-visible': popoverOpened.value,
  [`${props.align}-0`]: !props.detached,
  'align-center-transform': props.detached && props.align === 'center',
  'align-right-transform': props.detached && props.align === 'right',
}));

const popoverActivatorWrapperClasses = computed(() => ({
  relative: !props.detached,
}));

const activatorWidth = computed(() => activatorWrapper.value?.clientWidth || 0);

const activatorWidthPx = computed(() => `${activatorWidth.value}px`);

const activatorHalfWidthPx = computed(() => `${activatorWidth.value / 2}px`);

/**
 * METHODS
 */
function togglePopover() {
  popoverOpened.value = !popoverOpened.value;
}

function showPopover() {
  popoverOpened.value = true;
}

function hidePopover() {
  popoverOpened.value = false;
}

function handleClickOutside() {
  if (props.trigger === 'click') {
    hidePopover();
  }
}

/**
 * WATCHERS
 */
watch(popoverOpened, () => {
  if (popoverOpened.value) {
    emit('show');
  } else {
    emit('hide');
  }
});
</script>

<template>
  <div
    v-click-outside="handleClickOutside"
    :class="[popoverActivatorWrapperClasses]"
  >
    <div
      ref="activatorWrapper"
      class="group flex flex-col h-full bal-popover-activator"
      @click="trigger === 'click' && togglePopover()"
      @mouseenter="trigger === 'hover' && showPopover()"
      @mouseleave="trigger === 'hover' && hidePopover()"
    >
      <slot name="activator" />
    </div>
    <div :class="['bal-popover-wrapper', popoverWrapperClasses]">
      <BalCard
        shadow="lg"
        v-bind="$attrs"
        darkBgColor="800"
        exposeOverflow
        :class="['popover-card', overrideClasses]"
      >
        <slot :close="hidePopover" />
      </BalCard>
    </div>
  </div>
</template>

<style scoped>
.bal-popover-wrapper {
  @apply invisible opacity-0 absolute z-30 pt-3;

  transition: all 0.2s ease-in-out;
}
.popover-card {
  border-radius: 17px;
  border: 1px solid #5455a4;
  background: #d5d6ff;
  box-shadow: 0px 0px 16px 0px rgba(139, 141, 252, 0.46);
}
.dark .popover-card {
  border-radius: 17px;
  border: 1px solid #5455a4;
  background: #262850;
  box-shadow: 0px 0px 16px 0px rgba(139, 141, 252, 0.46);
}
.bal-popover-wrapper-visible {
  @apply visible opacity-100;
}

.bal-popover-wrapper:hover {
  @apply visible opacity-100;
}

.align-center-transform {
  transform: translateX(-webkit-calc(-50% + v-bind(activatorHalfWidthPx)));
  transform: translateX(calc(-50% + v-bind(activatorHalfWidthPx)));
}

.align-right-transform {
  transform: translateX(-webkit-calc(-100% + v-bind(activatorWidthPx)));
  transform: translateX(calc(-100% + v-bind(activatorWidthPx)));
}
@media (max-width: 768px) {
  .align-center-transform {
    transform: translateX(-webkit-calc(-100% + v-bind(activatorHalfWidthPx)));
    transform: translateX(calc(-100% + v-bind(activatorHalfWidthPx)));
  }
}
@media (max-width: 400px) {
  .align-center-transform {
    transform: translateX(-webkit-calc(-75% + v-bind(activatorHalfWidthPx)));
    transform: translateX(calc(-75% + v-bind(activatorHalfWidthPx)));
  }
}
</style>
