import { Config } from '../types';
import keys from './keys';
import contracts from './contracts';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '59144',
  chainId: 59144,
  chainName: 'Linea',
  name: 'Linea Mainnet',
  shortName: 'Linea',
  monorepoName: 'Linea',
  slug: 'lineanetwork',
  network: 'Linea',
  trustWalletNetwork: 'linea',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://rpc.linea.build',
  ws: `wss://ws.testnet.mantle.xyz`,
  publicRpc: 'https://rpc.linea.build',
  explorer: 'https://lineascan.build',
  explorerName: 'LineaExplorer',
  subgraph:
    'https://graph-query.linea.build/subgraphs/name/Chimp-Exchange/chimp-exchange-subgraph',
  balancerApi: 'https://api.balancer.fi',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://graph-query.linea.build/subgraphs/name/Chimp-Exchange/chimp-exchange-subgraph',
    ],
    aave: '',
    gauge:
      'https://api.studio.thegraph.com/query/24660/balancer-gauges-polygon-zk/version/latest',
    blocks: '',
  },
  bridgeUrl: 'https://wallet.polygon.technology/zkEVM-Bridge/bridge',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 8,
  nativeAsset: {
    name: 'LineaETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'LineaETH',
    decimals: 18,
    deeplinkId: 'mantle',
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
