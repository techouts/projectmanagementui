"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getResources } from "@/lib/database";
import { ResourcesTable } from "@/components/resources/resources-table";
import { ResourceFilters } from "@/components/resources/resource-filters";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/types";
import {
  Plus,
  BarChart3,
  Download,
  Users,
  AlertTriangle,
  TrendingUp,
  Upload,
  User,
  Building,
  MapPin,
} from "lucide-react";
import Link from "next/link";


export default function EmployeesPage() {
  const { profile, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    role: "all",
    utilization: "all",
    primarySkill: "all",
    secondarySkill: "all",
    employeeType: "all",
    department: "all",
    location: "all",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getResources();
        setEmployees(data?.[0]);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchEmployees();
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Employees" />
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

  const filteredEmployees = employees.filter((employee) => {
    if (filters.status !== "all" && employee.status !== filters.status)
      return false;
    if (
      filters.search &&
      !employee?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
      !employee?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
      !employee?.role?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
      !employee?.employee_id?.toLowerCase()?.includes(filters?.search?.toLowerCase())
    )
      return false;
    if (filters?.role !== "all" && employee?.role !== filters?.role) return false;
    if (
      filters?.employeeType !== "all" &&
      employee?.employee_type !== filters?.employeeType
    )
      return false;
    if (
      filters?.department !== "all" &&
      employee?.department !== filters?.department
    )
      return false;
    if (filters?.location !== "all" && employee?.location !== filters?.location)
      return false;
    if (filters?.utilization !== "all") {
      if (
        filters?.utilization === "underutilized" &&
        employee?.current_utilization >= employee?.utilization_target * 0.7
      )
        return false;
      if (
        filters?.utilization === "optimal" &&
        (employee?.current_utilization < employee?.utilization_target * 0.7 ||
          employee?.current_utilization > employee?.utilization_target * 1.1)
      )
        return false;
      if (
        filters?.utilization === "overutilized" &&
        employee?.current_utilization <= employee?.utilization_target * 1.1
      )
        return false;
    }

    // Primary Skill Filter
    if (filters?.primarySkill !== "all") {
      const primarySkill = employee?.skill_set[0];
      if (!primarySkill || primarySkill !== filters?.primarySkill) return false;
    }

    // Secondary Skill Filter
    if (filters?.secondarySkill !== "all") {
      const secondarySkills = employee?.skill_set?.slice(1);
      if (!secondarySkills?.includes(filters?.secondarySkill)) return false;
    }

    return true;
  });

  // Calculate summary stats
  const activeEmployees = filteredEmployees?.filter(
    (e:any) => e?.status === "active"
  );
  const benchEmployees = filteredEmployees?.filter(
    (e) => e?.status === "on_bench"
  );
  const fulltimeEmployees = filteredEmployees?.filter(
    (e) => e?.employee_type === "fulltime"
  );
  const consultantEmployees = filteredEmployees?.filter(
    (e) => e?.employee_type === "consultant"
  );
  const billableEmployees = filteredEmployees?.filter(
    (e) => e?.billing_status === "billable"
  );
  const averageUtilization =
    activeEmployees?.length > 0
      ? activeEmployees?.reduce((sum, e) => sum + e?.current_utilization, 0) /
        activeEmployees?.length
      : 0;
  const underutilizedCount = activeEmployees?.filter(
    (e) => e?.current_utilization < e?.utilization_target * 0.7
  ).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Employees" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Employee Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage employee utilization and allocation
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              {(profile?.role === "admin" ||
                profile?.role === "ceo" ||
                profile?.role === "hr") && (
                <div className="flex gap-2">
                  {/* Bulk Upload Button - Only for HR, Admin, CEO */}
                  <Link href="/resources/bulk-upload">
                    <Button
                      variant="outline"
                      className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Upload
                    </Button>
                  </Link>

                  {/* Add Single Employee */}
                  <Link href="/resources/new">
                    <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Employee
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-6">
            {[
              {
                title: "Total Employees",
                value: filteredEmployees?.length,
                subtitle: `${activeEmployees?.length} active`,
                icon: Users,
                gradient: "from-blue-500 to-blue-600",
                iconColor: "text-blue-600",
              },
              {
                title: "Full-time",
                value: fulltimeEmployees?.length,
                subtitle: "Permanent staff",
                icon: User,
                gradient: "from-green-500 to-green-600",
                iconColor: "text-green-600",
              },
              {
                title: "Consultants",
                value: consultantEmployees?.length,
                subtitle: "Contract staff",
                icon: User,
                gradient: "from-purple-500 to-purple-600",
                iconColor: "text-purple-600",
              },
              {
                title: "Billable",
                value: billableEmployees?.length,
                subtitle: "Revenue generating",
                icon: TrendingUp,
                gradient: "from-emerald-500 to-emerald-600",
                iconColor: "text-emerald-600",
              },
              {
                title: "On Bench",
                value: benchEmployees?.length,
                subtitle: "Awaiting assignment",
                icon: AlertTriangle,
                gradient: "from-orange-500 to-orange-600",
                iconColor: "text-orange-600",
              },
              {
                title: "Avg Utilization",
                value: `${averageUtilization?.toFixed(1)}%`,
                subtitle: "Target: 80%",
                icon: TrendingUp,
                gradient: "from-red-500 to-red-600",
                iconColor: "text-red-600",
              },
            ]?.map((stat, index) => (
              <Card
                key={index}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-700">
                    {stat?.title}
                  </CardTitle>
                  <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                    <stat.icon className={`h-5 w-5 ${stat?.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat?.gradient} bg-clip-text text-transparent mb-1`}>
                    {stat?.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.subtitle}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <ResourceFilters
                filters={filters}
                onFiltersChange={setFilters}
                resources={employees}
              />
            </CardContent>
          </Card>

          {/* Employees Table */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <ResourcesTable resources={filteredEmployees} />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
