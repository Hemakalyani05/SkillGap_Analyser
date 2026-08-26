import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';

const JobApplicants = () => {
  const { jobId } = useParams();
  const { api } = useContext(AuthContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/applications/job/${jobId}`);
        setApplicants(res.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [api, jobId]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplicants(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading ATS pipeline...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>Applicant Tracking System (ATS)</h1>
        <Link to="/admin" className="btn btn-outline" style={{ textDecoration: 'none' }}>Back to Dashboard</Link>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Candidates are automatically ranked by their AI Match Score based on their parsed resume and skills.
      </p>
      
      {applicants.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No applications received yet.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applicants.map((app, index) => (
            <div key={app._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)', width: '30px' }}>
                  #{index + 1}
                </div>
                {app.candidateId?.avatar && (
                  <img src={app.candidateId.avatar} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                )}
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{app.candidateId?.name || 'Unknown Candidate'}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {app.candidateId?.email} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>View Resume</a>
                    )}
                    <Link to="/messages" state={{ newChatUser: app.candidateId }} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none' }}>Message</Link>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: app.matchScore >= 80 ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                    {app.matchScore}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI Match</div>
                </div>

                <div>
                  <select 
                    className="input-field" 
                    value={app.status} 
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem', width: '150px' }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
