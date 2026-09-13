import BaseController from './BaseController';
import documentService from '../services/DocumentService';
import NotificationSystem from '../engines/NotificationSystem';

export class DocumentController extends BaseController {
  constructor() {
    super(documentService);
  }

  async loadDocuments(filters = {}) {
    this.setLoading(true);
    try {
      const result = await this.service.getAllWithDetails({ filters, orderBy: 'created_at', orderAsc: false });
      this.setData({ documents: result.data || [] });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async saveDocument(document) {
    this.setLoading(true);
    this.clearError();
    try {
      if (!document.validate()) {
        throw new Error(document.getValidationErrors()[0]?.message);
      }

      let saved;
      if (document.isNew()) {
        saved = await this.create(document, 'document');
        NotificationSystem.getInstance().success('Document added successfully.');
      } else {
        saved = await this.update(document.id, document, 'document');
        NotificationSystem.getInstance().success('Document updated successfully.');
      }
      
      await this.loadDocuments();
      return saved;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteDocument(id, name) {
    this.setLoading(true);
    try {
      await this.remove(id, 'document', name);
      NotificationSystem.getInstance().success('Document removed.');
      await this.loadDocuments();
      return true;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }
}

export const documentController = new DocumentController();
export default documentController;
