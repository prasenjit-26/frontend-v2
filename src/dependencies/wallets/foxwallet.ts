import { FoxWalletConnector } from '@/services/web3/connectors/foxwallet/foxwallet.connector';
import { handleDependencyError } from '..';

let _foxWalletConnector;

/**
 * Uses the real metamask connector instance by default but allows injecting metamask connector mocks from tests
 */
export async function initFoxWalletConnector() {
  if (!_foxWalletConnector) {
    // Lazy load dependency to reduce initial bundle size
    const { FoxWalletConnector } = await import(
      '@/services/web3/connectors/foxwallet/foxwallet.connector'
    );
    _foxWalletConnector = FoxWalletConnector;
  }
}

export async function initFoxWalletConnectorForTesting(foxWalletkConnector) {
  _foxWalletConnector = foxWalletkConnector;
}

export function getFoxWalletConnector(): FoxWalletConnector {
  if (!_foxWalletConnector) {
    handleDependencyError('FoxWalletConnector');
  }
  return _foxWalletConnector;
}
