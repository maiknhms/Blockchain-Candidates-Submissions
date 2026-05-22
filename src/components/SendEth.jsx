import { useState } from 'react';
import { getErrorMessage } from '../utils/errors.js';

export default function SendEth({ account, onSend }) {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);
    setSending(true);

    try {
      const receipt = await onSend(to.trim(), amount.trim());
      const hash = receipt.transactionHash;
      setFeedback({
        kind: 'ok',
        text: `Sent. Hash ${hash.slice(0, 10)}…${hash.slice(-6)}`,
      });
      setTo('');
      setAmount('');
    } catch (err) {
      setFeedback({
        kind: 'err',
        text: getErrorMessage(err, 'Transaction failed.'),
      });
    } finally {
      setSending(false);
    }
  }

  if (!account) {
    return (
      <section className="panel panel--idle">
        <h2 className="panel__title">Send</h2>
        <p className="panel__lead">Connect your wallet to transfer ETH.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2 className="panel__title">Send</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__label" htmlFor="send-to">
            To
          </label>
          <input
            id="send-to"
            className="input"
            type="text"
            placeholder="0x…"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="send-amount">
            Amount (ETH)
          </label>
          <input
            id="send-amount"
            className="input"
            type="number"
            placeholder="0.01"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn--solid" disabled={sending}>
          {sending ? 'Check your wallet…' : 'Send transfer'}
        </button>
      </form>
      {feedback && (
        <p className={`feedback feedback--${feedback.kind}`} role="status">
          {feedback.text}
        </p>
      )}
    </section>
  );
}
