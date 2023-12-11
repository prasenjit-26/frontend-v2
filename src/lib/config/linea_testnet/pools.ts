import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    veBAL: '0xec401733428706811dc419134a72905c30c19a0800020000000000000000002b',
  },
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: false,
  DelegateOwner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [''],
  IncludedPoolTypes: [
    'Weighted',
    'Stable',
    'MetaStable',
    'LiquidityBootstrapping',
    'Investment',
    'StablePhantom',
    'ComposableStable',
  ],
  Stable: {
    AllowList: [],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [],
  },
  Factories: {
    '0xCd86BDde8b9B348e03555A344751dC18E534d6bC': 'weightedPool', // Weighted v4
    '0x93dB1be491457046da6Bb700801B4FE70Ad65DE5': 'composableStablePool', // ComposableStable V4
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
  Deep: [],
  Deprecated: {},
  GaugeMigration: {},
  BoostedApr: [],
  DisabledJoins: [],
  Risks: {},
  Farms: ['0xb04584cb66edce8ebd829831f4e8a211c009ef88000200000000000000000005'],
  Reliquery: {
    '0xb04584cb66edce8ebd829831f4e8a211c009ef88000200000000000000000005': {
      pid: '0',
    },
  },
};

export default pools;
