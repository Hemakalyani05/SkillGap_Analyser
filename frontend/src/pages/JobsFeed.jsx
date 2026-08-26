import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

const JobsFeed = () => {
  const { api } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/job-postings'),
          api.get('/applications/my-applications').catch(() => ({ data: [] }))
        ]);
        setJobs(jobsRes.data);
        setMyApplications(appsRes.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [api]);

  const handleApply = async (jobId) => {
    setApplyingTo(jobId);
    try {
      await api.post(`/applications/${jobId}`);
      setMyApplications(prev => [...prev, { jobId: { _id: jobId } }]);
      alert('Successfully applied to job!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingTo(null);
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading job feed...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Recommended Jobs</h1>
      
      {jobs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No jobs posted yet.</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Check back later for new opportunities.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {jobs.map(job => (
            <div key={job._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> {job.location || 'Remote'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={16} /> {job.experienceLevel || 'Entry Level'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><DollarSign size={16} /> {job.salaryRange || 'Competitive'}</span>
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 'bold' }}>
                  AI Matched
                </div>
              </div>
              
              <p style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>{job.description}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Required Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {job.requiredSkills.map(skill => (
                    <span key={skill._id} className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>{skill.name}</span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <Link to={`/analysis/${job._id}`} className="btn btn-outline" style={{ textDecoration: 'none' }}>
                  Analyze Skill Gap
                </Link>
                {(() => {
                  const hasApplied = myApplications.some(app => app.jobId && app.jobId._id === job._id);
                  return (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleApply(job._id)}
                      disabled={hasApplied || applyingTo === job._id}
                    >
                      {hasApplied ? '✓ Applied' : (applyingTo === job._id ? 'Applying...' : 'One-Click Apply')}
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsFeed;
