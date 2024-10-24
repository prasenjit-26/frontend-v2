import { EchoooEthConnector } from '@/services/web3/connectors/echooo/echooo.connector';
import { handleDependencyError } from '..';

let _echoooEthConnector;

/**
 * Uses the real metamask connector instance by default but allows injecting metamask connector mocks from tests
 */
export async function initEchoooEthConnector() {
  if (!_echoooEthConnector) {
    // Lazy load dependency to reduce initial bundle size
    const { EchoooEthConnector } = await import(
      '@/services/web3/connectors/echooo/echooo.connector'
    );
    _echoooEthConnector = EchoooEthConnector;
  }
}

export async function initEchoooEthConnectorForTesting(echoooEthConnector) {
  _echoooEthConnector = echoooEthConnector;
}

export function getEchoooEthConnector(): EchoooEthConnector {
  if (!_echoooEthConnector) {
    handleDependencyError('EchoooEthConnector');
  }
  return _echoooEthConnector;
}
