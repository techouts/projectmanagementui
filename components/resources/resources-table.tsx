"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from "@/types";
import {
  Mail,
  Clock,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  AlertTriangle,
  User,
  Building,
  MapPin,
  CreditCard,
} from "lucide-react";
import EditIcon from "@mui/icons-material/Edit";

interface ResourcesTableProps {
  resources: Employee[];
}

export function ResourcesTable({ resources }: ResourcesTableProps) {
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const resourcesWithUtilization = resources.map((employee) => ({
    ...employee,
    current_utilization:
      employee.current_utilization ??
      Math.floor(Math.random() * (120 - 40 + 1) + 40),
  }));

  const sortedResources = [...resourcesWithUtilization].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === "asc" ? 1 : -1;
    if (bValue == null) return sortDirection === "asc" ? -1 : 1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "on_bench":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "inactive":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getEmployeeTypeColor = (type: string) => {
    switch (type) {
      case "fulltime":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "consultant":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "intern":
        return "bg-green-50 text-green-700 border-green-200";
      case "contractor":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case "billable":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "non_billable":
        return "bg-red-50 text-red-700 border-red-200";
      case "overhead":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getUtilizationColor = (utilization: number, target: number) => {
    if (utilization >= target * 1.1) return "text-red-600";
    if (utilization >= target * 0.9) return "text-green-600";
    if (utilization >= target * 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getUtilizationStatus = (utilization: number, target: number) => {
    if (utilization >= target * 1.1) return "Over-utilized";
    if (utilization >= target * 0.9) return "Optimal";
    if (utilization >= target * 0.7) return "Good";
    return "Under-utilized";
  };
  const handleClick = () => {
    window.location.href = "/resources/new";
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("employee_id")}>
              Employee
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("role")}>
              Role & Department
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("employee_type")}>
              Type & Status
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort("location")}>
              Location & Billing
            </TableHead>
            <TableHead>Utilization</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Bench Time</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResources.map((employee: any) => {
            const utilizationColor = getUtilizationColor(
              employee.current_utilization,
              employee.utilization_target
            );
            const utilizationStatus = getUtilizationStatus(
              employee.current_utilization,
              employee.utilization_target
            );

            return (
              <TableRow key={employee.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-slate-800">
                      {employee.fullname}
                    </div>
                    <div className="text-sm text-slate-600 font-mono">
                      {employee.id}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <div className="font-medium text-slate-800">
                      {employee.role}
                    </div>
                    <div className="text-sm text-slate-600">
                      {employee.designation}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Building className="h-3 w-3 mr-1" />
                      {employee.department}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-2">
                    <Badge
                      className={getEmployeeTypeColor(employee.employee_type)}>
                      <User className="h-3 w-3 mr-1" />
                      {employee.employee_type === "fulltime"
                        ? "Full-time"
                        : employee.employee_type?.charAt(0).toUpperCase() +
                          employee.employee_type?.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status?.replace("_", " ") || ""}
                      </Badge>
                      {employee.status === "on_bench" &&
                        employee.bench_time > 30 && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-700">
                      <MapPin className="h-3 w-3 mr-1" />
                      {employee.location}
                    </div>
                    <Badge
                      className={getBillingStatusColor(
                        employee.billing_status
                      )}>
                      <CreditCard className="h-3 w-3 mr-1" />
                      {employee?.billing_status?.replace("_", " ")}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell>
                  {employee.status === "active" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${utilizationColor}`}>
                          {employee?.current_utilization?.toFixed(1)}%
                        </span>
                        
                        <span className="text-xs text-muted-foreground ml-10">
                          Target: {employee?.utilization_target}%
                        </span>
                      </div>
                      <Progress
                        value={employee?.current_utilization}
                        className="h-2"
                      />
                      <div className="flex items-center text-xs">
                        {employee?.current_utilization >
                        employee?.utilization_target ? (
                          <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                        )}
                        <span className={utilizationColor}>
                          {utilizationStatus}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee?.skills
                      ?.slice(0, 3)
                      ?.map((skill: any, index: any) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    {employee?.skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{employee?.skills?.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {employee?.status === "on_bench" ? (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-orange-500" />
                      <span
                        className={
                          employee.bench_time > 30
                            ? "text-red-600 font-medium"
                            : "text-orange-600"
                        }>
                        {employee.bench_time} days
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>

                <TableCell>
                  <Button
                    style={{
                      minWidth: "unset",
                      width: 24,
                      height: 24,
                      padding: 0.5,
                    }}
                    onClick={handleClick}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {sortedResources.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No employees found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
