import { useEffect } from 'react';
import useController from './useController';
import { documentController } from '../controllers/DocumentController';

export function useDocuments(autoLoad = true, filters = {}) {
  const state = useController(documentController);
  const data = state.data || {};

  useEffect(() => {
    if (autoLoad) {
      documentController.loadDocuments(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, JSON.stringify(filters)]);

  return {
    ...state,
    documents: data.documents || [],
    loadDocuments: (f) => documentController.loadDocuments(f),
    saveDocument: (doc) => documentController.saveDocument(doc),
    deleteDocument: (id, name) => documentController.deleteDocument(id, name),
  };
}

export default useDocuments;
