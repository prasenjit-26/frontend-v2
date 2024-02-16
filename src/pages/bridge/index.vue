<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue';
import { Contract, ethers } from 'ethers';
import useBreakpoints from '@/composables/useBreakpoints';
import BigNumber from 'bignumber.js';
import ERC20_ABI from '@/lib/abi/ERC20.json';
import useTransactions from '@/composables/useTransactions';
import useWeb3 from '@/services/web3/useWeb3';
import { useWallets } from '@/providers/wallet.provider';
import SelectBirdgeTokenModal from '../../components/modals/SelectBirdgeTokenModal/SelectBirdgeTokenModal.vue';
import ethIcon from '../../assets/images/icons/networks/ethereum.svg';
import optisimIcon from '../../assets/images/icons/networks/optimism.svg';
import arbitrumIcon from '../../assets/images/icons/networks/arbitrum.svg';
import lineaIcon from '../../assets/images/icons/networks/linea.png';
import polygonIcon from '../../assets/images/icons/networks/polygon.svg';
import mantleIcon from '../../assets/images/icons/networks/mantle.svg';
import blastIcon from '../../assets/images/icons/networks/blast.svg';
import baseIcon from '../../assets/images/icons/networks/blast.svg';
import bnbIcon from '../../assets/images/icons/networks/bnb.png';
import polygonzkEVMIcon from '../../assets/images/icons/networks/zkEVM.png';
import sepoliaIcon from '../../assets/images/icons/networks/sepolia.png';
import zksyncIcon from '../../assets/images/icons/networks/zksync.svg';
import daiIcon from '../../assets/images/tokens/dai.png';
import usdtIcon from '../../assets/images/tokens/usdt.png';
import usdcIcon from '../../assets/images/tokens/usdc.png';
import wethIcon from '../../assets/images/tokens/weth.png';
import bnbTokenIcon from '../../assets/images/tokens/bnb.png';
import mantleTokenIcon from '../../assets/images/tokens/mantle.svg';
import metisIcon from '../../assets/images/tokens/metis.png';
import maticIcon from '../../assets/images/tokens/matic.webp';

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
const chainIdImageMapping = {
  '420': optisimIcon,
  '421613': arbitrumIcon,
  '97': bnbIcon,
  '84531': baseIcon,
  '59140': lineaIcon,
  '5001': mantleIcon,
  '11155111': sepoliaIcon,
  '1': ethIcon,
  '42161': arbitrumIcon,
  zksync: zksyncIcon,
  '137': polygonIcon,
  '10': optisimIcon,
  '1088': blastIcon,
  '56': bnbIcon,
  '42170': arbitrumIcon,
  '1101': polygonzkEVMIcon,
  '59144': lineaIcon,
  '5000': mantleIcon,
  '8453': baseIcon,
};
const tokenImageMaooing = {
  usdc: usdcIcon,
  dai: daiIcon,
  usdt: usdtIcon,
  weth: wethIcon,
  eth: wethIcon,
  metis: metisIcon,
  matic: maticIcon,
  bnb: bnbTokenIcon,
  mnt: mantleTokenIcon,
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
const noPath = ref(false);
const txLoading = ref(false);
const sourceTokenBalance = ref('0');
const destinationTokenBalance = ref('0');
const { upToLargeBreakpoint } = useBreakpoints();
const { addTransaction } = useTransactions();
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
const { provider } = useWallets();
const selectTokenModalSourceTokens = ref(false);
const selectTokenModalDesitnationTokens = ref(false);
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
      if (crossChainLink === null || crossChainLink === undefined) {
        amount.receiveDataRouter = null;
        receiveAmountInEth.value = '0';
        noPath.value = true;
      } else {
        noPath.value = false;
        getReceiveAmount();
      }
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
const handleSourceTokne = async tokenAddress => {
  const token = state.sourceTokens.find(
    tokenData => tokenData.address === tokenAddress
  );
  if (token) {
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
          .dividedBy(10 ** parseFloat(token.decimals.toString()))
          .toString();
      }
    }
  }
};
const handleDestinationNetwork = network => {
  activeNetworkDestination.value = network;
  state.destinamtionTokens = network.tokens;
  getCrosschainLink();
};
const handleDestinationToken = async tokenAddress => {
  const token = state.destinamtionTokens.find(
    tokenData => tokenData.address === tokenAddress
  );
  if (token) {
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
          .dividedBy(10 ** parseFloat(token.decimals.toString()))
          .toString();
      }
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
      const prefix = valueInWei.slice(0, -4);
      // Concatenate the prefix and the replacement
      const resultString = prefix + state.selectedCrosschainLink.vc;
      console.log('valueInWei', valueInWei, amount.sourceAmount, resultString);
      const checkReceiveAmount = await fetch(
        `${API_LINK}/routers/simulation/receiveAmount?line=${state.selectedCrosschainLink.line}&value=${resultString}`
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
          .toFixed(6);
        receiveAmountInEth.value = receiveValue;
        amount.receiveDataRouter = amountResp.result.router;
      } else {
        amount.receiveDataRouter = null;
        receiveAmountInEth.value = '0';
      }
      console.log('checkReceiveAmount', amountResp);
    }
  } catch (error) {
    console.log('error', error);
  }
};
const bridgeTranscation = async () => {
  try {
    txLoading.value = true;
    const signer = getSigner();
    if (chainId.value.toString() !== activeNetwork.value.chainId.toString()) {
      // @ts-ignore
      const hexChainId = `0x${activeNetwork.value.chainId.toString(16)}`;
      if (provider.value.request) {
        await provider.value.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
      }
    }
    if (amount && amount.receiveDataRouter) {
      const sourceAmountResp = new BigNumber(amount.sourceAmount)
        .multipliedBy(10 ** parseFloat(sourceToken.value.decimals.toString()))
        .toString();
      if (
        sourceToken.value.address ===
        '0x0000000000000000000000000000000000000000'
      ) {
        const txData = {
          value:
            sourceAmountResp.substring(0, sourceAmountResp.length - 4) +
            amount.receiveDataRouter.vc,
          to: amount.receiveDataRouter.endpoint,
        };
        console.log('txData', txData);
        const tx = await signer.sendTransaction(txData);
        addTransaction({
          id: tx.hash,
          type: 'tx',
          action: 'Bridge',
          summary: 'Birdge Transcation',
          details: {
            spender: account.value,
          },
        });
        await tx.wait();
        console.log('after', tx);
      } else {
        const erc20Token = new Contract(
          sourceToken.value.address,
          ERC20_ABI,
          signer
        );
        const sourceAmountResp = new BigNumber(amount.sourceAmount)
          .multipliedBy(10 ** parseFloat(sourceToken.value.decimals.toString()))
          .toString();
        const tx = await erc20Token.transfer(
          amount.receiveDataRouter?.endpoint,
          sourceAmountResp.substring(0, sourceAmountResp.length - 4) +
            amount.receiveDataRouter.vc
        );
        addTransaction({
          id: tx.hash,
          type: 'tx',
          action: 'Bridge',
          summary: 'Birdge Transcation',
          details: {
            spender: account.value,
          },
        });
        await tx.wait();
        console.log('after', tx);
      }
    }
    txLoading.value = false;
  } catch (error) {
    console.log('error', error);
  }
};
const getFee = () => {
  let fess = '0';
  if (
    state.selectedCrosschainLink &&
    state.selectedCrosschainLink.withholdingFee
  ) {
    fess = state.selectedCrosschainLink.withholdingFee;
    let feesinWei = new BigNumber(fess).multipliedBy(
      10 ** parseFloat(sourceToken.value.decimals.toString())
    );
    feesinWei = feesinWei.plus(state.selectedCrosschainLink.tradeFee);
    fess = feesinWei
      .dividedBy(10 ** parseFloat(sourceToken.value.decimals.toString()))
      .toString();
  }
  return fess;
};
const handleSouceAmount = event => {
  amount.sourceAmount = event.target.value;
  getReceiveAmount();
};
const handlePopOverClose = () => {
  console.log('in close');
};
onBeforeMount(() => {
  onPageLoad();
});
console.log('amount', amount);
const handleShowModal = () => {
  selectTokenModalSourceTokens.value = true;
};
const handleDestinationTokenModals = () => {
  selectTokenModalDesitnationTokens.value = true;
};
</script>
<template>
  <teleport to="#modal">
    <SelectBirdgeTokenModal
      v-if="selectTokenModalSourceTokens"
      :approvedTokenLists="state.sourceTokens"
      ignoreBalances
      @close="selectTokenModalSourceTokens = false"
      @select="handleSourceTokne"
    />
  </teleport>
  <teleport to="#modal">
    <SelectBirdgeTokenModal
      v-if="selectTokenModalDesitnationTokens"
      :approvedTokenLists="state.destinamtionTokens"
      ignoreBalances
      @close="selectTokenModalDesitnationTokens = false"
      @select="handleDestinationToken"
    />
  </teleport>
  <div
    class="container mx-auto max-w-[1300px] pl-[24px] pr-[24px] mt-[40px] h-[100vh]"
  >
    <BalCard
      class="flex relative items-center h-full card-container"
      shadow="none"
      noBorder
    >
      <div class="swap-container universal-border">
        <p class="text-black dark:text-white swap-title mb-[20px] font-[500]">
          Bridge
        </p>
        <div class="relative p-5 bal-text-input-container universal-border">
          <div class="flex justify-between">
            <BalPopover
              noPad
              overrideClasses="popuover-override"
              @close="handlePopOverClose"
            >
              <template #activator>
                <BalBtn
                  class="ml-4 network-button-bride"
                  color="white"
                  :size="upToLargeBreakpoint ? 'md' : 'sm'"
                >
                  <template v-if="activeNetwork">
                    <div class="flex justify-between items-center w-full">
                      <div class="flex items-center">
                        <img
                          :src="chainIdImageMapping[activeNetwork.chainId]"
                          :alt="activeNetwork.name"
                          width="20"
                        />
                        <span
                          class="ml-2 text-white font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                        >
                          {{ activeNetwork.name }}
                        </span>
                      </div>
                      <BalIcon
                        name="chevron-down"
                        size="sm"
                        class="ml-2 text-white"
                      />
                    </div>
                  </template>
                </BalBtn>
              </template>
              <template #default="{ close }">
                <div
                  role="menu"
                  class="flex flex-col w-52 rounded-lg max-h-[300px] overflow-scrolll wallet-menu wallet-menu-scroll"
                  @click="close"
                >
                  <div
                    class="py-2 px-3 text-sm font-medium text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
                  >
                    Select Network
                  </div>
                  <div
                    v-for="network in state.supportedChain"
                    :key="network.chainId"
                    class="flex justify-between items-center p-3 w-full hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer pop-pill-color"
                  >
                    <div
                      class="flex items-center w-full"
                      :onclick="() => handleSourceNetwork(network)"
                    >
                      <img
                        :src="chainIdImageMapping[network.chainId]"
                        :alt="network.name"
                        width="20"
                      />
                      <span class="ml-[10px]">
                        {{ network.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </BalPopover>
            <BalBtn
              class="ml-4 network-button-bride"
              color="white"
              :onclick="handleShowModal"
              :size="upToLargeBreakpoint ? 'md' : 'sm'"
            >
              <template v-if="sourceToken.name">
                <div class="flex justify-between items-center w-full">
                  <div class="flex items-center">
                    <BalAsset
                      :iconURI="
                        tokenImageMaooing[sourceToken.symbol.toLowerCase()]
                      "
                      :address="sourceToken.address"
                      :size="20"
                    />
                    <span
                      class="ml-2 text-white font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                    >
                      {{ sourceToken.symbol }}
                    </span>
                  </div>
                  <BalIcon
                    name="chevron-down"
                    size="sm"
                    class="ml-2 text-white"
                  />
                </div>
              </template>
              <template v-else>
                <span
                  class="ml-2 text-white font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                >
                  Select Token
                </span>
                <BalIcon
                  name="chevron-down"
                  size="sm"
                  class="ml-2 text-white"
                />
              </template>
            </BalBtn>
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
            <ArrowDownIcon class="text-white" />
          </div>
        </div>
        <div class="p-5 bal-text-input-container mt-[20px] universal-border">
          <div class="flex justify-between">
            <BalPopover noPad overrideClasses="popuover-override">
              <template #activator>
                <BalBtn
                  class="ml-4 network-button-bride"
                  color="white"
                  :size="upToLargeBreakpoint ? 'md' : 'sm'"
                >
                  <template v-if="activeNetworkDestination">
                    <div class="flex justify-between items-center w-full">
                      <div class="flex items-center">
                        <img
                          :src="
                            chainIdImageMapping[
                              activeNetworkDestination.chainId
                            ]
                          "
                          :alt="activeNetworkDestination.name"
                          width="20"
                        />
                        <span
                          class="ml-2 text-white font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                        >
                          {{ activeNetworkDestination.name }}
                        </span>
                      </div>
                      <BalIcon
                        name="chevron-down"
                        size="sm"
                        class="ml-2 text-white"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <span
                      class="ml-2 text-white font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                    >
                      Select Network
                    </span>
                    <BalIcon
                      name="chevron-down"
                      size="sm"
                      class="ml-2 text-white"
                    />
                  </template>
                </BalBtn>
              </template>
              <template #default="{ close }">
                <div
                  role="menu"
                  class="flex flex-col w-52 rounded-lg max-h-[300px] wallet-menu wallet-menu-scroll"
                  @click="close"
                >
                  <div
                    class="py-2 px-3 w-full text-sm font-medium text-white whitespace-nowrap bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-900"
                  >
                    Select Network
                  </div>
                  <div
                    v-for="network in state.supportedChain"
                    :key="network.chainId"
                    class="flex justify-between items-center p-3 w-full hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer pop-pill-color"
                  >
                    <div
                      class="flex items-center w-full"
                      :onclick="() => handleDestinationNetwork(network)"
                    >
                      <img
                        :src="chainIdImageMapping[network.chainId]"
                        :alt="network.name"
                        width="20"
                      />
                      <span class="ml-[10px]">
                        {{ network.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </BalPopover>
            <BalBtn
              class="ml-4 network-button-bride"
              color="white"
              :onclick="handleDestinationTokenModals"
              :size="upToLargeBreakpoint ? 'md' : 'sm'"
            >
              <template v-if="destinationToken.name">
                <div class="flex justify-between items-center w-full">
                  <div class="flex items-center">
                    <BalAsset
                      :iconURI="
                        tokenImageMaooing[destinationToken.symbol.toLowerCase()]
                      "
                      :address="destinationToken.address"
                      :size="20"
                    />
                    <span
                      class="ml-2 text-white font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px] leading-[20px]"
                    >
                      {{ destinationToken.name }}
                    </span>
                  </div>
                  <BalIcon
                    name="chevron-down"
                    size="sm"
                    class="ml-2 text-white"
                  />
                </div>
              </template>
              <template v-else>
                <span
                  class="ml-2 text-white font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                >
                  Select Token
                </span>
                <BalIcon
                  name="chevron-down"
                  size="sm"
                  class="ml-2 text-white"
                />
              </template>
            </BalBtn>
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
        <!-- <div class="bridge-info-container mt-[30px]">
          <div class="flex justify-between">
            <p class="info-title">Estimate Time arrival</p>
            <div class="flex">
              <img src="~@/assets/images/clock.svg" alt="Bridge" width="20" />
              <p class="info-title ml-[5px]">00:20</p>
            </div>
          </div>
        </div> -->
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
        <BalBtn v-if="noPath" class="w-full mt-[25px]" color="red">
          Unable to bridge selected pair, update token pair.
        </BalBtn>
        <div v-else>
          <BalBtn
            v-if="
              parseFloat(sourceTokenBalance) < parseFloat(amount.sourceAmount)
            "
            class="w-full mt-[25px]"
            color="red"
          >
            Insufficiant Balance
          </BalBtn>
          <BalBtn
            v-else
            :onclick="bridgeTranscation"
            class="w-full mt-[25px]"
            :disabled="
              state.selectedCrosschainLink === null ||
              parseFloat(amount.sourceAmount) <= 0 ||
              parseFloat(amount.receiveAmount) <= 0 ||
              txLoading
            "
            :color="
              state.selectedCrosschainLink === null ||
              parseFloat(amount.sourceAmount) <= 0 ||
              parseFloat(amount.receiveAmount) <= 0 ||
              txLoading
                ? 'gray'
                : 'gradient'
            "
          >
            {{ txLoading ? 'Processing...' : 'Bridge' }}
          </BalBtn>
        </div>
      </div>
    </BalCard>
  </div>
</template>
<style>
.dark .swap-container {
  background: #151526;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  max-width: 600px;
}
.swap-container {
  border-radius: 20px;
  background: #d5d6ff;
  padding: 20px;
  position: relative;
  max-width: 600px;
}
.swap-title {
  font-family: Plus Jakarta Sans;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.dark .bal-text-input-container {
  background: #212139;

  border-radius: 10.8px;
}
.bal-text-input-container {
  background: rgba(139, 141, 252, 0.15);
  border-radius: 10.8px;
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
.dark .network-button-bride {
  border-radius: 57.173px;
  background-color: #474881 !important;
  padding: 25px 18px;
  width: 200px;
}
.network-button-bride {
  border-radius: 57.173px;
  background-color: #4e529c !important;
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
.dark .bridge-info-container {
  border-radius: 10.8px;
  background: #212139;
  box-shadow: 0px 0px 0px 1.8px rgba(139, 141, 252, 0.6);
  padding: 16px;
}
.bridge-info-container {
  border-radius: 10.8px;
  background: #7476f3;
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
.dark .pop-pill-color {
  background: #16162d;
}
.pop-pill-color {
  background: #d5d6ff;
}
</style>