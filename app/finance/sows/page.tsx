'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getSOWs } from '@/lib/database';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SOW } from '@/types';
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  DollarSign,
  Users,
  Building2,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function SOWsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [sows, setSOWs] = useState<SOW[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSOWs = async () => {
      try {
        const data = await getSOWs();
        setSOWs(data);
      } catch (error) {
        console.error('Error fetching SOWs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchSOWs();
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="SOWs" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded-xl w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check permissions - Finance, CEO, Admin, PM can access
  if (!profile || !['finance', 'ceo', 'admin', 'pm'].includes(profile.role)) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="SOWs" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">Access Denied</h2>
                  <p className="text-gray-600 text-lg">
                    You don't have permission to access SOW management.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const filteredSOWs = sows.filter(sow =>
    sow.sow_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sow.sow_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sow.client?.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sow.project?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Header title="SOW Management" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Statement of Work (SOW)
              </h1>
              <p className="text-gray-600 text-lg">
                Manage project statements of work and resource mapping
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/finance/sows/new">
                <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Create SOW
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                title: 'Total SOWs', 
                value: sows.length, 
                icon: FileText,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
              },
              { 
                title: 'Active SOWs', 
                value: sows.filter(s => s.sow_active).length, 
                icon: CheckCircle,
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200'
              },
              { 
                title: 'Total Resources', 
                value: sows.reduce((sum, s) => sum + s.total_head_count, 0), 
                icon: Users,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200'
              },
              { 
                title: 'Avg Rate', 
                value: sows.length > 0 ? `₹${(sows.reduce((sum, s) => sum + s.billable_rate, 0) / sows.length).toFixed(0)}` : '₹0', 
                icon: DollarSign,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200'
              }
            ].map((stat, index) => (
              <Card key={index} className={`shadow-sm border-0 ${stat.bgColor} ${stat.borderColor} border hover:shadow-md transition-all duration-300`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
                  <div className="p-2 rounded-xl bg-white shadow-sm">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search SOWs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* SOWs Table */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <FileText className="h-6 w-6 mr-3 text-indigo-600" />
                SOWs ({filteredSOWs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold text-gray-700">SOW Details</TableHead>
                      <TableHead className="font-semibold text-gray-700">Client & Project</TableHead>
                      <TableHead className="font-semibold text-gray-700">Timeline</TableHead>
                      <TableHead className="font-semibold text-gray-700">Resources</TableHead>
                      <TableHead className="font-semibold text-gray-700">Billing</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSOWs.map((sow) => (
                      <TableRow key={sow.id} className="hover:bg-gray-50 transition-colors border-gray-100">
                        <TableCell className="py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{sow.sow_name}</div>
                            <div className="text-sm text-gray-600">{sow.sow_id}</div>
                            <div className="text-sm text-gray-500 mt-1">{sow.manager_name}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="flex items-center font-medium text-gray-900">
                              <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                              {sow.client?.client_name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{sow.project?.name}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {format(new Date(sow.sow_start_date), 'MMM dd, yyyy')}
                            </div>
                            <div className="text-sm text-gray-600">
                              to {format(new Date(sow.sow_end_date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="flex items-center font-medium text-gray-900">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              {sow.total_head_count} resources
                            </div>
                            <div className="text-sm text-gray-600">{sow.resource_type}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                              {sow.sow_resmap}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="flex items-center font-medium text-gray-900">
                              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                              ₹{sow.billable_rate}/hr
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              Per {sow.billing_per_hour_day_month}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {sow.sow_active ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Button variant="ghost" size="sm" className="rounded-lg hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredSOWs.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No SOWs found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}