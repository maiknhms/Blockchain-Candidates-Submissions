import React, { useState } from 'react';
import './SendETH.css';

function SendETH({ web3, account, onSuccess }) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const validateAddress = (address) => {
    return web3.utils.isAddress(address);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setTxHash('');

    // Validation
    if (!recipientAddress.trim()) {
      setError('Please enter a recipient address');
      return;
    }

    if (!validateAddress(recipientAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    if (recipientAddress.toLowerCase() === account.toLowerCase()) {
      setError('Cannot send to the same address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);

      // Convert amount to Wei
      const amountWei = web3.utils.toWei(amount, 'ether');

      // Create transaction
      const tx = {
        from: account,
        to: recipientAddress,
        value: amountWei,
        gas: 21000,
        gasPrice: await web3.eth.getGasPrice(),
      };

      // Send transaction
      const receipt = await web3.eth.sendTransaction(tx);
      setTxHash(receipt.transactionHash);
      
      // Reset form
      setRecipientAddress('');
      setAmount('');

      // Callback to refresh balance
      setTimeout(onSuccess, 2000);

      alert(`ETH sent successfully!\nTransaction: ${receipt.transactionHash}`);
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message || 'Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="send-form" onSubmit={handleSend}>
      <div className="form-group">
        <label>Recipient Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Amount (ETH)</label>
        <input
          type="number"
          step="0.0001"
          min="0"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {txHash && (
        <div className="success-message">
          <strong>Transaction sent!</strong>
          <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            View on Etherscan
          </a>
        </div>
      )}

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send ETH'}
      </button>
    </form>
  );
}

export default SendETH;
