'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createSOW, getClients, getProjects } from '@/lib/database';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Client, Project } from '@/types';
import { ArrowLeft, Save, FileText, Building2, FolderOpen, Users, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function NewSOWPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    sow_id: '',
    sow_name: '',
    project_id: '',
    client_id: '',
    sow_start_date: '',
    sow_end_date: '',
    total_head_count: '',
    billing_per_hour_day_month: 'hour' as const,
    sow_active: true,
    manager_name: '',
    sow_resmap: '',
    resource_type: '',
    billable_rate: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, projectsData] = await Promise.all([
          getClients(),
          getProjects()
        ]);
        setClients(clientsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!authLoading && profile) {
      fetchData();
    }
  }, [authLoading, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const sowData = {
        ...formData,
        total_head_count: parseInt(formData.total_head_count) || 0,
        billable_rate: parseFloat(formData.billable_rate) || 0
      };

      const result = await createSOW(sowData);
      
      if (result.error) {
        console.error('Error creating SOW:', result.error);
        return;
      }
      
      router.push('/finance/sows');
    } catch (error) {
      console.error('Error creating SOW:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    const clientProjects = projects.filter(p => p.client_id === clientId);
    
    setFilteredProjects(clientProjects);
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      project_id: '' // Reset project selection
    }));
  };

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId);
    setFormData(prev => ({
      ...prev,
      project_id: projectId,
      start_date: selectedProject?.start_date || '',
      end_date: selectedProject?.end_date || '',
      sow_start_date: selectedProject?.start_date || '',
      sow_end_date: selectedProject?.end_date || '',
      manager_name: selectedProject?.project_manager?.name || ''
    }));
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Create New SOW" />
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
                <p className="text-gray-600 mb-6">You don't have permission to create SOWs.</p>
                <Link href="/finance/sows">
                  <Button className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to SOWs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Create New SOW" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Create Statement of Work
              </h1>
              <p className="text-gray-600 text-lg">
                Define project scope and resource requirements
              </p>
            </div>
            <Link href="/finance/sows">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to SOWs
              </Button>
            </Link>
          </div>

          {/* Form */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                SOW Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                    Basic Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="sow_id" className="text-sm font-medium text-gray-700 mb-2 block">
                        SOW ID *
                      </Label>
                      <Input
                        id="sow_id"
                        value={formData.sow_id}
                        onChange={(e) => handleInputChange('sow_id', e.target.value)}
                        placeholder="e.g., SOW-2024-001"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="sow_name" className="text-sm font-medium text-gray-700 mb-2 block">
                        SOW Name *
                      </Label>
                      <Input
                        id="sow_name"
                        value={formData.sow_name}
                        onChange={(e) => handleInputChange('sow_name', e.target.value)}
                        placeholder="Enter SOW name"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="manager_name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Manager Name *
                      </Label>
                      <Input
                        id="manager_name"
                        value={formData.manager_name}
                        onChange={(e) => handleInputChange('manager_name', e.target.value)}
                        placeholder="Enter manager name"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sow_active"
                        checked={formData.sow_active}
                        onCheckedChange={(checked) => handleInputChange('sow_active', checked)}
                      />
                      <Label htmlFor="sow_active" className="text-sm font-medium text-gray-700">
                        SOW Active
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Client & Project */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-emerald-600" />
                    Client & Project
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
                      <Label htmlFor="project" className="text-sm font-medium text-gray-700 mb-2 block">
                        Project *
                      </Label>
                      <Select value={formData.project_id} onValueChange={handleProjectChange} disabled={!formData.client_id}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
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
                      <Label htmlFor="sow_start_date" className="text-sm font-medium text-gray-700 mb-2 block">
                        SOW Start Date *
                      </Label>
                      <Input
                        id="sow_start_date"
                        type="date"
                        value={formData.sow_start_date}
                        onChange={(e) => handleInputChange('sow_start_date', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="sow_end_date" className="text-sm font-medium text-gray-700 mb-2 block">
                        SOW End Date *
                      </Label>
                      <Input
                        id="sow_end_date"
                        type="date"
                        value={formData.sow_end_date}
                        onChange={(e) => handleInputChange('sow_end_date', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Resource Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Resource Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="total_head_count" className="text-sm font-medium text-gray-700 mb-2 block">
                        Total Head Count *
                      </Label>
                      <Input
                        id="total_head_count"
                        type="number"
                        value={formData.total_head_count}
                        onChange={(e) => handleInputChange('total_head_count', e.target.value)}
                        placeholder="Enter number of resources"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="resource_type" className="text-sm font-medium text-gray-700 mb-2 block">
                        Resource Type *
                      </Label>
                      <Select value={formData.resource_type} onValueChange={(value) => handleInputChange('resource_type', value)}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Consultant">Consultant</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="lg:col-span-2">
                      <Label htmlFor="sow_resmap" className="text-sm font-medium text-gray-700 mb-2 block">
                        SOW Resource Mapping *
                      </Label>
                      <Textarea
                        id="sow_resmap"
                        value={formData.sow_resmap}
                        onChange={(e) => handleInputChange('sow_resmap', e.target.value)}
                        placeholder="e.g., Senior Developer (2), UI/UX Designer (1), QA Engineer (1)"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Billing Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="billable_rate" className="text-sm font-medium text-gray-700 mb-2 block">
                        Billable Rate (₹) *
                      </Label>
                      <Input
                        id="billable_rate"
                        type="number"
                        value={formData.billable_rate}
                        onChange={(e) => handleInputChange('billable_rate', e.target.value)}
                        placeholder="Enter billable rate"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="billing_per_hour_day_month" className="text-sm font-medium text-gray-700 mb-2 block">
                        Billing Period *
                      </Label>
                      <Select value={formData.billing_per_hour_day_month} onValueChange={(value) => handleInputChange('billing_per_hour_day_month', value)}>
                        <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select billing period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Per Hour</SelectItem>
                          <SelectItem value="day">Per Day</SelectItem>
                          <SelectItem value="month">Per Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={loading || !formData.sow_id || !formData.sow_name || !formData.client_id || !formData.project_id || !formData.sow_start_date || !formData.sow_end_date || !formData.total_head_count || !formData.resource_type || !formData.sow_resmap || !formData.billable_rate}
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
                        Create SOW
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