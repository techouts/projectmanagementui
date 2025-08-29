"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Crown,
  BarChart3,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardPage() {
  const context = useAuth();

  const { user, loading: authLoading } = context;
  const profile = context.profile!;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2 text-slate-800">
                Access Required
              </h2>
              <p className="text-slate-600 text-lg">
                Please log in to access the dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ceo":
        return Crown;
      case "pm":
        return LayoutDashboard;
      case "finance":
        return DollarSign;
      case "hr":
        return Users;
      case "admin":
        return BarChart3;
      default:
        return LayoutDashboard;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ceo":
        return "from-yellow-500 to-orange-600";
      case "pm":
        return "from-blue-500 to-blue-600";
      case "finance":
        return "from-green-500 to-green-600";
      case "hr":
        return "from-purple-500 to-purple-600";
      case "admin":
        return "from-gray-500 to-gray-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  const RoleIcon = getRoleIcon(profile.role);
  const roleColor = getRoleColor(profile.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div
            className={`w-20 h-20 bg-gradient-to-br ${roleColor} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
            <RoleIcon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-slate-600 text-lg mt-2">
              ProjectHub Management Dashboard
            </p>
            <Badge
              className={`mt-3 bg-gradient-to-r ${roleColor} text-white border-0 text-sm px-4 py-1`}>
              {profile.role.toUpperCase()} Dashboard
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pl-64 pr-6">
          {[
            {
              title: "Active Projects",
              value: "12",
              change: "+2 this week",
              icon: FolderOpen,
              color: "text-blue-600",
              bgColor: "bg-blue-50",
              borderColor: "border-blue-200",
            },
            {
              title: "Team Members",
              value: "48",
              change: "85% utilization",
              icon: Users,
              color: "text-purple-600",
              bgColor: "bg-purple-50",
              borderColor: "border-purple-200",
            },
            {
              title: "Revenue",
              value: "$2.4M",
              change: "+12% this month",
              icon: DollarSign,
              color: "text-green-600",
              bgColor: "bg-green-50",
              borderColor: "border-green-200",
            },
            {
              title: "Growth",
              value: "23%",
              change: "Year over year",
              icon: TrendingUp,
              color: "text-orange-600",
              bgColor: "bg-orange-50",
              borderColor: "border-orange-200",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className={`shadow-lg border-0 ${stat.bgColor} ${stat.borderColor} border hover:shadow-xl transition-all duration-300 group`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 pl-64 pr-6">
          {/* Recent Activity */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Project created",
                    item: "Mobile App Redesign",
                    time: "2 hours ago",
                    type: "success",
                  },
                  {
                    action: "Team member added",
                    item: "Sarah Johnson",
                    time: "4 hours ago",
                    type: "info",
                  },
                  {
                    action: "Milestone completed",
                    item: "API Development",
                    time: "1 day ago",
                    type: "success",
                  },
                  {
                    action: "Budget updated",
                    item: "E-commerce Platform",
                    time: "2 days ago",
                    type: "warning",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {activity.action}
                      </p>
                      <p className="text-sm text-slate-600">{activity.item}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button className="w-full justify-start h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <FolderOpen className="w-5 h-5 mr-3" />
                  Create New Project
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                  <Users className="w-5 h-5 mr-3" />
                  Manage Team
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  View Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                  <DollarSign className="w-5 h-5 mr-3" />
                  Financial Overview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-specific Message */}
        <div className="pl-64 pr-6">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {profile.role === "ceo" && "Executive Dashboard"}
                  {profile.role === "pm" && "Project Management Hub"}
                  {profile.role === "finance" && "Financial Control Center"}
                  {profile.role === "hr" && "Human Resources Portal"}
                  {profile.role === "admin" && "System Administration"}
                </h3>
                <p className="text-slate-600">
                  {profile.role === "ceo" &&
                    "Access comprehensive business insights and strategic overview."}
                  {profile.role === "pm" &&
                    "Manage projects, track progress, and coordinate team activities."}
                  {profile.role === "finance" &&
                    "Monitor budgets, track expenses, and generate financial reports."}
                  {profile.role === "hr" &&
                    "Manage team resources, track utilization, and handle HR operations."}
                  {profile.role === "admin" &&
                    "Configure system settings and manage user access."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
