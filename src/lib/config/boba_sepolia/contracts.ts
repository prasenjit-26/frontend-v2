import { Contracts } from '../types';
import * as lumiaTestnet from '@/assets/data/contracts/boba_sepolia.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0x55813EDB4b83a3286bB69c826Cb81BF8c7773524',
  authorizer: lumiaTestnet.Authorizer,
  vault: lumiaTestnet.Vault,
  weightedPoolFactory: lumiaTestnet.WeightedPoolFactory,
  stablePoolFactory: lumiaTestnet.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: lumiaTestnet.BalancerHelpers,
  batchRelayer: lumiaTestnet.BalancerRelayer,
  gaugeFactory: '',
  balancerMinter: '',
  gaugeController: '',
  tokenAdmin: '',
  veBAL: '',
  veDelegationProxy: '',
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  faucet: '',
  gaugeRewardsHelper: '',
};

export default contracts;
