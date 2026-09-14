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
          <button className="btn btn-primary" onClick={() => { setEditingDoc(null); setIsModalOpen(true); }}>
            <MdAdd size={20} /> Add Document
          </button>
        )}
      </PageHeader>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
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

      <div className="data-table-wrapper">
        {loading && documents.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner-lg" style={{ margin: '0 auto' }} /></div>
        ) : filteredDocs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-muted)' }}><MdInsertDriveFile /></div>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No documents found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Type</th>
                <th>Date Added</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td data-label="Title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.5rem', background: 'var(--bg-surface-hover)', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
                        <MdInsertDriveFile size={20} />
                      </div>
                      <span style={{ fontWeight: 500 }}>{doc.title}</span>
                    </div>
                  </td>
                  <td data-label="Type">
                    <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-surface-hover)', borderRadius: '12px', fontSize: '0.875rem' }}>
                      {doc.type}
                    </span>
                  </td>
                  <td data-label="Date Added">{formatDate(doc.created_at)}</td>
                  <td data-label="Actions" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-icon" title="Open Link">
                        <MdLink size={16} />
                      </a>
                      {hasPermission('manage:documents') && (
                        <>
                          <button className="btn btn-secondary btn-icon" onClick={() => handleEdit(doc)} title="Edit">
                            <MdEdit size={16} />
                          </button>
                          <button className="btn btn-secondary btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(doc)} title="Delete">
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
