import { useEffect } from 'react';
import useController from './useController';
import { proposalController } from '../controllers/ProposalController';

/**
 * SKTrack — useProposals hook
 */
export function useProposals(autoLoad = true, filters = {}) {
  const state = useController(proposalController);
  const data = state.data || {};

  useEffect(() => {
    if (autoLoad) {
      proposalController.loadProposals(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, JSON.stringify(filters)]);

  return {
    ...state,
    proposals: data.proposals || [],
    currentProposal: data.currentProposal || null,
    loadProposals: (f) => proposalController.loadProposals(f),
    loadProposal: (id) => proposalController.loadProposal(id),
    saveProposal: (proposal) => proposalController.saveProposal(proposal),
    submitProposal: (id) => proposalController.submitProposal(id),
    reviewProposal: (id, status, feedback, councilData) => proposalController.reviewProposal(id, status, feedback, councilData),
    deleteProposal: (id, name) => proposalController.deleteProposal(id, name),
  };
}

export default useProposals;
