'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface ProjectFiltersProps {
  filters: {
    status: string;
    search: string;
    client: string;
    manager: string;
  };
  onFiltersChange: (filters: any) => void;
  projects: Project[];
}

export function ProjectFilters({ filters, onFiltersChange, projects }: ProjectFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      search: '',
      client: 'all',
      manager: 'all'
    });
  };

  // Get unique clients and managers for filter options
  const uniqueClients = Array.from(new Set(projects.map(p => p.client_name))).sort();
  const uniqueManagers = Array.from(new Set(
    projects
      .filter(p => p.project_manager)
      .map(p => ({ id: p.project_manager_id, name: p.project_manager!.name }))
  )).sort((a, b) => a.name.localeCompare(b.name));

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'search' && value !== 'all'
  ).length + (filters.search ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or clients..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 lg:gap-4">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Client Filter */}
          <Select value={filters.client} onValueChange={(value) => updateFilter('client', value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {uniqueClients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Manager Filter */}
          <Select value={filters.manager} onValueChange={(value) => updateFilter('manager', value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Managers</SelectItem>
              {uniqueManagers.map((manager) => (
                <SelectItem key={String(manager.id ?? '')} value={String(manager.id ?? '')}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button variant="outline" onClick={clearFilters} size="sm">
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
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('status', 'all')}
              />
            </Badge>
          )}
          {filters.client !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Client: {filters.client}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('client', 'all')}
              />
            </Badge>
          )}
          {filters.manager !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Manager: {uniqueManagers.find(m => m.id === filters.manager)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('manager', 'all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}