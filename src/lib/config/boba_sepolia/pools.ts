import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {},
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: false,
  DelegateOwner: '0xD19f62b5A721747A04b969C90062CBb85D4aAaA8',
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
    AllowList: [
      '0x90d8053f7e29faaf5189bdce796a516e29f1f5d3000000000000000000000000',
    ],
  },
  Factories: {
    '0x3Ba8Ac48A2ccf6Ba6eEB74b89190FDFBdDD817Fd': 'weightedPool', // Weighted v4
    '0xb3a3a2efebf72d94d731968b803a005614a38345': 'composableStablePool', // ComposableStable V4
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
};

export default pools;
