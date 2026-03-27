import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { analyzeExpenses } from '../services/aiService';
import { FiCpu } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ApiKeyPrompt from '../components/ApiKeyPrompt';
import ReactMarkdown from 'react-markdown';

const AIAnalyzer = () => {
  const { transactions, budget } = useFinance();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setReport(null);
    try {
      const result = await analyzeExpenses(transactions, budget);
      setReport(result);
    } catch (err) {
      console.error(err);
      if (err.message === 'API_KEY_MISSING') toast.error('You need to provide your Gemini API key first!');
      else toast.error('Failed to communicate with AI API.');
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-page" style={{ height: 'calc(100vh - 40px)', overflowY: 'auto', paddingBottom: '3rem' }}>
      <header className="page-header">
        <h1>AI Expense Analyzer</h1>
        <p className="text-muted">Deep dive analysis of your spending habits and trajectory.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <ApiKeyPrompt />
        
        {!report && (
          <section className="card interactive-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 1rem' }}>
            <FiCpu style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem', animation: loading ? 'pulse 1.5s infinite' : 'none' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>{loading ? 'Synthesizing...' : 'Run Deep Analysis'}</h2>
            <p className="text-muted" style={{ maxWidth: '400px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {loading ? 'Securely routing portfolio context to models. This will take a few seconds...' : 'The AI logic will securely scan your transactions over the last 90 days to identify hidden leaks, recurring subscription waste, and overall trajectory.'}
            </p>
            {!loading && (
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading} style={{ padding: '0.75rem 2rem' }}>
                Start Audit
              </button>
            )}
          </section>
        )}

        {report && (
          <section className="card form-section" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Intelligence Report</h3>
              <button onClick={handleAnalyze} disabled={loading} style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                {loading ? 'Re-Auditing...' : 'Run New Audit'}
              </button>
            </div>
            <div className="markdown-body" style={{ color: 'var(--text-color)', lineHeight: '1.6', fontSize: '0.95rem', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AIAnalyzer;
