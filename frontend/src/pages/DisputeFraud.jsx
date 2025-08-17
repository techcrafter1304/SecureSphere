import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../contexts/AuthContext';

const DisputeFraud = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [disputes, setDisputes] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
useEffect(() => {
  const fetchReports = async () => {
    try {
      const res = await axiosClient.get('/users/fraud-feed');
      const userEmail = user?.email?.trim().toLowerCase() || '';

      const myReports = res.data.filter(report =>
        report.fraudsterAccount &&
        userEmail &&
        report.fraudsterAccount.toLowerCase().includes(userEmail) &&
        report.status === 'under_review'
      );

      setReports(myReports);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error fetching reports');
    }
  };
  if (user?.email) fetchReports();
}, [user]);


  const handleChange = (id, message) => {
    setDisputes(prev => ({ ...prev, [id]: message }));
  };

  const handleSubmit = async (id) => {
    try {
      await axiosClient.post('/users/dispute-fraud', {
        fraudReportId: id,
        disputeMessage: disputes[id] || '',
      });
      setSuccess('Dispute submitted successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error submitting dispute');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Dispute Fraud Reports Against You</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {reports.length === 0 ? (
        <p>No fraud reports to dispute.</p>
      ) : (
        <ul>
          {reports.map(report => (
            <li key={report._id}>
              <strong>Reason:</strong> {report.reason}
              <br />
              <textarea
                placeholder="Enter your dispute message"
                value={disputes[report._id] || ''}
                onChange={e => handleChange(report._id, e.target.value)}
              />
              <br />
              <button onClick={() => handleSubmit(report._id)}>Submit Dispute</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisputeFraud;
