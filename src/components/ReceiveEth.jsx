import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js';

export default function ReceiveEth({ account }) {
  const { copied, copy } = useCopyToClipboard();

  if (!account) {
    return (
      <section className="panel panel--idle">
        <h2 className="panel__title">Receive</h2>
        <p className="panel__lead">Your deposit address appears after you connect.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2 className="panel__title">Receive</h2>
      <p className="panel__lead">
        Send ETH to this address from another wallet or exchange.
      </p>
      <div className="address-box">
        <code className="address-box__text">{account}</code>
      </div>
      <button
        type="button"
        className="btn btn--solid"
        onClick={() => copy(account)}
      >
        {copied ? 'Copied' : 'Copy address'}
      </button>
    </section>
  );
}
