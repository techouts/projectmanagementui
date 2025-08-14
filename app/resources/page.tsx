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
import {
  Plus,
  BarChart3,
  Download,
  Users,
  AlertTriangle,
  TrendingUp,
  Upload,
  User,
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
    utilization_target: "all",
    skills: "all",
    employee_type: "all",
    department: "all",
    location: "all",
    fullname: "all",
    start_date: "all",
    end_date: "all",
    billing_status: "all",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        if (filters?.search?.trim()) {
          const res = await fetch(
            `http://localhost:3005/api/employees/search/${encodeURIComponent(
              filters.search.trim()
            )}`
          );
          const data = await res.json();
          setEmployees(
            Array.isArray(data?.data?.employees) ? data.data.employees : []
          );
        } else {
          const data = await getResources();
          setEmployees(Array.isArray(data?.[0]) ? data[0] : []);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchEmployees();
    }
  }, [authLoading, profile, filters.search]);

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

  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) => {
        if (filters.status !== "all" && employee.status !== filters.status)
          return false;

        if (filters.role !== "all" && employee.role !== filters.role)
          return false;

        if (
          filters.employee_type !== "all" &&
          employee.employee_type !== filters.employee_type
        )
          return false;

        if (
          filters.department !== "all" &&
          employee.department !== filters.department
        )
          return false;

        if (
          filters.location !== "all" &&
          employee.location !== filters.location
        )
          return false;

        if (
          filters.billing_status !== "all" &&
          employee.billing_status?.toLowerCase() !==
            filters.billing_status.toLowerCase()
        )
          return false;

        if (filters.utilization_target !== "all") {
          const utilization = employee.current_utilization ?? 0;
          const target = employee.utilization_target ?? 0;

          if (
            filters.utilization_target === "underutilized" &&
            utilization >= target * 0.7
          )
            return false;
          if (
            filters.utilization_target === "optimal" &&
            (utilization < target * 0.7 || utilization > target * 1.1)
          )
            return false;
          if (
            filters.utilization_target === "overutilized" &&
            utilization <= target * 1.1
          )
            return false;
        }

        if (filters.skills !== "all") {
          const skillSet = employee.skills ?? [];
          if (!skillSet.includes(filters.skills)) return false;
        }

        if (filters.start_date) {
          const empStartDate = new Date(employee.start_date);
          const filterStartDate = new Date(filters.start_date);
          if (empStartDate < filterStartDate) return false;
        }

        if (filters.end_date) {
          const empEndDate = new Date(employee.end_date);
          const filterEndDate = new Date(filters.end_date);
          if (empEndDate > filterEndDate) return false;
        }

        return true;
      })
    : [];

  // Summary stats
  const activeEmployees = filteredEmployees.filter(
    (e: any) => e?.status === "active"
  );
  console.log(activeEmployees, filteredEmployees, "===omggg");
  const benchEmployees = filteredEmployees.filter(
    (e: any) => e?.status === "on_bench"
  );
  const fulltimeCount = filteredEmployees.filter(
    (e: any) =>
      e?.employee_type?.toLowerCase().replace(/[^a-z]/g, "") === "fulltime"
  ).length;

  const contractTimeCount = filteredEmployees.filter(
    (e: any) =>
      e?.employee_type?.toLowerCase().replace(/[^a-z]/g, "") === "contract"
  ).length;

  const billingTimeCount = filteredEmployees.filter(
    (e: any) =>
      e?.billing_status?.toLowerCase().replace(/[^a-z]/g, "") === "billable"
  ).length;

  const averageUtilization =
    activeEmployees.length > 0
      ? activeEmployees.reduce(
          (sum: number, e: any) => sum + (e?.current_utilization ?? 0),
          0
        ) / activeEmployees.length
      : 0;

  const underutilizedCount = activeEmployees.filter(
    (e: any) =>
      (e?.current_utilization ?? 0) < (e?.utilization_target ?? 0) * 0.7
  ).length;

  const handleExport = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/employees/export", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Export failed: ${res.statusText}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employees-export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting employees:", err);
    }
  };

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
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
                onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link href="/hr">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              {(profile?.role === "admin" ||
                profile?.role === "ceo" ||
                profile?.role === "hr") && (
                <div className="flex gap-2">
                  <Link href="/resources/bulk-upload">
                    <Button
                      variant="outline"
                      className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            "http://localhost:3005/api/bulk-upload/template?format=csv"
                          );
                          if (!res.ok)
                            throw new Error("Failed to fetch template");
                          const blob = await res.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "bulk-upload-template.csv";
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error("Error downloading template:", error);
                        }
                      }}>
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
                value: filteredEmployees.length,
                subtitle: `${activeEmployees.length} active`,
                icon: Users,
                gradient: "from-blue-500 to-blue-600",
                iconColor: "text-blue-600",
              },
              {
                title: "Full-time",
                value: fulltimeCount,
                subtitle: "Permanent staff",
                icon: User,
                gradient: "from-green-500 to-green-600",
                iconColor: "text-green-600",
              },
              {
                title: "Consultants",
                value: contractTimeCount,
                subtitle: "Contract staff",
                icon: User,
                gradient: "from-purple-500 to-purple-600",
                iconColor: "text-purple-600",
              },
              {
                title: "Billable",
                value: billingTimeCount,
                subtitle: "Revenue generating",
                icon: TrendingUp,
                gradient: "from-emerald-500 to-emerald-600",
                iconColor: "text-emerald-600",
              },
              {
                title: "On Bench",
                value: benchEmployees.length,
                subtitle: "Awaiting assignment",
                icon: AlertTriangle,
                gradient: "from-orange-500 to-orange-600",
                iconColor: "text-orange-600",
              },
              {
                title: "Avg Utilization",
                value: `${averageUtilization.toFixed(1)}%`,
                subtitle: "Target: 80%",
                icon: TrendingUp,
                gradient: "from-red-500 to-red-600",
                iconColor: "text-red-600",
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
                resources={Array.isArray(employees) ? employees : []}
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
