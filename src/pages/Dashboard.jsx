import React, { useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { useCurrency } from '../hooks/useCurrency';
import { formatCurrency } from '../utils/formatters';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import QuickAdd from '../components/QuickAdd';
import './Dashboard.css';

const Dashboard = () => {
  const { transactions, budget } = useFinance();
  const { currency } = useCurrency();

  const { totalIncome, totalExpenses, topIncomes, topExpenses, categoryTotals, totalSavings, realCash, realOnline } = useMemo(() => {
    let tIncome = 0;
    let tExpenses = 0;
    let tSavings = 0;
    let cBalance = 0;
    let oBalance = 0;
    const catTotals = {};

    transactions.forEach(t => {
      const account = t.account || 'Online';
      const isInc = t.type === 'income';
      const amount = isInc ? t.amount : -t.amount;
      
      if (account === 'Cash') cBalance += amount;
      else oBalance += amount;

      if (isInc) {
        tIncome += t.amount;
      } else {
        tExpenses += t.amount;
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
        if (t.category === 'Saving & Debts') {
          tSavings += t.amount;
        }
      }
    });

    const incomeList = transactions.filter(t => t.type === 'income').slice(0, 3);
    const expenseList = transactions.filter(t => t.type === 'expense').slice(0, 4);

    return {
      totalIncome: tIncome,
      totalExpenses: tExpenses,
      topIncomes: incomeList,
      topExpenses: expenseList,
      categoryTotals: catTotals,
      totalSavings: tSavings,
      realCash: cBalance,
      realOnline: oBalance
    };
  }, [transactions]);

  const netBalance = totalIncome - totalExpenses;
  const accounts = [
    { name: 'Cash', balance: realCash },
    { name: 'Savings', balance: totalSavings },
    { name: 'Online', balance: realOnline }
  ];

  // Goals data using real metrics
  const carGoal = 2000;
  const carProgress = Math.min((netBalance > 0 ? netBalance : 0) / carGoal * 100, 100);

  const studentLoanGoal = 10000;
  const loanProgress = studentLoanGoal > 0 ? Math.min((totalSavings / studentLoanGoal) * 100, 100) : 0;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1 className="gradient-text">My Finances</h1>
      </header>

      <div className="dashboard-layout">
        {/* Left Column (Summary) */}
        <aside className="dashboard-left-col">
          <div className="card summary-card interactive-card">
            <h3 className="section-title">This Month Summary</h3>
            <div className="summary-row">
              <span className="text-muted">Income</span>
              <span className="val-income">{formatCurrency(totalIncome, currency)}</span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Expense</span>
              <span className="val-expense">{formatCurrency(totalExpenses, currency)}</span>
            </div>
            <div className="summary-row total">
              <span className="text-primary">Balance</span>
              <span className="val-balance">{formatCurrency(netBalance, currency)}</span>
            </div>
          </div>

          <div className="card summary-card interactive-card">
            <h3 className="section-title">Accounts</h3>
            {accounts.map((acc, i) => (
              <div className="summary-row" key={i}>
                <span className="text-muted">{acc.name}</span>
                <span className="font-bold">{formatCurrency(acc.balance, currency)}</span>
              </div>
            ))}
          </div>

          <QuickAdd />
        </aside>

        {/* Right Main Grid */}
        <div className="dashboard-right-col">
          <div className="metric-grid">
            {/* Income */}
            <div className="card metric-card interactive-card">
              <div className="metric-header">
                <span className="metric-title">Income</span>
              </div>
              <div className="metric-value income">{formatCurrency(totalIncome, currency)}</div>

              <div className="mt-auto mb-4">
                {topIncomes.map((t) => (
                  <div className="list-item" key={t.id}>
                    <span className="text-muted">{t.title || t.category}</span>
                    <span className="val-income">{formatCurrency(t.amount, currency)}</span>
                  </div>
                ))}
                {topIncomes.length === 0 && <span className="text-sm text-muted">No income recorded.</span>}
              </div>
              <Link to="/transactions/new" className="btn btn-primary mt-2">
                <FiPlus /> Add New Income
              </Link>
            </div>

            {/* Expenses */}
            <div className="card metric-card interactive-card">
              <div className="metric-header">
                <span className="metric-title">Expenses</span>
              </div>
              <div className="metric-value expense">{formatCurrency(totalExpenses, currency)}</div>

              <div className="mt-auto">
                {topExpenses.map((t) => (
                  <div className="list-item" key={t.id}>
                    <span className="text-muted">{t.title || t.category}</span>
                    <span className="val-expense">{formatCurrency(t.amount, currency)}</span>
                  </div>
                ))}
                {topExpenses.length === 0 && <span className="text-sm text-muted">No expenses recorded.</span>}
              </div>
            </div>

            {/* Balance */}
            <div className="card metric-card interactive-card">
              <div className="metric-header">
                <span className="metric-title">Balance</span>
              </div>
              <div className="metric-value balance">{formatCurrency(netBalance, currency)}</div>

              <div className="progress-container">
                <div className="progress-label">
                  <span>Car Goal</span>
                  <span>{carProgress.toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${carProgress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Savings */}
            <div className="card metric-card interactive-card">
              <div className="metric-header">
                <span className="metric-title">Savings</span>
                <br />
                <span className="metric-subtitle">Total Savings</span>
              </div>
              <div className="metric-value balance">{formatCurrency(totalSavings, currency)}</div>

              <div className="progress-container mt-auto">
                <div className="progress-label">
                  <span>Student Loan</span>
                  <span>{loanProgress.toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill warning" style={{ width: `${loanProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Spending Budget */}
          <div className="card wide-card interactive-card mt-2">
            <h3>Spending Budget</h3>
            <div className="budget-grid">
              {Object.entries(categoryTotals).slice(0, 6).map(([cat, amount]) => {
                const catBudget = budget.categories?.[cat] || 300;
                const pct = Math.min((amount / catBudget) * 100, 100);
                const isDanger = pct >= 90;
                const isWarning = pct >= 75 && pct < 90;

                return (
                  <div className="budget-item" key={cat}>
                    <div className="b-header">
                      <span>{cat}</span>
                      <span>{amount.toFixed(0)}/{catBudget.toFixed(0)}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${isDanger ? 'danger' : isWarning ? 'warning' : 'success'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(categoryTotals).length === 0 && (
                <p className="text-muted text-sm">No expenses to display budget progress.</p>
              )}
            </div>
          </div>

          {/* Upcoming Expenses */}
          <div className="card wide-card interactive-card">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-color)', borderBottom: '2px solid hsla(var(--primary-color-hsl), 0.15)', paddingBottom: '0.75rem' }}>Recent & Upcoming</h3>
            <div className="d-flex flex-col gap-2">
              {transactions.slice(0, 5).map(t => (
                <div 
                  key={t.id} 
                  className="transaction-row-card"
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: t.type === 'income' ? 'hsla(150, 80%, 40%, 0.15)' : 'hsla(var(--danger-color-hsl), 0.15)',
                    color: t.type === 'income' ? 'var(--success-color)' : 'var(--danger-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    flexShrink: 0
                  }}>
                    {t.type === 'income' ? <FiPlus style={{ fontSize: '1.3rem' }} /> : <FiCalendar style={{ fontSize: '1.2rem' }} />}
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-color)', letterSpacing: '0.02em' }}>{t.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ backgroundColor: 'hsla(var(--background-color-hsl), 0.5)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{t.category}</span>
                      <span>•</span>
                      <span>{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {t.isRecurring && (
                        <>
                          <span>•</span>
                          <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Recurring</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '1.1rem', 
                    color: t.type === 'income' ? 'var(--success-color)' : 'var(--text-color)' 
                  }}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && <p className="text-muted text-sm">No transactions yet.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
