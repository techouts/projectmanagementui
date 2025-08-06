'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { CalendarDays, AlertTriangle, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface UpcomingDeadlinesProps {
  projects: Project[];
}

export function UpcomingDeadlines({ projects }: UpcomingDeadlinesProps) {
  const getDeadlineUrgency = (daysUntil: number) => {
    if (daysUntil <= 3) return { color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
    if (daysUntil <= 7) return { color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertTriangle };
    if (daysUntil <= 14) return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock };
    return { color: 'text-blue-600', bg: 'bg-blue-50', icon: CalendarDays };
  };

  const upcomingProjects = projects
    .filter(p => p.status === 'active')
    .map(p => ({
      ...p,
      daysUntil: differenceInDays(new Date(p.end_date), new Date())
    }))
    .filter(p => p.daysUntil >= 0 && p.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            Upcoming Deadlines
          </div>
          <Link href="/projects">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingProjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming deadlines in the next 30 days</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingProjects.map((project) => {
              const urgency = getDeadlineUrgency(project.daysUntil);
              const IconComponent = urgency.icon;

              return (
                <div key={project.id} className={`flex items-center space-x-4 p-3 rounded-lg border ${urgency.bg} hover:shadow-sm transition-shadow`}>
                  <div className={`p-2 rounded-full ${urgency.bg}`}>
                    <IconComponent className={`h-4 w-4 ${urgency.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{project.name}</h4>
                      <Badge variant="outline" className={urgency.color}>
                        {project.daysUntil === 0 ? 'Due Today' : 
                         project.daysUntil === 1 ? '1 day left' : 
                         `${project.daysUntil} days left`}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{project.client_name}</span>
                      <span className="text-muted-foreground">
                        Due {format(new Date(project.end_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}