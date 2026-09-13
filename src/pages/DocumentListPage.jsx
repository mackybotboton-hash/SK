import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useDocuments from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/common/Modal';
import DocumentUploadModal from '../components/documents/DocumentUploadModal';
import { formatDate } from '../utils/formatters';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdInsertDriveFile, MdLink } from 'react-icons/md';

export default function DocumentListPage() {
  const { documents, loading, saveDocument, deleteDocument } = useDocuments();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Delete document "${doc.title}"?`)) {
      await deleteDocument(doc.id, doc.title);
    }
  };

  const handleSave = async (docModel) => {
    const success = await saveDocument(docModel);
    if (success) setIsModalOpen(false);
  };

  return (
    <div className="page-enter">
      <PageHeader title="Documents Vault" description="Secure repository for SK files and records">
        {hasPermission('manage:documents') && (
          <button className="btn btn-primary" onClick={() => { setEditingDoc(null); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center' }}>
            <MdAdd size={20} style={{ marginRight: '0.25rem' }} /> Add Document
          </button>
        )}
      </PageHeader>

      <div className="card glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MdSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search documents by title or type..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card glass-panel" style={{ overflowX: 'auto' }}>
        {loading && documents.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredDocs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}><MdInsertDriveFile /></div>
            <p className="empty-state-title" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No documents found</p>
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Document Title</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Type</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date Added</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover-lift" style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '8px', color: 'var(--primary)' }}>
                        <MdInsertDriveFile size={20} />
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doc.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-elevated)', borderRadius: '12px', fontSize: '0.875rem' }}>
                      {doc.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{formatDate(doc.created_at)}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Open Link">
                        <MdLink size={16} />
                      </a>
                      {hasPermission('manage:documents') && (
                        <>
                          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleEdit(doc)} title="Edit">
                            <MdEdit size={16} />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => handleDelete(doc)} title="Delete">
                            <MdDelete size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDoc ? 'Edit Document' : 'Add Document'}>
        <DocumentUploadModal initialData={editingDoc ? editingDoc.toJSON() : null} onSave={handleSave} onCancel={() => setIsModalOpen(false)} loading={loading} />
      </Modal>
    </div>
  );
}
