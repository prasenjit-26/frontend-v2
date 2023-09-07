import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0x8042bAf687c2342930558806e8E6A2B946B22a22', // USDC
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x2C1b868d6596a18e32E61B901E4060C872647b6C',
    WETH: '0x2C1b868d6596a18e32E61B901E4060C872647b6C',
    BAL: '0xD114960a8e14b0c408A9BcEF1F2e7f9cD59aD4a9',
  },
};

export default tokens;
