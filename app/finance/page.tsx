'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getProjects, getClients, getSOWs, getResources } from '@/lib/database';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Building2,
  FolderOpen,
  FileText,
  Users,
  Plus,
  Download,
  Upload,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Clock,
  Star,
  Rocket,
  Activity,
  Calendar,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { Project, Client, SOW, Employee } from '@/types';
import Link from 'next/link';

export default function FinanceManagerPage() {
  const { profile, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sows, setSOWs] = useState<SOW[]>([]);
  const [resources, setResources] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, clientsData, sowsData, resourcesData] = await Promise.all([
          getProjects(),
          getClients(),
          getSOWs(),
          getResources()
        ]);
        
        setProjects(projectsData);
        setClients(clientsData);
        setSOWs(sowsData);
        setResources(resourcesData);
      } catch (error) {
        console.error('Error fetching finance data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile && (profile.role === 'finance' || profile.role === 'ceo' || profile.role === 'admin')) {
      fetchData();
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Finance Manager" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded-xl w-1/4"></div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl" />
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-xl" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile || !['finance', 'ceo', 'admin'].includes(profile.role)) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Finance Manager" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">Access Denied</h2>
                  <p className="text-gray-600 text-lg">
                    You don't have permission to access the Finance Manager dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalProfit = projects.reduce((sum, p) => sum + (p.budget - p.actual_cost), 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const activeSOWs = sows.filter(s => s.sow_active).length;
  const totalSOWValue = sows.reduce((sum, s) => sum + (s.billable_rate * s.total_head_count * 160), 0); // Assuming 160 hours/month

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Finance Manager Dashboard" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Finance Manager Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Comprehensive financial management and client operations
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Total Revenue',
                value: formatCurrency(totalRevenue),
                description: `${profitMargin.toFixed(1)}% profit margin`,
                icon: DollarSign,
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200',
                trend: profitMargin > 20 ? 'up' : 'neutral'
              },
              {
                title: 'Active Clients',
                value: clients.length,
                description: `${clients.filter(c => c.current_msa_start_date).length} with MSA`,
                icon: Building2,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                trend: 'up'
              },
              {
                title: 'Active Projects',
                value: projects.filter(p => p.status === 'active').length,
                description: `${projects.length} total projects`,
                icon: FolderOpen,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                trend: 'up'
              },
              {
                title: 'Active SOWs',
                value: activeSOWs,
                description: formatCurrency(totalSOWValue),
                icon: FileText,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                trend: 'up'
              }
            ].map((metric, index) => (
              <Card key={index} className={`shadow-sm border-0 ${metric.bgColor} ${metric.borderColor} border hover:shadow-md transition-all duration-300`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700">{metric.title}</CardTitle>
                  <div className="p-2 rounded-xl bg-white shadow-sm">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{metric.description}</span>
                    {metric.trend === 'up' && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Good
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Management Tabs */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 mr-3 text-indigo-600" />
                Financial Management Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 rounded-xl bg-gray-100 p-1">
                  <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                  <TabsTrigger value="clients" className="rounded-lg">Clients</TabsTrigger>
                  <TabsTrigger value="projects" className="rounded-lg">Projects</TabsTrigger>
                  <TabsTrigger value="sows" className="rounded-lg">SOWs</TabsTrigger>
                  <TabsTrigger value="resources" className="rounded-lg">Resources</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {/* Enhanced Quick Actions */}
                    <Card className="relative overflow-hidden border border-gray-200 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>
                      </div>

                      <CardHeader className="relative pb-4">
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <Rocket className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              Quick Actions
                              <Sparkles className="h-5 w-5 ml-2 text-yellow-500 animate-pulse" />
                            </div>
                            <p className="text-sm font-normal text-gray-600 mt-1">Streamline your workflow with one-click actions</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="relative space-y-4">
                        {/* Primary Action Cards */}
                        <div className="space-y-3">
                          <Link href="/finance/clients/new">
                            <div className="group/item relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 h-full">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-white/20 group-hover/item:bg-white/30 transition-colors duration-300 group-hover/item:scale-110 transform">
                                      <Building2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-white text-lg">Add New Client</h3>
                                      <p className="text-blue-100 text-sm">Create client profile & MSA</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Popular
                                    </Badge>
                                    <ArrowRight className="h-5 w-5 text-white group-hover/item:translate-x-1 transition-transform duration-300" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/finance/projects/new">
                            <div className="group/item relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 h-full">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-white/20 group-hover/item:bg-white/30 transition-colors duration-300 group-hover/item:scale-110 transform">
                                      <FolderOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-white text-lg">Create Project</h3>
                                      <p className="text-purple-100 text-sm">Setup new engagement</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                      <Activity className="h-3 w-3 mr-1" />
                                      Active
                                    </Badge>
                                    <ArrowRight className="h-5 w-5 text-white group-hover/item:translate-x-1 transition-transform duration-300" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          <Link href="/finance/sows/new">
                            <div className="group/item relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 p-1 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 h-full">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-white/20 group-hover/item:bg-white/30 transition-colors duration-300 group-hover/item:scale-110 transform">
                                      <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-white text-lg">Create SOW</h3>
                                      <p className="text-emerald-100 text-sm">Define scope & resources</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Ready
                                    </Badge>
                                    <ArrowRight className="h-5 w-5 text-white group-hover/item:translate-x-1 transition-transform duration-300" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Secondary Actions Grid */}
                        <div className="pt-4 border-t border-gray-200/50">
                          <div className="grid grid-cols-2 gap-3">
                            <Button className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-300 h-14 transform hover:-translate-y-0.5">
                              <div className="flex items-center justify-center space-x-2">
                                <Users className="h-5 w-5 text-white group-hover/btn:scale-110 transition-transform" />
                                <span className="font-semibold text-white">Assign Resources</span>
                              </div>
                            </Button>
                            
                            <Button variant="outline" className="group/btn relative overflow-hidden rounded-xl border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 h-14 transform hover:-translate-y-0.5">
                              <div className="flex items-center justify-center space-x-2">
                                <Target className="h-5 w-5 text-gray-600 group-hover/btn:text-indigo-600 group-hover/btn:scale-110 transition-all" />
                                <span className="font-semibold text-gray-700 group-hover/btn:text-indigo-700">Quick Reports</span>
                              </div>
                            </Button>
                          </div>
                        </div>

                        {/* Enhanced Stats Grid */}
                        <div className="pt-4 border-t border-gray-200/50">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="group/stat relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                              <div className="flex items-center justify-between mb-2">
                                <Building2 className="h-5 w-5 text-blue-600 group-hover/stat:scale-110 transition-transform" />
                                <Badge className="bg-blue-500 text-white text-xs">+{clients.filter(c => {
                                  const created = new Date(c.created_at);
                                  const now = new Date();
                                  return created.getMonth() === now.getMonth();
                                }).length}</Badge>
                              </div>
                              <div className="text-2xl font-bold text-blue-700">{clients.length}</div>
                              <div className="text-xs text-blue-600 font-medium">Clients</div>
                            </div>
                            
                            <div className="group/stat relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                              <div className="flex items-center justify-between mb-2">
                                <FolderOpen className="h-5 w-5 text-purple-600 group-hover/stat:scale-110 transition-transform" />
                                <Badge className="bg-purple-500 text-white text-xs">
                                  {projects.filter(p => p.status === 'active').length}
                                </Badge>
                              </div>
                              <div className="text-2xl font-bold text-purple-700">{projects.length}</div>
                              <div className="text-xs text-purple-600 font-medium">Projects</div>
                            </div>
                            
                            <div className="group/stat relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                              <div className="flex items-center justify-between mb-2">
                                <FileText className="h-5 w-5 text-emerald-600 group-hover/stat:scale-110 transition-transform" />
                                <Badge className="bg-emerald-500 text-white text-xs">
                                  {sows.filter(s => s.sow_active).length}
                                </Badge>
                              </div>
                              <div className="text-2xl font-bold text-emerald-700">{sows.length}</div>
                              <div className="text-xs text-emerald-600 font-medium">SOWs</div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Access Footer */}
                        <div className="pt-4 border-t border-gray-200/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Zap className="h-4 w-4 text-indigo-500" />
                              <span>Quick access to all finance operations</span>
                            </div>
                            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 text-xs">
                              <Activity className="h-3 w-3 mr-1" />
                              Live
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Enhanced Recent Activity */}
                    <Card className="border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 mr-3 shadow-lg">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          Recent Activity
                        </CardTitle>
                        <p className="text-sm text-gray-600">Latest updates and changes</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
                            <div className="p-2 rounded-lg bg-blue-500 shadow-sm">
                              <Building2 className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">New client added</p>
                              <p className="text-xs text-gray-600">TechCorp Inc. - 2 hours ago</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">New</Badge>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-200">
                            <div className="p-2 rounded-lg bg-emerald-500 shadow-sm">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">SOW approved</p>
                              <p className="text-xs text-gray-600">Mobile Banking App - 4 hours ago</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">Approved</Badge>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200">
                            <div className="p-2 rounded-lg bg-purple-500 shadow-sm">
                              <FolderOpen className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">Project milestone</p>
                              <p className="text-xs text-gray-600">E-commerce Platform - 6 hours ago</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">Milestone</Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button variant="outline" className="w-full rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-200">
                            View All Activity
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Clients Tab */}
                <TabsContent value="clients" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Client Management</h3>
                    <div className="flex gap-2">
                      <Link href="/finance/clients">
                        <Button variant="outline" className="rounded-xl">
                          View All Clients
                        </Button>
                      </Link>
                      <Link href="/finance/clients/new">
                        <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Client
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {clients.slice(0, 6).map((client) => (
                      <Card key={client.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-gray-900">{client.client_name}</CardTitle>
                            <Badge className="text-xs">{client.client_id}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600">{client.contact_1_name}</p>
                            <p className="text-gray-500">{client.location}</p>
                            {client.current_msa_start_date && (
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                Active MSA
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Project Management</h3>
                    <div className="flex gap-2">
                      <Link href="/projects">
                        <Button variant="outline" className="rounded-xl">
                          View All Projects
                        </Button>
                      </Link>
                      <Link href="/finance/projects/new">
                        <Button className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Project
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {projects.slice(0, 4).map((project) => (
                      <Card key={project.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-gray-900">{project.name}</CardTitle>
                            <Badge className={`text-xs ${
                              project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                              project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {project.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600">{project.client_name}</p>
                            <p className="font-medium text-gray-900">{formatCurrency(project.budget)}</p>
                            <p className="text-gray-500">
                              Profit: {((project.budget - project.actual_cost) / project.budget * 100).toFixed(1)}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* SOWs Tab */}
                <TabsContent value="sows" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">SOW Management</h3>
                    <div className="flex gap-2">
                      <Link href="/finance/sows">
                        <Button variant="outline" className="rounded-xl">
                          View All SOWs
                        </Button>
                      </Link>
                      <Link href="/finance/sows/new">
                        <Button className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                          <Plus className="h-4 w-4 mr-2" />
                          Create SOW
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {sows.slice(0, 4).map((sow) => (
                      <Card key={sow.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-gray-900">{sow.sow_name}</CardTitle>
                            <Badge className={`text-xs ${
                              sow.sow_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {sow.sow_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600">{sow.client?.client_name}</p>
                            <p className="font-medium text-gray-900">₹{sow.billable_rate}/{sow.billing_per_hour_day_month}</p>
                            <p className="text-gray-500">{sow.total_head_count} resources</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Resource Management</h3>
                    <div className="flex gap-2">
                      <Link href="/resources">
                        <Button variant="outline" className="rounded-xl">
                          View All Resources
                        </Button>
                      </Link>
                      <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Resources
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {resources.slice(0, 6).map((resource) => (
                      <Card key={resource.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-gray-900">{resource.name}</CardTitle>
                            <Badge className={`text-xs ${
                              resource.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                              resource.status === 'on_bench' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {resource.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600">{resource.role}</p>
                            <p className="font-medium text-gray-900">₹{resource.hourly_rate}/hr</p>
                            <p className="text-gray-500">{resource.current_utilization.toFixed(1)}% utilized</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}