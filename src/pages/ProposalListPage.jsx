import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import useProposals from '../hooks/useProposals';
import { useAuth } from '../hooks/useAuth';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdRateReview, MdFolderOpen } from 'react-icons/md';
import { PROPOSAL_STATUS } from '../utils/constants';

export default function ProposalListPage() {
  const { proposals, loading, deleteProposal } = useProposals();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (proposal, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${proposal.title}"?`)) {
      await deleteProposal(proposal.id, proposal.title);
    }
  };

  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter">
      <PageHeader title="Proposals" description="Submit and review project proposals">
        {hasPermission('create:proposals') && (
          <button className="btn btn-primary" onClick={() => navigate('/proposals/new')}>
            <MdAdd size={20} /> New Proposal
          </button>
        )}
      </PageHeader>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MdSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search proposals..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="data-table-wrapper">
        {loading && proposals.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredProposals.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-muted)' }}><MdFolderOpen /></div>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No proposals found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Target Date</th>
                <th>Budget</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((proposal) => (
                <tr 
                  key={proposal.id} 
                  onClick={() => navigate(`/proposals/${proposal.id}/review`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td data-label="Title" style={{ fontWeight: 600 }}>{proposal.title}</td>
                  <td data-label="Target Date">{formatDate(proposal.target_date)}</td>
                  <td data-label="Budget">{formatCurrency(proposal.estimated_budget)}</td>
                  <td data-label="Status">
                    <ProjectStatusBadge status={proposal.status} />
                  </td>
                  <td data-label="Actions" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-icon" onClick={(e) => { e.stopPropagation(); navigate(`/proposals/${proposal.id}/review`); }} title="Review">
                        <MdRateReview size={16} />
                      </button>
                      {(proposal.status === PROPOSAL_STATUS.DRAFT || proposal.status === PROPOSAL_STATUS.REJECTED) && (hasPermission('manage:proposals') || hasPermission('create:proposals')) && (
                        <button className="btn btn-secondary btn-icon" onClick={(e) => { e.stopPropagation(); navigate(`/proposals/${proposal.id}/edit`); }} title="Edit">
                          <MdEdit size={16} />
                        </button>
                      )}
                      {(hasPermission('manage:proposals') || hasPermission('create:proposals')) && (
                        <button className="btn btn-secondary btn-icon" style={{ color: 'var(--danger)' }} onClick={(e) => handleDelete(proposal, e)} title="Delete">
                          <MdDelete size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
