import { Config } from '../types';
import keys from './keys';
import contracts from './contracts';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '28882',
  chainId: 28882,
  chainName: 'Boba Sepolia',
  name: 'Boba Sepolia',
  shortName: 'Boba',
  monorepoName: 'Boba',
  slug: 'bobasepolia',
  network: 'bobasepolia',
  trustWalletNetwork: 'bobasepolia',
  unknown: false,
  visibleInUI: false,
  testNetwork: false,
  rpc: 'https://sepolia.boba.network',
  ws: `wss://wss.sepolia.boba.network`,
  publicRpc: 'https://sepolia.boba.network',
  explorer: 'https://testnet.bobascan.com',
  explorerName: 'bobascan',
  subgraph:
    'https://api.studio.thegraph.com/query/94032/chimp-exchange/version/latest',
  balancerApi: 'https://api.balancer.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.studio.thegraph.com/query/94032/chimp-exchange/version/latest',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: 'https://wallet.polygon.technology/zkEVM-Bridge/bridge',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 8,
  nativeAsset: {
    name: 'ETH',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'ETH',
    decimals: 18,
    deeplinkId: 'ETH',
    logoURI: 'tokens/eth.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'weth',
      platformId: 'boba-network-ecosystem',
    },
  },
  addresses: {
    ...contracts,
  },
  pools,
  tokens,
  keys,
  gauges: {
    type: 3,
    weight: 0,
  },
  tokenlists,
  rateProviders,
};

export default config;
