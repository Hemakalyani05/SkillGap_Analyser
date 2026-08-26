import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  // Use local state for form, initialize with user data if available
  const [theme, setTheme] = useState(user?.theme || 'dark');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setTheme(user.theme || 'dark');
      setAvatar(user.avatar || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');
    }
  }, [user]);

  // Classic pokemon IDs for sprites
  const pokemonIds = [25, 1, 4, 7, 133, 150, 143, 94, 6, 9];
  
  // Combine pokemon sprites with our custom cartoon avatars
  const allAvatars = [
    ...pokemonIds.map(id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`),
    '/avatars/avatar_doraemon_1776948686065.png',
    '/avatars/avatar_ben10_1776948716509.png',
    '/avatars/avatar_shinchan_1776948776895.png'
  ];
  
  const themes = [
    { id: 'dark', name: 'Dark Mode (Default)' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'nature', name: 'Nature' },
    { id: 'light', name: 'Light Mode' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateProfile(avatar, theme);
    if (success) {
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to update profile.');
    }
    setIsSaving(false);
  };

  const chartData = useMemo(() => {
    if (!user || !user.history) return [];
    // Take the last 10 records and sort by date ascending for the chart
    return user.history.slice(-10).map((record, index) => ({
      name: `Analysis ${index + 1}`,
      job: record.jobRole,
      match: record.matchPercentage,
      date: new Date(record.date).toLocaleDateString()
    }));
  }, [user]);

  if (!user) return <div className="container" style={{paddingTop: '2rem'}}>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Profile Settings</h1>
      
      {message && (
        <div style={{ padding: '1rem', marginBottom: '2rem', borderRadius: 'var(--radius-md)', backgroundColor: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
          {message}
        </div>
      )}

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={avatar} alt="Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', objectFit: 'cover' }} />
          <span>{user.name}'s Profile</span>
        </h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Email Address</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.email}</p>
        </div>
      </div>

      {user.history && user.history.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Analysis History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user.history.slice(-5).reverse().map((record, index) => (
              <div key={index} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{record.jobRole}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString()}
                  </span>
                </div>
                <div className="badge badge-success" style={{ fontSize: '1rem' }}>
                  {record.matchPercentage}% Match
                </div>
              </div>
            ))}
          </div>

          {chartData.length > 1 && (
            <div style={{ marginTop: '2rem', height: '300px', width: '100%' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Skill Match Progression</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--glass-border)' }}
                    itemStyle={{ color: 'var(--accent-primary)' }}
                    labelStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Line type="monotone" dataKey="match" name="Match %" stroke="var(--accent-primary)" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Choose Your Avatar</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {allAvatars.map((spriteUrl, index) => {
            return (
              <img 
                key={index}
                src={spriteUrl} 
                alt={`Avatar ${index}`}
                onClick={() => setAvatar(spriteUrl)}
                style={{
                  width: '80px',
                  height: '80px',
                  cursor: 'pointer',
                  objectFit: 'cover',
                  backgroundColor: avatar === spriteUrl ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: avatar === spriteUrl ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)'
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Select Application Theme</h3>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Changes to the theme will preview instantly, but you must click Save to keep them.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {themes.map(t => (
            <div 
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                document.documentElement.setAttribute('data-theme', t.id); // Live preview
              }}
              style={{
                padding: '1rem',
                cursor: 'pointer',
                backgroundColor: theme === t.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                border: theme === t.id ? '2px solid var(--accent-primary)' : '2px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                transition: 'var(--transition)',
                fontWeight: '500'
              }}
            >
              {t.name}
            </div>
          ))}
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving Changes...' : 'Save Profile Settings'}
      </button>

    </div>
  );
};

export default Profile;
