<script lang="ts" setup>
import { isAddress } from '@ethersproject/address';

import usePoolCreation from '@/composables/pools/usePoolCreation';
import useNumbers from '@/composables/useNumbers';
import { isRequired, isValidAddress } from '@/lib/utils/validations';
import useWeb3 from '@/services/web3/useWeb3';
import { shorten } from '@/lib/utils';
import useNetwork from '@/composables/useNetwork';

const emit = defineEmits(['update:height']);

/**
 * STATIC
 */
const FIXED_FEE_OPTIONS = ['0.001', '0.003', '0.01'];

/**
 * STATE
 */
const isCustomFee = ref(false);
const checkboxState = ref(true);
const isInvalidFee = ref(false);
const cardWrapper = ref<HTMLElement>();

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const {
  initialFee,
  feeController,
  feeManagementType,
  feeType,
  setFeeManagement,
  setFeeType,
  setFeeController,
  setTrpController,
  thirdPartyFeeController,
  fee,
  proceed,
  goBack,
  isLoadingSimilarPools,
} = usePoolCreation();
const { account } = useWeb3();
const { networkConfig } = useNetwork();

/**
 * COMPUTED
 */
const customInputClasses = computed(() => ({
  'border border-blue-500 text-blue-600 dark:text-blue-400': isCustomFee.value,
  'border dark:border-gray-900': !isCustomFee.value,
}));

const isProceedDisabled = computed(() => {
  if (
    feeController.value === 'other' &&
    !isAddress(thirdPartyFeeController.value)
  ) {
    return true;
  }

  if (isInvalidFee.value) return true;

  return false;
});

// this does not need to be computed as it relies on a static
const feeOptions = FIXED_FEE_OPTIONS.map(option => {
  return {
    label: fNum(option, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      fixedFormat: true,
    }),
    value: option,
  };
});

/**
 * FUNCTIONS
 */
function onFixedInput(val: string): void {
  fee.value = '';
  initialFee.value = val;
  isCustomFee.value = false;
}

function onCustomInput(val: string): void {
  if (val === '') return;

  initialFee.value = (Number(val) / 100).toString();
  isCustomFee.value = true;

  if (Number(val) < 0.0001 || Number(val) > 10) {
    isInvalidFee.value = true;
  } else {
    isInvalidFee.value = false;
  }
}

async function onChangeFeeManagementType(val: boolean) {
  if (!val) {
    setFeeManagement('self');
  } else {
    setFeeManagement('governance');
    setFeeType('fixed');
    setFeeController('self');
    setTrpController('');
  }
  await nextTick();
  emit('update:height', {
    height: cardWrapper.value?.offsetHeight || 0,
  });
}

async function onChangeFeeType(val: string) {
  if (val === 'fixed') {
    setFeeController('self');
    setTrpController('');
  }
  await nextTick();
  emit('update:height', {
    height: cardWrapper.value?.offsetHeight || 0,
  });
}

async function onChangeFeeController(val: string) {
  if (val === 'self') {
    setTrpController('');
  }
  await nextTick();
  emit('update:height', {
    height: cardWrapper.value?.offsetHeight || 0,
  });
}

watch(fee, onCustomInput, { immediate: true });
</script>

<template>
  <div ref="cardWrapper">
    <BalCard shadow="xl" noBorder class="center-col-container">
      <BalStack vertical>
        <BalStack vertical spacing="xs">
          <span class="text-xs text-secondary">{{ networkConfig?.name }}</span>
          <BalStack horizontal align="center" spacing="xs">
            <h5
              class="font-semibold dark:text-gray-300 text-[24px] mt-[10px] mb-[30px]"
            >
              {{ $t('createAPool.setPoolFees') }}
            </h5>
          </BalStack>
        </BalStack>
        <BalStack vertical spacing="sm">
          <div>
            <p class="mb-[20px] text-[20px] font-[500]">Initial swap fee</p>
            <p class="text-black dark:text-gray-400 text-[16px] mb-[20px]">
              {{ $t('createAPool.bestFeeOption') }}
            </p>
          </div>
          <div class="divider" />
          <BalStack spacing="xs" horizontal>
            <BalBtnGroup
              v-model="initialFee"
              :options="feeOptions"
              @update:model-value="onFixedInput"
            />
            <div>
              <div :class="['custom-input', customInputClasses]">
                <input
                  v-model="fee"
                  class="w-12 h-full text-right bg-transparent p-[11px]"
                  placeholder="0.1"
                  type="number"
                  step="any"
                />
                <div class="px-1 text-white">%</div>
              </div>
            </div>
          </BalStack>
          <BalAlert
            v-if="isInvalidFee"
            class="w-full"
            :title="$t('invalidFee')"
            type="error"
          >
            {{ $t('invalidFeeExplain') }}
          </BalAlert>
        </BalStack>
        <BalStack horizontal spacing="none" align="center">
          <BalCheckbox
            v-model="checkboxState"
            name="areFeesGovernanceManaged"
            size="sm"
            :label="$t('createAPool.governanceFees')"
            noMargin
            @update:model-value="onChangeFeeManagementType"
          />
          <BalTooltip
            :text="$t('createAPool.governanceFeesTooltip')"
            iconSize="sm"
            class="mt-1 ml-2"
          />
        </BalStack>
        <BalStack v-if="feeManagementType === 'self'" vertical spacing="sm">
          <h6 class="mb-1">
            {{ $t('createAPool.alternativeFeeManagement') }}
          </h6>
          <BalRadio
            v-model="feeType"
            value="fixed"
            name="feeManagementOptions"
            @update:model-value="onChangeFeeType"
          >
            <template #label>
              <span>
                {{ $t('createAPool.fixedFeeRadioLabel') }}
              </span>
            </template>
          </BalRadio>
          <BalRadio
            v-model="feeType"
            value="dynamic"
            name="feeManagementOptions"
            @update:model-value="onChangeFeeType"
          >
            <template #label>
              <span>
                {{ $t('createAPool.dynamicFeeRadioLabel') }}
              </span>
            </template>
          </BalRadio>
        </BalStack>
        <BalStack v-if="feeType === 'dynamic'" vertical spacing="sm">
          <h6 class="mb-1">
            {{ $t('createAPool.setAnAddress') }}
          </h6>
          <BalRadio
            v-model="feeController"
            value="self"
            name="addressOption"
            @update:model-value="onChangeFeeController"
          >
            <template #label>
              <span>
                {{ $t('createAPool.myAddressOption', [shorten(account)]) }}
              </span>
            </template>
          </BalRadio>
          <BalRadio
            v-model="feeController"
            value="other"
            name="addressOption"
            @update:model-value="onChangeFeeController"
          >
            <template #label>
              <span>
                {{ $t('createAPool.customAddressOption') }}
              </span>
            </template>
          </BalRadio>
        </BalStack>
        <BalStack
          v-if="feeController === 'other' && feeType === 'dynamic'"
          vertical
          spacing="xs"
        >
          <h6>{{ $t('createAPool.customAddressTitle') }}</h6>
          <p class="mb-1 text-gray-600">
            {{ $t('createAPool.customAddressInfo') }}
          </p>
          <BalStack vertical spacing="xs">
            <BalTextInput
              v-model="thirdPartyFeeController"
              placeholder="0xBA4...2069"
              type="text"
              size="sm"
              validateOn="blur"
              :rules="[
                isRequired($t('A controller address')),
                isValidAddress(),
              ]"
              name="customAddress"
            />
          </BalStack>
        </BalStack>
        <BalBtn
          :disabled="isProceedDisabled || isLoadingSimilarPools"
          type="submit"
          block
          color="gradient"
          class="rounded-[12px] text-[20px]"
          :loading="isLoadingSimilarPools"
          @click="proceed"
        >
          {{ $t('next') }}
        </BalBtn>
      </BalStack>
    </BalCard>
  </div>
</template>

<style scoped>
.custom-input {
  @apply flex items-center px-1 h-full;
  border: 1px solid #5f5f5f;
  color: #5f5f5f;
  border-radius: 12px;
}
.center-col-container {
  box-shadow: 0px 0px 0px 5px #8b8dfc99, 0px 0px 0px 10px #8b8dfc40,
    0px 0px 149px -46px #8b8dfccc;
  border-radius: 12px;
  padding: 16px;
}
.dark .warning-class {
  margin-top: 32px;
  box-shadow: 0px 0px 0px 4px #ffd04d, 0px 0px 0px 8px #ffd04d40;
  background: #3a3333;
  border-radius: 12px;
  padding: 20px;
}
.warning-class {
  margin-top: 32px;
  background: rgba(255, 208, 77, 0.4);
  box-shadow: 0px 0px 0px 4px #ffd04d, 0px 0px 0px 8px rgba(255, 208, 77, 0.25);
  border-radius: 12px;
  padding: 20px;
}
.warning-class > #animateContainer > .bal-alert {
  background: transparent;
  border: none;
}
.dark .divider {
  border: 1px solid #454680;
  width: 100%;
  margin-bottom: 20px;
}
.divider {
  border: 1px solid rgba(139, 141, 252, 0.4);
  width: 100%;
  margin-bottom: 20px;
}
</style>
