export const USER_ROLES = {
  ADMIN: 'admin',
  CEO: 'ceo',
  PM: 'pm',
  FINANCE: 'finance',
  HR: 'hr',
  RESOURCE: 'resource'
} as const;

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const RESOURCE_STATUS = {
  ACTIVE: 'active',
  ON_BENCH: 'on_bench',
  INACTIVE: 'inactive'
} as const;

export const EMPLOYEE_TYPES = {
  FULLTIME: 'fulltime',
  CONSULTANT: 'consultant',
  INTERN: 'intern',
  CONTRACTOR: 'contractor'
} as const;

export const BILLING_STATUS = {
  BILLABLE: 'billable',
  NON_BILLABLE: 'non_billable',
  OVERHEAD: 'overhead'
} as const;

export const DOCUMENT_TYPES = {
  SOW: 'sow',
  MSA: 'msa',
  CR: 'cr',
  OTHER: 'other'
} as const;

export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  ALERT: 'alert',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;