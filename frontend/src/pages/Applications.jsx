import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Applications = () => {
  const { api } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [api]);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Applied': return 'badge-primary';
      case 'Shortlisted': return 'badge-success';
      case 'Interview': return 'badge-warning';
      case 'Rejected': return 'badge-danger';
      case 'Hired': return 'badge-success';
      default: return 'badge-primary';
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading applications...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>My Applications</h1>
      
      {applications.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>You haven't applied to any jobs yet.</h3>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map(app => (
            <div key={app._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{app.jobId?.title || 'Unknown Job'}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
                <div style={{ marginTop: '0.5rem', color: 'var(--accent-success)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  AI Match Score: {app.matchScore}%
                </div>
              </div>
              <div>
                <span className={`badge ${getStatusBadgeClass(app.status)}`} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
