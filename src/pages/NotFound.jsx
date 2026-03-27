import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', gap: '1.5rem', textAlign: 'center', padding: '2rem'
  }}>
    <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>404</h1>
    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-color)' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/dashboard" className="btn btn-primary">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
