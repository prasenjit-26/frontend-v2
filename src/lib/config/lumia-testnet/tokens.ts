import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['CTT', 'DAI', 'USDC', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0x9140084f70C3DF3ed0Cf7a13c7617CC7a45C3E25', // USDC
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x1a1aF9C78704D3a0Ab9e031C92E7bd808711A582',
    WETH: '0x1a1aF9C78704D3a0Ab9e031C92E7bd808711A582',
    CTT: '0x286381aEdd20e51f642fE4A200B5CB2Fe3729695',
  },
};

export default tokens;
