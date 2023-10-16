
import { log } from 'console';

import { title } from 'process';

<script lang="ts" setup>
import { ref } from 'vue';
import { StepState } from '@/types';

const emit = defineEmits(['navigate']);
type Props = {
  steps: Step[];
};
type Step = {
  tooltip: string;
  state: StepState;
  label?: number;
  isVisible?: boolean;
};
const props = defineProps<Props>();

const activeIndex = ref(0);
const activeStep = ref(props.steps[activeIndex.value]);
function handleNavigate(state: StepState, stepIndex: number) {
  activeIndex.value = stepIndex;
  activeStep.value = props.steps[stepIndex];
  if (state === StepState.Todo) return;
  emit('navigate', stepIndex);
}
console.log(activeStep.value.tooltip);
</script>
<template>
  <div class="flex justify-between items-center w-full mb-[40px]">
    <div
      class="icon-conatainer"
      @click="handleNavigate(activeStep.state, activeIndex - 1)"
    >
      <BalIcon name="chevron-left" />
    </div>
    <div class="flex flex-col justify-center items-center">
      <div class="index-conatiner mb-[10px]">
        {{ activeIndex }}
      </div>
      <div>
        <span class="text-[14px] font-[600] mt-[14px] mb-[14px]">
          {{ activeStep.tooltip }}
        </span>
      </div>
    </div>
    <div
      class="icon-conatainer"
      @click="handleNavigate(activeStep.state, activeIndex + 1)"
    >
      <BalIcon name="chevron-right" />
    </div>
  </div>
</template>
<style>
.icon-conatainer {
  border-radius: 6px;
  padding: 5px;
  background: #14132c;
  box-shadow: 0px 2px 9px 4px rgba(6, 6, 6, 0.15) inset,
    0px 0px 0px 2px rgba(139, 141, 252, 0.6),
    0px 0px 0px 4px rgba(139, 141, 252, 0.25);
}
.index-conatiner {
  border-radius: 20.16px;
  border: 0.72px solid #8b8dfc;
  background: #3f3f75;
  display: flex;
  width: 40px;
  height: 40px;
  padding: 2.88px;
  justify-content: center;
  align-items: center;
}
</style>