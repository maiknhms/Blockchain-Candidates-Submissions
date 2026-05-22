import React from 'react';
import './WalletInfo.css';

function WalletInfo({ account, balance, refreshBalance }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    alert('Address copied to clipboard!');
  };

  return (
    <div className="wallet-info">
      <div className="info-card">
        <h3>Wallet Address</h3>
        <div className="address-display">
          <code>{account}</code>
          <button className="copy-btn" onClick={copyToClipboard} title="Copy address">
            📋
          </button>
        </div>
      </div>

      <div className="info-card">
        <h3>Balance</h3>
        <div className="balance-display">
          <span className="balance-value">{parseFloat(balance).toFixed(4)}</span>
          <span className="balance-unit">ETH</span>
        </div>
        <button className="refresh-btn" onClick={refreshBalance}>
          🔄 Refresh Balance
        </button>
      </div>
    </div>
  );
}

export default WalletInfo;
