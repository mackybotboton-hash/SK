import BaseController from './BaseController';
import proposalService from '../services/ProposalService';
import NotificationSystem from '../engines/NotificationSystem';
import { PROPOSAL_STATUS } from '../utils/constants';

/**
 * SKTrack — ProposalController
 */
export class ProposalController extends BaseController {
  constructor() {
    super(proposalService);
    this.proposals = [];
    this.currentProposal = null;
  }

  async loadProposals(filters = {}) {
    this.setLoading(true);
    try {
      const result = await this.service.getAllWithDetails({ filters, orderBy: 'created_at' });
      this.proposals = result.data;
      this.setData({ proposals: this.proposals, currentProposal: this.currentProposal });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async loadProposal(id) {
    this.setLoading(true);
    try {
      this.currentProposal = await this.service.getById(id, '*, profiles:proponent_id(full_name, avatar_url)');
      this.setData({ proposals: this.proposals, currentProposal: this.currentProposal });
      return this.currentProposal;
    } catch (error) {
      this.handleError(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async saveProposal(proposal) {
    this.setLoading(true);
    this.clearError();
    try {
      if (!proposal.validate()) {
        const errorMsg = proposal.getValidationErrors()[0]?.message || 'Validation failed';
        throw new Error(errorMsg);
      }

      let saved;
      if (proposal.isNew()) {
        saved = await this.create(proposal, 'proposal');
        NotificationSystem.getInstance().success('Proposal created successfully.');
      } else {
        saved = await this.update(proposal.id, proposal, 'proposal');
        NotificationSystem.getInstance().success('Proposal updated successfully.');
      }
      
      await this.loadProposals();
      return saved;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async submitProposal(id) {
    this.setLoading(true);
    try {
      await this.update(id, { status: PROPOSAL_STATUS.SUBMITTED }, 'proposal');
      NotificationSystem.getInstance().success('Proposal submitted for review.');
      await this.loadProposal(id);
      return true;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async reviewProposal(id, status, feedback, councilData = null) {
    this.setLoading(true);
    try {
      const updateData = { status, feedback };
      if (councilData) {
        Object.assign(updateData, councilData);
      }
      await this.update(id, updateData, 'proposal');
      NotificationSystem.getInstance().success(`Proposal marked as ${status}.`);
      await this.loadProposal(id);
      return true;
    } catch (error) {
      this.handleError(error);
      NotificationSystem.getInstance().error(error.message);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async deleteProposal(id, name) {
    this.setLoading(true);
    try {
      await this.remove(id, 'proposal', name);
      NotificationSystem.getInstance().success('Proposal deleted.');
      await this.loadProposals();
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

export const proposalController = new ProposalController();
export default proposalController;
