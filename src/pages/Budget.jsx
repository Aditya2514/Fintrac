import React, { useState, useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { useCurrency } from '../hooks/useCurrency';
import { formatCurrency } from '../utils/formatters';
import { FiSave, FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiTarget } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Budget.css';

const CATEGORY_META = {
  'Housing':          { emoji: '🏠', color: '#6366f1' },
  'Transportation':   { emoji: '🚗', color: '#f59e0b' },
  'Food':             { emoji: '🍕', color: '#10b981' },
  'Utilities':        { emoji: '⚡', color: '#3b82f6' },
  'Insurance':        { emoji: '🛡️', color: '#8b5cf6' },
  'Healthcare':       { emoji: '💊', color: '#ef4444' },
  'Saving & Debts':   { emoji: '💰', color: '#14b8a6' },
  'Personal Spending':{ emoji: '🛍️', color: '#ec4899' },
  'Entertainment':    { emoji: '🎬', color: '#f97316' },
  'Other':            { emoji: '📦', color: '#64748b' },
};

const defaultCategories = Object.keys(CATEGORY_META);

const Budget = () => {
  const { budget, updateBudget, transactions } = useFinance();
  const { currency } = useCurrency();

  const [categoryBudgets, setCategoryBudgets] = useState(budget.categories || {});

  const globalBudgetAmount = useMemo(() =>
    Object.values(categoryBudgets).reduce((acc, val) => acc + (Number(val) || 0), 0),
  [categoryBudgets]);

  const { totalExpenses, categorySpend } = useMemo(() => {
    let tExpenses = 0;
    const catSpend = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        tExpenses += t.amount;
        catSpend[t.category] = (catSpend[t.category] || 0) + t.amount;
      }
    });
    return { totalExpenses: tExpenses, categorySpend: catSpend };
  }, [transactions]);

  const handleCategoryChange = (cat, val) => {
    const num = parseFloat(val);
    setCategoryBudgets(prev => ({ ...prev, [cat]: isNaN(num) ? '' : num }));
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    updateBudget({ amount: globalBudgetAmount, categories: categoryBudgets });
    toast.success('Budget limits saved!');
  };

  const remaining = globalBudgetAmount - totalExpenses;
  const totalPct = globalBudgetAmount > 0 ? Math.min((totalExpenses / globalBudgetAmount) * 100, 100) : 0;

  const getStatus = (pct) => {
    if (pct >= 100) return { label: 'Over Budget', cls: 'status-danger' };
    if (pct >= 75)  return { label: 'Warning',     cls: 'status-warning' };
    if (pct > 0)    return { label: 'On Track',     cls: 'status-success' };
    return { label: 'Not Set', cls: 'status-muted' };
  };

  const totalStatus = getStatus(totalPct);

  return (
    <div className="budget-page">
      <header className="page-header">
        <h1 className="gradient-text">Budget Manager</h1>
        <p className="text-muted">Set per-category limits and track your spending health.</p>
      </header>

      {/* ── Overview Banner ── */}
      <div className="budget-overview-banner">
        <div className="overview-stat">
          <div className="overview-stat-icon" style={{ color: '#6366f1' }}><FiTarget size={22}/></div>
          <div>
            <div className="overview-stat-label">Total Budget</div>
            <div className="overview-stat-value">{formatCurrency(globalBudgetAmount, currency)}</div>
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-stat-icon" style={{ color: '#ef4444' }}><FiTrendingUp size={22}/></div>
          <div>
            <div className="overview-stat-label">Total Spent</div>
            <div className="overview-stat-value danger">{formatCurrency(totalExpenses, currency)}</div>
          </div>
        </div>
        <div className="overview-stat">
          <div className="overview-stat-icon" style={{ color: remaining >= 0 ? '#10b981' : '#ef4444' }}>
            {remaining >= 0 ? <FiCheckCircle size={22}/> : <FiAlertTriangle size={22}/>}
          </div>
          <div>
            <div className="overview-stat-label">Remaining</div>
            <div className={`overview-stat-value ${remaining < 0 ? 'danger' : 'success'}`}>
              {formatCurrency(Math.abs(remaining), currency)}{remaining < 0 ? ' over' : ' left'}
            </div>
          </div>
        </div>
        <div className="overview-gauge">
          <div className="gauge-header">
            <span className={`status-badge ${totalStatus.cls}`}>{totalStatus.label}</span>
            <span className="gauge-pct">{totalPct.toFixed(1)}%</span>
          </div>
          <div className="gauge-track">
            <div className="gauge-fill" style={{
              width: `${totalPct}%`,
              background: totalPct >= 100 ? 'var(--danger-color)' : totalPct >= 75 ? 'var(--warning-color)' : 'var(--success-color)'
            }}/>
          </div>
        </div>
      </div>

      <div className="budget-main-grid">
        {/* ── Category Cards ── */}
        <section className="budget-categories-section">
          <div className="section-header-row">
            <h2>Category Limits</h2>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Click a card to edit its limit</span>
          </div>
          <form onSubmit={handleSaveBudget}>
            <div className="category-cards-grid">
              {defaultCategories.map(cat => {
                const meta = CATEGORY_META[cat] || { emoji: '📦', color: '#64748b' };
                const limit = Number(categoryBudgets[cat]) || 0;
                const spent = categorySpend[cat] || 0;
                const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                const status = getStatus(limit > 0 ? (spent / limit) * 100 : 0);

                return (
                  <div key={cat} className="category-budget-card interactive-card">
                    <div className="cat-card-header">
                      <div className="cat-icon" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                        {meta.emoji}
                      </div>
                      <div className="cat-names">
                        <span className="cat-name">{cat}</span>
                        <span className={`status-badge ${status.cls}`}>{status.label}</span>
                      </div>
                    </div>

                    <div className="cat-amounts">
                      <span className="cat-spent">{formatCurrency(spent, currency)} <span className="of-label">of</span></span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={categoryBudgets[cat] ?? ''}
                        onChange={(e) => handleCategoryChange(cat, e.target.value)}
                        placeholder="Set limit"
                        className="cat-limit-input"
                        style={{ '--accent': meta.color }}
                      />
                    </div>

                    <div className="cat-progress-track">
                      <div className="cat-progress-fill" style={{
                        width: `${pct}%`,
                        backgroundColor: pct >= 100 ? 'var(--danger-color)' : pct >= 75 ? 'var(--warning-color)' : meta.color
                      }}/>
                    </div>
                    <div className="cat-pct-label">{pct > 0 ? `${pct.toFixed(0)}% used` : 'No spending yet'}</div>
                  </div>
                );
              })}
            </div>

            <div className="save-row">
              <div className="total-compiled">
                <span>Total Compiled Goal</span>
                <strong style={{ color: 'var(--primary-color)' }}>{formatCurrency(globalBudgetAmount, currency)}</strong>
              </div>
              <button type="submit" className="btn btn-primary save-btn">
                <FiSave /> Save Limits
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Budget;
