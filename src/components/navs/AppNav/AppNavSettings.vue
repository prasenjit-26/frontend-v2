<script setup lang="ts">
import AppSlippageForm from '@/components/forms/AppSlippageForm.vue';
import Avatar from '@/components/images/Avatar.vue';
import useEthereumTxType from '@/composables/useEthereumTxType';
import { ethereumTxTypeOptions } from '@/constants/options';
import useWeb3 from '@/services/web3/useWeb3';
import { shorten } from '@/lib/utils';
import useDarkMode from '@/composables/useDarkMode';
import { getConnectorLogo } from '@/services/web3/wallet-logos';
import { getConnectorName } from '@/services/web3/wallet-names';
import { useUserSettings } from '@/providers/user-settings.provider';
import { useTokens } from '@/providers/tokens.provider';
import { isEIP1559SupportedNetwork } from '@/composables/useNetwork';
import { Network } from '@/lib/config';
import Cede from '../../../pages/cede.vue';

// COMPOSABLES
const { darkMode, setDarkMode } = useDarkMode();
const showCedestoreModal = ref(false);
const emit = defineEmits(['close', 'success']);
const {
  balanceFor,
  priceFor,
  nativeAsset,
  wrappedNativeAsset,
  dynamicDataLoading,
} = useTokens();
const {
  account,
  profile,
  disconnectWallet,
  toggleWalletSelectModal,
  connector,
  provider,
  userNetworkConfig,
  isUnsupportedNetwork,
  explorerLinks,
} = useWeb3();
const { ethereumTxType, setEthereumTxType } = useEthereumTxType();
const { supportSignatures, setSupportSignatures } = useUserSettings();

// DATA
const data = reactive({
  copiedAddress: false,
});

// COMPUTED
const avatarUri = computed(() => profile.value?.avatar || undefined);
const tokenBalance = computed(() => balanceFor(nativeAsset.address));
const networkColorClass = computed(() => {
  let color = 'green';

  if (isUnsupportedNetwork.value) {
    color = 'red';
  } else {
    switch (userNetworkConfig.value?.chainId) {
      case Network.GOERLI:
        color = 'blue';
        break;
    }
  }

  return `bg-${color}-500 dark:bg-${color}-400`;
});
const networkName = computed(() => userNetworkConfig.value?.name);
const connectorName = computed(() =>
  getConnectorName(connector.value?.id, provider.value)
);
const connectorLogo = computed(() =>
  getConnectorLogo(connector.value?.id, provider.value)
);
const hideDisconnect = computed(() => connector.value?.id == 'safe');

// METHODS
function copyAddress() {
  navigator.clipboard.writeText(account.value);
  data.copiedAddress = true;

  setTimeout(() => {
    data.copiedAddress = false;
  }, 2 * 1000);
}
function handleClose() {
  showCedestoreModal.value = false;
  emit('close');
}
function showModal() {
  showCedestoreModal.value = true;
}
</script>

<template>
  <BalModal :minWidth="438" :show="showCedestoreModal" @close="handleClose">
    <div>
      <div class="flex justify-between items-center mb-[25px]">
        <p class="title-cede-text">CeDe Store</p>
        <BalBtn class="bal-btn-cede" :onclick="handleClose">Close</BalBtn>
      </div>
      <Cede />
    </div>
  </BalModal>
  <div>
    <div class="p-4">
      <div class="flex justify-between items-center">
        <h5 class="tracking-tight leading-none" v-text="$t('account')" />
        <div class="flex gap-2 items-center">
          <BalBtn color="gray" size="xs" @click="toggleWalletSelectModal">
            {{ $t('change') }}
          </BalBtn>
          <div v-if="!hideDisconnect">
            <BalBtn
              outline
              color="gray"
              size="xs"
              class="capitalize"
              @click="disconnectWallet"
            >
              {{ $t('disconnect') }}
            </BalBtn>
          </div>
        </div>
      </div>
    </div>
    <div class="info-conatainer-modal rounded-[20px] m-[20px]">
      <div class="flex items-center">
        <div class="flex items-center">
          <img :src="connectorLogo" class="w-[50px] h-[50px]" />
          <div class="ml-[10px]">
            <p class="font-[400]">
              {{
                isUnsupportedNetwork ? $t('unsupportedNetwork') : networkName
              }}
            </p>
            <p
              class="font-bold text-black dark:text-white"
              v-text="shorten(account)"
            />
          </div>
          <div class="flex ml-3">
            <BalTooltip width="auto">
              <template #activator>
                <BalBtn class="button-container" @click="copyAddress">
                  <img
                    src="~@/assets/images/copy.svg"
                    alt="twitter"
                    class="w-[30px]"
                  />
                </BalBtn>
              </template>
              <div
                class="text-center"
                v-text="data.copiedAddress ? $t('copied') : $t('copyAddress')"
              />
            </BalTooltip>
            <BalBtn
              class="ml-2 button-container"
              tag="a"
              :href="explorerLinks.addressLink(account)"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="~@/assets/images/logout.svg"
                alt="twitter"
                class="w-[30px]"
              />
            </BalBtn>
          </div>
        </div>
      </div>
      <div class="info-conatainer-modal rounded-[12px] mt-[20px] mb-[20px]">
        <div class="flex">
          <img
            src="~@/assets/images/eth.png"
            alt="LineaEth"
            width="25"
            class="object-contain mr-[10px]"
          />
          {{ parseFloat(tokenBalance.toString()).toFixed(3) }} ETH
        </div>
      </div>
      <div class="flex items-center">
        <BalBtn class="w-full modal-button"> Bridge </BalBtn>
        <BalBtn class="w-full ml-[15px] modal-button" :onclick="showModal">
          Add Funds
        </BalBtn>
      </div>
    </div>
    <div class="hidden px-4 mt-4">
      <span class="mb-2 font-medium" v-text="$t('theme')" />
      <div class="flex mt-1">
        <div
          class="flex justify-center items-center py-1.5 mr-2 w-16 rounded-xl border cursor-pointer option"
          :class="{ active: !darkMode }"
          @click="setDarkMode(false)"
        >
          <BalIcon name="sun" size="sm" />
        </div>
        <div
          class="flex justify-center items-center py-1.5 mr-2 w-16 rounded-xl border cursor-pointer option"
          :class="{ active: darkMode }"
          @click="setDarkMode(true)"
        >
          <BalIcon name="moon" size="sm" />
        </div>
      </div>
    </div>
    <div class="px-4 mt-4">
      <div class="flex items-baseline">
        <span class="mb-2 font-medium" v-text="$t('slippageTolerance')" />
        <BalTooltip>
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px ml-1 text-gray-400" />
          </template>
          <div v-html="$t('marketConditionsWarning')" />
        </BalTooltip>
      </div>
      <AppSlippageForm class="mt-1" />
    </div>
    <div v-if="isEIP1559SupportedNetwork" class="px-4 mt-6">
      <div class="flex items-baseline">
        <span class="mb-2 font-medium" v-text="$t('transactionType')" />
        <BalTooltip>
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px ml-1 text-gray-400" />
          </template>
          <div v-text="$t('ethereumTxTypeTooltip')" />
        </BalTooltip>
      </div>
      <BalBtnGroup
        v-model="ethereumTxType"
        :options="ethereumTxTypeOptions"
        @update:model-value="setEthereumTxType"
      />
    </div>
    <div class="px-4 mt-6">
      <div class="flex items-baseline">
        <span class="mb-2 font-medium" v-text="$t('useSignatures')" />
        <BalTooltip>
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px ml-1 text-gray-400" />
          </template>
          <div v-text="$t('useSignaturesTooltip')" />
        </BalTooltip>
      </div>
      <BalToggle
        v-model="supportSignatures"
        name="supportSignatures"
        @toggle="setSupportSignatures"
      />
    </div>
    <div
      class="p-4 mt-4 text-sm rounded-b-xl border-t dark:border-gray-900 network"
    >
      <div v-text="$t('network')" />
      <div class="flex items-baseline">
        <div :class="['w-2 h-2 mr-1 rounded-full', networkColorClass]" />
        {{ isUnsupportedNetwork ? $t('unsupportedNetwork') : networkName }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.address {
  @apply text-blue-500;

  font-variant-ligatures: no-contextual;
}

.option:hover {
  @apply text-blue-500 border-blue-500;
}

.option.active {
  @apply text-blue-500 border-blue-500;
}

.slippage-input {
  @apply bg-white;
}

.slippage-input.active {
  @apply text-blue-500 border-blue-500 border-2 ring;
}
.info-conatainer-modal {
  border: 1px solid #8b8dfc;
  padding: 20px 15px;
  border: 1px solid #8b8dfc;
  background: rgba(134, 136, 255, 0.39);
  box-shadow: 0px 0px 0px 2px rgba(134, 136, 255, 0.39);
}
.dark .info-conatainer-modal {
  border: 1px solid #8b8dfc;
  background: #141438;
  padding: 20px 15px;
  box-shadow: 0px 0px 0px 2px rgba(134, 136, 255, 0.39);
}
.button-container {
  border-radius: 8px;
  background: #8b8dfc;
  width: 35px;
  height: 35px;
  padding: 10px;
}
.modal-button {
  border-radius: 20px;
  background: #2575fc;
}
</style>
