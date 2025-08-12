import { supabase, isSupabaseConfigured } from "./supabase";
import {
  mockUsers,
  mockProjects,
  mockEmployees,
  mockDocuments,
  mockClients,
  mockSOWs,
} from "./mock-data";
import {
  Project,
  Resource,
  Document,
  DashboardStats,
  Client,
  SOW,
  User,
} from "@/types";

// Helper function to handle Supabase errors and fallback to mock data
const handleSupabaseError = (error: any, operation: string) => {
  console.warn(`${operation} error (falling back to mock data):`, error);
  return null; // Return null to trigger fallback
};

// Users
export const getUsers = async (): Promise<User[]> => {
  if (!isSupabaseConfigured) {
    return [...mockUsers];
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name");

    if (error) {
      handleSupabaseError(error, "fetch users");
      return [...mockUsers];
    }

    return data || mockUsers;
  } catch (error) {
    console.warn("Error fetching users (using mock data):", error);
    return [...mockUsers];
  }
};

export const getUser = async (id: string): Promise<User | null> => {
  if (!isSupabaseConfigured) {
    return mockUsers.find((u) => u.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // User not found
      }
      handleSupabaseError(error, "fetch user");
      return mockUsers.find((u) => u.id === id) || null;
    }

    return data;
  } catch (error) {
    console.warn("Error fetching user (using mock data):", error);
    return mockUsers.find((u) => u.id === id) || null;
  }
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured) {
    return mockProjects.map((project) => ({
      ...project,
      project_manager: mockUsers.find(
        (u) => u.id === project.project_manager_id
      ),
      client: mockClients.find((c) => c.id === project.client_id),
      resources: [],
      documents: mockDocuments.filter((d) => d.project_id === project.id),
      sows: mockSOWs.filter((s) => s.project_id === project.id),
    }));
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_manager:users!projects_project_manager_id_fkey(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      handleSupabaseError(error, "fetch projects");
      return mockProjects.map((project) => ({
        ...project,
        project_manager: mockUsers.find(
          (u) => u.id === project.project_manager_id
        ),
        client: mockClients.find((c) => c.id === project.client_id),
        resources: [],
        documents: mockDocuments.filter((d) => d.project_id === project.id),
        sows: mockSOWs.filter((s) => s.project_id === project.id),
      }));
    }

    return (data || []).map((project:any) => ({
      ...project,
      project_manager: project.project_manager,
      client: null, // Will be populated when we add clients table
      resources: [], // Will be populated from project_resources
      documents: [], // Will be populated separately
      sows: [], // Will be populated separately
    }));
  } catch (error) {
    console.warn("Error fetching projects (using mock data):", error);
    return mockProjects.map((project) => ({
      ...project,
      project_manager: mockUsers.find(
        (u) => u.id === project.project_manager_id
      ),
      client: mockClients.find((c) => c.id === project.client_id),
      resources: [],
      documents: mockDocuments.filter((d) => d.project_id === project.id),
      sows: mockSOWs.filter((s) => s.project_id === project.id),
    }));
  }
};

export const getProject = async (id: string): Promise<Project | null> => {
  if (!isSupabaseConfigured) {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) return null;

    return {
      ...project,
      project_manager: mockUsers.find(
        (u) => u.id === project.project_manager_id
      ),
      client: mockClients.find((c) => c.id === project.client_id),
      resources: [],
      documents: mockDocuments.filter((d) => d.project_id === project.id),
      sows: mockSOWs.filter((s) => s.project_id === project.id),
    };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_manager:users!projects_project_manager_id_fkey(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Project not found
      }
      handleSupabaseError(error, "fetch project");
      const project = mockProjects.find((p) => p.id === id);
      if (!project) return null;

      return {
        ...project,
        project_manager: mockUsers.find(
          (u) => u.id === project.project_manager_id
        ),
        client: mockClients.find((c) => c.id === project.client_id),
        resources: [],
        documents: mockDocuments.filter((d) => d.project_id === project.id),
        sows: mockSOWs.filter((s) => s.project_id === project.id),
      };
    }

    return {
      ...data,
      project_manager: data.project_manager,
      client: null,
      resources: [],
      documents: [],
      sows: [],
    };
  } catch (error) {
    console.warn("Error fetching project (using mock data):", error);
    const project = mockProjects.find((p) => p.id === id);
    if (!project) return null;

    return {
      ...project,
      project_manager: mockUsers.find(
        (u) => u.id === project.project_manager_id
      ),
      client: mockClients.find((c) => c.id === project.client_id),
      resources: [],
      documents: mockDocuments.filter((d) => d.project_id === project.id),
      sows: mockSOWs.filter((s) => s.project_id === project.id),
    };
  }
};

export const createProject = async (
  project: Omit<
    Project,
    | "id"
    | "created_at"
    | "updated_at"
    | "profit_margin"
    | "project_manager"
    | "resources"
    | "documents"
    | "client"
    | "sows"
  >
) => {
  if (!isSupabaseConfigured) {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      profit_margin:
        project.budget > 0
          ? ((project.budget - project.actual_cost) / project.budget) * 100
          : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_manager: mockUsers.find(
        (u) => u.id === project.project_manager_id
      ),
      client: mockClients.find((c) => c.id === project.client_id),
      resources: [],
      documents: [],
      sows: [],
    };
    mockProjects.push(newProject);
    return {
      data: newProject,
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name: project.name,
          description: project.description,
          start_date: project.start_date,
          end_date: project.end_date,
          status: project.status,
          budget: project.budget,
          actual_cost: project.actual_cost,
          client_name: project.client_name,
          project_manager_id: project.project_manager_id,
        },
      ])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "create project");
      // Fallback to mock data creation
      const newProject: Project = {
        ...project,
        id: `proj-${Date.now()}`,
        profit_margin:
          project.budget > 0
            ? ((project.budget - project.actual_cost) / project.budget) * 100
            : 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_manager: mockUsers.find(
          (u) => u.id === project.project_manager_id
        ),
        client: mockClients.find((c) => c.id === project.client_id),
        resources: [],
        documents: [],
        sows: [],
      };
      mockProjects.push(newProject);
      return {
        data: newProject,
        error: null,
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.warn("Error creating project (using mock data):", error);
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      profit_margin:
        project.budget > 0
          ? ((project.budget - project.actual_cost) / project.budget) * 100
          : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_manager: mockUsers.find(
        (u) => u.id === project.project_manager_id
      ),
      client: mockClients.find((c) => c.id === project.client_id),
      resources: [],
      documents: [],
      sows: [],
    };
    mockProjects.push(newProject);
    return {
      data: newProject,
      error: null,
    };
  }
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  if (!isSupabaseConfigured) {
    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      return {
        data: null,
        error: { message: "Project not found" },
      };
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    mockProjects[projectIndex] = updatedProject;
    return {
      data: updatedProject,
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .update({
        name: updates.name,
        description: updates.description,
        start_date: updates.start_date,
        end_date: updates.end_date,
        status: updates.status,
        budget: updates.budget,
        actual_cost: updates.actual_cost,
        client_name: updates.client_name,
        project_manager_id: updates.project_manager_id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "update project");
      // Fallback to mock data update
      const projectIndex = mockProjects.findIndex((p) => p.id === id);
      if (projectIndex === -1) {
        return {
          data: null,
          error: { message: "Project not found" },
        };
      }

      const updatedProject = {
        ...mockProjects[projectIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      mockProjects[projectIndex] = updatedProject;
      return {
        data: updatedProject,
        error: null,
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.warn("Error updating project (using mock data):", error);
    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      return {
        data: null,
        error: { message: "Project not found" },
      };
    }

    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    mockProjects[projectIndex] = updatedProject;
    return {
      data: updatedProject,
      error: null,
    };
  }
};

// Resources
export const getResources = async (): Promise<any[]> => {
  if (!isSupabaseConfigured) {
    const response = await fetch("http://localhost:3005/api/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log('data-data', data.data.employees)
    return [data.data.employees];
  }

  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("name");

    if (error) {
      handleSupabaseError(error, "fetch resources");
      return [...mockEmployees];
    }

    return (data.data.employees|| []).map((resource:any) => ({
      ...resource,
      // Map database fields to our Resource interface
      id: resource.id,
      employee_id: resource.id, // Use id as employee_id for compatibility
      name: resource.name,
      email: resource.email,
      role: resource.role,
      designation: resource.role, // Use role as designation
      department: resource.department || "Engineering",
      cost_center: "", // Not in database yet
      reporting_manager_id: null,
      dotted_line_manager_id: null,
      start_date: resource.start_date || new Date().toISOString().split("T")[0],
      end_date: null,
      employee_type: resource?.employee_type,
      location: resource?.location,
      billing_status: resource?.billing_status ,
      skill_set: resource.skill_set || [],
      utilization_target: resource.utilization_target,
      hourly_rate: resource.hourly_rate,
      current_utilization: resource.current_utilization,
      bench_time: resource.bench_time,
      status: resource.status,
      notes: resource.notes || "",
      created_at: resource.created_at,
      updated_at: resource.updated_at,
    }));
  } catch (error) {
    console.warn("Error fetching resources (using mock data):", error);
      return [...mockEmployees];
  }
};

export const getResource = async (id: string): Promise<Resource | null> => {
  if (!isSupabaseConfigured) {
    return mockEmployees.find((e:any) => e.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Resource not found
      }
      handleSupabaseError(error, "fetch resource");
      return mockEmployees.find((e:any) => e.id === id) || null;
    }

    return {
      ...data,
      employee_id: data.id,
      designation: data.role,
      department: data.department || "Engineering",
      cost_center: "",
      reporting_manager_id: null,
      dotted_line_manager_id: null,
      start_date: data.start_date || new Date().toISOString().split("T")[0],
      end_date: null,
      employee_type: "fulltime" as const,
      location: "Bangalore",
      billing_status: "billable" as const,
      skill_set: data.skill_set || [],
      notes: data.notes || "",
    };
  } catch (error) {
    console.warn("Error fetching resource (using mock data):", error);
    return mockEmployees.find((e:any) => e.id === id) || null;
  }
};

export const createResource = async (
  resource: Omit<Resource, "id" | "created_at" | "updated_at">
) => {
  if (!isSupabaseConfigured) {
    const newResource: Resource = {
      ...resource,
      id: `emp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockEmployees.push(newResource);
    return {
      data: newResource,
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("resources")
      .insert([
        {
          name: resource.name,
          email: resource.email,
          role: resource.role,
          skill_set: resource.skill,
          hourly_rate: resource.hourly_rate,
          utilization_target: resource.utilization_target,
          current_utilization: resource.current_utilization,
          bench_time: resource.bench_time,
          status: resource.status,
          department: resource.department,
          start_date: resource.start_date,
          notes: resource.notes,
        },
      ])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "create resource");
      // Fallback to mock data
      const newResource: Resource = {
        ...resource,
        id: `emp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockEmployees.push(newResource);
      return {
        data: newResource,
        error: null,
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.warn("Error creating resource (using mock data):", error);
    const newResource: Resource = {
      ...resource,
      id: `emp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockEmployees.push(newResource);
    return {
      data: newResource,
      error: null,
    };
  }
};

export const updateResource = async (
  id: string,
  updates: Partial<Resource>
) => {
  if (!isSupabaseConfigured) {
    const resourceIndex = mockEmployees.findIndex((e:any) => e.id === id);
    if (resourceIndex === -1) {
      return {
        data: null,
        error: { message: "Resource not found" },
      };
    }

    const updatedResource = {
      ...mockEmployees[resourceIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    mockEmployees[resourceIndex] = updatedResource;
    return {
      data: updatedResource,
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("resources")
      .update({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        skill_set: updates.skill,
        hourly_rate: updates.hourly_rate,
        utilization_target: updates.utilization_target,
        current_utilization: updates.current_utilization,
        bench_time: updates.bench_time,
        status: updates.status,
        department: updates.department,
        start_date: updates.start_date,
        notes: updates.notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "update resource");
      // Fallback to mock data
      const resourceIndex = mockEmployees.findIndex((e:any) => e.id === id);
      if (resourceIndex === -1) {
        return {
          data: null,
          error: { message: "Resource not found" },
        };
      }

      const updatedResource = {
        ...mockEmployees[resourceIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      mockEmployees[resourceIndex] = updatedResource;
      return {
        data: updatedResource,
        error: null,
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.warn("Error updating resource (using mock data):", error);
    const resourceIndex = mockEmployees.findIndex((e:any) => e.id === id);
    if (resourceIndex === -1) {
      return {
        data: null,
        error: { message: "Resource not found" },
      };
    }

    const updatedResource = {
      ...mockEmployees[resourceIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    mockEmployees[resourceIndex] = updatedResource;
    return {
      data: updatedResource,
      error: null,
    };
  }
};

// Documents
export const getDocuments = async (projectId?: string): Promise<Document[]> => {
  if (!isSupabaseConfigured) {
    let documents = mockDocuments.map((doc) => ({
      ...doc,
      uploader: mockUsers.find((u) => u.id === doc.uploaded_by),
      project: mockProjects.find((p) => p.id === doc.project_id),
    }));

    if (projectId) {
      documents = documents.filter((d) => d.project_id === projectId);
    }

    return documents;
  }

  try {
    let query = supabase
      .from("documents")
      .select(
        `
        *,
        uploader:users!documents_uploaded_by_fkey(*),
        project:projects(*)
      `
      )
      .order("created_at", { ascending: false });

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;

    if (error) {
      handleSupabaseError(error, "fetch documents");
      let documents = mockDocuments.map((doc) => ({
        ...doc,
        uploader: mockUsers.find((u) => u.id === doc.uploaded_by),
        project: mockProjects.find((p) => p.id === doc.project_id),
      }));

      if (projectId) {
        documents = documents.filter((d) => d.project_id === projectId);
      }

      return documents;
    }

    return (data || []).map((doc:any) => ({
      ...doc,
      uploader: doc.uploader,
      project: doc.project,
    }));
  } catch (error) {
    console.warn("Error fetching documents (using mock data):", error);
    let documents = mockDocuments.map((doc) => ({
      ...doc,
      uploader: mockUsers.find((u) => u.id === doc.uploaded_by),
      project: mockProjects.find((p) => p.id === doc.project_id),
    }));

    if (projectId) {
      documents = documents.filter((d) => d.project_id === projectId);
    }

    return documents;
  }
};

export const uploadDocument = async (
  document: Omit<
    Document,
    "id" | "created_at" | "updated_at" | "uploader" | "project"
  >
) => {
  if (!isSupabaseConfigured) {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      uploader: mockUsers.find((u) => u.id === document.uploaded_by),
      project: mockProjects.find((p) => p.id === document.project_id),
    };
    mockDocuments.push(newDocument);
    return {
      data: newDocument,
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("documents")
      .insert([
        {
          name: document.name,
          type: document.type,
          file_url: document.file_url,
          file_size: document.file_size,
          uploaded_by: document.uploaded_by,
          project_id: document.project_id,
          tags: document.tags,
          version: document.version,
        },
      ])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, "upload document");
      // Fallback to mock data
      const newDocument: Document = {
        ...document,
        id: `doc-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        uploader: mockUsers.find((u) => u.id === document.uploaded_by),
        project: mockProjects.find((p) => p.id === document.project_id),
      };
      mockDocuments.push(newDocument);
      return {
        data: newDocument,
        error: null,
      };
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.warn("Error uploading document (using mock data):", error);
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      uploader: mockUsers.find((u) => u.id === document.uploaded_by),
      project: mockProjects.find((p) => p.id === document.project_id),
    };
    mockDocuments.push(newDocument);
    return {
      data: newDocument,
      error: null,
    };
  }
};

// Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (!isSupabaseConfigured) {
    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(
      (p) => p.status === "active"
    ).length;
    const totalRevenue = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalProfit = mockProjects.reduce(
      (sum, p) => sum + (p.budget - p.actual_cost),
      0
    );
    const averageUtilization =
      mockEmployees.reduce((sum:any, e:any) => sum + e.current_utilization, 0) /
      mockEmployees.length;
    const resourcesOnBench = mockEmployees.filter(
      (e:any) => e.status === "on_bench"
    ).length;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingDeadlines = mockProjects
      .filter(
        (p) =>
          new Date(p.end_date) <= thirtyDaysFromNow && p.status === "active"
      )
      .slice(0, 5)
      .map((project) => ({
        ...project,
        project_manager: mockUsers.find(
          (u) => u.id === project.project_manager_id
        ),
        client: mockClients.find((c) => c.id === project.client_id),
        resources: [],
        documents: mockDocuments.filter((d) => d.project_id === project.id),
        sows: mockSOWs.filter((s) => s.project_id === project.id),
      }));

    return {
      total_projects: totalProjects,
      active_projects: activeProjects,
      total_revenue: totalRevenue,
      total_profit: totalProfit,
      average_utilization: averageUtilization,
      resources_on_bench: resourcesOnBench,
      upcoming_deadlines: upcomingDeadlines,
      recent_activity: [],
    };
  }

  try {
    // Get projects
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*");

    // Get resources
    const { data: resources, error: resourcesError } = await supabase
      .from("resources")
      .select("*");

    // If either query fails, fall back to mock data
    if (projectsError || resourcesError) {
      console.warn("Error fetching stats data, using mock data");
      const totalProjects = mockProjects.length;
      const activeProjects = mockProjects.filter(
        (p) => p.status === "active"
      ).length;
      const totalRevenue = mockProjects.reduce((sum, p) => sum + p.budget, 0);
      const totalProfit = mockProjects.reduce(
        (sum, p) => sum + (p.budget - p.actual_cost),
        0
      );
      const averageUtilization =
        mockEmployees.reduce((sum:any, e:any) => sum + e.current_utilization, 0) /
        mockEmployees.length;
      const resourcesOnBench = mockEmployees.filter(
        (e:any) => e.status === "on_bench"
      ).length;

      return {
        total_projects: totalProjects,
        active_projects: activeProjects,
        total_revenue: totalRevenue,
        total_profit: totalProfit,
        average_utilization: averageUtilization,
        resources_on_bench: resourcesOnBench,
        upcoming_deadlines: [],
        recent_activity: [],
      };
    }

    // Calculate stats
    const totalProjects = projects?.length || 0;
    const activeProjects =
      projects?.filter((p:any) => p.status === "active").length || 0;
    const totalRevenue =
      projects?.reduce((sum:any, p:any) => sum + (p.budget || 0), 0) || 0;
    const totalProfit =
      projects?.reduce(
        (sum:any, p:any) => sum + ((p.budget || 0) - (p.actual_cost || 0)),
        0
      ) || 0;
    const averageUtilization = resources?.length
      ? resources.reduce((sum:any, r:any) => sum + (r.current_utilization || 0), 0) /
        resources.length
      : 0;
    const resourcesOnBench =
      resources?.filter((r:any) => r.status === "on_bench").length || 0;

    // Get upcoming deadlines
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingDeadlines =
      projects
        ?.filter(
          (p:any) =>
            new Date(p.end_date) <= thirtyDaysFromNow && p.status === "active"
        )
        .slice(0, 5) || [];

    return {
      total_projects: totalProjects,
      active_projects: activeProjects,
      total_revenue: totalRevenue,
      total_profit: totalProfit,
      average_utilization: averageUtilization,
      resources_on_bench: resourcesOnBench,
      upcoming_deadlines: upcomingDeadlines.map((project:any) => ({
        ...project,
        project_manager: null,
        client: null,
        resources: [],
        documents: [],
        sows: [],
      })),
      recent_activity: [],
    };
  } catch (error) {
    console.warn("Error fetching dashboard stats (using mock data):", error);
    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(
      (p) => p.status === "active"
    ).length;
    const totalRevenue = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalProfit = mockProjects.reduce(
      (sum, p) => sum + (p.budget - p.actual_cost),
      0
    );
    const averageUtilization =
      mockEmployees.reduce((sum:any, e:any) => sum + e.current_utilization, 0) /
      mockEmployees.length;
    const resourcesOnBench = mockEmployees.filter(
      (e:any) => e.status === "on_bench"
    ).length;

    return {
      total_projects: totalProjects,
      active_projects: activeProjects,
      total_revenue: totalRevenue,
      total_profit: totalProfit,
      average_utilization: averageUtilization,
      resources_on_bench: resourcesOnBench,
      upcoming_deadlines: [],
      recent_activity: [],
    };
  }
};

// Clients (using mock data for now)
export const getClients = async (): Promise<Client[]> => {
  return [...mockClients];
};

export const getClient = async (id: string): Promise<Client | null> => {
  return mockClients.find((c) => c.id === id) || null;
};

export const createClient = async (
  client: Omit<Client, "id" | "created_at" | "updated_at">
) => {
  const newClient: Client = {
    ...client,
    id: `client-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockClients.push(newClient);
  return {
    data: newClient,
    error: null,
  };
};

export const updateClient = async (id: string, updates: Partial<Client>) => {
  const clientIndex = mockClients.findIndex((c) => c.id === id);
  if (clientIndex === -1) {
    return {
      data: null,
      error: { message: "Client not found" },
    };
  }

  const updatedClient = {
    ...mockClients[clientIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  mockClients[clientIndex] = updatedClient;
  return {
    data: updatedClient,
    error: null,
  };
};

// SOWs (using mock data for now)
export const getSOWs = async (): Promise<SOW[]> => {
  return mockSOWs.map((sow) => ({
    ...sow,
    project: mockProjects.find((p) => p.id === sow.project_id),
    client: mockClients.find((c) => c.id === sow.client_id),
  }));
};

export const getSOW = async (id: string): Promise<SOW | null> => {
  const sow = mockSOWs.find((s) => s.id === id);
  if (!sow) return null;

  return {
    ...sow,
    project: mockProjects.find((p) => p.id === sow.project_id),
    client: mockClients.find((c) => c.id === sow.client_id),
  };
};

export const createSOW = async (
  sow: Omit<SOW, "id" | "created_at" | "updated_at" | "project" | "client">
) => {
  const newSOW: SOW = {
    ...sow,
    id: `sow-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    project: mockProjects.find((p) => p.id === sow.project_id),
    client: mockClients.find((c) => c.id === sow.client_id),
  };
  mockSOWs.push(newSOW);
  return {
    data: newSOW,
    error: null,
  };
};

export const updateSOW = async (id: string, updates: Partial<SOW>) => {
  const sowIndex = mockSOWs.findIndex((s) => s.id === id);
  if (sowIndex === -1) {
    return {
      data: null,
      error: { message: "SOW not found" },
    };
  }

  const updatedSOW = {
    ...mockSOWs[sowIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  mockSOWs[sowIndex] = updatedSOW;
  return {
    data: updatedSOW,
    error: null,
  };
};

// Upcoming Bench Report
export const getUpcomingBenchReport = async () => {
  try {
    const projects = await getProjects();
    const resources = await getResources();

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Find projects ending within 30 days
    const endingProjects = projects.filter((project) => {
      const endDate = new Date(project.end_date);
      const today = new Date();
      return (
        endDate <= thirtyDaysFromNow &&
        endDate >= today &&
        project.status === "active"
      );
    });

    // Mock project-resource assignments for demo
    const projectResourceAssignments = [
      {
        projectId: "650e8400-e29b-41d4-a716-446655440001",
        resourceIds: ["emp-001", "emp-002", "emp-007"],
      },
      {
        projectId: "650e8400-e29b-41d4-a716-446655440002",
        resourceIds: ["emp-003", "emp-004", "emp-005"],
      },
      {
        projectId: "650e8400-e29b-41d4-a716-446655440005",
        resourceIds: ["emp-006", "emp-008"],
      },
    ];

    // Get resources that will be available soon
    const upcomingBenchResources = endingProjects.flatMap((project) => {
      const assignment = projectResourceAssignments.find(
        (a) => a.projectId === project.id
      );
      if (!assignment) return [];

      return assignment.resourceIds
        .map((resourceId) => {
          const resource = resources.find((r) => r.id === resourceId);
          if (!resource) return null;

          return {
            resource,
            project,
            daysUntilAvailable: Math.ceil(
              (new Date(project.end_date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            projectManager: project.project_manager,
          };
        })
        .filter(Boolean);
    });

    return upcomingBenchResources.sort(
      (a:any, b:any) => a.daysUntilAvailable - b.daysUntilAvailable
    );
  } catch (error) {
    console.warn(
      "Error fetching upcoming bench report (using mock data):",
      error
    );
    return [];
  }
};
