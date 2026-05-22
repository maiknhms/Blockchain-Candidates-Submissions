import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import './App.css';
import SendETH from './components/SendETH';
import ReceiveETH from './components/ReceiveETH';
import WalletInfo from './components/WalletInfo';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      setLoading(true);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setConnected(true);
        
        // Get balance
        const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
        const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
        setBalance(balanceEth);

        // Listen to account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });

        // Listen to chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setConnected(false);
    setBalance('0');
    setActiveTab('info');
  };

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (web3 && account) {
      try {
        const balanceWei = await web3.eth.getBalance(account);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        setBalance(balanceEth);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  }, [web3, account]);

  useEffect(() => {
    if (connected && account) {
      const interval = setInterval(refreshBalance, 15000); // Refresh every 15 seconds
      return () => clearInterval(interval);
    }
  }, [connected, account, web3, refreshBalance]);

  return (
    <div className="app-container">
      <div className="wallet-card">
        <h1 className="title">ETH Wallet</h1>
        
        {!connected ? (
          <button 
            className="connect-button" 
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect MetaMask Wallet'}
          </button>
        ) : (
          <>
            <WalletInfo 
              account={account}
              balance={balance}
              refreshBalance={refreshBalance}
            />

            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Wallet Info
              </button>
              <button 
                className={`tab ${activeTab === 'send' ? 'active' : ''}`}
                onClick={() => setActiveTab('send')}
              >
                Send ETH
              </button>
              <button 
                className={`tab ${activeTab === 'receive' ? 'active' : ''}`}
                onClick={() => setActiveTab('receive')}
              >
                Receive ETH
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'info' && (
                <div className="info-section">
                  <p>Connected wallet: <code>{account}</code></p>
                  <p>Balance: <strong>{parseFloat(balance).toFixed(4)} ETH</strong></p>
                </div>
              )}
              {activeTab === 'send' && (
                <SendETH web3={web3} account={account} onSuccess={refreshBalance} />
              )}
              {activeTab === 'receive' && (
                <ReceiveETH account={account} />
              )}
            </div>

            <button 
              className="disconnect-button"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
