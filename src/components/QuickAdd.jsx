import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFinance } from '../hooks/useFinance';
import { toast } from 'react-toastify';
import { FiCheckCircle } from 'react-icons/fi';

const schema = yup.object().shape({
  title: yup.string().required('Title required').max(50),
  amount: yup.number().transform(v => (isNaN(v) ? undefined : v)).required().positive(),
  type: yup.string().oneOf(['income', 'expense']).required(),
  category: yup.string().required(),
  account: yup.string().required(),
  isRecurring: yup.boolean().default(false)
});

const defaultCategories = [
  'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 
  'Healthcare', 'Saving & Debts', 'Personal Spending', 'Entertainment', 'Salary', 'Other'
];

const QuickAdd = () => {
  const { addTransaction } = useFinance();

  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      account: 'Online',
      isRecurring: false
    }
  });

  const onSubmit = (data) => {
    try {
      addTransaction({
        ...data,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      toast.success('Added to transactions!');
      reset();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add');
    }
  };

  return (
    <div className="card interactive-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <h3 style={{ color: 'var(--primary-color)', fontSize: '0.90rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid hsla(var(--primary-color-hsl), 0.2)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        Quick Add
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-color)' }} className="income-radio">
            <input type="radio" value="income" {...register('type')} style={{ display: 'none' }} />
            <span style={{ fontSize: '0.85rem' }}>Income</span>
          </label>
          <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-color)' }} className="expense-radio">
            <input type="radio" value="expense" {...register('type')} style={{ display: 'none' }} />
            <span style={{ fontSize: '0.85rem' }}>Expense</span>
          </label>
        </div>

        <div>
          <input type="text" placeholder="Title" className="form-control" {...register('title')} style={{ fontSize: '0.85rem', padding: '0.6rem' }} />
        </div>

        <div>
          <input type="number" step="0.01" placeholder="Amount ($)" className="form-control" {...register('amount')} style={{ fontSize: '0.85rem', padding: '0.6rem' }} />
        </div>

        <div>
          <select className="form-control" {...register('account')} style={{ fontSize: '0.85rem', padding: '0.6rem' }}>
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <select className="form-control" {...register('category')} style={{ fontSize: '0.85rem', padding: '0.6rem' }}>
            <option value="">Category...</option>
            {defaultCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.2rem 0.2rem 0.6rem 0.2rem' }}>
          <input type="checkbox" id="qa-recur" {...register('isRecurring')} style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
          <label htmlFor="qa-recur" style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-color)' }}>This is a recurring transaction</label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '0.6rem', fontSize: '0.85rem', justifyContent: 'center', marginTop: '0.25rem' }}>
          <FiCheckCircle /> Add Transaction
        </button>
      </form>
    </div>
  );
};

export default QuickAdd;
