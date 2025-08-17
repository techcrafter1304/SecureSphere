import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const FraudReport = () => {
  const [fraudsterAccount, setFraudsterAccount] = useState('');
  const [reason, setReason] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/users/mark-fraud', { fraudsterAccount, reason });
      setResult(res.data.msg);
      setError('');
      setFraudsterAccount('');
      setReason('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not report fraud');
      setResult('');
    }
  };

  return (
    <div>
      <h2>Report a Fraudulent Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Fraudster Email" 
          value={fraudsterAccount}
          onChange={e => setFraudsterAccount(e.target.value)}
          required 
        />
        <br />
        <textarea 
          rows="3" 
          placeholder="Reason for reporting"
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
        />
        <br />
        <button type="submit">Report Fraud</button>
      </form>
      {result && <p style={{ color: 'green' }}>{result}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FraudReport;
