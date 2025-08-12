'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUpcomingBenchReport } from '@/lib/database';
import { Resource, Project, User } from '@/types';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Users, 
  TrendingDown,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface UpcomingBenchResource {
  resource: Resource;
  project: Project;
  daysUntilAvailable: number;
  projectManager?: User;
}

export function UpcomingBenchReport() {
  const [upcomingBenchResources, setUpcomingBenchResources] = useState<UpcomingBenchResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingBenchReport = async () => {
      try {
        const data :any= await getUpcomingBenchReport();
        setUpcomingBenchResources(data);
      } catch (error) {
        console.error('Error fetching upcoming bench report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingBenchReport();
  }, []);

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (days <= 14) return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (days <= 21) return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
  };

  const getUrgencyIcon = (days: number) => {
    if (days <= 7) return AlertTriangle;
    if (days <= 14) return Clock;
    return Calendar;
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Upcoming Bench Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Upcoming Bench Report
            {upcomingBenchResources.length > 0 && (
              <Badge className="ml-3 bg-blue-100 text-blue-700 border-blue-200">
                {upcomingBenchResources.length} resources
              </Badge>
            )}
          </div>
          <Link href="/resources">
            <Button variant="outline" size="sm" className="rounded-xl">
              View All Resources
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingBenchResources.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50 text-green-500" />
            <h3 className="text-lg font-semibold mb-2 text-slate-700">No Upcoming Bench Resources</h3>
            <p className="text-slate-600">
              All active resources have projects extending beyond the next 30 days
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {upcomingBenchResources.filter(r => r.daysUntilAvailable <= 7).length}
                </div>
                <div className="text-sm text-red-700 font-medium">This Week</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">
                  {upcomingBenchResources.filter(r => r.daysUntilAvailable <= 14 && r.daysUntilAvailable > 7).length}
                </div>
                <div className="text-sm text-orange-700 font-medium">Next 2 Weeks</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {upcomingBenchResources.filter(r => r.daysUntilAvailable > 14).length}
                </div>
                <div className="text-sm text-blue-700 font-medium">Next 30 Days</div>
              </div>
            </div>

            {/* Resource List */}
            <div className="space-y-3">
              {upcomingBenchResources.map((item, index) => {
                const urgency = getUrgencyColor(item.daysUntilAvailable);
                const UrgencyIcon = getUrgencyIcon(item.daysUntilAvailable);

                return (
                  <div 
                    key={`${item.resource.id}-${item.project.id}`} 
                    className={`flex items-center justify-between p-4 rounded-xl border ${urgency.bg} ${urgency.border} hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Resource Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 shadow-sm">
                          <AvatarImage src={undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            {item.resource.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-slate-800">{item.resource.name}</h4>
                          <p className="text-sm text-slate-600">{item.resource.role}</p>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="flex-1 min-w-0 mx-4">
                        <div className="font-medium text-slate-800 truncate">{item.project.name}</div>
                        <div className="text-sm text-slate-600 truncate">{item.project.client_name}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Ends: {format(new Date(item.project.end_date), 'MMM dd, yyyy')}
                        </div>
                      </div>

                      {/* Project Manager */}
                      {item.projectManager && (
                        <div className="hidden lg:flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.projectManager.avatar_url ?? undefined} />
                            <AvatarFallback className="text-xs bg-slate-200">
                              {item.projectManager.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-600">{item.projectManager.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Availability Timeline */}
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${urgency.bg}`}>
                        <UrgencyIcon className={`h-4 w-4 ${urgency.color}`} />
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${urgency.color}`}>
                          {item.daysUntilAvailable === 0 ? 'Today' : 
                           item.daysUntilAvailable === 1 ? '1 day' : 
                           `${item.daysUntilAvailable} days`}
                        </div>
                        <div className="text-xs text-slate-500">until available</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
              <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Planning
              </Button>
              <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                <TrendingDown className="h-4 w-4 mr-2" />
                Resource Forecast
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}