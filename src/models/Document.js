import BaseModel from './BaseModel';

export class Document extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.title = data.title || '';
    this.type = data.type || 'Other';
    this.url = data.url || '';
    this.project_id = data.project_id || null;
    this.uploaded_by = data.uploaded_by || null;
    this.size_bytes = data.size_bytes || 0;
  }

  get validationRules() {
    return [
      { field: 'title', test: (v) => !!v && v.trim().length > 0, message: 'Document title is required.' },
      { field: 'type', test: (v) => !!v, message: 'Document type is required.' },
      { field: 'url', test: (v) => !!v && v.trim().length > 0, message: 'Document URL/File is required.' }
    ];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      type: this.type,
      url: this.url,
      project_id: this.project_id,
      uploaded_by: this.uploaded_by,
      size_bytes: this.size_bytes
    };
  }
}

export default Document;
