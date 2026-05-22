export function shortenAddress(address, head = 6, tail = 4) {
  if (!address) return '';
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

export function formatEthBalance(balance) {
  if (balance === null || balance === undefined) return null;
  return `${Number(balance).toFixed(4)} ETH`;
}
