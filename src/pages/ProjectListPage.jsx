import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import useProjects from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdFolderOpen } from 'react-icons/md';

export default function ProjectListPage() {
  const { projects, loading, error, saveProject, deleteProject } = useProjects();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (project, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      await deleteProject(project.id, project.name);
    }
  };

  const handleSave = async (projectModel) => {
    const success = await saveProject(projectModel);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter">
      <PageHeader 
        title="Projects" 
        description="Manage SK programs, projects, and activities" 
      >
        {hasPermission('manage:projects') && (
          <button className="btn btn-primary" onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center' }}>
            <MdAdd size={20} style={{ marginRight: '0.25rem' }} /> New Project
          </button>
        )}
      </PageHeader>

      <div className="card glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <MdSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={20} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search projects..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card glass-panel" style={{ overflowX: 'auto' }}>
        {loading && projects.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <div className="spinner-lg" style={{ margin: '0 auto' }} />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}><MdFolderOpen /></div>
            <p className="empty-state-title" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>No projects found</p>
            <p className="empty-state-desc" style={{ color: 'var(--text-secondary)' }}>Get started by creating a new project.</p>
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Project Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Budget</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id} 
                  className="hover-lift"
                  style={{ borderBottom: '1px solid var(--border-default)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                      {formatDate(project.start_date)} — {formatDate(project.end_date) || 'TBD'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{project.category}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {formatCurrency(project.approved_budget || project.proposed_budget)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <ProjectStatusBadge status={project.status} />
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {hasPermission('manage:projects') && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={(e) => handleEdit(project, e)} title="Edit">
                          <MdEdit size={16} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={(e) => handleDelete(project, e)} title="Delete">
                          <MdDelete size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProject ? 'Edit Project' : 'New Project'}
      >
        <ProjectForm 
          initialData={editingProject ? editingProject.toJSON() : null}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
