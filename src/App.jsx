import WalletHeader from './components/WalletHeader.jsx';
import SendEth from './components/SendEth.jsx';
import ReceiveEth from './components/ReceiveEth.jsx';
import { useWeb3 } from './hooks/useWeb3.js';

export default function App() {
  const wallet = useWeb3();

  return (
    <div className="layout">
      <WalletHeader
        account={wallet.account}
        balance={wallet.balance}
        chainId={wallet.chainId}
        hasProvider={wallet.hasProvider}
        loading={wallet.loading}
        switchingNetwork={wallet.switchingNetwork}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
        onSwitchNetwork={wallet.switchNetwork}
      />

      {wallet.error && (
        <p className="alert" role="alert">
          {wallet.error}
        </p>
      )}

      <main className="layout__main">
        <SendEth account={wallet.account} onSend={wallet.sendEth} />
        <ReceiveEth account={wallet.account} />
      </main>
    </div>
  );
}
