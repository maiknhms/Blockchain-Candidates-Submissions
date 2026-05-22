import React from 'react';
import QRCode from 'qrcode.react';
import './ReceiveETH.css';

function ReceiveETH({ account }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    alert('Address copied to clipboard!');
  };

  const downloadQR = () => {
    const qrElement = document.getElementById('qr-code');
    const link = document.createElement('a');
    link.href = qrElement.toDataURL('image/png');
    link.download = `eth-wallet-${account.slice(0, 8)}.png`;
    link.click();
  };

  return (
    <div className="receive-container">
      <div className="receive-section">
        <h3>Share Your Address</h3>
        <p className="instruction">Send this address to others to receive ETH</p>

        <div className="qr-wrapper">
          <QRCode
            id="qr-code"
            value={account}
            size={200}
            level="H"
            includeMargin={true}
            renderAs="canvas"
          />
        </div>

        <div className="address-box">
          <code>{account}</code>
          <button className="copy-btn" onClick={copyToClipboard}>
            📋 Copy
          </button>
        </div>

        <button className="download-btn" onClick={downloadQR}>
          ⬇️ Download QR Code
        </button>
      </div>

      <div className="receive-info">
        <h4>How to Receive ETH:</h4>
        <ol>
          <li>Share your wallet address with the sender</li>
          <li>Or share the QR code for quick scanning</li>
          <li>Wait for the transaction to be confirmed</li>
          <li>Your balance will update automatically</li>
        </ol>
      </div>
    </div>
  );
}

export default ReceiveETH;
