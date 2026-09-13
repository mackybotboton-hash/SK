import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useFinance from '../hooks/useFinance';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/finance/ExpenseForm';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdReceipt } from 'react-icons/md';

export default function ExpenseListPage() {
  const { expenses, loading, saveExpense, deleteExpense } = useFinance();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.budget_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (expense) => {
    if (window.confirm(`Delete expense for "${expense.description}"?`)) {
      await deleteExpense(expense.id);
    }
  };

  const handleSave = async (expenseModel) => {
    const success = await saveExpense(expenseModel);
    if (success) setIsModalOpen(false);
  };

  return (
    <div className="page-enter">
      <PageHeader title="Expenses" description="Record and track project expenditures">
        {hasPermission('manage:expenses') && (
          <button className="btn btn-primary" onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center' }}>
            <MdAdd size={20} style={{ marginRight: '0.25rem' }} /> Log Expense
          </button>
        )}
      </PageHeader>

      <div className="card glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MdSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search expenses..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card glass-panel" style={{ overflowX: 'auto' }}>
        {loading && expenses.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}><MdReceipt /></div>
            <p className="empty-state-title" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No expenses logged</p>
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Description</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover-lift" style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{formatDate(exp.date)}</td>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{exp.description}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{exp.budget_category}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{formatCurrency(exp.amount)}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {hasPermission('manage:expenses') && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleEdit(exp)}><MdEdit size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => handleDelete(exp)}><MdDelete size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? 'Edit Expense' : 'Log Expense'}>
        <ExpenseForm initialData={editingExpense ? editingExpense.toJSON() : null} onSave={handleSave} onCancel={() => setIsModalOpen(false)} loading={loading} />
      </Modal>
    </div>
  );
}
