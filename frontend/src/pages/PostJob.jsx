import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const { api } = useContext(AuthContext);
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    experienceLevel: 'Junior',
    salaryRange: '',
    requiredSkills: []
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        setSkills(res.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };
    fetchSkills();
  }, [api]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skillId)
        ? prev.requiredSkills.filter(id => id !== skillId)
        : [...prev.requiredSkills, skillId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.requiredSkills.length === 0) {
      alert('Please select at least one required skill');
      return;
    }

    try {
      await api.post('/job-postings', formData);
      alert('Job posted successfully!');
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', color: 'var(--accent-primary)' }}>Post a New Job</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Job Title</label>
            <input type="text" className="input-field" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" />
          </div>
          
          <div className="input-group">
            <label className="input-label">Job Description</label>
            <textarea className="input-field" name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the role and responsibilities..." style={{ minHeight: '120px' }}></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Location</label>
              <input type="text" className="input-field" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, San Francisco, CA" />
            </div>
            
            <div className="input-group">
              <label className="input-label">Salary Range</label>
              <input type="text" className="input-field" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="e.g. $100k - $120k" />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Experience Level</label>
            <select className="input-field" name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" style={{ marginBottom: '1rem' }}>Required Skills</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '1rem' }}>
              {skills.map(skill => (
                <div 
                  key={skill._id}
                  onClick={() => handleSkillToggle(skill._id)}
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${formData.requiredSkills.includes(skill._id) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    backgroundColor: formData.requiredSkills.includes(skill._id) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                    transition: 'var(--transition)',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '2rem' }}>
            Publish Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
