/**
 * SKTrack — Constants & Enums
 * Central source of truth for all application constants.
 */

// ─── Roles ────────────────────────────────────────────────
export const ROLES = {
  CHAIRPERSON: 'chairperson',
  TREASURER: 'treasurer',
  SECRETARY: 'secretary',
  KAGAWAD: 'kagawad',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.CHAIRPERSON]: 'SK Chairperson',
  [ROLES.TREASURER]: 'SK Treasurer',
  [ROLES.SECRETARY]: 'SK Secretary',
  [ROLES.KAGAWAD]: 'SK Kagawad',
  [ROLES.ADMIN]: 'System Administrator',
};

export const ROLE_COLORS = {
  [ROLES.CHAIRPERSON]: '#6366f1',
  [ROLES.TREASURER]: '#10b981',
  [ROLES.SECRETARY]: '#f59e0b',
  [ROLES.KAGAWAD]: '#3b82f6',
  [ROLES.ADMIN]: '#ef4444',
};

// ─── Project Status ───────────────────────────────────────
export const PROJECT_STATUS = {
  BUDGET_CONFIRMED: 'budget_confirmed',
  READY_FOR_IMPLEMENTATION: 'ready_for_implementation',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.BUDGET_CONFIRMED]: 'Budget Confirmed',
  [PROJECT_STATUS.READY_FOR_IMPLEMENTATION]: 'Ready for Implementation',
  [PROJECT_STATUS.ONGOING]: 'Ongoing',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled',
};

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.BUDGET_CONFIRMED]: '#3b82f6',
  [PROJECT_STATUS.READY_FOR_IMPLEMENTATION]: '#8b5cf6',
  [PROJECT_STATUS.ONGOING]: '#f59e0b',
  [PROJECT_STATUS.COMPLETED]: '#10b981',
  [PROJECT_STATUS.CANCELLED]: '#ef4444',
};

// ─── Proposal Status ─────────────────────────────────────
export const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_COUNCIL_REVIEW: 'under_council_review',
  RETURNED: 'returned',
  APPROVED_BY_COUNCIL: 'approved_by_council',
  REJECTED: 'rejected',
};

export const PROPOSAL_STATUS_LABELS = {
  [PROPOSAL_STATUS.DRAFT]: 'Draft',
  [PROPOSAL_STATUS.SUBMITTED]: 'Submitted',
  [PROPOSAL_STATUS.UNDER_COUNCIL_REVIEW]: 'Under Council Review',
  [PROPOSAL_STATUS.RETURNED]: 'Returned for Revision',
  [PROPOSAL_STATUS.APPROVED_BY_COUNCIL]: 'Approved by Council',
  [PROPOSAL_STATUS.REJECTED]: 'Rejected',
};

export const PROPOSAL_STATUS_COLORS = {
  [PROPOSAL_STATUS.DRAFT]: '#94a3b8',
  [PROPOSAL_STATUS.SUBMITTED]: '#3b82f6',
  [PROPOSAL_STATUS.UNDER_COUNCIL_REVIEW]: '#f59e0b',
  [PROPOSAL_STATUS.RETURNED]: '#8b5cf6',
  [PROPOSAL_STATUS.APPROVED_BY_COUNCIL]: '#10b981',
  [PROPOSAL_STATUS.REJECTED]: '#ef4444',
};

// ─── Expense Categories ──────────────────────────────────
export const EXPENSE_CATEGORY = {
  EQUIPMENT: 'equipment',
  FOOD: 'food',
  TRANSPORTATION: 'transportation',
  SUPPLIES: 'supplies',
  VENUE: 'venue',
  SERVICES: 'services',
  PRIZES: 'prizes',
  PRINTING: 'printing',
  OTHER: 'other',
};

export const EXPENSE_CATEGORY_LABELS = {
  [EXPENSE_CATEGORY.EQUIPMENT]: 'Equipment',
  [EXPENSE_CATEGORY.FOOD]: 'Food & Beverages',
  [EXPENSE_CATEGORY.TRANSPORTATION]: 'Transportation',
  [EXPENSE_CATEGORY.SUPPLIES]: 'Supplies & Materials',
  [EXPENSE_CATEGORY.VENUE]: 'Venue Rental',
  [EXPENSE_CATEGORY.SERVICES]: 'Services',
  [EXPENSE_CATEGORY.PRIZES]: 'Prizes & Awards',
  [EXPENSE_CATEGORY.PRINTING]: 'Printing & Documentation',
  [EXPENSE_CATEGORY.OTHER]: 'Other',
};

export const EXPENSE_CATEGORY_ICONS = {
  [EXPENSE_CATEGORY.EQUIPMENT]: '🏗️',
  [EXPENSE_CATEGORY.FOOD]: '🍽️',
  [EXPENSE_CATEGORY.TRANSPORTATION]: '🚗',
  [EXPENSE_CATEGORY.SUPPLIES]: '📦',
  [EXPENSE_CATEGORY.VENUE]: '🏛️',
  [EXPENSE_CATEGORY.SERVICES]: '🔧',
  [EXPENSE_CATEGORY.PRIZES]: '🏆',
  [EXPENSE_CATEGORY.PRINTING]: '🖨️',
  [EXPENSE_CATEGORY.OTHER]: '📋',
};

// ─── Document Types ───────────────────────────────────────
export const DOCUMENT_TYPE = {
  PROPOSAL: 'proposal',
  RESOLUTION: 'resolution',
  RECEIPT: 'receipt',
  FINANCIAL: 'financial',
  ACCOMPLISHMENT: 'accomplishment',
  MEETING: 'meeting',
  OTHER: 'other',
};

export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPE.PROPOSAL]: 'Project Proposal',
  [DOCUMENT_TYPE.RESOLUTION]: 'Resolution',
  [DOCUMENT_TYPE.RECEIPT]: 'Receipt',
  [DOCUMENT_TYPE.FINANCIAL]: 'Financial Document',
  [DOCUMENT_TYPE.ACCOMPLISHMENT]: 'Accomplishment Report',
  [DOCUMENT_TYPE.MEETING]: 'Meeting Document',
  [DOCUMENT_TYPE.OTHER]: 'Other Document',
};

// ─── Activity Status ─────────────────────────────────────
export const ACTIVITY_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ACTIVITY_STATUS_LABELS = {
  [ACTIVITY_STATUS.SCHEDULED]: 'Scheduled',
  [ACTIVITY_STATUS.ONGOING]: 'Ongoing',
  [ACTIVITY_STATUS.COMPLETED]: 'Completed',
  [ACTIVITY_STATUS.CANCELLED]: 'Cancelled',
};

export const ACTIVITY_STATUS_COLORS = {
  [ACTIVITY_STATUS.SCHEDULED]: '#3b82f6',
  [ACTIVITY_STATUS.ONGOING]: '#8b5cf6',
  [ACTIVITY_STATUS.COMPLETED]: '#10b981',
  [ACTIVITY_STATUS.CANCELLED]: '#ef4444',
};

// ─── Budget Alert Levels ─────────────────────────────────
export const ALERT_LEVEL = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

export const BUDGET_THRESHOLDS = {
  WARNING: 0.75,
  CRITICAL: 0.90,
};

// ─── Statutory Budget Limits (JMC No. 1 s. 2025) ────────
export const STATUTORY_LIMITS = {
  PERSONAL_SERVICES: 0.25, // Max 25% of SK Fund
  TRAINING: 0.15, // Max 15% of SK Fund
};

export const ALERT_COLORS = {
  [ALERT_LEVEL.NORMAL]: '#10b981',
  [ALERT_LEVEL.WARNING]: '#f59e0b',
  [ALERT_LEVEL.CRITICAL]: '#ef4444',
};

// ─── Entity Types (for documents & audit) ────────────────
export const ENTITY_TYPE = {
  PROJECT: 'project',
  PROPOSAL: 'proposal',
  EXPENSE: 'expense',
  ACTIVITY: 'activity',
  BUDGET: 'budget',
  USER: 'user',
};

// ─── Audit Actions ────────────────────────────────────────
export const AUDIT_ACTIONS = {
  CREATE: 'created',
  UPDATE: 'updated',
  DELETE: 'deleted',
  STATUS_CHANGE: 'status_changed',
  APPROVE: 'approved',
  REJECT: 'rejected',
  UPLOAD: 'uploaded',
  DOWNLOAD: 'downloaded',
  LOGIN: 'logged_in',
  LOGOUT: 'logged_out',
  EXPORT: 'exported',
};

// ─── Permission Actions ──────────────────────────────────
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  APPROVE: 'approve',
  GENERATE: 'generate',
  EXPORT: 'export',
};

// ─── Resources ────────────────────────────────────────────
export const RESOURCES = {
  DASHBOARD: 'dashboard',
  PROJECTS: 'projects',
  BUDGETS: 'budgets',
  EXPENSES: 'expenses',
  DOCUMENTS: 'documents',
  PROPOSALS: 'proposals',
  SCHEDULES: 'schedules',
  REPORTS: 'reports',
  USERS: 'users',
  AUDIT_LOGS: 'audit_logs',
};

// ─── Permission Matrix ────────────────────────────────────
export const PERMISSIONS = {
  [ROLES.CHAIRPERSON]: {
    'view:dashboard': true,
    'manage:projects': true,
    'view:projects': true,
    'view:budgets': true,
    'view:expenses': true,
    'manage:documents': true,
    'view:documents': true,
    'view:proposals': true,
    'approve:proposals': true,
    'manage:schedules': true,
    'view:schedules': true,
    'generate:reports': true,
    'view:reports': true,
    'export:reports': true,
    'manage:users': true,
    'view:audit_logs': true,
  },
  [ROLES.TREASURER]: {
    'view:dashboard': true,
    'view:projects': true,
    'manage:budgets': true,
    'view:budgets': true,
    'manage:expenses': true,
    'view:expenses': true,
    'manage:documents': true,
    'view:documents': true,
    'view:proposals': true,
    'view:schedules': true,
    'generate:reports': true,
    'view:reports': true,
    'export:reports': true,
    'view:audit_logs': true,
  },
  [ROLES.SECRETARY]: {
    'view:dashboard': true,
    'manage:projects': true,
    'view:projects': true,
    'view:budgets': true,
    'view:expenses': true,
    'manage:documents': true,
    'view:documents': true,
    'manage:proposals': true,
    'create:proposals': true,
    'approve:proposals': true,
    'view:proposals': true,
    'manage:schedules': true,
    'view:schedules': true,
    'generate:reports': true,
    'view:reports': true,
    'export:reports': true,
    'view:audit_logs': true,
  },
  [ROLES.KAGAWAD]: {
    'view:dashboard': true,
    'view:projects': true,
    'view:budgets': true,
    'view:expenses': true,
    'view:documents': true,
    'create:proposals': true,
    'view:proposals': true,
    'view:schedules': true,
    'view:reports': true,
    'view:audit_logs': true,
  },
  [ROLES.ADMIN]: {
    'view:dashboard': true,
    'manage:projects': true,
    'view:projects': true,
    'manage:budgets': true,
    'view:budgets': true,
    'manage:expenses': true,
    'view:expenses': true,
    'manage:documents': true,
    'view:documents': true,
    'manage:proposals': true,
    'approve:proposals': true,
    'create:proposals': true,
    'view:proposals': true,
    'manage:schedules': true,
    'view:schedules': true,
    'generate:reports': true,
    'view:reports': true,
    'export:reports': true,
    'manage:users': true,
    'view:audit_logs': true,
  },
};

// ─── Navigation Items ─────────────────────────────────────
export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'MdDashboard', path: '/', permission: 'view:dashboard' },
  { key: 'projects', label: 'Projects', icon: 'MdFolder', path: '/projects', permission: 'view:projects' },
  { key: 'proposals', label: 'Proposals', icon: 'MdDescription', path: '/proposals', permission: 'view:proposals' },
  { key: 'budget', label: 'Budget', icon: 'MdAccountBalance', path: '/budget', permission: 'view:budgets' },
  { key: 'expenses', label: 'Expenses', icon: 'MdReceipt', path: '/expenses', permission: 'view:expenses' },
  { key: 'documents', label: 'Documents', icon: 'MdAttachFile', path: '/documents', permission: 'view:documents' },
  { key: 'schedule', label: 'Schedule', icon: 'MdCalendarToday', path: '/schedule', permission: 'view:schedules' },
  { key: 'reports', label: 'Reports', icon: 'MdAssessment', path: '/reports', permission: 'view:reports' },
  { key: 'audit', label: 'Audit Log', icon: 'MdHistory', path: '/audit', permission: 'view:audit_logs' },
  { key: 'users', label: 'Users', icon: 'MdPeople', path: '/users', permission: 'manage:users' },
];

// ─── Project Categories ───────────────────────────────────
export const PROJECT_CATEGORIES = [
  'Sports',
  'Education',
  'Health',
  'Environment',
  'Livelihood',
  'Social Services',
  'Infrastructure',
  'Culture & Arts',
  'Governance',
  'Other',
];

// ─── App Config ───────────────────────────────────────────
export const APP_CONFIG = {
  APP_NAME: 'SKTrack',
  APP_TAGLINE: 'SK Project, Budget & Records Management',
  CURRENCY: '₱',
  DATE_FORMAT: 'MMM dd, yyyy',
  DATETIME_FORMAT: 'MMM dd, yyyy hh:mm a',
  TIME_FORMAT: 'hh:mm a',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif'],
};
