import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate'
  });
  const { name, email, password, confirmPassword, role } = formData;
  const { register, error } = useContext(AuthContext);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError('');
    const registeredUser = await register(name, email, password, role);
    if (registeredUser) {
      if (registeredUser.role === 'recruiter') {
        navigate('/admin'); // Temporarily point to old admin dash until recruiter dash is built
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        {(error || localError) && (
          <div style={{ color: 'var(--accent-danger)', marginBottom: '1rem', textAlign: 'center' }}>
            {error || localError}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              className="input-field"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              className="input-field"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              type="password"
              className="input-field"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Create a password"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="role">Role (For testing)</label>
            <select
              className="input-field"
              id="role"
              name="role"
              value={role}
              onChange={onChange}
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="candidate" style={{ backgroundColor: 'rgba(15, 23, 42, 1)' }}>Job Seeker (Candidate)</option>
              <option value="recruiter" style={{ backgroundColor: 'rgba(15, 23, 42, 1)' }}>Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
