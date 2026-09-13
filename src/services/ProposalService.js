import BaseService from './BaseService';
import Proposal from '../models/Proposal';

/**
 * SKTrack — ProposalService
 * Handles database operations for Proposals.
 */
export class ProposalService extends BaseService {
  constructor() {
    super('proposals', Proposal);
  }

  async getAllWithDetails(options = {}) {
    const select = options.select || '*, profiles:proponent_id(full_name, avatar_url)';
    return super.getAll({ ...options, select });
  }
}

export const proposalService = new ProposalService();
export default proposalService;
