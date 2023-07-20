import { Contracts } from '../types';
import * as mantle from '@/assets/data/contracts/mantle.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0x6776103E6614E128Be36eC8A8Bb3a0c12c6bbEdc',
  authorizer: mantle.Authorizer,
  vault: mantle.Vault,
  weightedPoolFactory: mantle.WeightedPoolFactory,
  stablePoolFactory: mantle.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: mantle.BalancerHelpers,
  batchRelayer: mantle.BalancerRelayer,
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
