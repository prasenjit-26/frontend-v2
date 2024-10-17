import { Contracts } from '../types';
import * as lumiaTestnet from '@/assets/data/contracts/lumia-testnet.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0x84fbA619fC0Ee580aEb55D797e0413254347C97E',
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
