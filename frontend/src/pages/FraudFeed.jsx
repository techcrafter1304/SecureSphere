import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const FraudFeed = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFraudFeed = async () => {
      try {
        const res = await axiosClient.get('/users/fraud-feed');
        setReports(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching fraud feed');
      }
    };
    fetchFraudFeed();
  }, []);
  return (
    <div>
      <h2>Fraud Reports in Your Network</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reports.length === 0 ? (
        <p>No fraud reports found in your network.</p>
      ) : (
        <ul>
          {reports.map(report => (
            <li key={report._id}>
              <strong>Fraudster:</strong> {report.fraudsterAccount}<br />
              <strong>Reason:</strong> {report.reason}<br />
              <strong>Reported By:</strong> {report.reportedBy?.email || report.reportedBy}<br />
              <strong>Status:</strong> {report.status}<br />
              {report.status === 'under_review' && (
                <span>(You may be able to dispute this if it’s about your account)</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FraudFeed;
