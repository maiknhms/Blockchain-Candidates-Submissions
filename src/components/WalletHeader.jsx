import { NETWORKS, getNetworkByChainId } from '../constants/networks.js';
import { formatEthBalance, shortenAddress } from '../utils/format.js';

export default function WalletHeader({
  account,
  balance,
  chainId,
  hasProvider,
  loading,
  switchingNetwork,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
}) {
  return (
    <header className="site-header">
      <a className="logo" href="/">
        Wallet
      </a>

      {!account ? (
        <div className="header-connect">
          {!hasProvider && (
            <p className="header-note">You need a browser wallet such as MetaMask.</p>
          )}
          <button
            type="button"
            className="btn btn--solid"
            onClick={onConnect}
            disabled={!hasProvider || loading}
          >
            {loading ? 'Connecting…' : 'Connect'}
          </button>
        </div>
      ) : (
        <div className="toolbar">
          <div className="toolbar__group">
            <p className="toolbar__label">Balance</p>
            <p className="toolbar__balance">{formatEthBalance(balance) ?? '—'}</p>
            <p className="toolbar__address" title={account}>
              {shortenAddress(account)}
            </p>
          </div>

          <div className="toolbar__rule" aria-hidden="true" />

          <div className="toolbar__group toolbar__group--network">
            <label className="toolbar__label" htmlFor="network-select">
              Network
            </label>
            <select
              id="network-select"
              className="select"
              value={chainId || NETWORKS[0].chainId}
              onChange={(e) => onSwitchNetwork(e.target.value)}
              disabled={switchingNetwork}
            >
              {chainId && !getNetworkByChainId(chainId) && (
                <option value={chainId}>Unknown chain</option>
              )}
              {NETWORKS.map((network) => (
                <option key={network.chainId} value={network.chainId}>
                  {network.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn--quiet"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
        </div>
      )}
    </header>
  );
}
