import { Config } from '../types';
import keys from './keys';
import contracts from './contracts';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '5001',
  chainId: 5001,
  chainName: 'Mantle Testnet',
  name: 'Mantle Testnet',
  shortName: 'Mantle',
  monorepoName: 'Mantle',
  slug: 'mantle',
  network: 'Mantle',
  trustWalletNetwork: 'mantle',
  unknown: false,
  visibleInUI: false,
  testNetwork: false,
  rpc: 'https://rpc.testnet.mantle.xyz',
  ws: `wss://ws.testnet.mantle.xyz`,
  publicRpc: 'https://rpc.testnet.mantle.xyz',
  explorer: 'https://explorer.testnet.mantle.xyz/',
  explorerName: 'MantleExplorer',
  subgraph: 'https://graph.testnet.mantle.xyz/subgraphs/name/chimpExchange',
  balancerApi: 'https://api.balancer.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: ['https://graph.testnet.mantle.xyz/subgraphs/name/chimpExchange'],
    aave: '',
    gauge:
      'https://api.studio.thegraph.com/query/24660/balancer-gauges-polygon-zk/version/latest',
    blocks: '',
  },
  bridgeUrl: 'https://wallet.polygon.technology/zkEVM-Bridge/bridge',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 2,
  nativeAsset: {
    name: 'Mantle',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'MNT',
    decimals: 18,
    deeplinkId: 'mantle',
    logoURI: 'tokens/eth.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'mantle',
      platformId: 'mantle',
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
