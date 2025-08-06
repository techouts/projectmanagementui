'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getDocuments } from '@/lib/database';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Document } from '@/types';
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  MoreHorizontal,
  File,
  FileCheck,
  FileX,
  Calendar,
  User,
  Tag,
  Eye,
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

export default function DocumentsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && profile) {
      fetchDocuments();
    }
  }, [authLoading, profile]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Documents" />
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

  // Allow access for all authenticated users
  if (!profile) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Documents" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h2 className="text-2xl font-bold mb-2 text-slate-800">Access Required</h2>
                  <p className="text-slate-600 text-lg">
                    Please log in to access the document management system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const filteredDocuments = documents.filter(doc => {
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.project?.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (typeFilter !== 'all' && doc.type !== typeFilter) return false;
    if (projectFilter !== 'all' && doc.project_id !== projectFilter) return false;
    return true;
  });

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'sow': return FileCheck;
      case 'msa': return FileText;
      case 'cr': return FileX;
      default: return File;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'sow': return 'bg-green-100 text-green-700 border-green-200';
      case 'msa': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cr': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get unique projects and types for filters
  const uniqueProjects = Array.from(new Set(documents.map(d => d.project).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(documents.map(d => d.type)));

  // Calculate stats
  const totalDocuments = documents.length;
  const totalSize = documents.reduce((sum, d) => sum + d.file_size, 0);
  const documentsByType = uniqueTypes.reduce((acc, type) => {
    acc[type] = documents.filter(d => d.type === type).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Documents" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Document Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage project documents, contracts, and files
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {(profile?.role === 'admin' || profile?.role === 'ceo' || profile?.role === 'pm' || profile?.role === 'finance') && (
                <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[
              { 
                title: 'Total Documents', 
                value: totalDocuments, 
                icon: FileText,
                gradient: 'from-blue-500 to-blue-600',
                iconColor: 'text-blue-600'
              },
              { 
                title: 'Total Size', 
                value: formatFileSize(totalSize), 
                icon: HardDrive,
                gradient: 'from-purple-500 to-purple-600',
                iconColor: 'text-purple-600'
              },
              { 
                title: 'SOW Documents', 
                value: documentsByType.sow || 0, 
                icon: FileCheck,
                gradient: 'from-green-500 to-green-600',
                iconColor: 'text-green-600'
              },
              { 
                title: 'MSA Documents', 
                value: documentsByType.msa || 0, 
                icon: FileText,
                gradient: 'from-orange-500 to-orange-600',
                iconColor: 'text-orange-600'
              }
            ].map((stat, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-700">{stat.title}</CardTitle>
                  <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
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
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl border-slate-200 bg-slate-50/50 focus:border-blue-300 focus:ring-blue-200"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Type Filter */}
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-40 rounded-xl border-slate-200">
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sow">SOW</SelectItem>
                      <SelectItem value="msa">MSA</SelectItem>
                      <SelectItem value="cr">Change Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Project Filter */}
                  <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl border-slate-200">
                      <SelectValue placeholder="Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {uniqueProjects.map((project) => (
                        <SelectItem key={project!.id} value={project!.id}>
                          {project!.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-slate-800">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Documents ({filteredDocuments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Document</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold text-slate-700">Type</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold text-slate-700">Project</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold text-slate-700">Size</TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold text-slate-700">Uploaded By</TableHead>
                      <TableHead className="hidden xl:table-cell font-semibold text-slate-700">Date</TableHead>
                      <TableHead className="w-[100px] font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => {
                      const IconComponent = getDocumentTypeIcon(document.type);
                      
                      return (
                        <TableRow key={document.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl ${getDocumentTypeColor(document.type)} shadow-sm`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-slate-800 truncate">{document.name}</div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {document.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs rounded-lg border-slate-200">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {document.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs rounded-lg border-slate-200">
                                      +{document.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell className="hidden md:table-cell">
                            <Badge className={`${getDocumentTypeColor(document.type)} rounded-lg font-medium`}>
                              {document.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          
                          <TableCell className="hidden lg:table-cell">
                            {document.project ? (
                              <div>
                                <div className="font-semibold text-slate-800">{document.project.name}</div>
                                <div className="text-sm text-slate-600">{document.project.client_name}</div>
                              </div>
                            ) : (
                              <span className="text-slate-500">No project</span>
                            )}
                          </TableCell>
                          
                          <TableCell className="hidden md:table-cell">
                            <span className="text-sm font-medium text-slate-700">{formatFileSize(document.file_size)}</span>
                          </TableCell>
                          
                          <TableCell className="hidden lg:table-cell">
                            {document.uploader && (
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3 shadow-sm">
                                  <AvatarImage src={document.uploader.avatar_url || undefined} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                                    {document.uploader.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-slate-700">{document.uploader.name}</span>
                              </div>
                            )}
                          </TableCell>
                          
                          <TableCell className="hidden xl:table-cell">
                            <div className="text-sm text-slate-600">
                              {format(new Date(document.created_at), 'MMM dd, yyyy')}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="rounded-lg hover:bg-slate-100">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="rounded-lg hover:bg-slate-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No documents found</p>
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