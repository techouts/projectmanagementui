'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/database';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Building2, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import Link from 'next/link';

export default function NewClientPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    contact_1_name: '',
    contact_1_email: '',
    contact_1_phone: '',
    contact_2_name: '',
    contact_2_email: '',
    contact_2_phone: '',
    acc_contact_name: '',
    acc_contact_email: '',
    acc_contact_phone: '',
    mailing_address: '',
    location: '',
    msa_link: '',
    current_msa_start_date: '',
    current_msa_end_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createClient(formData);
      
      if (result.error) {
        console.error('Error creating client:', result.error);
        return;
      }
      
      router.push('/finance/clients');
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Add New Client" />
          <main className="p-6 lg:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-xl w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check permissions
  if (!profile || !['finance', 'ceo', 'admin'].includes(profile.role)) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Access Denied" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">You don't have permission to add new clients.</p>
                <Link href="/finance/clients">
                  <Button className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Clients
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Add New Client" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Add New Client
              </h1>
              <p className="text-gray-600 text-lg">
                Create a new client profile for project management
              </p>
            </div>
            <Link href="/finance/clients">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
              </Button>
            </Link>
          </div>

          {/* Form */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                    Basic Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label htmlFor="client_id" className="text-sm font-medium text-gray-700 mb-2 block">
                        Client ID *
                      </Label>
                      <Input
                        id="client_id"
                        value={formData.client_id}
                        onChange={(e) => handleInputChange('client_id', e.target.value)}
                        placeholder="e.g., CL001"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="client_name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Client Name *
                      </Label>
                      <Input
                        id="client_name"
                        value={formData.client_name}
                        onChange={(e) => handleInputChange('client_name', e.target.value)}
                        placeholder="Enter client company name"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Label htmlFor="mailing_address" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        Mailing Address *
                      </Label>
                      <Textarea
                        id="mailing_address"
                        value={formData.mailing_address}
                        onChange={(e) => handleInputChange('mailing_address', e.target.value)}
                        placeholder="Enter complete mailing address"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 min-h-[80px]"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
                        Location *
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., California, USA"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-emerald-600" />
                    Primary Contact
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div>
                      <Label htmlFor="contact_1_name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Contact Name *
                      </Label>
                      <Input
                        id="contact_1_name"
                        value={formData.contact_1_name}
                        onChange={(e) => handleInputChange('contact_1_name', e.target.value)}
                        placeholder="Enter contact name"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact_1_email" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Mail className="h-4 w-4 mr-1" />
                        Email *
                      </Label>
                      <Input
                        id="contact_1_email"
                        type="email"
                        value={formData.contact_1_email}
                        onChange={(e) => handleInputChange('contact_1_email', e.target.value)}
                        placeholder="Enter email address"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact_1_phone" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone *
                      </Label>
                      <Input
                        id="contact_1_phone"
                        value={formData.contact_1_phone}
                        onChange={(e) => handleInputChange('contact_1_phone', e.target.value)}
                        placeholder="Enter phone number"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-purple-600" />
                    Secondary Contact (Optional)
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div>
                      <Label htmlFor="contact_2_name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Contact Name
                      </Label>
                      <Input
                        id="contact_2_name"
                        value={formData.contact_2_name}
                        onChange={(e) => handleInputChange('contact_2_name', e.target.value)}
                        placeholder="Enter contact name"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact_2_email" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Label>
                      <Input
                        id="contact_2_email"
                        type="email"
                        value={formData.contact_2_email}
                        onChange={(e) => handleInputChange('contact_2_email', e.target.value)}
                        placeholder="Enter email address"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact_2_phone" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </Label>
                      <Input
                        id="contact_2_phone"
                        value={formData.contact_2_phone}
                        onChange={(e) => handleInputChange('contact_2_phone', e.target.value)}
                        placeholder="Enter phone number"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Accounts Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-orange-600" />
                    Accounts Contact (Optional)
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div>
                      <Label htmlFor="acc_contact_name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Contact Name
                      </Label>
                      <Input
                        id="acc_contact_name"
                        value={formData.acc_contact_name}
                        onChange={(e) => handleInputChange('acc_contact_name', e.target.value)}
                        placeholder="Enter contact name"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="acc_contact_email" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Label>
                      <Input
                        id="acc_contact_email"
                        type="email"
                        value={formData.acc_contact_email}
                        onChange={(e) => handleInputChange('acc_contact_email', e.target.value)}
                        placeholder="Enter email address"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="acc_contact_phone" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </Label>
                      <Input
                        id="acc_contact_phone"
                        value={formData.acc_contact_phone}
                        onChange={(e) => handleInputChange('acc_contact_phone', e.target.value)}
                        placeholder="Enter phone number"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* MSA Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    MSA Information (Optional)
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div>
                      <Label htmlFor="msa_link" className="text-sm font-medium text-gray-700 mb-2 block">
                        MSA Link
                      </Label>
                      <Input
                        id="msa_link"
                        type="url"
                        value={formData.msa_link}
                        onChange={(e) => handleInputChange('msa_link', e.target.value)}
                        placeholder="Enter MSA document link"
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="current_msa_start_date" className="text-sm font-medium text-gray-700 mb-2 block">
                        MSA Start Date
                      </Label>
                      <Input
                        id="current_msa_start_date"
                        type="date"
                        value={formData.current_msa_start_date}
                        onChange={(e) => handleInputChange('current_msa_start_date', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="current_msa_end_date" className="text-sm font-medium text-gray-700 mb-2 block">
                        MSA End Date
                      </Label>
                      <Input
                        id="current_msa_end_date"
                        type="date"
                        value={formData.current_msa_end_date}
                        onChange={(e) => handleInputChange('current_msa_end_date', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={loading || !formData.client_id || !formData.client_name || !formData.contact_1_name || !formData.contact_1_email || !formData.contact_1_phone || !formData.mailing_address || !formData.location}
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Client
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}