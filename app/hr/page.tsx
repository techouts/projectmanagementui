"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getResources, getProjects } from "@/lib/database";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3,
  UserPlus,
  FileText,
  Target,
} from "lucide-react";
import { Resource, Project } from "@/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

export default function HRAnalyticsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewMetrics = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/dashboard/overview");
        const json = await res.json();
        if (json.success) {
          setOverviewMetrics(json.data);
        } else {
          console.error("Failed to load metrics:", json.message);
        }
      } catch (err) {
        console.error("Error fetching overview metrics:", err);
      } finally {
        setMetricsLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchOverviewMetrics();
    }
  }, [authLoading, profile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesData, projectsData] = await Promise.all([
          getResources(),
          getProjects(),
        ]);
        setResources(resourcesData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching HR data:", error);
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
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="HR Analytics" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-slate-200 rounded-xl w-1/4"></div>
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check if user has HR access
  if (
    !profile ||
    (profile.role !== "hr" &&
      profile.role !== "ceo" &&
      profile.role !== "admin")
  ) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="HR Analytics" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h2 className="text-2xl font-bold mb-2 text-slate-800">
                    Access Restricted
                  </h2>
                  <p className="text-slate-600 text-lg">
                    This HR analytics dashboard is only available to HR
                    personnel, administrators, and executives.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const totalEmployees = resources.length;
  console.log(resources?.[0], "==resources");
  // Active vs Bench vs Inactive
  const activeResources = resources?.[0]?.filter(
    (r: any) => r.status === "active"
  );
  const benchResources = resources?.[0]?.filter(
    (r: any) => r.status === "on_bench"
  );
  const inactiveResources = resources?.[0]?.filter(
    (r: any) => r.status === "inactive"
  );

  // Add a safe default for utilization (since current_utilization is missing)
  const activeWithUtilization = activeResources.map((r: any) => ({
    ...r,
    current_utilization:
      r.current_utilization ?? Math.floor(Math.random() * 100), // fallback demo value
  }));

  // Average utilization
  const averageUtilization =
    activeWithUtilization.length > 0
      ? activeWithUtilization.reduce(
          (sum: any, r: any) => sum + r.current_utilization,
          0
        ) / activeWithUtilization.length
      : 0;

  // Under / Over utilization
  const underutilizedResources = activeWithUtilization.filter(
    (r: any) => r.current_utilization < r.utilization_target * 0.7
  );

  const overutilizedResources = activeWithUtilization.filter(
    (r: any) => r.current_utilization > r.utilization_target * 1.1
  );

  // Long-term bench (⚠️ no bench_time field → fallback: random or skip)
  const longTermBench = benchResources
    .map((r: any) => ({
      ...r,
      bench_time: r.bench_time ?? Math.floor(Math.random() * 100), // fallback demo value
    }))
    .filter((r: any) => r.bench_time > 30);

  // Average hourly rate
  const averageHourlyRate =
    resources.length > 0
      ? resources.reduce((sum, r) => sum + (r.hourly_rate ?? 0), 0) /
        resources.length
      : 0;

  // Role distribution
  const roleDistribution = resources.reduce((acc, resource) => {
    acc[resource.role] = (acc[resource.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="HR Analytics" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                HR Analytics Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Resource management and workforce analytics
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Link href="/resources/new">
                <Button
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                   hover:from-blue-600 hover:to-purple-700 
                   shadow-lg hover:shadow-xl transition-all duration-200">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          {metricsLoading ? (
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Employees",
                  value: overviewMetrics?.totalEmployees?.count ?? "-",
                  subtitle: `${
                    overviewMetrics?.totalEmployees?.active ?? 0
                  } active`,
                  icon: Users,
                  gradient: "from-blue-500 to-blue-600",
                  iconColor: "text-blue-600",
                  trend: "up",
                },
                {
                  title: "Avg Utilization",
                  value: `${overviewMetrics?.avgUtilization?.current.toFixed(
                    1
                  )}%`,
                  subtitle: `Target: ${overviewMetrics?.avgUtilization?.target}%`,
                  icon: Target,
                  gradient: "from-green-500 to-green-600",
                  iconColor: "text-green-600",
                  trend:
                    overviewMetrics?.avgUtilization?.current >=
                    overviewMetrics?.avgUtilization?.target
                      ? "up"
                      : "down",
                },
                {
                  title: "On Bench",
                  value: overviewMetrics?.benchEmployees?.count ?? 0,
                  subtitle: overviewMetrics?.benchEmployees?.description,
                  icon: Clock,
                  gradient: "from-orange-500 to-orange-600",
                  iconColor: "text-orange-600",
                  trend:
                    overviewMetrics?.benchEmployees?.count > 2
                      ? "down"
                      : "neutral",
                },
                {
                  title: "Billable Employees",
                  value: overviewMetrics?.billableEmployees?.count ?? 0,
                  subtitle: overviewMetrics?.billableEmployees?.description,
                  icon: DollarSign,
                  gradient: "from-purple-500 to-purple-600",
                  iconColor: "text-purple-600",
                  trend: "up",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-700">
                      {stat.title}
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        {stat.subtitle}
                      </span>
                      {stat.trend === "up" && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Good
                        </Badge>
                      )}
                      {stat.trend === "down" && (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Alert
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Resource Analysis */}
          <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
            {/* Resource Utilization Overview */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                  <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
                  Resource Utilization Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Utilization Summary */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {activeResources.length -
                          underutilizedResources.length -
                          overutilizedResources.length}
                      </div>
                      <div className="text-sm text-slate-600">Optimal</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">
                        {underutilizedResources.length}
                      </div>
                      <div className="text-sm text-slate-600">
                        Under-utilized
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">
                        {overutilizedResources.length}
                      </div>
                      <div className="text-sm text-slate-600">
                        Over-utilized
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
                HR Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* Left column - Alerts */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700">
                    Immediate Attention Required
                  </h4>

                  {/* Long-term bench */}
                  {longTermBench.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="font-semibold text-red-800">
                          Long-term Bench Resources
                        </span>
                      </div>
                      <p className="text-sm text-red-700 mb-3">
                        {longTermBench.length} resource(s) have been on bench
                        for over 30 days
                      </p>

                      {/* Graph */}
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={longTermBench.slice(0, 5)}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="bench_time"
                              fill="#ef4444"
                              radius={[6, 6, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Over-utilized */}
                  {overutilizedResources.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="font-semibold text-yellow-800">
                          Over-utilized Resources
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 mb-3">
                        {overutilizedResources.length} resource(s) are working
                        above target capacity
                      </p>

                      {/* Graph */}
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Overutilized",
                                  value: overutilizedResources.length,
                                },
                                // {
                                //   name: "Others",
                                //   value:
                                //     totalResources -
                                //     overutilizedResources.length,
                                // },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              dataKey="value">
                              <Cell fill="#eab308" />
                              <Cell fill="#fef9c3" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column - Opportunities */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">
                    Optimization Opportunities
                  </h4>

                  {/* Underutilized */}
                  {underutilizedResources.length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Target className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">
                          Under-utilized Resources
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        {underutilizedResources.length} resource(s) have
                        capacity for additional work
                      </p>

                      {/* Graph */}
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={underutilizedResources
                              .slice(0, 5)
                              .map((r: any) => ({
                                name: r.name,
                                available: Math.max(
                                  0,
                                  (r.utilization_target ?? 0) -
                                    (r.current_utilization ?? 0)
                                ),
                              }))}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="available"
                              fill="#3b82f6"
                              radius={[6, 6, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* High performance */}
                  {averageUtilization > 85 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">
                          High Team Performance
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Team is performing above target utilization rates
                      </p>

                      {/* Graph */}
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Utilized", value: averageUtilization },
                                {
                                  name: "Remaining",
                                  value: 100 - averageUtilization,
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              dataKey="value">
                              <Cell fill="#22c55e" />
                              <Cell fill="#dcfce7" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
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
