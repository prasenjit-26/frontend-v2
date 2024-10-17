// @ts-nocheck
import { reactive, Ref, ref } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';
import QUERY_KEYS from '@/constants/queryKeys';
import useNetwork from '../useNetwork';
// import { getApi } from '@/dependencies/balancer-api';
// import { GqlTokenPrice } from '@/services/api/graphql/generated/api-types';
import { oneMinInMs } from '../useTime';
// import { getAddress } from '@ethersproject/address';

/**
 * TYPES
 */
export type TokenPrices = { [address: string]: number };
type QueryResponse = TokenPrices;
type QueryOptions = UseQueryOptions<QueryResponse>;
/**
 * Fetches token prices for all provided addresses.
 */
export default function useTokenPricesQuery(
  pricesToInject: Ref<TokenPrices> = ref({}),
  options: QueryOptions = {}
) {
  const { networkId } = useNetwork();
  // const { activeTokenLists } = useTokenLists();
  const queryKey = reactive(
    QUERY_KEYS.Tokens.Prices(networkId, pricesToInject)
  );
  // function priceArrayToMap(prices: GqlTokenPrice[]): TokenPrices {
  //   return prices.reduce(
  //     (obj, item) => ((obj[getAddress(item.address)] = item.price), obj),
  //     {}
  //   );
  // }

  function injectCustomTokens(
    prices: TokenPrices,
    pricesToInject: TokenPrices,
    lineaTokenPrices: any
  ): TokenPrices {
    console.log('lineaTokenPrices', lineaTokenPrices);
    for (const address of Object.keys(pricesToInject)) {
      prices[address] = pricesToInject[address];
    }
    return { ...prices, ...lineaTokenPrices };
  }
  // const api = getApi();
  const queryFn = async () => {
    // const { prices } = await api.GetCurrentTokenPrices();
    // console.log('prices', prices);
    const fetchTokens = await fetch(
      'https://raw.githubusercontent.com/Chimp-Exchange/chimp-tokenlists/main/generated/balancer.tokenlist.json'
    );
    const tokensData = await fetchTokens.json();
    const filterLineaTokens = [];
    tokensData.tokens.forEach((token: any) => {
      if (token.chainId === 59144) {
        filterLineaTokens.push(token.address);
      }
    });
    const options = {
      method: 'GET',
      headers: { 'x-cg-demo-api-key': 'CG-NGC4psS5VnEsTQ9qsmTP1Qk8' },
    };
    const getTokenPrices = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/linea?contract_addresses=${filterLineaTokens.toString()}&vs_currencies=usd`,
      options
    );
    const pricesData = await getTokenPrices.json();
    console.log('pricesData', pricesData);
    let lineaTokenPrices = {};
    for (const property in pricesData) {
      lineaTokenPrices = {
        ...lineaTokenPrices,
        [property]: pricesData[property].usd,
      };
    }
    const lumiaTestnetTokenPrices = {
      '0xa4f6268f8f6ca4d9160c584338587b515aff7b88': 1,
      '0x286381aedd20e51f642fe4a200b5cb2fe3729695': 0.5,
      '0x8f60119e7b6d0691097232e8f25e19961623ad27': 1,
      '0x9140084f70c3df3ed0cf7a13c7617cc7a45c3e25': 1,
    };
    let pricesMap = {};
    pricesMap = injectCustomTokens(
      pricesMap,
      pricesToInject.value,
      lineaTokenPrices,
      lumiaTestnetTokenPrices
    );
    pricesMap = {
      ...lineaTokenPrices,
      ...pricesMap,
      ...lumiaTestnetTokenPrices,
    };
    return pricesMap;
  };

  const queryOptions = reactive({
    enabled: true,
    refetchInterval: oneMinInMs * 5,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    ...options,
  });

  return useQuery<QueryResponse>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
