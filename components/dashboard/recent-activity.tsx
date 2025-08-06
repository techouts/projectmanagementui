'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Activity, FileText, Users, DollarSign, Settings, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string;
  metadata: any;
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string | null;
  };
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (entityType: string, action: string) => {
    switch (entityType) {
      case 'project':
        return action === 'completed' ? CheckCircle : DollarSign;
      case 'resource':
        return Users;
      case 'document':
        return FileText;
      default:
        return Activity;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'created':
        return 'text-blue-600 bg-blue-50';
      case 'updated':
        return 'text-yellow-600 bg-yellow-50';
      case 'uploaded':
        return 'text-purple-600 bg-purple-50';
      case 'status_changed':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Mock recent activities for demo
  const mockActivities = [
    {
      id: '1',
      user_id: '1',
      entity_type: 'project',
      entity_id: '1',
      action: 'updated',
      description: 'Updated project budget from ₹1,16,67,000 to ₹1,25,00,000',
      metadata: { field: 'budget', old_value: 11667000, new_value: 12500000 },
      created_at: new Date().toISOString(),
      user: { name: 'Mike Chen', avatar_url: null }
    },
    {
      id: '2',
      user_id: '2',
      entity_type: 'resource',
      entity_id: '2',
      action: 'status_changed',
      description: 'Resource status changed from active to on_bench',
      metadata: { field: 'status', old_value: 'active', new_value: 'on_bench' },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: { name: 'David Kim', avatar_url: null }
    },
    {
      id: '3',
      user_id: '3',
      entity_type: 'document',
      entity_id: '3',
      action: 'uploaded',
      description: 'Uploaded technical specifications document',
      metadata: { file_name: 'DataTech_Technical_Specs.pdf', file_size: 3072000 },
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: { name: 'Lisa Anderson', avatar_url: null }
    },
    {
      id: '4',
      user_id: '4',
      entity_type: 'project',
      entity_id: '4',
      action: 'completed',
      description: 'Project marked as completed',
      metadata: { status: 'completed', completion_date: '2024-05-20' },
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      user: { name: 'Mike Chen', avatar_url: null }
    }
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.slice(0, 6).map((activity) => {
            const IconComponent = getActivityIcon(activity.entity_type, activity.action);
            const colorClass = getActivityColor(activity.action);

            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.action.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Avatar className="h-4 w-4 mr-2">
                        <AvatarImage src={activity.user?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {activity.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{activity.user?.name || 'Unknown User'}</span>
                    </div>
                    <span>{format(new Date(activity.created_at), 'MMM dd, HH:mm')}</span>
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