'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  FileText, 
  Users, 
  Plus, 
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface BulkResource {
  name: string;
  email: string;
  role: string;
  resourceType: string;
  department: string;
  utilizationTarget: string;
  skills: string;
  startDate: string;
  errors?: string[];
}

export default function BulkUploadResourcesPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<BulkResource[]>([]);
  const [manualResources, setManualResources] = useState<BulkResource[]>([
    {
      name: '',
      email: '',
      role: '',
      resourceType: '',
      department: '',
      utilizationTarget: '80',
      skills: '',
      startDate: '',
    }
  ]);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data: BulkResource[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const resource: BulkResource = {
            name: values[0] || '',
            email: values[1] || '',
            role: values[2] || '',
            resourceType: values[3] || '',
            department: values[4] || '',
            utilizationTarget: values[5] || '80',
            skills: values[6] || '',
            startDate: values[7] || '',
          };
          
          // Validate resource
          const errors: string[] = [];
          if (!resource.name) errors.push('Name is required');
          if (!resource.email) errors.push('Email is required');
          if (!resource.role) errors.push('Role is required');
          if (!resource.resourceType) errors.push('Resource type is required');
          if (resource.email && !/\S+@\S+\.\S+/.test(resource.email)) {
            errors.push('Invalid email format');
          }
          if (resource.resourceType && !['fulltime', 'consultant'].includes(resource.resourceType)) {
            errors.push('Resource type must be fulltime or consultant');
          }
          
          if (errors.length > 0) {
            resource.errors = errors;
          }
          
          data.push(resource);
        }
      }
      
      setCsvData(data);
    };
    
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = [
      'Name,Email,Role,Resource Type,Department,Utilization Target,Skills,Start Date',
      'John Doe,john.doe@company.com,Developer,fulltime,Engineering,80,"React, Node.js, Python",2024-01-15',
      'Jane Smith,jane.smith@company.com,Designer,consultant,Design,75,"Figma, Adobe Creative Suite",2024-01-20'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_resources_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const addManualResource = () => {
    setManualResources([
      ...manualResources,
      {
        name: '',
        email: '',
        role: '',
        resourceType: '',
        department: '',
        utilizationTarget: '80',
        skills: '',
        startDate: '',
      }
    ]);
  };

  const removeManualResource = (index: number) => {
    setManualResources(manualResources.filter((_, i) => i !== index));
  };

  const updateManualResource = (index: number, field: keyof BulkResource, value: string) => {
    const updated = [...manualResources];
    updated[index] = { ...updated[index], [field]: value };
    setManualResources(updated);
  };

  const validateManualResources = () => {
    return manualResources.map(resource => {
      const errors: string[] = [];
      if (!resource.name) errors.push('Name is required');
      if (!resource.email) errors.push('Email is required');
      if (!resource.role) errors.push('Role is required');
      if (!resource.resourceType) errors.push('Resource type is required');
      if (resource.email && !/\S+@\S+\.\S+/.test(resource.email)) {
        errors.push('Invalid email format');
      }
      
      return { ...resource, errors: errors.length > 0 ? errors : undefined };
    });
  };

  const handleBulkSubmit = async (resources: BulkResource[]) => {
    setLoading(true);
    
    try {
      // Simulate API call for bulk resource creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const validResources = resources.filter(r => !r.errors || r.errors.length === 0);
      const invalidResources = resources.filter(r => r.errors && r.errors.length > 0);
      
      setUploadResults({
        success: validResources.length,
        failed: invalidResources.length,
        errors: invalidResources.flatMap(r => r.errors || [])
      });
      
      if (invalidResources.length === 0) {
        setTimeout(() => {
          router.push('/resources');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating bulk resources:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Bulk Upload Resources" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded-xl w-1/4 mb-8"></div>
              <div className="h-96 bg-slate-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check permissions - HR, Admin, and CEO can access
  if (!profile || !['admin', 'ceo', 'hr'].includes(profile.role)) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Access Denied" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h2>
                <p className="text-slate-600 mb-6">You don't have permission to bulk upload resources.</p>
                <Link href="/resources">
                  <Button className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Bulk Upload Resources" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Bulk Upload Resources
              </h1>
              <p className="text-slate-600 text-lg">
                Add multiple resources at once using CSV upload or manual entry
              </p>
            </div>
            <Link href="/resources">
              <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>

          {/* Upload Results */}
          {uploadResults && (
            <Alert className={uploadResults.failed === 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
              <CheckCircle className={`h-4 w-4 ${uploadResults.failed === 0 ? 'text-green-600' : 'text-yellow-600'}`} />
              <AlertDescription>
                <div className="font-semibold mb-2">
                  Upload Complete: {uploadResults.success} successful, {uploadResults.failed} failed
                </div>
                {uploadResults.failed > 0 && (
                  <div className="text-sm">
                    <p className="mb-2">Errors encountered:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {uploadResults.failed === 0 && (
                  <p className="text-sm">Redirecting to resources page...</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Bulk Resource Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="csv" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100">
                  <TabsTrigger value="csv" className="rounded-lg">CSV Upload</TabsTrigger>
                  <TabsTrigger value="manual" className="rounded-lg">Manual Entry</TabsTrigger>
                </TabsList>

                {/* CSV Upload Tab */}
                <TabsContent value="csv" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">Upload CSV File</h3>
                      <Button
                        variant="outline"
                        onClick={downloadTemplate}
                        className="rounded-xl border-slate-200 hover:bg-slate-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        <div className="text-blue-800">
                          <p className="font-semibold mb-2">CSV Format Requirements:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Headers: Name, Email, Role, Resource Type, Department, Utilization Target, Skills, Start Date</li>
                            <li>• Email addresses must be valid format</li>
                            <li>• Resource Type must be either "fulltime" or "consultant"</li>
                            <li>• Skills should be comma-separated within quotes</li>
                            <li>• Start Date format: YYYY-MM-DD</li>
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label htmlFor="csv-upload" className="cursor-pointer">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-lg font-medium text-slate-700 mb-2">
                          {csvFile ? csvFile.name : 'Choose CSV file or drag and drop'}
                        </p>
                        <p className="text-sm text-slate-500">
                          Supports CSV files up to 10MB
                        </p>
                      </label>
                    </div>

                    {csvData.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800">
                            Preview ({csvData.length} resources)
                          </h4>
                          <div className="flex gap-2">
                            <Badge className="bg-green-100 text-green-700">
                              {csvData.filter(r => !r.errors).length} Valid
                            </Badge>
                            {csvData.filter(r => r.errors).length > 0 && (
                              <Badge className="bg-red-100 text-red-700">
                                {csvData.filter(r => r.errors).length} Invalid
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto border rounded-xl">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50 sticky top-0">
                              <tr>
                                <th className="text-left p-3 font-medium">Name</th>
                                <th className="text-left p-3 font-medium">Email</th>
                                <th className="text-left p-3 font-medium">Role</th>
                                <th className="text-left p-3 font-medium">Type</th>
                                <th className="text-left p-3 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {csvData.map((resource, index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-3">{resource.name}</td>
                                  <td className="p-3">{resource.email}</td>
                                  <td className="p-3">{resource.role}</td>
                                  <td className="p-3">{resource.resourceType}</td>
                                  <td className="p-3">
                                    {resource.errors ? (
                                      <Badge className="bg-red-100 text-red-700">
                                        {resource.errors.length} error(s)
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-green-100 text-green-700">
                                        Valid
                                      </Badge>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <Button
                          onClick={() => handleBulkSubmit(csvData)}
                          disabled={loading || csvData.every(r => r.errors)}
                          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Uploading Resources...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload {csvData.filter(r => !r.errors).length} Resources
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Manual Entry Tab */}
                <TabsContent value="manual" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">Manual Resource Entry</h3>
                      <Button
                        onClick={addManualResource}
                        variant="outline"
                        className="rounded-xl border-slate-200 hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {manualResources.map((resource, index) => (
                        <Card key={index} className="border border-slate-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium text-slate-700">
                                Resource #{index + 1}
                              </CardTitle>
                              {manualResources.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeManualResource(index)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Name *</Label>
                                <Input
                                  value={resource.name}
                                  onChange={(e) => updateManualResource(index, 'name', e.target.value)}
                                  placeholder="Full name"
                                  className="rounded-lg border-slate-200"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Email *</Label>
                                <Input
                                  type="email"
                                  value={resource.email}
                                  onChange={(e) => updateManualResource(index, 'email', e.target.value)}
                                  placeholder="email@company.com"
                                  className="rounded-lg border-slate-200"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Role *</Label>
                                <Input
                                  value={resource.role}
                                  onChange={(e) => updateManualResource(index, 'role', e.target.value)}
                                  placeholder="e.g., Developer"
                                  className="rounded-lg border-slate-200"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Resource Type *</Label>
                                <Select 
                                  value={resource.resourceType} 
                                  onValueChange={(value) => updateManualResource(index, 'resourceType', value)}
                                >
                                  <SelectTrigger className="rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="fulltime">Full-time</SelectItem>
                                    <SelectItem value="consultant">Consultant</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Department</Label>
                                <Input
                                  value={resource.department}
                                  onChange={(e) => updateManualResource(index, 'department', e.target.value)}
                                  placeholder="e.g., Engineering"
                                  className="rounded-lg border-slate-200"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Utilization Target (%)</Label>
                                <Input
                                  type="number"
                                  value={resource.utilizationTarget}
                                  onChange={(e) => updateManualResource(index, 'utilizationTarget', e.target.value)}
                                  placeholder="80"
                                  className="rounded-lg border-slate-200"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Skills</Label>
                                <Input
                                  value={resource.skills}
                                  onChange={(e) => updateManualResource(index, 'skills', e.target.value)}
                                  placeholder="React, Node.js, Python"
                                  className="rounded-lg border-slate-200"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-slate-600">Start Date</Label>
                                <Input
                                  type="date"
                                  value={resource.startDate}
                                  onChange={(e) => updateManualResource(index, 'startDate', e.target.value)}
                                  className="rounded-lg border-slate-200"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleBulkSubmit(validateManualResources())}
                      disabled={loading || manualResources.every(r => !r.name || !r.email || !r.role || !r.resourceType)}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Resources...
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Create {manualResources.filter(r => r.name && r.email && r.role && r.resourceType).length} Resources
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}