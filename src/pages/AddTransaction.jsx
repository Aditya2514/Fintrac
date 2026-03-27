import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useFinance } from '../hooks/useFinance';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './AddTransaction.css';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(50, 'Title is too long'),
  amount: yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Amount is required')
    .positive('Amount must be positive'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  category: yup.string().required('Category is required'),
  account: yup.string().required('Account is required'),
  date: yup.date()
    .transform((curr, orig) => orig === '' ? null : curr)
    .required('Date is required')
    .default(() => new Date()),
  isRecurring: yup.boolean().default(false),
  notes: yup.string().max(200, 'Notes too long').nullable()
});

const defaultCategories = [
  'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance',
  'Healthcare', 'Saving & Debts', 'Personal Spending', 'Entertainment', 'Salary', 'Other'
];

const AddTransaction = ({ onClose }) => {
  const { addTransaction, updateTransaction, transactions } = useFinance();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      account: 'Online'
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        // format date properly for input[type="date"]
        const formattedDate = new Date(tx.date).toISOString().split('T')[0];
        reset({
          ...tx,
          date: formattedDate
        });
      } else {
        toast.error('Transaction not found');
        navigate('/transactions');
      }
    }
  }, [id, transactions, reset, navigate, isEditMode]);

  const onSubmit = (data) => {
    try {
      if (isEditMode) {
        updateTransaction(id, data);
        toast.success('Transaction updated successfully!');
      } else {
        addTransaction(data);
        toast.success('Transaction added successfully!');
      }
      reset();
      if (onClose) onClose();
      else navigate('/transactions');
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} transaction.`);
    }
  };

  return (
    <div className="add-transaction-page">
      <header className="page-header">
        <h1>{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</h1>
      </header>

      <section className="card form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">
          <div className="form-sections">
            {/* Section 1: Basic Info */}
            <div className="form-section">
              <h3>Basic Info</h3>
              <div className="form-group">
                <label>Type</label>
                <div className="radio-group">
                  <label className="radio-label expense-radio">
                    <input type="radio" value="expense" {...register('type')} />
                    <span>Expense</span>
                  </label>
                  <label className="radio-label income-radio">
                    <input type="radio" value="income" {...register('type')} />
                    <span>Income</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  className={`form-control ${errors.title ? 'error' : ''}`}
                  placeholder="e.g. Grocery Shopping"
                  {...register('title')}
                />
                {errors.title && <span className="error-text">{errors.title.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount ($)</label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.amount ? 'error' : ''}`}
                  placeholder="0.00"
                  {...register('amount')}
                />
                {errors.amount && <span className="error-text">{errors.amount.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="account">Account</label>
                <select
                  id="account"
                  className={`form-control ${errors.account ? 'error' : ''}`}
                  {...register('account')}
                >
                  <option value="Online">Online</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            {/* Section 2: Details */}
            <div className="form-section">
              <h3>Categorization</h3>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  className={`form-control ${errors.category ? 'error' : ''}`}
                  {...register('category')}
                >
                  <option value="">Select Category</option>
                  {defaultCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  className={`form-control ${errors.date ? 'error' : ''}`}
                  {...register('date')}
                />
                {errors.date && <span className="error-text">{errors.date.message}</span>}
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" {...register('isRecurring')} />
                  <span className="checkbox-text">This is a recurring transaction</span>
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  rows="3"
                  className={`form-control ${errors.notes ? 'error' : ''}`}
                  placeholder="Additional details..."
                  {...register('notes')}
                ></textarea>
                {errors.notes && <span className="error-text">{errors.notes.message}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => { if(onClose) onClose(); else navigate(-1); }}>
              <FiXCircle /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <FiCheckCircle /> {isEditMode ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddTransaction;
