import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../hooks/useFinance';
import { chatWithAdvisor } from '../services/aiService';
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ApiKeyPrompt from '../components/ApiKeyPrompt';
import ReactMarkdown from 'react-markdown';

const STORAGE_KEY = 'fintrack-chat-history';
const DEFAULT_MSG = [{ role: 'model', content: "Hello! I am your AI Financial Advisor. I have direct access to your live balance, income categories, expenses, and budget limits. What would you like to discuss today?" }];

const AIAdvisor = () => {
  const { transactions, budget } = useFinance();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_MSG;
    } catch { return DEFAULT_MSG; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const reply = await chatWithAdvisor(newHistory, transactions, budget);
      const updated = [...newHistory, { role: 'model', content: reply }];
      setMessages(updated);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
      if (err.message === 'API_KEY_MISSING') toast.error('You need to provide your Gemini API key first!');
      else toast.error('Failed to communicate with AI API.');
      
      // Rollback user message if crash
      setMessages(messages);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-page" style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      <header className="page-header" style={{ flexShrink: 0 }}>
        <h1>AI Financial Advisor Chat</h1>
        <p className="text-muted">A fully conversational, infinitely scalable contextual chat model.</p>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '900px', margin: '0 0', overflow: 'hidden' }}>
        <ApiKeyPrompt />
        
        <div className="card form-section interactive-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '1rem', paddingBottom: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                gap: '1rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'hsla(var(--success-color-hsl), 0.15)',
                  color: msg.role === 'user' ? '#fff' : 'var(--success-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {msg.role === 'user' ? <FiUser /> : <FiMessageSquare />}
                </div>
                
                <div className="markdown-body" style={{
                  maxWidth: '80%', padding: '1rem', borderRadius: '12px',
                  backgroundColor: msg.role === 'user' ? 'hsla(var(--primary-color-hsl), 0.1)' : 'var(--bg-color)',
                  border: msg.role === 'user' ? '1px solid hsla(var(--primary-color-hsl), 0.3)' : '1px solid var(--border-color)',
                  color: 'var(--text-color)', lineHeight: '1.6', fontSize: '0.95rem',
                  borderTopRightRadius: msg.role === 'user' ? '0px' : '12px',
                  borderTopLeftRadius: msg.role === 'model' ? '0px' : '12px',
                }}>
                  {msg.role === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, backgroundColor: 'hsla(var(--success-color-hsl), 0.15)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiMessageSquare />
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderTopLeftRadius: '0px', color: 'var(--text-muted)' }}>
                  Thinking critically...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexShrink: 0 }}>
            <input 
              type="text" 
              className="form-control" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              placeholder="E.g., I'm trying to buy a house in two years. With my current income limits, is that feasible?" 
              style={{ flex: 1, padding: '1rem' }}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()} style={{ padding: '0 1.5rem', borderRadius: '8px' }}>
              <FiSend style={{ fontSize: '1.2rem' }} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
