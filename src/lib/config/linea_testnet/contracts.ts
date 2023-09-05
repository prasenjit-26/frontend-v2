import { Contracts } from '../types';
import * as lineaTestnet from '@/assets/data/contracts/linea_testnet.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  authorizer: lineaTestnet.Authorizer,
  vault: lineaTestnet.Vault,
  weightedPoolFactory: lineaTestnet.WeightedPoolFactory,
  stablePoolFactory: lineaTestnet.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: lineaTestnet.BalancerHelpers,
  batchRelayer: lineaTestnet.BalancerRelayer,
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
