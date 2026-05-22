export function getProvider() {
  return typeof window !== 'undefined' ? window.ethereum ?? null : null;
}

export async function fetchChainId(provider) {
  return provider.request({ method: 'eth_chainId' });
}

export async function requestAccounts(provider) {
  return provider.request({ method: 'eth_requestAccounts' });
}

export async function switchOrAddChain(provider, chainId, addParams) {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    if (error.code === 4902 && addParams) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [addParams],
      });
      return;
    }
    if (error.code === 4001) {
      throw Object.assign(new Error('Request cancelled.'), { cancelled: true });
    }
    throw error;
  }
}
