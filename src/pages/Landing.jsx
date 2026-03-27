import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo">FinTrack</div>
        <nav>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </nav>
      </header>
      
      <main className="hero-section">
        <div className="hero-content">
          <h1>Take Control of Your Finances Today</h1>
          <p className="subtext">
            Track expenses, manage budgets, and visualize your financial health with our intuitive, production-grade analytics platform.
          </p>
          <div className="cta-group">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Get Started <FiArrowRight />
            </Link>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="feature-card interactive-card">
          <FiPieChart className="feature-icon" />
          <h3>Smart Analytics</h3>
          <p>Beautiful charts that adapt to your theme, giving you a clear picture of your spending habits.</p>
        </div>
        <div className="feature-card interactive-card">
          <FiTrendingUp className="feature-icon" />
          <h3>Budget Tracking</h3>
          <p>Set monthly boundaries and monitor your progress with color-coded health indicators.</p>
        </div>
        <div className="feature-card interactive-card">
          <FiShield className="feature-icon" />
          <h3>Secure & Private</h3>
          <p>Your data stays local. We leverage local storage persistence so nothing leaves your device.</p>
        </div>
      </section>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} FinTrack. Designed for clarity.</p>
      </footer>
    </div>
  );
};

export default Landing;
