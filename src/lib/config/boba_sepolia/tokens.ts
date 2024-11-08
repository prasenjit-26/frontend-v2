import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['CTT', 'DAI', 'USDC', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0x4200000000000000000000000000000000000006',
    output: '0x9140084f70C3DF3ed0Cf7a13c7617CC7a45C3E25', // USDC
  },
  Addresses: {
    nativeAsset: '0x4200000000000000000000000000000000000006',
    wNativeAsset: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    WETH: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    CTT: '0xA4F6268f8f6CA4D9160C584338587B515AfF7B88',
  },
};

export default tokens;
