'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Project } from '@/types';
import { CalendarDays, DollarSign, Users, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [sortField, setSortField] = useState<keyof Project>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'planning': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'on_hold': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const calculateProgress = (project: Project) => {
    const totalDays = differenceInDays(new Date(project.end_date), new Date(project.start_date));
    const elapsedDays = differenceInDays(new Date(), new Date(project.start_date));
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  const getProfitMargin = (project: Project) => {
    return project.budget > 0 ? ((project.budget - project.actual_cost) / project.budget) * 100 : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('name')}
            >
              Project Name
            </TableHead>
            <TableHead>Client</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleSort('status')}
            >
              Status
            </TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right"
              onClick={() => handleSort('budget')}
            >
              Budget
            </TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead>Resources</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => {
            const progress = calculateProgress(project);
            const profitMargin = getProfitMargin(project);
            const daysUntilDeadline = differenceInDays(new Date(project.end_date), new Date());

            return (
              <TableRow key={project.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <Link href={`/projects/${project.id}`} className="font-medium hover:text-blue-600">
                      {project.name}
                    </Link>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="font-medium">{project.client_name}</div>
                </TableCell>
                
                <TableCell>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-2">
                    <div className="text-sm">
                      {format(new Date(project.start_date), 'MMM dd')} - {format(new Date(project.end_date), 'MMM dd, yyyy')}
                    </div>
                    {project.status === 'active' && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1" />
                        {daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (
                          <p className="text-xs text-orange-600 mt-1">
                            {daysUntilDeadline} days left
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="font-medium">{formatCurrency(project.budget)}</div>
                  <div className="text-sm text-muted-foreground">
                    Spent: {formatCurrency(project.actual_cost)}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end font-medium ${
                    profitMargin > 20 ? 'text-green-600' : 
                    profitMargin > 10 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {profitMargin > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {profitMargin.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(project.budget - project.actual_cost)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{project.resources?.length || 0}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  {project.project_manager && (
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={project.project_manager.avatar_url ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {project.project_manager.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{project.project_manager.name}</span>
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {sortedProjects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No projects found matching your criteria</p>
        </div>
      )}
    </div>
  );
}