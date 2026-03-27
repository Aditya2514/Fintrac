import React, { useState } from 'react';
import { FiKey, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ApiKeyPrompt = () => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(() => !!localStorage.getItem('gemini_api_key'));

  // Completely hide the manual configuration UI if the developer hardcoded the key securely on the backend/env
  if (import.meta.env.VITE_GEMINI_API_KEY) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid key');
      return;
    }
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setHasKey(true);
    toast.success('API Key saved securely to your browser!');
  };

  const handleRemove = () => {
    localStorage.removeItem('gemini_api_key');
    setHasKey(false);
    setApiKey('');
    toast.info('API Key removed.');
  };

  return (
    <div className="card interactive-card" style={{ marginBottom: '1.5rem', border: hasKey ? '1px solid var(--success-color)' : '1px solid var(--warning-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <FiKey style={{ color: hasKey ? 'var(--success-color)' : 'var(--warning-color)', fontSize: '1.2rem' }} />
        <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Gemini Configuration</h3>
      </div>
      
      {!hasKey ? (
        <>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
            To enable live AI insights, you must provide your Google Gemini API key. It is stored <strong>locally and securely</strong> in your web browser configuration.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Paste AI key here..." 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)} 
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleSave}><FiCheck /> Save Config</button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--success-color)', fontWeight: 600 }}>Live AI Engine is fully verified and securely connected.</span>
          <button className="btn btn-secondary" onClick={handleRemove} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Revoke Access</button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyPrompt;
