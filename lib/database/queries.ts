import { User, Project, Employee, Document, DashboardStats, Client, SOW } from '@/types';
import { mockUsers, mockProjects, mockEmployees, mockDocuments, mockClients, mockSOWs } from '../mock-data';

// User queries
export const userQueries = {
  async findByEmail(email: string): Promise<(User & { password_hash?: string }) | null> {
    const user = mockUsers.find(u => u.email === email);
    return user ? { ...user, password_hash: '$2b$10$hashedpassword' } : null;
  },

  async findById(id: string): Promise<(User & { password_hash?: string }) | null> {
    const user = mockUsers.find(u => u.id === id);
    return user ? { ...user, password_hash: '$2b$10$hashedpassword' } : null;
  },

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password_hash: string }): Promise<User & { password_hash: string }> {
    const newUser = {
      ...user,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<(User & { password_hash?: string }) | null> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    const updatedUser = { 
      ...mockUsers[userIndex], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    mockUsers[userIndex] = updatedUser;
    return { ...updatedUser, password_hash: '$2b$10$hashedpassword' };
  }
};

// Client queries
export const clientQueries = {
  async findAll(): Promise<Client[]> {
    return [...mockClients];
  },

  async findById(id: string): Promise<Client | null> {
    return mockClients.find(c => c.id === id) || null;
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockClients.push(newClient);
    return newClient;
  },

  async update(id: string, updates: Partial<Client>): Promise<Client | null> {
    const clientIndex = mockClients.findIndex(c => c.id === id);
    if (clientIndex === -1) return null;
    
    const updatedClient = {
      ...mockClients[clientIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    mockClients[clientIndex] = updatedClient;
    return updatedClient;
  }
};

// SOW queries
export const sowQueries = {
  async findAll(): Promise<SOW[]> {
    return mockSOWs.map(sow => ({
      ...sow,
      project: mockProjects.find(p => p.id === sow.project_id),
      client: mockClients.find(c => c.id === sow.client_id)
    }));
  },

  async findById(id: string): Promise<SOW | null> {
    const sow = mockSOWs.find(s => s.id === id);
    if (!sow) return null;
    
    return {
      ...sow,
      project: mockProjects.find(p => p.id === sow.project_id),
      client: mockClients.find(c => c.id === sow.client_id)
    };
  },

  async create(sow: Omit<SOW, 'id' | 'created_at' | 'updated_at' | 'project' | 'client'>): Promise<SOW> {
    const newSOW: SOW = {
      ...sow,
      id: `sow-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project: mockProjects.find(p => p.id === sow.project_id),
      client: mockClients.find(c => c.id === sow.client_id)
    };
    mockSOWs.push(newSOW);
    return newSOW;
  },

  async update(id: string, updates: Partial<SOW>): Promise<SOW | null> {
    const sowIndex = mockSOWs.findIndex(s => s.id === id);
    if (sowIndex === -1) return null;
    
    const updatedSOW = {
      ...mockSOWs[sowIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    mockSOWs[sowIndex] = updatedSOW;
    return updatedSOW;
  }
};

// Project queries
export const projectQueries = {
  async findAll(): Promise<Project[]> {
    return mockProjects.map(project => ({
      ...project,
      project_manager: mockUsers.find(u => u.id === project.project_manager_id),
      client: mockClients.find(c => c.id === project.client_id),
      resources: [],
      documents: mockDocuments.filter(d => d.project_id === project.id),
      sows: mockSOWs.filter(s => s.project_id === project.id)
    }));
  },

  async findById(id: string): Promise<Project | null> {
    const project = mockProjects.find(p => p.id === id);
    if (!project) return null;
    
    return {
      ...project,
      project_manager: mockUsers.find(u => u.id === project.project_manager_id),
      client: mockClients.find(c => c.id === project.client_id),
      resources: [],
      documents: mockDocuments.filter(d => d.project_id === project.id),
      sows: mockSOWs.filter(s => s.project_id === project.id)
    };
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'profit_margin' | 'project_manager' | 'resources' | 'documents' | 'client' | 'sows'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      profit_margin: project.budget > 0 ? ((project.budget - project.actual_cost) / project.budget) * 100 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_manager: mockUsers.find(u => u.id === project.project_manager_id),
      client: mockClients.find(c => c.id === project.client_id),
      resources: [],
      documents: [],
      sows: []
    };
    mockProjects.push(newProject);
    return newProject;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) return null;
    
    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    mockProjects[projectIndex] = updatedProject;
    return updatedProject;
  }
};

// Employee queries (renamed from resource queries)
export const resourceQueries = {
  async findAll(): Promise<Employee[]> {
    return [...mockEmployees];
  },

  async findById(id: string): Promise<Employee | null> {
    return mockEmployees.find((e:any)=> e?.id === id) || null;
  },

  async create(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'reporting_manager' | 'dotted_line_manager'>): Promise<Employee> {
    const newEmployee: Employee = {
      ...employee,
      id: `emp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockEmployees.push(newEmployee);
    return newEmployee;
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee | null> {
    const employeeIndex = mockEmployees.findIndex((e:any) => e?.id === id);
    if (employeeIndex === -1) return null;
    
    const updatedEmployee = {
      ...mockEmployees[employeeIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    mockEmployees[employeeIndex] = updatedEmployee;
    return updatedEmployee;
  }
};

// Document queries
export const documentQueries = {
  async findAll(projectId?: string): Promise<Document[]> {
    let documents = mockDocuments.map(doc => ({
      ...doc,
      uploader: mockUsers.find(u => u.id === doc.uploaded_by),
      project: mockProjects.find(p => p.id === doc.project_id)
    }));
    
    if (projectId) {
      documents = documents.filter(d => d.project_id === projectId);
    }
    
    return documents;
  },

  async create(document: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'uploader' | 'project'>): Promise<Document> {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      uploader: mockUsers.find(u => u.id === document.uploaded_by),
      project: mockProjects.find(p => p.id === document.project_id)
    };
    mockDocuments.push(newDocument);
    return newDocument;
  }
};

// Dashboard stats
export const dashboardQueries = {
  async getStats(): Promise<DashboardStats> {
    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(p => p.status === 'active').length;
    const totalRevenue = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalProfit = mockProjects.reduce((sum, p) => sum + (p.budget - p.actual_cost), 0);
    const averageUtilization = mockEmployees.reduce((sum:any, e:any) => sum + e.current_utilization, 0) / mockEmployees.length;
    const resourcesOnBench = mockEmployees.filter((e:any) => e?.status === 'on_bench').length;
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const upcomingDeadlines = mockProjects
      .filter(p => new Date(p.end_date) <= thirtyDaysFromNow && p.status === 'active')
      .slice(0, 5)
      .map(project => ({
        ...project,
        project_manager: mockUsers.find(u => u.id === project.project_manager_id),
        client: mockClients.find(c => c.id === project.client_id),
        resources: [],
        documents: mockDocuments.filter(d => d.project_id === project.id),
        sows: mockSOWs.filter(s => s.project_id === project.id)
      }));
    
    return {
      total_projects: totalProjects,
      active_projects: activeProjects,
      total_revenue: totalRevenue,
      total_profit: totalProfit,
      average_utilization: averageUtilization,
      resources_on_bench: resourcesOnBench,
      upcoming_deadlines: upcomingDeadlines,
      recent_activity: []
    };
  }
};