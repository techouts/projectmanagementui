'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getProjects } from '@/lib/database';
import { ProjectsTable } from '@/components/projects/projects-table';
import { ProjectFilters } from '@/components/projects/project-filters';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import { Plus, BarChart3, Download } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    client: 'all',
    manager: 'all'
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchProjects();
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Projects" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded-xl w-1/4 mb-8"></div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter(project => {
    if (filters.status !== 'all' && project.status !== filters.status) return false;
    if (filters.search && !project.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !project.client_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.client !== 'all' && project.client_name !== filters.client) return false;
    if (filters.manager !== 'all' && project.project_manager_id !== filters.manager) return false;
    return true;
  });

  // Calculate summary stats
  const totalRevenue = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalProfit = filteredProjects.reduce((sum, p) => sum + (p.budget - p.actual_cost), 0);
  const averageMargin = filteredProjects.length > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Projects" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Projects
              </h1>
              <p className="text-slate-600 text-lg">
                Manage project profitability and resource allocation
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              {(profile?.role === 'admin' || profile?.role === 'ceo' || profile?.role === 'pm') && (
                <Link href="/projects/new">
                  <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Total Projects', value: filteredProjects.length, gradient: 'from-blue-500 to-blue-600' },
              { title: 'Total Revenue', value: formatCurrency(totalRevenue), gradient: 'from-green-500 to-green-600' },
              { title: 'Total Profit', value: formatCurrency(totalProfit), gradient: 'from-purple-500 to-purple-600' },
              { title: 'Avg Margin', value: `${averageMargin.toFixed(1)}%`, gradient: 'from-orange-500 to-orange-600' }
            ].map((stat, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-700">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <ProjectFilters 
                filters={filters} 
                onFiltersChange={setFilters}
                projects={projects}
              />
            </CardContent>
          </Card>

          {/* Projects Table */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <ProjectsTable projects={filteredProjects} />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}