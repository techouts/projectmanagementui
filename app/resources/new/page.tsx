"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import {
  ArrowLeft,
  Briefcase,
  Building,
  CreditCard,
  Mail,
  MapPin,
  Save,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormDataType = {
  role: string;
  band: string;
  offerLetter: File | null;
  assetLetter: File | null;
};

export default function NewEmployeePage() {
  const router = useRouter();

  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    role: "",
    department: "",
    cost_center: "",
    reporting_manager_id: "",
    dotted_line_manager_id: "",
    designation: "",
    start_date: "",
    end_date: "",
    employee_type: "",
    location: "",
    billing_status: "",
    skills: [],
    utilization_target: "80",
    hourly_rate: "",
    notes: "",
    band: "",
    offerLetter: null,
    assetLetter: null,
  });

  const transformedData = {
    department: formData.department,
    costCenter: formData.cost_center,
    role: formData.role,
    employeeType: formData.employee_type,
    location: formData.location,
    billingStatus: formData.billing_status,
    hourlyRate: formData.hourly_rate
      ? parseFloat(formData.hourly_rate)
      : undefined,
    utilizationTarget: formData.utilization_target
      ? parseInt(formData.utilization_target)
      : undefined,
    startDate: formData.start_date,
    endDate: formData.end_date || null,
    skills: formData.skills,
    fullname: formData.name,
    band: formData.band,
    offerLetter: formData.offerLetter,
    assetLetter: formData.assetLetter,
  };

  const handleChange = <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3005/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create employee");
      }

      const createdEmployee = await response.json();
      console.log("Employee created:", createdEmployee);
      router.push("/resources");
    } catch (error) {
      console.error("Error creating employee:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const allSkills = [
    "Javascript",
    "React.Js",
    "Google Analytics",
    "Google Tag Manager",
    "Nextjs",
    "Material Ui",
    "Redux",
    "Mobx",
    "TypeScript",
    "Tailwind CSS",
    "CSS",
    "HTML",
    "GraphQL APIs",
    "Npm",
    "YARN",
    "React Testing Library",
    "Cypress",
    "Github",
    "Netlify",
    "Vercel",
    "GIT",
    "Firebase",
    "Node",
    "Node.js",
    "Node API",
    "Node Express",
    "Node-RED",
  ];

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Add New Employee" />
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

  if (!profile || !["admin", "ceo", "hr"].includes(profile.role)) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        <div className="flex-1 lg:ml-72">
          <Header title="Access Denied" />
          <main className="p-6 lg:p-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Access Denied
                </h2>
                <p className="text-slate-600 mb-6">
                  You don&apos;t have permission to add new employees.
                </p>
                <Link href="/resources">
                  <Button className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Employees
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const selectedSkills = formData.skills;

  const handleSkillsChange = (eventL: any, newValue: any) => {
    handleInputChange("skills", newValue);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header title="Add New Employee" />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Add New Employee
              </h1>
              <p className="text-slate-600 text-lg">
                Create a new employee profile for team management
              </p>
            </div>
            <Link href="/resources">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employees
              </Button>
            </Link>
          </div>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="employee_id"
                        className="text-sm font-medium text-slate-700 mb-2 block">
                        Employee ID *
                      </Label>
                      <Input
                        id="employee_id"
                        value={formData.employee_id}
                        onChange={(e) =>
                          handleInputChange("employee_id", e.target.value)
                        }
                        placeholder="Enter employee ID"
                        className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-slate-700 mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter full name"
                        className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-700 flex items-center mb-2">
                        <Mail className="h-4 w-4 mr-1" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="role"
                        className="text-sm font-medium text-slate-700 flex items-center mb-2">
                        <Briefcase className="h-4 w-4 mr-1" />
                        Role *
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleInputChange("role", value)
                        }>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="senior_developer">
                            Senior Developer
                          </SelectItem>
                          <SelectItem value="tech_lead">Tech Lead</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem>
                          <SelectItem value="senior_designer">
                            Senior Designer
                          </SelectItem>
                          <SelectItem value="project_manager">
                            Project Manager
                          </SelectItem>
                          <SelectItem value="qa_engineer">
                            QA Engineer
                          </SelectItem>
                          <SelectItem value="business_analyst">
                            Business Analyst
                          </SelectItem>
                          <SelectItem value="consultant">Consultant</SelectItem>
                          <SelectItem value="devops_engineer">
                            DevOps Engineer
                          </SelectItem>
                          <SelectItem value="data_analyst">
                            Data Analyst
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-purple-600" />
                    Organizational Information
                  </h3>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <Label
                        htmlFor="department"
                        className="text-sm font-medium text-slate-700 mb-2 block">
                        Department *
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleInputChange("department", value)
                        }>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="cost_center"
                        className="text-sm font-medium text-slate-700 mb-2 block">
                        Cost Center
                      </Label>
                      <Input
                        id="cost_center"
                        value={formData.cost_center}
                        onChange={(e) =>
                          handleInputChange("cost_center", e.target.value)
                        }
                        placeholder="Enter cost center"
                        className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="Band"
                        className="text-sm font-medium text-slate-700 flex items-center mb-2">
                        Band*
                      </Label>
                      <Select
                        value={formData.band}
                        onValueChange={(value) =>
                          handleInputChange("band", value)
                        }>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select band" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">A</SelectItem>
                          <SelectItem value="b">B</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="d">D</SelectItem>
                          <SelectItem value="e">E</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="employee_type"
                        className="text-sm font-medium text-slate-700 mb-2 block">
                        Employee Type *
                      </Label>
                      <Select
                        value={formData.employee_type}
                        onValueChange={(value) =>
                          handleInputChange("employee_type", value)
                        }>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select employee type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-slate-700 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        Location *
                      </Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) =>
                          handleInputChange("location", value)
                        }>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="chennai">Chennai</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="pune">Pune</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="billing_status"
                        className="text-sm font-medium text-slate-700 flex items-center mb-2">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Billing Status *
                      </Label>
                      <Select
                        value={formData.billing_status}
                        onValueChange={(value) =>
                          handleInputChange("billing_status", value)
                        }>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select billing status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Billable">Billable</SelectItem>
                          <SelectItem value="Non-billable">
                            Non-billable
                          </SelectItem>
                          <SelectItem value="Overhead">Overhead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Additional Information
                  </h3>
                  <div>
                    <div>
                      <Label
                        htmlFor="skills"
                        className="text-sm font-medium text-slate-700 mb-1 block">
                        Skills & Technologies
                      </Label>
                      <Autocomplete
                        multiple
                        freeSolo
                        id="skills"
                        options={allSkills}
                        value={selectedSkills}
                        onChange={handleSkillsChange}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            // eslint-disable-next-line react/jsx-key
                            <Chip
                              variant="outlined"
                              label={option}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Add skill..."
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                marginBottom: 2,
                              },
                              "& .MuiFormHelperText-root": {
                                margin: 2,
                              },
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="notes"
                        className="text-sm font-medium text-slate-700 mb-2 block">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        placeholder="Enter any additional notes or comments"
                        className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Offer Letter Upload */}
                <div>
                  <Label
                    htmlFor="offerLetter"
                    className="text-sm font-medium text-slate-700 flex items-center mb-2">
                    Offer Letter
                  </Label>
                  <Input
                    id="offerLetter"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e: any) =>
                      handleChange("offerLetter", e?.target.files?.[0] || null)
                    }
                  />
                </div>

                {/* Asset Letter Upload */}
                <div>
                  <Label
                    htmlFor="assetLetter"
                    className="text-sm font-medium text-slate-700 flex items-center mb-2">
                    Asset Letter
                  </Label>
                  <Input
                    id="assetLetter"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleChange("assetLetter", e.target.files?.[0] || null)
                    }
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-slate-200">
                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !formData.employee_id ||
                      !formData.name ||
                      !formData.email ||
                      !formData.department ||
                      !formData.role ||
                      !formData.employee_type ||
                      !formData.location ||
                      !formData.billing_status ||
                      !formData.band
                    }
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-8">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Employee
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
