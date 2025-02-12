import { Config } from '../types';
import keys from './keys';
import contracts from './contracts';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '1952959480',
  chainId: 1952959480,
  chainName: 'Lumia Testnet',
  name: 'Lumia Testnet',
  shortName: 'Lumia',
  monorepoName: 'Lumia',
  slug: 'lumia',
  network: 'lumia',
  trustWalletNetwork: 'lumia',
  unknown: false,
  visibleInUI: false,
  testNetwork: false,
  rpc: 'https://testnet-rpc.lumia.org',
  ws: `wss://ws.testnet-rpc.lumia.org`,
  publicRpc: 'https://testnet-rpc.lumia.org',
  explorer: 'https://testnet-explorer.lumia.org/',
  explorerName: 'LumiaExplorer',
  subgraph:
    'https://api.goldsky.com/api/public/project_cm2a65azcz6r801ukfg4tareq/subgraphs/Chimp-Exchange/chimp-exchange-subgraph/gn',
  balancerApi: 'https://api.balancer.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.goldsky.com/api/public/project_cm2a65azcz6r801ukfg4tareq/subgraphs/Chimp-Exchange/chimp-exchange-subgraph/gn',
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
    name: 'LUMIA',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'LUMIA',
    decimals: 18,
    deeplinkId: 'LUMIA',
    logoURI: 'tokens/eth.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'wrapped-ether-linea',
      platformId: 'linea-ecosystem',
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
