import React from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Briefcase, FileText, CheckCircle, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingTop: '4rem' }}>
      {/* Hero Section */}
      <section style={{ 
        backgroundColor: '#2563eb', // Deep red hero matching ResQ image
        color: 'white',
        padding: '6rem 1rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            padding: '0.25rem 1rem', 
            borderRadius: '999px',
            marginBottom: '2rem',
            fontSize: '0.875rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span>
            AI-Powered Career Growth Network
          </div>
          
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Your dream job is <br /> within reach.
          </h1>
          
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Connect with your career goals instantly. SkillGap uses advanced AI to analyze your resume, identify missing skills, and build your personalized learning roadmap.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '1rem 2rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s'
            }}>
              Get Started
            </Link>
            <a href="#how-it-works" style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '500',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'background-color 0.2s'
            }}>
              How it Works
            </a>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" style={{ padding: '6rem 1rem', backgroundColor: '#f8fafc', color: '#0f172a' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>How SkillGap Works</h2>
            <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Three simple steps to career acceleration. Designed for precision when every skill counts.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Card 1 */}
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <FileText style={{ color: '#2563eb' }} size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Upload Resume</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                Upload your PDF resume with one tap. Our NLP engine instantly extracts your current skills and experience.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Target style={{ color: '#4f46e5' }} size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>AI Gap Analysis</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                Select your target job role. We compare your extracted skills against live industry requirements to find your gaps.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <TrendingUp style={{ color: '#16a34a' }} size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Personalized Roadmap</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                Receive a step-by-step learning priority sequence and course recommendations to become job-ready fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#0f172a', padding: '6rem 1rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          right: '-5%',
          bottom: '-20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Briefcase size={200} color="#dc2626" opacity={0.8} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Need Job Recommendations?</h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.6 }}>
              Find roles that perfectly match your current strength areas instantly. Every skill counts in a competitive market.
            </p>
            <Link to="/login" style={{
              color: '#dc2626',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.1rem'
            }}>
              Start Profiling <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
