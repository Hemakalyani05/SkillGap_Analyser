import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Analysis = () => {
  const { jobId } = useParams();
  const { api, refreshUser } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/analysis/gap/${jobId}`);
        setData(res.data);
        if (refreshUser) {
          refreshUser();
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analysis', err);
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [api, jobId]);

  if (loading) return <div className="container" style={{paddingTop: '2rem'}}>Analyzing your skills...</div>;
  if (!data) return <div className="container" style={{paddingTop: '2rem'}}>Analysis data not found.</div>;

  const matchPercentage = Math.round(
    ((data.requiredSkills.length - data.missingSkills.length) / data.requiredSkills.length) * 100
  );

  // Helper function to extract YouTube Video ID
  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId = '';
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1>Analysis: {data.jobRole}</h1>
        <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {data.userSkills && data.userSkills.length === 0 && (
        <div className="glass-panel" style={{ marginBottom: '2rem', border: '1px solid var(--accent-warning)', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
          <h3 style={{ color: 'var(--accent-warning)', marginBottom: '0.5rem' }}>⚠️ Empty Skill Profile Detected</h3>
          <p style={{ marginBottom: '1rem' }}>
            We noticed you haven't added any skills to your profile yet! Because of this, your Match Score is currently 0%. 
            To get an accurate AI analysis, please upload your resume or manually select your skills.
          </p>
          <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go to Skill Profiling</Link>
        </div>
      )}

      {/* Overview Section */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Skill Match Progress */}
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '500' }}>Skill Match</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, marginBottom: '1rem' }}>
              {data.matchPercentage}%
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${data.matchPercentage}%`, height: '100%', backgroundColor: 'var(--accent-primary)', transition: 'width 1s ease-in-out' }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              You have {data.requiredSkills.length - data.missingSkills.length} out of {data.requiredSkills.length} required skills.
            </p>
          </div>
          
          {/* ATS Score Progress */}
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '500' }}>ATS Score</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, marginBottom: '1rem' }}>
              {data.atsScore}%
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${data.atsScore}%`, height: '100%', backgroundColor: 'var(--accent-success)', transition: 'width 1s ease-in-out' }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Estimated compatibility based on your entire skill profile.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Strength Areas */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--accent-success)', marginBottom: '1rem' }}>Strength Areas</h3>
          {data.requiredSkills.length - data.missingSkills.length === 0 ? (
            <p>You haven't acquired any of the required skills yet.</p>
          ) : (
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {data.requiredSkills.filter(rs => !data.missingSkills.find(ms => ms._id === rs._id)).map(skill => (
                <li key={skill._id} className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  ✓ {skill.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Missing Skills */}
        <div className="glass-panel">
          <h3 style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>Skill Gaps (Missing)</h3>
          {data.missingSkills.length === 0 ? (
            <p>Congratulations! You have all the required skills.</p>
          ) : (
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {data.missingSkills.map(skill => (
                <li key={skill._id} className="badge badge-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  ✕ {skill.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Learning Roadmap Section */}
      {data.missingSkills.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Learning Priority Roadmap</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Follow this sequence to fill your skill gap most effectively.</p>
          <div style={{ position: 'relative', margin: '0 auto', maxWidth: '800px', padding: '2rem 0' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '100%', backgroundColor: 'var(--border-color)', top: 0, zIndex: 0 }}></div>
            
            {data.missingSkills.map((skill, index) => (
              <div key={skill._id} style={{ 
                display: 'flex', 
                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                position: 'relative',
                marginBottom: '2rem',
                width: '100%',
                zIndex: 1
              }}>
                {/* Node on the line */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '20px',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  border: '4px solid var(--bg-primary)'
                }}></div>
                
                {/* Content Box */}
                <div className="glass-panel" style={{ 
                  width: 'calc(50% - 30px)', 
                  padding: '1.5rem',
                  position: 'relative'
                }}>
                  <h3 style={{ margin: 0, color: 'var(--accent-warning)' }}>Step {index + 1}: {skill.name}</h3>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Master {skill.name} to close this skill gap.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {data.missingSkills.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Recommended Learning Resources</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {data.recommendations.map(rec => {
              const isYouTube = rec.type === 'Video' && getYouTubeEmbedUrl(rec.resourceLink);
              const embedUrl = isYouTube ? getYouTubeEmbedUrl(rec.resourceLink) : null;
              
              return (
                <div key={rec._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--text-primary)', margin: 0, paddingRight: '1rem' }}>{rec.resourceTitle}</h4>
                    <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-primary)', flexShrink: 0 }}>
                      {rec.type}
                    </span>
                  </div>
                  
                  {embedUrl ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                      <iframe 
                        src={embedUrl} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        title={rec.resourceTitle}
                      ></iframe>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
                      Learn this required skill to close your gap for this role.
                    </p>
                  )}
                  
                  <a 
                    href={rec.resourceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none', textAlign: 'center', marginTop: 'auto' }}
                  >
                    Open Resource →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Recommended Alternative Jobs Section */}
      {data.recommendedJobs && data.recommendedJobs.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-success)' }}>✨</span> Alternative Career Paths
          </h2>
          <p style={{ marginBottom: '2rem' }}>Based on your skills, you might also be a great fit for these roles:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {data.recommendedJobs.map(job => (
              <Link 
                key={job._id}
                to={`/analysis/${job._id}`}
                className="glass-panel"
                style={{ display: 'block', textDecoration: 'none', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-5px)' } }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>{job.roleName}</h4>
                  <span className="badge badge-success" style={{ flexShrink: 0 }}>
                    {job.matchPercentage}% Match
                  </span>
                </div>
                <div style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: '500', marginTop: '1rem' }}>
                  View Analysis →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
