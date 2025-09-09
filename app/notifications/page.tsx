"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "alert" | "info" | "success" | "warning" | "error";
  read: boolean;
  action_url?: string;
  created_at: string;
}

export default function NotificationsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Mock notifications data
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "Project Deadline Approaching",
            message: "E-commerce Platform Redesign is due in 7 days",
            type: "warning",
            read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Resource Available",
            message:
              "Alex Rodriguez will be available for new projects in 5 days",
            type: "info",
            read: false,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            title: "Monthly Report Ready",
            message: "Your monthly executive report is ready for review",
            type: "info",
            read: true,
            created_at: new Date(
              Date.now() - 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            id: "4",
            title: "Budget Alert",
            message: "Mobile Banking App project is 90% over budget",
            type: "alert",
            read: false,
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "5",
            title: "New Document Uploaded",
            message:
              "Technical specifications document has been uploaded to DataTech project",
            type: "success",
            read: true,
            created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchNotifications();
    }
  }, [authLoading, profile]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
      case "error":
        return AlertTriangle;
      case "warning":
        return Clock;
      case "success":
        return CheckCheck;
      case "reminder":
        return Calendar;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "alert":
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "reminder":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Notifications" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-slate-200 rounded-xl w-1/4"></div>
              <div className="grid gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Notifications" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Notifications
              </h1>
              <p className="text-slate-600 text-lg">
                Stay updated with important alerts and reminders
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Notifications",
                value: notifications.length,
                gradient: "from-blue-500 to-blue-600",
                iconColor: "text-blue-600",
                icon: Bell,
              },
              {
                title: "Unread",
                value: unreadCount,
                gradient: "from-red-500 to-red-600",
                iconColor: "text-red-600",
                icon: AlertTriangle,
              },
              {
                title: "Alerts",
                value: notifications.filter(
                  (n) => n.type === "alert" || n.type === "warning"
                ).length,
                gradient: "from-orange-500 to-orange-600",
                iconColor: "text-orange-600",
                icon: AlertTriangle,
              },
              {
                title: "Reminders",
                value: notifications.filter((n) => n.type === "reminder")
                  .length,
                gradient: "from-purple-500 to-purple-600",
                iconColor: "text-purple-600",
                icon: Calendar,
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group"
              >
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
                    className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Filter:
                  </span>
                </div>
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "All" },
                    { key: "unread", label: "Unread" },
                    { key: "read", label: "Read" },
                  ].map((filterOption) => (
                    <Button
                      key={filterOption.key}
                      variant={
                        filter === filterOption.key ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setFilter(filterOption.key as any)}
                      className="rounded-xl"
                    >
                      {filterOption.label}
                      {filterOption.key === "unread" && unreadCount > 0 && (
                        <Badge className="ml-2 bg-red-500 text-white border-0 text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                <Bell className="h-6 w-6 mr-3 text-blue-600" />
                Notifications ({filteredNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Bell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No notifications found</p>
                  <p className="text-sm">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(
                      notification.type
                    );
                    const colorClass = getNotificationColor(notification.type);

                    return (
                      <div
                        key={notification.id}
                        className={`flex items-start space-x-4 p-6 hover:bg-slate-50/50 transition-colors ${
                          !notification.read ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl ${colorClass} shadow-sm`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3
                              className={`font-semibold text-slate-800 ${
                                !notification.read ? "font-bold" : ""
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg hover:bg-slate-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-slate-600 mb-3">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-slate-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(
                                new Date(notification.created_at),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={`text-xs capitalize ${colorClass}`}
                              >
                                {notification.type}
                              </Badge>

                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
