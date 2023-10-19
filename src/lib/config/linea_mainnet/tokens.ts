import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f', // USDC
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
    WETH: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
    BAL: '0xD114960a8e14b0c408A9BcEF1F2e7f9cD59aD4a9',
  },
};

export default tokens;
