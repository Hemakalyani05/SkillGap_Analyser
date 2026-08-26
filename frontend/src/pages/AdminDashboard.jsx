import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PieChart, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { api, user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Legacy item states
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', category: '' });

  const fetchData = async () => {
    try {
      const [statsRes, skillsRes, jobsRes] = await Promise.all([
        api.get('/job-postings/analytics/stats'),
        api.get('/skills'),
        api.get('/job-postings/my-postings')
      ]);
      setStats(statsRes.data);
      setSkills(skillsRes.data);
      setMyJobs(jobsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skills', newSkill);
      setNewSkill({ name: '', category: '' });
      fetchData();
      alert('Skill added successfully');
    } catch (err) {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  if (!user || user.role !== 'recruiter') {
    return <div className="container" style={{paddingTop: '2rem'}}>Access Denied. Recruiters only.</div>;
  }

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading ATS Analytics...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Recruiter Dashboard</h1>
        <Link to="/post-job" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          + Post New Job
        </Link>
      </div>
      
      {/* Analytics KPI Cards */}
      <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Hiring Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <Briefcase style={{ color: 'var(--accent-primary)' }} size={32} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalPostings || 0}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Job Postings</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <Users style={{ color: 'var(--accent-success)' }} size={32} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalApplications || 0}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Applications Received</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <PieChart style={{ color: '#a855f7' }} size={32} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.conversionRate || 0}%</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Conversion Rate (Hired)</div>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <Clock style={{ color: '#f59e0b' }} size={32} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.timeToHire || 0}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Avg. Time to Hire (Days)</div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Active Job Postings */}
        <div className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem' }}>My Job Postings</h2>
          {myJobs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You haven't posted any jobs yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myJobs.map(job => (
                <div key={job._id} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.25rem', fontSize: '1.2rem' }}>{job.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        {job.location} • {job.experienceLevel} • {job.salaryRange}
                      </p>
                    </div>
                    <div className="badge badge-primary">{job.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to={`/job-applicants/${job._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                      View Pipeline
                    </Link>
                    {/* Optionally add Delete button here */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Skills - Legacy but useful for defining job reqs */}
        <div className="glass-panel">
          <h2>Manage Database Skills</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Add new system-wide skills to tag in your job postings.</p>
          <form onSubmit={handleAddSkill} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <input 
                type="text" 
                placeholder="Skill Name" 
                className="input-field"
                value={newSkill.name}
                onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                required 
              />
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <input 
                type="text" 
                placeholder="Category (e.g., Frontend)" 
                className="input-field"
                value={newSkill.category}
                onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Skill</button>
          </form>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {skills.map(s => (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <span>{s.name} <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>({s.category})</span></span>
                <button onClick={() => handleDeleteSkill(s._id)} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
