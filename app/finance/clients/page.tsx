'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getClients } from '@/lib/database';
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
import { Client } from '@/types';
import { 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  FileText,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ClientsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchClients();
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Clients" />
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

  // Check permissions - Finance, CEO, Admin can access
  if (!profile || !['finance', 'ceo', 'admin'].includes(profile.role)) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Clients" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">Access Denied</h2>
                  <p className="text-gray-600 text-lg">
                    You don't have permission to access client management.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const filteredClients = clients.filter(client =>
    client.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.client_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Client Management" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Client Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage client information and relationships
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/finance/clients/new">
                <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                title: 'Total Clients', 
                value: clients.length, 
                icon: Building2,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
              },
              { 
                title: 'Active MSAs', 
                value: clients.filter(c => c.current_msa_start_date && c.current_msa_end_date).length, 
                icon: FileText,
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200'
              },
              { 
                title: 'Locations', 
                value: new Set(clients.map(c => c.location)).size, 
                icon: MapPin,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200'
              },
              { 
                title: 'This Month', 
                value: clients.filter(c => {
                  const created = new Date(c.created_at);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length, 
                icon: Calendar,
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
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Table */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <Building2 className="h-6 w-6 mr-3 text-indigo-600" />
                Clients ({filteredClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold text-gray-700">Client</TableHead>
                      <TableHead className="font-semibold text-gray-700">Primary Contact</TableHead>
                      <TableHead className="font-semibold text-gray-700">Location</TableHead>
                      <TableHead className="font-semibold text-gray-700">MSA Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Created</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50 transition-colors border-gray-100">
                        <TableCell className="py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{client.client_name}</div>
                            <div className="text-sm text-gray-600">{client.client_id}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{client.contact_1_name}</div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.contact_1_email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              {client.contact_1_phone}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-gray-900">{client.location}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {client.current_msa_start_date && client.current_msa_end_date ? (
                            <div>
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                Active
                              </Badge>
                              <div className="text-xs text-gray-600 mt-1">
                                Until {format(new Date(client.current_msa_end_date), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              No MSA
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {format(new Date(client.created_at), 'MMM dd, yyyy')}
                          </div>
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

                {filteredClients.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No clients found</p>
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