import BaseModel from './BaseModel';

export class Document extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || data.name || '';
    this.type = data.type || data.document_type || 'other';
    this.url = data.url || data.file_path || '';
    this.project_id = data.project_id || data.entity_id || null;
    this.uploaded_by = data.uploaded_by || null;
    this.size_bytes = data.size_bytes || data.file_size || 0;
    
    // Transient property for file uploads
    this.fileToUpload = data.fileToUpload || null;
  }

  get validationRules() {
    return [
      { field: 'title', test: () => !!this.title && this.title.trim().length > 0, message: 'Document title is required.' },
      { field: 'type', test: () => !!this.type, message: 'Document type is required.' },
      { field: 'url', test: () => (!!this.url && this.url.trim().length > 0) || !!this.fileToUpload, message: 'Document File or Cloud Link is required.' }
    ];
  }

  toJSON() {
    const validDocumentTypes = ['proposal', 'resolution', 'receipt', 'financial', 'accomplishment', 'meeting', 'other'];
    const docType = validDocumentTypes.includes((this.type || '').toLowerCase()) ? this.type.toLowerCase() : 'other';

    return {
      ...super.toJSON(),
      name: this.title,
      document_type: docType,
      file_path: this.url,
      entity_id: this.project_id || null,
      entity_type: this.project_id ? 'project' : null,
      uploaded_by: this.uploaded_by || null,
      file_size: this.size_bytes || 0
    };
  }

  clone() {
    const cloned = super.clone();
    cloned.fileToUpload = this.fileToUpload;
    return cloned;
  }
}

export default Document;
