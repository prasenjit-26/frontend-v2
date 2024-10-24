import { initSafeConnector } from './safe';
import { initMetamaskConnector } from './metamask';
import { initFoxWalletConnector } from './foxwallet';
import { initTallyConnector } from './tally';
import { initWalletconnectConnector } from './walletconnect';
import { initWalletLinkConnector } from './walletlink';
import { initEchoooEthConnector } from './echoooEth';

export function initWalletConnectors() {
  initWalletconnectConnector();
  initMetamaskConnector();
  initSafeConnector();
  initWalletLinkConnector();
  initTallyConnector();
  initFoxWalletConnector();
  initEchoooEthConnector();
}
