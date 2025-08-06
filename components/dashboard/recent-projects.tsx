'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Project } from '@/types';
import { CalendarDays, DollarSign, Users, MoreHorizontal, TrendingUp, AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'planning':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const calculateProgress = (project: Project) => {
    const totalDays = differenceInDays(new Date(project.end_date), new Date(project.start_date));
    const elapsedDays = differenceInDays(new Date(), new Date(project.start_date));
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  const getDaysUntilDeadline = (endDate: string) => {
    return differenceInDays(new Date(endDate), new Date());
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Projects
          <Link href="/projects">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => {
            const progress = calculateProgress(project);
            const daysUntilDeadline = getDaysUntilDeadline(project.end_date);
            const profitMargin = project.budget > 0 ? ((project.budget - project.actual_cost) / project.budget) * 100 : 0;

            return (
              <div key={project.id} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{project.name}</h3>
                    <div className="flex items-center space-x-2">
                      {daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{project.client_name}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Due {format(new Date(project.end_date), 'MMM dd')}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatCurrency(project.budget)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Profit Margin */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <TrendingUp className={`h-4 w-4 mr-1 ${profitMargin > 20 ? 'text-green-600' : profitMargin > 10 ? 'text-yellow-600' : 'text-red-600'}`} />
                      <span className={profitMargin > 20 ? 'text-green-600' : profitMargin > 10 ? 'text-yellow-600' : 'text-red-600'}>
                        {profitMargin.toFixed(1)}% profit
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {project.project_manager && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={project.project_manager.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {project.project_manager.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {project.resources?.length || 0} resources
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}