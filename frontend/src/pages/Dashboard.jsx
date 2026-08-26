import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, jobsRes, appsRes] = await Promise.all([
          api.get('/skills'),
          api.get('/jobs'),
          api.get('/applications/my-applications').catch(() => ({ data: [] }))
        ]);
        setSkills(skillsRes.data);
        setJobs(jobsRes.data);
        setApplications(appsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleAnalyze = async () => {
    if (!selectedJob) {
      alert('Please select a target job role');
      return;
    }
    
    try {
      // Save user skills
      await api.post('/analysis/user-skills', { skills: selectedSkills });
      
      // Navigate to analysis page
      navigate(`/analysis/${selectedJob}`);
    } catch (err) {
      console.error('Error analyzing skills', err);
      alert('An error occurred during analysis');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    
    setIsUploading(true);
    try {
      const res = await api.post('/analysis/parse-resume', formData);
      
      if (res.data.extractedSkillIds && res.data.extractedSkillIds.length > 0) {
        setSelectedSkills(res.data.extractedSkillIds);
        alert(`Successfully extracted ${res.data.extractedSkillIds.length} skills from your resume! Please review them below.`);
      } else {
        alert('We could not find any matching skills in your resume. Please select them manually.');
      }
    } catch (err) {
      console.error('Error uploading resume', err);
      alert(err.response?.data?.message || 'Failed to parse resume. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = null;
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Loading...</div>;

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
    skill.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Candidate Dashboard</h1>
      
      {/* Candidate KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>{applications.length}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Applications Sent</div>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a855f7' }}>
            {applications.filter(a => a.status === 'Interview').length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Pending Interviews</div>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>+12%</div>
          <div style={{ color: 'var(--text-secondary)' }}>Weekly Match Growth</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-6" style={{ md: { flexDirection: 'row'} }}>
        {/* Skills Selection */}
        <div className="glass-panel" style={{ flex: 2 }}>
          <h2>1. What skills do you currently have?</h2>
          <p>Upload your resume or select technologies manually.</p>
          
          <div style={{ padding: '1.5rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', margin: '1.5rem 0', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>📄 Upload Resume (PDF)</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Auto-extract skills using AI</span>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
                disabled={isUploading}
              />
            </label>
            {isUploading && <div style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>Parsing resume with NLP...</div>}
          </div>

          <div className="input-group" style={{ marginTop: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search skills (e.g. React, Cloud)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
            {filteredSkills.map(skill => (
              <div 
                key={skill._id}
                onClick={() => toggleSkill(skill._id)}
                style={{
                  padding: '1rem',
                  border: `1px solid ${selectedSkills.includes(skill._id) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: selectedSkills.includes(skill._id) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                  transition: 'var(--transition)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: '500' }}>{skill.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{skill.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Role Selection */}
        <div className="glass-panel" style={{ flex: 1 }}>
          <h2>2. Choose Target Role</h2>
          <p>Select the job role you are aiming for.</p>
          
          <div className="input-group" style={{ marginTop: '1.5rem' }}>
            <select 
              className="input-field"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="" style={{ backgroundColor: 'rgba(15, 23, 42, 1)' }}>-- Select Job Role --</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id} style={{ backgroundColor: 'rgba(15, 23, 42, 1)' }}>{job.roleName}</option>
              ))}
            </select>
          </div>
          
          {selectedJob && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Role Description</h4>
              <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                {jobs.find(j => j._id === selectedJob)?.description}
              </p>
            </div>
          )}

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1rem' }}
            onClick={handleAnalyze}
            disabled={!selectedJob}
          >
            Analyze Skill Gap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
