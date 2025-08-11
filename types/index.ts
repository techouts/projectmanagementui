export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "ceo" | "pm" | "finance" | "hr" | "resource";
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  department: string;
  cost_center: string;
  reporting_manager_id?: string | null;
  dotted_line_manager_id?: string | null;
  start_date: string;
  end_date?: string | null;
  employee_type: "fulltime" | "consultant" | "intern" | "contractor";
  location: string;
  billing_status: "billable" | "non_billable" | "overhead";
  skill_set: string[];
  utilization_target: number;
  hourly_rate: number;
  current_utilization: number;
  bench_time: number;
  status: "active" | "on_bench" | "inactive";
  notes: string;
  created_at: string;
  updated_at: string;
  reporting_manager?: User;
  dotted_line_manager?: User;
  billingStatus: any;
  employeeType: any;
  utilizationTarget: any;
}

// Resource is an alias for Employee for backward compatibility
export type Resource = Employee;

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  budget: number;
  actual_cost: number;
  profit_margin?: number | null;
  client_name: string;
  client_id?: string;
  project_manager_id?: string | null;
  created_at: string;
  updated_at: string;
  project_manager?: User | null;
  client?: Client | null;
  resources?: Resource[];
  documents?: Document[];
  sows?: SOW[];
}

export interface Document {
  id: string;
  name: string;
  type: "sow" | "msa" | "cr" | "other";
  file_url: string;
  file_size: number;
  uploaded_by: string;
  project_id?: string | null;
  tags: string[];
  version: number;
  created_at: string;
  updated_at: string;
  uploader?: User;
  project?: Project | null;
}

export interface Client {
  id: string;
  client_id: string;
  client_name: string;
  contact_1_name: string;
  contact_1_email: string;
  contact_1_phone: string;
  contact_2_name?: string;
  contact_2_email?: string;
  contact_2_phone?: string;
  acc_contact_name?: string;
  acc_contact_email?: string;
  acc_contact_phone?: string;
  mailing_address: string;
  location: string;
  msa_link?: string;
  current_msa_start_date?: string;
  current_msa_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface SOW {
  id: string;
  sow_id: string;
  sow_name: string;
  project_id: string;
  client_id: string;
  sow_start_date: string;
  sow_end_date: string;
  total_head_count: number;
  billing_per_hour_day_month: "hour" | "day" | "month";
  sow_active: boolean;
  manager_name: string;
  sow_resmap: string;
  resource_type: string;
  billable_rate: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  client?: Client;
}

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  total_revenue: number;
  total_profit: number;
  average_utilization: number;
  resources_on_bench: number;
  upcoming_deadlines: Project[];
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string;
  metadata: any;
  created_at: string;
  user?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "reminder" | "alert" | "info" | "success" | "warning" | "error";
  read: boolean;
  action_url?: string | null;
  created_at: string;
}
