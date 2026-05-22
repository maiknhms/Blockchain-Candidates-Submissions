import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { getNetworkByChainId } from '../constants/networks.js';
import {
  fetchChainId,
  getProvider,
  requestAccounts,
  switchOrAddChain,
} from '../lib/ethereum.js';
import { getErrorMessage } from '../utils/errors.js';

function createWeb3(provider) {
  return new Web3(provider);
}

export function useWeb3() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const provider = getProvider();
  const hasProvider = Boolean(provider);

  const refreshBalance = useCallback(async (instance, address) => {
    if (!instance || !address) return;
    const wei = await instance.eth.getBalance(address);
    setBalance(instance.utils.fromWei(wei, 'ether'));
  }, []);

  const connect = useCallback(async () => {
    setError(null);

    if (!provider) {
      setError('Install MetaMask (or another Web3 wallet) to continue.');
      return;
    }

    setLoading(true);
    try {
      const instance = createWeb3(provider);
      const accounts = await requestAccounts(provider);
      const address = accounts[0];
      const id = await fetchChainId(provider);

      setWeb3(instance);
      setAccount(address);
      setChainId(id);
      await refreshBalance(instance, address);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not connect wallet.'));
    } finally {
      setLoading(false);
    }
  }, [provider, refreshBalance]);

  const disconnect = useCallback(() => {
    setWeb3(null);
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setError(null);
  }, []);

  const switchNetwork = useCallback(
    async (targetChainId) => {
      if (!provider) {
        setError('Install MetaMask (or another Web3 wallet) to continue.');
        return;
      }

      if (chainId?.toLowerCase() === targetChainId.toLowerCase()) return;

      const network = getNetworkByChainId(targetChainId);
      if (!network) {
        setError('That network is not supported here.');
        return;
      }

      setError(null);
      setSwitchingNetwork(true);

      try {
        await switchOrAddChain(provider, targetChainId, network.addParams);
        const id = await fetchChainId(provider);
        setChainId(id);
        if (web3 && account) await refreshBalance(web3, account);
      } catch (err) {
        if (!err.cancelled) {
          setError(getErrorMessage(err, 'Could not switch network.'));
        }
      } finally {
        setSwitchingNetwork(false);
      }
    },
    [provider, chainId, web3, account, refreshBalance]
  );

  const sendEth = useCallback(
    async (to, amountEth) => {
      if (!web3 || !account) throw new Error('Connect a wallet first.');
      if (!Web3.utils.isAddress(to)) throw new Error('That address does not look valid.');

      const amount = Number(amountEth);
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Enter an amount greater than zero.');
      }

      const receipt = await web3.eth.sendTransaction({
        from: account,
        to,
        value: web3.utils.toWei(String(amountEth), 'ether'),
      });

      await refreshBalance(web3, account);
      return receipt;
    },
    [web3, account, refreshBalance]
  );

  useEffect(() => {
    if (!provider) return undefined;

    const onAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
        return;
      }
      if (web3) {
        setAccount(accounts[0]);
        refreshBalance(web3, accounts[0]);
      }
    };

    const onChainChanged = (id) => {
      setChainId(id);
      if (web3 && account) refreshBalance(web3, account);
    };

    provider.on('accountsChanged', onAccountsChanged);
    provider.on('chainChanged', onChainChanged);

    return () => {
      provider.removeListener('accountsChanged', onAccountsChanged);
      provider.removeListener('chainChanged', onChainChanged);
    };
  }, [provider, web3, account, disconnect, refreshBalance]);

  return {
    account,
    balance,
    chainId,
    error,
    loading,
    switchingNetwork,
    hasProvider,
    connect,
    disconnect,
    switchNetwork,
    sendEth,
  };
}
