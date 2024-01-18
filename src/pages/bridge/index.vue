<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue';
import { Contract, ethers } from 'ethers';
import useBreakpoints from '@/composables/useBreakpoints';
import BigNumber from 'bignumber.js';
import ERC20_ABI from '@/lib/abi/ERC20.json';
import useWeb3 from '@/services/web3/useWeb3';
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const chainIdRpcMapping = {
  '420': 'https://rpc.goerli.optimism.gateway.fm',
  '421613': 'https://rpc.goerli.arbitrum.gateway.fm',
  '97': 'https://bsc-testnet.publicnode.com',
  '84531': 'https://goerli.base.org',
  '59140': 'https://rpc.goerli.linea.build',
  '5001': 'https://rpc.testnet.mantle.xyz',
  '11155111': 'https://rpc2.sepolia.org',
  '1': 'https://mainnet.infura.io/v3/',
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
interface TokenRef {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
}
interface NetworkRef {
  networkId: string;
  name: string;
  internalId: string;
  chainId: string;
  nativeCurrency: TokenRef;
  tokens: TokenRef[];
}
interface ReceiverRouter {
  compRatio: string;
  endpoint: string;
  endpointContract: string;
  line: string;
  maxAmt: string;
  minAmt: string;
  spentTime: string;
  srcChain: string;
  srcToken: string;
  state: string;
  tgtChain: string;
  tgtToken: string;
  tradeFee: string;
  vc: string;
  withholdingFee: string;
}
const activeNetwork = ref({} as NetworkRef);
const activeNetworkDestination = ref({} as NetworkRef);
const sourceToken = ref({} as TokenRef);
const destinationToken = ref({} as TokenRef);
const receiveAmountInEth = ref('0');
const sourceTokenBalance = ref('0');
const destinationTokenBalance = ref('0');
const { upToLargeBreakpoint } = useBreakpoints();
const state = reactive<{
  supportedChain: NetworkRef[];
  sourceTokens: TokenRef[];
  destinamtionTokens: TokenRef[];
  crossChainRouters: ReceiverRouter[];
  selectedCrosschainLink: ReceiverRouter | null;
}>({
  supportedChain: [],
  sourceTokens: [],
  destinamtionTokens: [],
  crossChainRouters: [],
  selectedCrosschainLink: null,
});
const amount = reactive<{
  sourceAmount: string;
  receiveAmount: string;
  receiveDataRouter: ReceiverRouter | null;
}>({
  sourceAmount: '0',
  receiveAmount: '0',
  receiveDataRouter: null,
});
const { account, getSigner, chainId } = useWeb3();
const API_LINK = 'https://api.orbiter.finance/sdk';
const onPageLoad = async () => {
  // Example: Fetch data from an API and update reactive state
  const getSupportedNetworks = await fetch(`${API_LINK}/chains`);
  const resp = await getSupportedNetworks.json();
  if (resp && resp.status === 'success') {
    const filteredChains = resp.result.filter(
      chain => chainIdRpcMapping[chain.chainId]
    );
    state.supportedChain = filteredChains;
    activeNetwork.value = filteredChains[0];
    state.sourceTokens = filteredChains[0].tokens;
    const destinationNetwork = filteredChains.find(networkData =>
      networkData.name.includes('Linea')
    );
    if (destinationNetwork) {
      activeNetworkDestination.value = destinationNetwork;
      state.destinamtionTokens = destinationNetwork.tokens;
    }
  }
  const getCrossChainRouters = await fetch(`${API_LINK}/routers/cross-chain`);
  const respRouters = await getCrossChainRouters.json();
  console.log('respRouters', respRouters);
  if (respRouters && respRouters.status === 'success') {
    state.crossChainRouters = respRouters.result;
  }
  // You can also directly modify other properties in the reactive state here
  // state.someOtherProperty = 'new value';
};
const getCrosschainLink = () => {
  try {
    if (
      activeNetwork &&
      activeNetwork.value &&
      activeNetworkDestination.value &&
      sourceToken.value &&
      destinationToken.value
    ) {
      const crossChainLink = state.crossChainRouters.find(
        (eachLink: {
          srcChain: string;
          tgtChain: string;
          srcToken: string;
          tgtToken: string;
        }) =>
          eachLink &&
          eachLink.srcChain === activeNetwork.value.chainId &&
          eachLink.tgtChain === activeNetworkDestination.value.chainId &&
          eachLink.srcToken.toLowerCase() ===
            sourceToken.value.address.toLowerCase() &&
          eachLink.tgtToken.toLowerCase() ===
            destinationToken.value.address.toLowerCase()
      );
      state.selectedCrosschainLink = crossChainLink || null;
      getReceiveAmount();
      console.log('crossChainLink', crossChainLink);
    }
  } catch (error) {
    console.log('error', error);
  }
  console.log('coming here');
};
const handleSourceNetwork = network => {
  activeNetwork.value = network;
  state.sourceTokens = network.tokens;
  getCrosschainLink();
  emit('close');
};
const handleSourceTokne = async token => {
  sourceToken.value = token;
  getCrosschainLink();
  if (account.value) {
    const provider = new ethers.providers.JsonRpcProvider(
      chainIdRpcMapping[activeNetwork.value.chainId]
    );
    if (token.address === '0x0000000000000000000000000000000000000000') {
      const ethBalance = await provider.getBalance(account.value);
      sourceTokenBalance.value = new BigNumber(ethBalance.toString())
        .dividedBy(10 ** 18)
        .toString();
    } else {
      const tokenContract = new Contract(token.address, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(account.value);
      sourceTokenBalance.value = new BigNumber(balance.toString())
        .dividedBy(10 ** parseFloat(token.decimals))
        .toString();
    }
  }
};
const handleDestinationNetwork = network => {
  activeNetworkDestination.value = network;
  state.destinamtionTokens = network.tokens;
  getCrosschainLink();
};
const handleDestinationToken = async token => {
  destinationToken.value = token;
  getCrosschainLink();
  if (account.value) {
    const provider = new ethers.providers.JsonRpcProvider(
      chainIdRpcMapping[activeNetworkDestination.value.chainId]
    );
    if (token.address === '0x0000000000000000000000000000000000000000') {
      const ethBalance = await provider.getBalance(account.value);
      destinationTokenBalance.value = new BigNumber(ethBalance.toString())
        .dividedBy(10 ** 18)
        .toString();
    } else {
      const tokenContract = new Contract(token.address, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(account.value);
      destinationTokenBalance.value = new BigNumber(balance.toString())
        .dividedBy(10 ** parseFloat(token.decimals))
        .toString();
    }
  }
};
const getReceiveAmount = async () => {
  try {
    if (
      activeNetwork.value &&
      activeNetworkDestination.value &&
      sourceToken.value &&
      destinationToken.value &&
      amount.sourceAmount &&
      parseFloat(amount.sourceAmount) > 0 &&
      state.selectedCrosschainLink
    ) {
      console.log('selectedCrosschainLink', state.selectedCrosschainLink);
      const valueInWei = new BigNumber(amount.sourceAmount)
        .multipliedBy(10 ** parseFloat(sourceToken.value.decimals.toString()))
        .toString();
      console.log('valueInWei', valueInWei, amount.sourceAmount);
      const checkReceiveAmount = await fetch(
        `${API_LINK}/routers/simulation/receiveAmount?line=${state.selectedCrosschainLink.line}&value=${valueInWei}${state.selectedCrosschainLink.vc}`
      );
      const amountResp = await checkReceiveAmount.json();
      if (amountResp.status === 'success') {
        const receiveAmountFormatted = amountResp.result.receiveAmount.replace(
          'NaN',
          ''
        );
        amount.receiveAmount = receiveAmountFormatted;
        const receiveValue = new BigNumber(receiveAmountFormatted)
          .dividedBy(
            10 ** parseFloat(destinationToken.value.decimals.toString())
          )
          .toString();
        receiveAmountInEth.value = receiveValue;
        amount.receiveDataRouter = amountResp.result.router;
      }
      console.log('checkReceiveAmount', amountResp);
    }
  } catch (error) {
    console.log('error', error);
  }
};
const bridgeTranscation = async () => {
  const signer = getSigner();
  console.log('signer', signer);
  if (amount && amount.receiveDataRouter) {
    const sourceAmountResp = new BigNumber(amount.sourceAmount)
      .multipliedBy(10 ** parseFloat(sourceToken.value.decimals.toString()))
      .toString();
    const txData = {
      value:
        sourceAmountResp.substring(0, sourceAmountResp.length - 4) +
        amount.receiveDataRouter.vc,
      to: amount.receiveDataRouter.endpoint,
    };
    console.log('txData', txData);
    const tx = await signer.sendTransaction(txData);
    console.log('before', tx);
    await tx.wait();
    console.log('after', tx);
    console.log(tx);
  }
};
const getFee = () => {
  let fess = '0';
  if (
    state.selectedCrosschainLink &&
    state.selectedCrosschainLink.withholdingFee
  ) {
    fess = state.selectedCrosschainLink.withholdingFee;
  }
  return fess;
};
const handleSouceAmount = event => {
  amount.sourceAmount = event.target.value;
  getReceiveAmount();
};
onBeforeMount(() => {
  onPageLoad();
});
console.log('amount', amount);
</script>
<template>
  <div
    class="container mx-auto max-w-[1300px] pl-[24px] pr-[24px] mt-[40px] h-[100vh]"
  >
    <BalCard
      class="flex relative items-center h-full card-container"
      shadow="none"
      noBorder
    >
      <div class="swap-container">
        <p class="swap-title mb-[20px]">Bridge</p>
        <div class="relative p-5 bal-text-input-container">
          <div class="flex justify-between">
            <BalPopover noPad overrideClasses="popuover-override">
              <template #activator>
                <BalBtn
                  class="ml-4 network-button-bride"
                  color="white"
                  :size="upToLargeBreakpoint ? 'md' : 'sm'"
                >
                  <template v-if="activeNetwork">
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                    >
                      {{ activeNetwork.name }}
                    </span>
                    <BalIcon name="chevron-down" size="sm" class="ml-2" />
                  </template>
                </BalBtn>
              </template>
              <div
                role="menu"
                class="flex flex-col w-52 rounded-lg max-h-[300px] overflow-scrolll wallet-menu wallet-menu-scroll"
              >
                <div
                  class="py-2 px-3 text-sm font-medium text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
                >
                  Select Network
                </div>
                <div
                  v-for="network in state.supportedChain"
                  :key="network.chainId"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer pop-pill-color"
                >
                  <div
                    class="flex items-center"
                    :onclick="() => handleSourceNetwork(network)"
                  >
                    <span class="ml-1">
                      {{ network.name }}
                    </span>
                  </div>
                </div>
              </div>
            </BalPopover>
            <BalPopover noPad overrideClasses="popuover-override">
              <template #activator>
                <BalBtn
                  class="ml-4 network-button-bride"
                  color="white"
                  :size="upToLargeBreakpoint ? 'md' : 'sm'"
                >
                  <template v-if="sourceToken.name">
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                    >
                      {{ sourceToken.name }}
                    </span>
                    <BalIcon name="chevron-down" size="sm" class="ml-2" />
                  </template>
                  <template v-else>
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                    >
                      Select Token
                    </span>
                    <BalIcon name="chevron-down" size="sm" class="ml-2" />
                  </template>
                </BalBtn>
              </template>
              <div
                role="menu"
                class="flex overflow-hidden flex-col w-52 rounded-lg wallet-menu wallet-menu-scroll"
              >
                <div
                  class="py-2 px-3 text-sm font-medium text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
                >
                  Select Network
                </div>
                <div
                  v-for="token in state.sourceTokens"
                  :key="token.address"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer pop-pill-color"
                >
                  <div
                    class="flex items-center"
                    :onclick="() => handleSourceTokne(token)"
                  >
                    <span class="ml-1">
                      {{ token.name }}
                    </span>
                  </div>
                </div>
              </div>
            </BalPopover>
          </div>
          <div class="flex justify-between items-center mt-[20px]">
            <input
              class="ml-4 amount-input w-[50%]"
              placeholder="0"
              :value="amount.sourceAmount"
              type="number"
              :onchange="handleSouceAmount"
            />
            <p class="balance-text w-[50%]">
              Balance: {{ parseFloat(sourceTokenBalance).toFixed(3) }}
              {{ sourceToken ? sourceToken.symbol : '' }}
            </p>
          </div>
          <div class="round-icon">
            <ArrowDownIcon />
          </div>
        </div>
        <div class="p-5 bal-text-input-container mt-[20px]">
          <div class="flex justify-between">
            <BalPopover noPad overrideClasses="popuover-override">
              <template #activator>
                <BalBtn
                  class="ml-4 network-button-bride"
                  color="white"
                  :size="upToLargeBreakpoint ? 'md' : 'sm'"
                >
                  <template v-if="activeNetworkDestination">
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                    >
                      {{ activeNetworkDestination.name }}
                    </span>
                    <BalIcon name="chevron-down" size="sm" class="ml-2" />
                  </template>
                  <template v-else>
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                    >
                      Select Network
                    </span>
                    <BalIcon name="chevron-down" size="sm" class="ml-2" />
                  </template>
                </BalBtn>
              </template>
              <div
                role="menu"
                class="flex flex-col w-52 rounded-lg max-h-[300px] wallet-menu wallet-menu-scroll"
              >
                <div
                  class="py-2 px-3 text-sm font-medium text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
                >
                  Select Network
                </div>
                <div
                  v-for="network in state.supportedChain"
                  :key="network.chainId"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer pop-pill-color"
                >
                  <div
                    class="flex items-center"
                    :onclick="() => handleDestinationNetwork(network)"
                  >
                    <span class="ml-1">
                      {{ network.name }}
                    </span>
                  </div>
                </div>
              </div>
            </BalPopover>
            <BalPopover noPad overrideClasses="popuover-override">
              <template #activator>
                <BalBtn
                  class="ml-4 network-button-bride"
                  color="white"
                  :size="upToLargeBreakpoint ? 'md' : 'sm'"
                >
                  <template v-if="destinationToken.name">
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                    >
                      {{ destinationToken.name }}
                    </span>
                    <BalIcon name="chevron-down" size="sm" class="ml-2" />
                  </template>
                  <template v-else>
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                    >
                      Select Token
                    </span>
                    <BalIcon name="chevron-down" size="sm" class="ml-2" />
                  </template>
                </BalBtn>
              </template>
              <div
                role="menu"
                class="flex overflow-hidden flex-col w-52 rounded-lg wallet-menu wallet-menu-scroll"
              >
                <div
                  class="py-2 px-3 text-sm font-medium text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
                >
                  Select Token
                </div>
                <div
                  v-for="token in state.destinamtionTokens"
                  :key="token.address"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer pop-pill-color"
                >
                  <div
                    class="flex items-center"
                    :onclick="() => handleDestinationToken(token)"
                  >
                    <span class="ml-1">
                      {{ token.name }}
                    </span>
                  </div>
                </div>
              </div>
            </BalPopover>
          </div>
          <div class="flex justify-between items-center mt-[20px]">
            <div class="ml-4 amount-input w-[50%]">
              {{ receiveAmountInEth }}
            </div>

            <p class="balance-text w-[50%]">
              Balance: {{ parseFloat(destinationTokenBalance).toFixed(3) }}
              {{ destinationToken ? destinationToken.symbol : '' }}
            </p>
          </div>
        </div>
        <div class="bridge-info-container mt-[30px]">
          <div class="flex justify-between">
            <p class="info-title">Estimate Time arrival</p>
            <div class="flex">
              <img src="~@/assets/images/clock.svg" alt="Bridge" width="20" />
              <p class="info-title ml-[5px]">00:20</p>
            </div>
          </div>
        </div>
        <div class="bridge-info-container mt-[15px]">
          <div class="flex justify-between">
            <p class="info-title">Bridge Provider</p>
            <div class="flex">
              <img src="~@/assets/images/bridge.svg" alt="Bridge" width="20" />
              <p class="info-title ml-[5px]">Orbiter</p>
            </div>
          </div>
        </div>
        <div class="bridge-info-container mt-[15px]">
          <div class="flex justify-between">
            <p class="info-title">Fees</p>
            <div class="flex">
              <img src="~@/assets/images/bridge.svg" alt="Bridge" width="20" />
              <p class="info-title ml-[5px]">
                {{
                  state.selectedCrosschainLink &&
                  state.selectedCrosschainLink.tradeFee
                    ? getFee()
                    : 0
                }}
                {{ sourceToken.symbol }}
              </p>
            </div>
          </div>
        </div>
        <BalBtn
          :onclick="bridgeTranscation"
          class="w-full mt-[25px]"
          :color="'gradient'"
          >Bridge</BalBtn
        >
      </div>
    </BalCard>
  </div>
</template>
<style>
.dark .swap-container {
  box-shadow: 0px 0px 0px 3.6px rgba(139, 141, 252, 0.6),
    0px 0px 0px 7.2px rgba(139, 141, 252, 0.25),
    0px 0px 134.1px -41.4px rgba(139, 141, 252, 0.8);
  background: #151526;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  max-width: 600px;
}
.swap-container {
  border-radius: 20px;
  background: #d5d6ff;
  box-shadow: 0px 0px 0px 4px rgba(139, 141, 252, 0.6),
    0px 0px 0px 8px rgba(139, 141, 252, 0.25),
    0px 0px 149px -46px rgba(139, 141, 252, 0.8);
  padding: 20px;
  position: relative;
  max-width: 600px;
}
.swap-title {
  color: #fff;
  font-family: Plus Jakarta Sans;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.dark .bal-text-input-container {
  box-shadow: 0px 0px 0px 2px #8b8dfc99;
  background: #212139;

  border-radius: 10.8px;
}
.bal-text-input-container {
  background: rgba(139, 141, 252, 0.15);
  border-radius: 10.8px;
  box-shadow: 0px 2px 9px 4px rgba(6, 6, 6, 0.15) inset,
    0px 0px 0px 3px rgba(139, 141, 252, 0.6),
    0px 0px 0px 6px rgba(139, 141, 252, 0.25);
}
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
.network-button-bride {
  border-radius: 57.173px;
  background-color: #474881 !important;
  padding: 25px 18px;
  width: 200px;
}
.popuover-override {
  overflow: auto !important;
  max-height: 300px;
}
.wallet-menu-scroll {
  max-height: 300px;
}
.popuover-override::-webkit-scrollbar {
  display: none;
  visibility: hidden;
}
.amount-input {
  background: transparent;
  color: #fff;
  font-family: Plus Jakarta Sans;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
}
.balance-text {
  color: #8b8dfc;
  text-align: right;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
}
.bridge-info-container {
  border-radius: 10.8px;
  background: #212139;
  box-shadow: 0px 0px 0px 1.8px rgba(139, 141, 252, 0.6);
  padding: 16px;
}
.info-title {
  color: #fff;
  font-family: Plus Jakarta Sans;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 25.2px */
}
.round-icon {
  background: #8b8dfc;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pop-pill-color {
  background: #16162d;
}
</style>