<script setup lang="ts">
import { watch } from 'vue';
import useNumbers from '@/composables/useNumbers';
import BigNumber from 'bignumber.js';
import { Contract, ethers } from 'ethers';
import useWeb3 from '@/services/web3/useWeb3';
import useNetwork from '@/composables/useNetwork';
import { getConnectorLogo } from '@/services/web3/wallet-logos';
import { useTokens } from '@/providers/tokens.provider';
import CedeWidget from '../../../pages/cedeWidget.vue';
import { Children } from 'react';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export interface NetworkOption {
  id: string;
  name: string;
  networkSlug?: string;
  key?: string;
}
const chainIdRpcMapping = {
  '420': 'https://rpc.goerli.optimism.gateway.fm',
  '421613': 'https://rpc.goerli.arbitrum.gateway.fm',
  '97': 'https://bsc-testnet.publicnode.com',
  '84531': 'https://goerli.base.org',
  '59140': 'https://rpc.goerli.linea.build',
  '5001': 'https://rpc.testnet.mantle.xyz',
  '11155111': 'https://rpc2.sepolia.org',
  '1': 'https://rpc.ankr.com/eth',
  '42161': 'https://arb1.arbitrum.io/rpc',
  zksync: 'https://mainnet.era.zksync.io',
  '137': 'https://polygon-rpc.com',
  '10': 'https://rpc.ankr.com/optimism',
  '1088': 'https://metis-mainnet.public.blastapi.io',
  '56': 'https://bsc-dataseed1.defibit.io',
  '42170': 'https://arbitrum-nova.publicnode.com',
  '1101': 'https://zkevm-rpc.com',
  '59144': 'https://rpc.linea.build',
  '5000': 'https://rpc.mantle.xyz',
  '8453': 'https://mainnet.base.org',
};
const emit = defineEmits(['close', 'success']);
const { balances, nativeAsset, wrappedNativeAsset } = useTokens();
const { toFiat } = useNumbers();
const otherNetworkBalance = ref('0.000 ETH');
const showCedestoreModal = ref(false);
const { account, chainId, isMismatchedNetwork, isUnsupportedNetwork } =
  useWeb3();
const { networkSlug } = useNetwork();

function handleClose() {
  showCedestoreModal.value = false;
  emit('close');
}
function showModal() {
  showCedestoreModal.value = true;
}
const fiatLabel = computed(() => {
  let usdBalance = 0;
  for (let address in balances.value) {
    const fiatValueForToken = toFiat(
      balances.value[address],
      nativeAsset.address.toLowerCase() === address.toLowerCase()
        ? wrappedNativeAsset.value.address
        : address
    );
    usdBalance = usdBalance + parseFloat(fiatValueForToken);
  }

  return usdBalance;
});
const checkOtherNetworkBalance = async () => {
  let usdBalance = '0';
  if (isMismatchedNetwork.value || isUnsupportedNetwork.value) {
    const rpcUrl = chainIdRpcMapping[chainId.value];
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const ethBalance = await provider.getBalance(account.value);
    usdBalance = new BigNumber(ethBalance.toString())
      .dividedBy(10 ** 18)
      .toFixed(3);
  }
  const getChains = await fetch('https://chainid.network/chains.json');
  const chains = await getChains.json();
  const chainDetails = chains.find(
    chain => chain.chainId.toString() === chainId.value.toString()
  );
  otherNetworkBalance.value = `${usdBalance} ${
    chainDetails ? chainDetails.nativeCurrency.symbol : ''
  }`;
};
onMounted(async () => {
  checkOtherNetworkBalance();
});
watch(chainId, () => {
  checkOtherNetworkBalance();
});
</script>
<template>
  <BalModal :minWidth="438" :show="showCedestoreModal" @close="handleClose">
    <div>
      <div class="flex justify-between items-center mb-[25px]">
        <p class="title-cede-text">Cede.store</p>
        <BalBtn class="bal-btn-cede" :onclick="handleClose" :rounded="true">
          <BalCloseIcon class="text-black dark:text-white cursor-pointer" />
        </BalBtn>
      </div>
      <!-- <Cede /> -->
      <CedeWidget />
    </div>
  </BalModal>
  <BalPopover noPad topValue="60">
    <template #activator>
      <div class="funds-button universal-border">
        <img src="~@/assets/images/wallet.svg" alt="wallet" width="20" />
        <p class="funds-text ml-[15px] mr-[15px]">
          {{
            account
              ? isMismatchedNetwork || isUnsupportedNetwork
                ? otherNetworkBalance
                : `${fiatLabel.toFixed(3)} USD`
              : '0.000 USD'
          }}
        </p>
        <img src="~@/assets/images/plus.svg" alt="wallet" width="20" />
      </div>
    </template>
    <div class="funds-menu">
      <!-- <div class="account-menu">
        <div class="flex items-center">
          <img :src="connectorLogo" class="w-[40px] h-[40px]" />
          <div class="ml-[10px]">
            <p class="text-black dark:text-white font-[400] text-[16px]">
              {{
                isUnsupportedNetwork ? $t('unsupportedNetwork') : networkName
              }}
            </p>
            <p
              class="text-black dark:text-white font-[500] text-[18px]"
              v-text="shorten(account)"
            />
          </div>
        </div>
      </div> -->
      <div class="mt-[24px]">
        <div class="flex justify-between items-center mb-[20px]">
          <p class="funds-info-text">Bridge funds from other networks</p>
          <BalBtn class="w-[30%] assets-button">
            <router-link :to="{ name: 'bridge' }"> Bridge </router-link>
          </BalBtn>
        </div>
        <!-- <div class="flex justify-between items-center mb-[20px]">
          <p class="funds-info-text">Add funds using Credit cards</p>
          <BalBtn class="w-[30%] assets-button"> Add Funds </BalBtn>
        </div> -->
        <div class="flex justify-between items-center mb-[20px]">
          <p class="funds-info-text">
            Transfer assets from CEX Using cede.store
          </p>
          <BalBtn
            class="lg:whitespace-nowrap lg:w-[30%] assets-button sm:w-fit md:w-fit"
            :onclick="showModal"
          >
            cede.store
          </BalBtn>
        </div>
      </div>
    </div>
  </BalPopover>
</template>
<style>
.funds-button {
  cursor: pointer;
  border-radius: 60px;
  background: rgba(139, 141, 252, 0.51);
  backdrop-filter: blur(20px);
  display: flex;
  padding: 15px 22px;
  justify-content: center;
  align-items: center;
  max-height: 40px;
}
.funds-text {
  color: #fff;
  text-align: center;
  font-family: Plus Jakarta Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
@media (max-width: 768px) {
  .funds-menu {
    width: auto !important;
  }
}
.dark .funds-menu {
  width: 360px;
  border-radius: 18px;
  background: var(--Grapgh---Background, #151526);
  box-shadow: 0px 0px 0px 3.6px rgba(139, 141, 252, 0.6),
    0px 0px 0px 7.2px rgba(139, 141, 252, 0.25),
    0px 0px 134.1px -41.4px rgba(139, 141, 252, 0.8);
  padding: 25px;
}
.funds-menu {
  width: 360px;
  border-radius: 18px;
  background: var(--Grapgh---Background, #d5d6ff);
  box-shadow: 0px 0px 0px 3.6px rgba(139, 141, 252, 0.6),
    0px 0px 0px 7.2px rgba(139, 141, 252, 0.25),
    0px 0px 134.1px -41.4px rgba(139, 141, 252, 0.8);

  padding: 25px;
}
.dark .account-menu {
  border-radius: 57.173px;
  background: #474881;
  padding: 9px 18px;
  border: 1px solid #6a6bc5;
  width: fit-content;
}
.account-menu {
  border-radius: 57.173px;
  background: #bbbcfd;
  border: 1px solid #6a6bc5;
  padding: 9px 18px;
  width: fit-content;
}
.dark .funds-info-text {
  color: #fff;
  font-family: Plus Jakarta Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-right: 20px;
  width: 70%;
  line-height: 20px;
}
.funds-info-text {
  color: #000;
  font-family: Plus Jakarta Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-right: 20px;
  width: 70%;
  line-height: 20px;
}
.assets-button {
  border-radius: 20px;
  background: #7e75ff;
}
.bal-btn-cede {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 5px;
}
.title-cede-text {
  color: #000;
  font-family: Plus Jakarta Sans;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
}
.dark .title-cede-text {
  color: #fff;
  font-family: Plus Jakarta Sans;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
}
</style>