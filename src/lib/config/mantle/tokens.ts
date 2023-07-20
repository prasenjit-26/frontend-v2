import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035', // USDC
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x6e1723460D190B4A092a2c13BA42BcC57d71870b',
    WETH: '0x6e1723460D190B4A092a2c13BA42BcC57d71870b',
    BAL: '0xB625463C9114edb77065e87E067910987E06955e',
  },
};

export default tokens;
