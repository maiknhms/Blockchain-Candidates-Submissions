import { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('0.01');
  const [recipient, setRecipient] = useState('');
  const [status, setStatus] = useState('Connect MetaMask to get started.');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const provider = window.ethereum;
      const instance = new Web3(provider);
      setWeb3(instance);

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', () => window.location.reload());

      return () => {
        provider.removeListener('accountsChanged', handleAccountsChanged);
      };
    } else {
      setStatus('MetaMask not detected. Please install MetaMask and refresh.');
    }
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setStatus('Please connect to MetaMask.');
      setAccount('');
      setBalance('0');
      return;
    }

    const selected = accounts[0];
    setAccount(selected);
    setStatus('Account connected.');
    await updateBalance(selected);
  };

  const updateBalance = async (address) => {
    if (!web3 || !address) {
      return;
    }
    try {
      const wei = await web3.eth.getBalance(address);
      const eth = web3.utils.fromWei(wei, 'ether');
      setBalance(parseFloat(eth).toFixed(6));
    } catch (error) {
      setStatus('Unable to read balance.');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('MetaMask not installed.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await handleAccountsChanged(accounts);
    } catch (error) {
      setStatus('Connection request rejected.');
    }
  };

  const sendEth = async (event) => {
    event.preventDefault();

    if (!web3) {
      setStatus('Web3 is not initialized.');
      return;
    }

    if (!recipient || !web3.utils.isAddress(recipient)) {
      setStatus('Enter a valid recipient address.');
      return;
    }

    if (!account) {
      setStatus('Connect your wallet first.');
      return;
    }

    try {
      setStatus('Submitting transaction...');
      const value = web3.utils.toWei(amount.toString(), 'ether');
      const tx = await web3.eth.sendTransaction({
        from: account,
        to: recipient,
        value,
      });
      setTxHash(tx.transactionHash);
      setStatus('Transaction successful.');
      await updateBalance(account);
    } catch (error) {
      setStatus(error.message || 'Transaction failed.');
    }
  };

  return (
    <div className="App">
      <div className="wallet-card">
        <h1>React ETH Wallet</h1>
        <p className="status">{status}</p>
        <div className="info-row">
          <label>Connected address</label>
          <div>{account || 'Not connected'}</div>
        </div>
        <div className="info-row">
          <label>Balance</label>
          <div>{balance} ETH</div>
        </div>

        <button className="primary-button" onClick={connectWallet}>
          {account ? 'Reconnect Wallet' : 'Connect MetaMask'}
        </button>

        <form className="transaction-form" onSubmit={sendEth}>
          <h2>Send ETH</h2>
          <label>
            Recipient address
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label>
            Amount (ETH)
            <input
              type="number"
              min="0"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <button type="submit" className="secondary-button">
            Send ETH
          </button>
        </form>

        {txHash && (
          <div className="tx-info">
            <strong>Last transaction</strong>
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
