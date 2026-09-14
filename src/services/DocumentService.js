import BaseService from './BaseService';
import Document from '../models/Document';

export class DocumentService extends BaseService {
  constructor() {
    super('documents', Document);
  }

  async getAllWithDetails(options = {}) {
    const select = options.select || '*, profiles!uploaded_by(full_name)';
    return super.getAll({ ...options, select });
  }
}

export const documentService = new DocumentService();
export default documentService;
