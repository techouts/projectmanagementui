'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createProject, getClients } from '@/lib/database';
import { mockUsers } from '@/lib/mock-data';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client } from '@/types';
import { ArrowLeft, Save, FolderOpen, Calendar, DollarSign, User, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planning' as const,
    budget: '',
    actual_cost: '0',
    client_name: '',
    client_id: '',
    project_manager_id: ''
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    if (!authLoading && profile) {
      fetchClients();
    }
  }, [authLoading, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        actual_cost: parseFloat(formData.actual_cost) || 0
      };

      const result = await createProject(projectData);
      
      if (result.error) {
        console.error('Error creating project:', result.error);
        return;
      }
      
      router.push('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      client_name: selectedClient?.client_name || ''
    }));
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Add New Project" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-xl w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check permissions
  if (!profile || !['finance', 'ceo', 'admin', 'pm'].includes(profile.role)) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Access Denied" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">You don't have permission to add new projects.</p>
                <Link href="/projects">
                  <Button className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Get project managers
  const projectManagers = mockUsers.filter(u => u.role === 'pm' || u.role === 'admin' || u.role === 'ceo');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Add New Project" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Add New Project
              </h1>
              <p className="text-gray-600 text-lg">
                Create a new project for client engagement
              </p>
            </div>
            <Link href="/projects">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>

          {/* Form */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <FolderOpen className="h-5 w-5 mr-2 text-indigo-600" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2 text-indigo-600" />
                    Basic Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Project Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter project name"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                        Status *
                      </Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="lg:col-span-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter project description"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-emerald-600" />
                    Client Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="client" className="text-sm font-medium text-gray-700 mb-2 block">
                        Client *
                      </Label>
                      <Select value={formData.client_id} onValueChange={handleClientChange}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.client_name} ({client.client_id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="project_manager_id" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <User className="h-4 w-4 mr-1" />
                        Project Manager *
                      </Label>
                      <Select value={formData.project_manager_id} onValueChange={(value) => handleInputChange('project_manager_id', value)}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select project manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectManagers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name} ({manager.role.toUpperCase()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                    Timeline
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="start_date" className="text-sm font-medium text-gray-700 mb-2 block">
                        Start Date *
                      </Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="end_date" className="text-sm font-medium text-gray-700 mb-2 block">
                        End Date *
                      </Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Financial Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="budget" className="text-sm font-medium text-gray-700 mb-2 block">
                        Budget (₹) *
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="Enter project budget"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="actual_cost" className="text-sm font-medium text-gray-700 mb-2 block">
                        Actual Cost (₹)
                      </Label>
                      <Input
                        id="actual_cost"
                        type="number"
                        value={formData.actual_cost}
                        onChange={(e) => handleInputChange('actual_cost', e.target.value)}
                        placeholder="Enter actual cost"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={loading || !formData.name || !formData.client_id || !formData.project_manager_id || !formData.start_date || !formData.end_date || !formData.budget}
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Project
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}