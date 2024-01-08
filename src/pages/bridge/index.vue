<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
const supportedNetworks = [
  {
    chainId: '1',
    networkId: '1',
    internalId: '1',
    name: 'Ethereum',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x3be8b60ddf9feff6b2426e47a7619d7cbc786d97': 'OrbiterRouterV1',
      '0xc741900276cd598060b0fe6594fbe977392928f4': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        coinKey: 'DAI',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        coinKey: 'USDC',
        decimals: 6,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      },
      {
        name: 'Tether USD',
        symbol: 'USDT',
        coinKey: 'USDT',
        decimals: 6,
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      },
    ],
  },
  {
    chainId: '42161',
    networkId: '42161',
    internalId: '2',
    name: 'Arbitrum',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x752bc92211d1ecbb31f84e57c9dfc39a15df9cfa': 'OrbiterRouterV1',
      '0x6a065083886ec63d274b8e1fe19ae2ddf498bfdd': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        coinKey: 'DAI',
        address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      },
      {
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        coinKey: 'USDT',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      },
    ],
  },
  {
    chainId: 'zksync',
    networkId: '1',
    internalId: '3',
    name: 'zkSync Lite',
    nativeCurrency: {
      id: 0,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        id: 0,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        id: 1,
        name: 'DAI',
        symbol: 'DAI',
        decimals: 18,
        coinKey: 'DAI',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
      {
        id: 2,
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
      {
        id: 4,
        name: 'USDT',
        symbol: 'USDT',
        decimals: 6,
        coinKey: 'USDT',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      },
    ],
  },
  {
    chainId: 'SN_MAIN',
    networkId: 'mainnet-alpha',
    internalId: '4',
    name: 'Starknet',
    contract: {
      '0x0173f81c529191726c6e7287e24626fe24760ac44dae2a1f7e02080230f8458b':
        'OBSource',
    },
    nativeCurrency: {
      id: 0,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address:
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    },
    tokens: [
      {
        id: 0,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      },
      {
        name: 'DAI',
        symbol: 'DAI',
        decimals: 18,
        coinKey: 'DAI',
        address:
          '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
      },
      {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address:
          '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      },
      {
        name: 'USDT',
        symbol: 'USDT',
        decimals: 6,
        coinKey: 'USDT',
        address:
          '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
      },
    ],
  },
  {
    chainId: '137',
    networkId: '137',
    internalId: '6',
    name: 'Polygon',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x752bc92211d1ecbb31f84e57c9dfc39a15df9cfa': 'OrbiterRouterV1',
      '0x653f25dc641544675338cb47057f8ea530c69b78': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      coinKey: 'MATIC',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
        coinKey: 'MATIC',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        coinKey: 'DAI',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      },
      {
        name: 'Wrapped Ether',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      },
      {
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        coinKey: 'USDT',
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      },
    ],
  },
  {
    chainId: '10',
    networkId: '10',
    internalId: '7',
    name: 'Optimism',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x752bc92211d1ecbb31f84e57c9dfc39a15df9cfa': 'OrbiterRouterV1',
      '0x3191f40de6991b1bb1f61b7cec43d62bb337786b': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      coinKey: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        coinKey: 'DAI',
        address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      },
      {
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        coinKey: 'USDT',
        address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      },
    ],
  },
  {
    chainId: 'immutableX',
    networkId: '1',
    internalId: '8',
    name: 'Immutable X',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        coinKey: 'USDC',
        decimals: 6,
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    ],
  },
  {
    chainId: 'loopring',
    networkId: '1',
    internalId: '9',
    name: 'Loopring',
    nativeCurrency: {
      id: 0,
      name: 'Ethereum',
      symbol: 'ETH',
      coinKey: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        id: 0,
        name: 'Ethereum',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
    ],
  },
  {
    chainId: '1088',
    networkId: '1088',
    internalId: '10',
    name: 'Metis',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
    },
    nativeCurrency: {
      name: 'Metis Token',
      symbol: 'METIS',
      decimals: 18,
      coinKey: 'METIS',
      address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    },
    tokens: [
      {
        name: 'Metis Token',
        symbol: 'METIS',
        decimals: 18,
        coinKey: 'METIS',
        address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
      },
      {
        name: 'Ether (WETH)',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0x420000000000000000000000000000000000000a',
      },
      {
        name: 'USDC Token',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0xEA32A96608495e54156Ae48931A7c20f0dcc1a21',
      },
    ],
  },
  {
    chainId: 'ZKSpace',
    networkId: '13',
    internalId: '12',
    name: 'ZKSpace',
    nativeCurrency: {
      id: 0,
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        id: 0,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        id: 4,
        name: 'USD Coin',
        symbol: 'USDC',
        coinKey: 'USDC',
        decimals: 6,
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      },
    ],
  },
  {
    chainId: '324',
    networkId: '324',
    internalId: '14',
    name: 'ZKSyncEra',
    contract: {
      '0xbf3922a0cebbcd718e715e83d9187cc4bba23f11': 'OBSource',
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      coinKey: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'Ether',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
      },
      {
        name: 'USDT',
        symbol: 'USDT',
        coinKey: 'USDT',
        decimals: 6,
        address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
      },
    ],
  },
  {
    chainId: '56',
    networkId: '56',
    internalId: '15',
    name: 'BSC',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      coinKey: 'BNB',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'BNB',
        symbol: 'BNB',
        coinKey: 'BNB',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'Binance-Peg Ethereum',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      },
      {
        name: 'Binance-Peg USDT',
        symbol: 'USDT',
        decimals: 18,
        coinKey: 'USDT',
        address: '0x55d398326f99059ff775485246999027b3197955',
      },
      {
        name: 'Binance-Peg USDC',
        symbol: 'USDC',
        coinKey: 'USDC',
        decimals: 18,
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      },
    ],
  },
  {
    chainId: '42170',
    networkId: '42170',
    internalId: '16',
    name: 'Arbitrum Nova',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0xbea3c3c4f00799b9b053f7ad25024d85e1ad049a': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      coinKey: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0x750ba8b76187092b0d1e87e28daaf484d1b5273b',
      },
    ],
  },
  {
    chainId: '1101',
    networkId: '1101',
    internalId: '17',
    name: 'Polygon zkEVM',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      coinKey: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035',
      },
      {
        name: 'Tether USD',
        symbol: 'USDT',
        coinKey: 'USDT',
        decimals: 6,
        address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
      },
    ],
  },
  {
    chainId: '59144',
    networkId: '59144',
    internalId: '23',
    name: 'Linea',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
      },
      {
        name: 'USDT',
        symbol: 'USDT',
        decimals: 6,
        coinKey: 'USDT',
        address: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
      },
    ],
  },
  {
    chainId: '5000',
    networkId: '5000',
    internalId: '24',
    name: 'Mantle',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
      coinKey: 'MNT',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'MNT',
        symbol: 'MNT',
        decimals: 18,
        coinKey: 'MNT',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'WETH',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111',
      },
    ],
  },
  {
    chainId: '8453',
    networkId: '8453',
    internalId: '21',
    name: 'Base',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      },
    ],
  },
  {
    chainId: '7777777',
    networkId: '7777777',
    internalId: '30',
    name: 'Zora',
    contract: {
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OBSource',
      '0x2598d7bc9d3b4b6124f3282e49eee68db270f516': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
    ],
  },
  {
    chainId: '204',
    networkId: '204',
    internalId: '25',
    name: 'OPBNB',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      coinKey: 'BNB',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
        coinKey: 'BNB',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0xe7798f023fc62146e8aa1b36da45fb70855a77ea',
      },
    ],
  },
  {
    chainId: '169',
    networkId: '169',
    internalId: '31',
    name: 'Manta',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      coinKey: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        coinKey: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
    ],
  },
  {
    chainId: '534352',
    networkId: '534352',
    internalId: '19',
    name: 'Scroll',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      coinKey: 'ETH',
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        coinKey: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
        coinKey: 'USDC',
        address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
      },
      {
        name: 'USDT',
        symbol: 'USDT',
        coinKey: 'USDT',
        decimals: 6,
        address: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
      },
    ],
  },
  {
    chainId: '42766',
    networkId: '42766',
    internalId: '38',
    name: 'ZKFair',
    contract: {
      '0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc': 'OBSource',
      '0x13e46b2a3f8512ed4682a8fb8b560589fe3c2172': 'OrbiterRouterV3',
    },
    nativeCurrency: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    tokens: [
      {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        address: '0x4b21b980d0Dc7D3C0C6175b0A412694F3A1c7c6b',
      },
    ],
  },
];
const activeNetwork = ref(supportedNetworks[0]);
const { upToLargeBreakpoint } = useBreakpoints();
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
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
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
                  v-for="network in supportedNetworks"
                  :key="network.networkId"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                >
                  <div class="flex items-center">
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
                  <template v-if="activeNetwork">
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                    >
                      {{ activeNetwork.name }}
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
                  v-for="network in supportedNetworks"
                  :key="network.networkId"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                >
                  <div class="flex items-center">
                    <span class="ml-1">
                      {{ network.name }}
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
              value="0"
              type="number"
            />
            <p class="balance-text w-[50%]">Balance: $451.23</p>
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
                  <template v-if="activeNetwork">
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                    >
                      {{ activeNetwork.name }}
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
                  v-for="network in supportedNetworks"
                  :key="network.networkId"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                >
                  <div class="flex items-center">
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
                  <template v-if="activeNetwork">
                    <span
                      class="ml-2 font-[500] xs:text-[8px] sm:text-[10px] lg:text-[18px] xl:text-[18px]"
                    >
                      {{ activeNetwork.name }}
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
                  v-for="network in supportedNetworks"
                  :key="network.networkId"
                  class="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                >
                  <div class="flex items-center">
                    <span class="ml-1">
                      {{ network.name }}
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
              value="0"
              type="number"
            />
            <p class="balance-text w-[50%]">Balance: $451.23</p>
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
              <p class="info-title ml-[5px]">Orbittor</p>
            </div>
          </div>
        </div>
        <div class="bridge-info-container mt-[15px]">
          <div class="flex justify-between">
            <p class="info-title">Fees</p>
            <div class="flex">
              <img src="~@/assets/images/bridge.svg" alt="Bridge" width="20" />
              <p class="info-title ml-[5px]">$0.02</p>
            </div>
          </div>
        </div>
        <BalBtn class="w-full mt-[25px]" :color="'gradient'">Bridge</BalBtn>
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
}
.popuover-override {
  overflow: auto !important;
  max-height: 300px;
}
.wallet-menu-scroll {
  overflow: scroll;
  height: 300px;
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
</style>