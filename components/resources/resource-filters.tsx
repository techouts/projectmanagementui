/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types";
import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ResourceFiltersProps {
  filters: {
    status: string;
    search: string;
    role: string;
    utilization_target: string;
    skills: string;
    employee_type: string;
    department: string;
    location: string;
    fullname: any;
    start_date: any;
    end_date: any;
    billing_status: any;
  };
  onFiltersChange: (filters: any) => void;
  resources: Employee[];
}

export function ResourceFilters({
  filters,
  onFiltersChange,
  resources,
}: ResourceFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchTerm.trim() });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      search: "",
      role: "all",
      utilization_target: "all",
      primarySkill: "all",
      secondarySkill: "all",
      employeeType: "all",
      department: "all",
      location: "all",
    });
    setSearchTerm("");
  };

  // Filter option uniques based on current resources prop
  const uniqueRoles = Array.from(new Set(resources.map((r) => r.role))).sort();
  const uniqueDepartments = Array.from(
    new Set(resources.map((r) => r.department))
  ).sort();
  const uniqueLocations = Array.from(
    new Set(resources.map((r) => r.location))
  ).sort();
  const allSkills = resources.flatMap((r) => r.skill);
  const uniqueSkills = Array.from(new Set(allSkills)).sort();

  const activeFilterCount =
    Object.entries(filters).filter(
      ([key, value]) => key !== "search" && value !== "all"
    ).length + (filters.search ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-slate-200 bg-slate-50/50 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>

        <div className="flex flex-wrap gap-2 lg:gap-3">
          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger className="w-full sm:w-32 rounded-xl border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_bench">On Bench</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Employee Type Filter */}
          <Select
            value={filters.employee_type}
            onValueChange={(value) => updateFilter("employeeType", value)}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl border-slate-200">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fulltime">Full-time</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
              <SelectItem value="contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select
            value={filters.department}
            onValueChange={(value) => updateFilter("department", value)}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-slate-200">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select
            value={filters.location}
            onValueChange={(value) => updateFilter("location", value)}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl border-slate-200">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select
            value={filters.role}
            onValueChange={(value) => updateFilter("role", value)}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-slate-200">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Utilization Filter */}
          <Select
            value={filters.utilization_target}
            onValueChange={(value) => updateFilter("utilization", value)}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-slate-200">
              <SelectValue placeholder="Utilization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Utilization</SelectItem>
              <SelectItem value="underutilized">Under-utilized</SelectItem>
              <SelectItem value="optimal">Optimal</SelectItem>
              <SelectItem value="overutilized">Over-utilized</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
              className="rounded-xl border-slate-200 hover:bg-slate-50">
              <X className="h-4 w-4 mr-2" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1 rounded-lg">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("search", "")}
              />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1 rounded-lg">
              Status: {filters.status.replace("_", " ")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("status", "all")}
              />
            </Badge>
          )}
          {filters.employee_type !== "all" && (
            <Badge variant="secondary" className="gap-1 rounded-lg">
              Type:{" "}
              {filters.employee_type === "fulltime"
                ? "Full-time"
                : filters.employee_type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("employeeType", "all")}
              />
            </Badge>
          )}
          {filters.department !== "all" && (
            <Badge variant="secondary" className="gap-1 rounded-lg">
              Department: {filters.department}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("department", "all")}
              />
            </Badge>
          )}
          {filters.location !== "all" && (
            <Badge variant="secondary" className="gap-1 rounded-lg">
              Location: {filters.location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("location", "all")}
              />
            </Badge>
          )}
          {filters.role !== "all" && (
            <Badge variant="secondary" className="gap-1 rounded-lg">
              Role: {filters.role}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("role", "all")}
              />
            </Badge>
          )}
          {filters.utilization_target !== "all" && (
            <Badge variant="secondary" className="gap-1 rounded-lg">
              Utilization: {filters.utilization_target.replace("_", " ")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("utilization", "all")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
