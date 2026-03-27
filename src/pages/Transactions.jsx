import React, { useState, useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { useCurrency } from '../hooks/useCurrency';
import { formatCurrency, formatDate } from '../utils/formatters';
import { FiSearch, FiFilter, FiTrash2, FiEdit2, FiRepeat, FiPlusCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AddTransaction from './AddTransaction';
import './Transactions.css';

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinance();
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(lowercasedTerm) ||
        t.category.toLowerCase().includes(lowercasedTerm) ||
        (t.notes && t.notes.toLowerCase().includes(lowercasedTerm))
      );
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        case 'category': return a.category.localeCompare(b.category);
        default: return 0;
      }
    });

    return result;
  }, [transactions, searchTerm, filterType, sortBy]);

  return (
    <div className="transactions-page">
      <header className="page-header d-flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Transactions</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FiPlusCircle /> Add Transaction
        </button>
      </header>

      <section className="controls-section card">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, category, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <FiFilter className="filter-icon" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="category">Category A-Z</option>
            </select>
          </div>
        </div>
      </section>

      <section className="transactions-list-container">
        {filteredAndSorted.length > 0 ? (
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map(t => (
                  <tr key={t.id} className={t.isRecurring ? 'recurring-row' : ''}>
                    <td className="t-date">{formatDate(t.date)}</td>
                    <td className="t-title">
                      <div className="title-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
                        <div style={{ fontWeight: 600 }}>{t.title}</div>
                        {t.isRecurring && <span className="recurring-badge">Recurring</span>}
                      </div>
                      {t.notes && <div className="t-notes" style={{ marginTop: '0.25rem' }}>{t.notes}</div>}
                    </td>
                    <td><span className="t-category-badge">{t.category}</span></td>
                    <td className={`t-amount-cell ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                    </td>
                    <td className="t-actions">
                      <Link to={`/transactions/edit/${t.id}`} className="action-text-btn edit" title="Edit">
                        Edit
                      </Link>
                      <button className="action-text-btn delete" onClick={() => deleteTransaction(t.id)} title="Delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state card">
            <p>No transactions match your criteria.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <FiX />
            </button>
            <div style={{ maxHeight: '85vh', overflowY: 'auto' }}>
              <AddTransaction onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
