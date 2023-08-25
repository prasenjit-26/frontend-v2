<script lang="ts" setup>
import { StepState } from '@/types';

type Props = {
  title: string;
  steps: Step[];
};

type Step = {
  tooltip: string;
  state: StepState;
  label?: number;
  isVisible?: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits(['navigate']);

/**
 * COMPUTED
 */
const visibleSteps = computed(() => {
  return props.steps.filter(
    step => step.isVisible === undefined || step.isVisible
  );
});

const stepTextClasses = computed(() => {
  return visibleSteps.value.map(step => {
    return getActiveClassName(step.state, [
      [
        StepState.Active,
        'text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800',
      ],
      [StepState.Todo, 'text-gray-400 font-normal'],
      [StepState.Success, 'text-green-500 font-semibold'],
      [StepState.Warning, 'text-red-500 font-semibold'],
      [StepState.Completed, 'text-gray-700 font-medium'],
    ]);
  });
});

const horizontalRowClasses = computed(() => {
  return visibleSteps.value.map(step => {
    return getActiveClassName(step.state, [
      [StepState.Active, 'horizontal-row-selected'],
      [StepState.Todo, 'horizontal-row'],
      [StepState.Success, 'horizontal-row'],
      [StepState.Warning, 'horizontal-row'],
      [StepState.Completed, 'horizontal-row-selected'],
    ]);
  });
});
const stepCircleClasses = computed(() => {
  return visibleSteps.value.map(step => {
    return getActiveClassName(step.state, [
      [StepState.Active, 'step-circle-active'],
      [
        StepState.Todo,
        'border-2 border-gray-300 dark:border-gray-600 text-secondary step-circle',
      ],
      [
        StepState.Success,
        'border-2 border-none bg-gradient-to-tr from-green-500 to-green-200 text-white',
      ],
      [StepState.Warning, 'border-2 border-none bg-red-500 text-white active'],
      [
        StepState.Completed,
        'border-2 border-gray-600 font-medium step-circle-active',
      ],
    ]);
  });
});

/**
 * METHODS
 */
function handleNavigate(state: StepState, stepIndex: number) {
  if (state === StepState.Todo) return;
  emit('navigate', stepIndex);
}

function getActiveClassName<T>(state: T, classes: [T, string][]) {
  return (classes.find(_class => _class[0] === state) || [])[1] || '';
}
</script>

<template>
  <BalCard noPad shadow="none">
    <div class="p-4 border-b dark:border-gray-600">
      <h6 class="dark:text-gray-300">
        {{ title }}
      </h6>
    </div>
    <BalStack horizontal spacing="base" class="p-4" justify="center">
      <div
        v-for="(step, i) in visibleSteps"
        :key="`vertical-step-${step.tooltip}`"
        class="flex items-center"
      >
        <button
          :class="{ 'cursor-default': step.state === StepState.Todo }"
          @click="handleNavigate(step.state, i)"
        >
          <BalStack vertical align="center" spacing="sm">
            <div
              :class="[
                'rounded-full w-[30px] h-[30px] flex justify-center items-center',
                stepCircleClasses[i],
                { 'circle-line': i !== visibleSteps.length - 1 },
              ]"
            >
              <!-- <span
                v-if="
                  ![StepState.Warning, StepState.Error].includes(step.state)
                "
                >{{ step.label || i + 1 }}</span
              > -->
              <span
                v-if="
                  ![StepState.Warning, StepState.Error].includes(step.state)
                "
                class="text-[12px]"
                >{{ step.label || i + 1 }}</span
              >
              <span v-else class="font-semibold">!</span>
            </div>
            <span class="text-[16px] font-[600] mt-[14px] mb-[14px]">
              {{ step.tooltip }}
            </span>
            <div :class="horizontalRowClasses[i]" />
          </BalStack>
        </button>
      </div>
    </BalStack>
  </BalCard>
</template>

<style scoped>
.step-circle-active {
  border: 1px solid #8b8dfc;
  color: #8b8dfc;
  background: #3f3f75;
}
.step-circle {
  border: 1px solid #818181;
  background: #2a2a4659;
  color: #818181;
}
.horizontal-row-selected {
  background: #8b8dfc;
  border-radius: 28px;
  height: 12px;
  width: 300px;
}
.horizontal-row {
  background: #505074;
  border-radius: 28px;
  height: 12px;
  width: 300px;
}
</style>
