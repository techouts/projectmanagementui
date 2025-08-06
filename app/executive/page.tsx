'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getDashboardStats, getProjects } from '@/lib/database';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DashboardStats, Project } from '@/types';
import { 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FolderOpen,
  AlertTriangle,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export default function ExecutivePage() {
  const { profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, projectsData] = await Promise.all([
          getDashboardStats(),
          getProjects()
        ]);
        setStats(dashboardStats);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching executive data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchData();
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header title="Executive Dashboard" />
          <main className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-96 bg-gray-200 rounded" />
                <div className="h-96 bg-gray-200 rounded" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Redirect if not CEO
  if (profile?.role !== 'ceo') {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header title="Executive Dashboard" />
          <main className="p-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
                  <p className="text-muted-foreground">
                    This executive dashboard is only available to CEO users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Calculate executive metrics
  const totalRevenue = stats?.total_revenue || 0;
  const totalProfit = stats?.total_profit || 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const onHoldProjects = projects.filter(p => p.status === 'on_hold');
  
  const avgProjectValue = projects.length > 0 ? totalRevenue / projects.length : 0;
  const completionRate = projects.length > 0 ? (completedProjects.length / projects.length) * 100 : 0;
  
  // Risk analysis
  const overBudgetProjects = projects.filter(p => p.actual_cost > p.budget * 0.9);
  const delayedProjects = activeProjects.filter(p => {
    const daysUntilDeadline = differenceInDays(new Date(p.end_date), new Date());
    return daysUntilDeadline < 7;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Executive Dashboard" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Crown className="h-8 w-8 text-yellow-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
            </div>
            <p className="text-gray-600">
              Strategic overview of company performance and key metrics
            </p>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    {profitMargin.toFixed(1)}% profit margin
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {activeProjects.length}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {completionRate.toFixed(1)}% completion rate
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Avg Project Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(avgProjectValue)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {projects.length} total projects
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Resource Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.average_utilization.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {stats?.resources_on_bench} on bench
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Indicators */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-red-700">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Budget Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {overBudgetProjects.length}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Projects over 90% budget
                </p>
                {overBudgetProjects.length > 0 && (
                  <div className="space-y-2">
                    {overBudgetProjects.slice(0, 3).map(project => (
                      <div key={project.id} className="text-xs">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-red-600">
                          {((project.actual_cost / project.budget) * 100).toFixed(1)}% of budget used
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-yellow-700">
                  <Calendar className="h-5 w-5 mr-2" />
                  Timeline Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {delayedProjects.length}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Projects due within 7 days
                </p>
                {delayedProjects.length > 0 && (
                  <div className="space-y-2">
                    {delayedProjects.slice(0, 3).map(project => {
                      const daysLeft = differenceInDays(new Date(project.end_date), new Date());
                      return (
                        <div key={project.id} className="text-xs">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-yellow-600">
                            {daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-gray-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-gray-700">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  On Hold Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {onHoldProjects.length}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Projects requiring attention
                </p>
                {onHoldProjects.length > 0 && (
                  <div className="space-y-2">
                    {onHoldProjects.slice(0, 3).map(project => (
                      <div key={project.id} className="text-xs">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-gray-600">{project.client_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Project Portfolio Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Portfolio Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Projects</span>
                    <Badge className="bg-green-50 text-green-700">
                      {activeProjects.length}
                    </Badge>
                  </div>
                  <Progress value={(activeProjects.length / projects.length) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed Projects</span>
                    <Badge className="bg-blue-50 text-blue-700">
                      {completedProjects.length}
                    </Badge>
                  </div>
                  <Progress value={(completedProjects.length / projects.length) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">On Hold Projects</span>
                    <Badge className="bg-yellow-50 text-yellow-700">
                      {onHoldProjects.length}
                    </Badge>
                  </div>
                  <Progress value={(onHoldProjects.length / projects.length) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(totalRevenue)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Profit</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(totalProfit)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <div className="flex items-center">
                      {profitMargin > 20 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-lg font-bold ${
                        profitMargin > 20 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium text-red-700">Immediate Attention Required</h4>
                  {overBudgetProjects.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        {overBudgetProjects.length} project(s) are over budget and require immediate review
                      </p>
                    </div>
                  )}
                  {delayedProjects.length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        {delayedProjects.length} project(s) have upcoming deadlines within 7 days
                      </p>
                    </div>
                  )}
                  {stats && stats.resources_on_bench > 5 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">
                        {stats.resources_on_bench} resources are on bench - consider reallocation
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700">Strategic Opportunities</h4>
                  {profitMargin > 25 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        Strong profit margins indicate potential for expansion
                      </p>
                    </div>
                  )}
                  {completionRate > 80 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        High project completion rate shows strong delivery capability
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}