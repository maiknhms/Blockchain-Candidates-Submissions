export const NETWORKS = [
  {
    chainId: '0x1',
    name: 'Ethereum Mainnet',
    addParams: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://ethereum-rpc.publicnode.com'],
      blockExplorerUrls: ['https://etherscan.io'],
    },
  },
  {
    chainId: '0xaa36a7',
    name: 'Sepolia',
    addParams: {
      chainId: '0xaa36a7',
      chainName: 'Sepolia',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://rpc.sepolia.org'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
  }
];

export function getNetworkByChainId(chainId) {
  return NETWORKS.find((n) => n.chainId.toLowerCase() === chainId?.toLowerCase());
}
