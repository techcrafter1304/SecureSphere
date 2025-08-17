import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to SecureSphere</h1>
<nav>
  <Link to="/friends">Manage Friends</Link> |{' '}
  <Link to="/report-fraud">Report Fraud</Link> |{' '}
  <Link to="/fraud-feed">Fraud Feed</Link> |{' '}
  <Link to="/dispute-fraud">Dispute Fraud</Link>
</nav>


    </div>
  );
};

export default Dashboard;
