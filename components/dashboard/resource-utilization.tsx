'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getResources } from '@/lib/database';
import { Resource } from '@/types';
import { Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export function ResourceUtilization() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getUtilizationColor = (utilization: number, target: number) => {
    if (utilization >= target * 0.9) return 'text-green-600';
    if (utilization >= target * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUtilizationBgColor = (utilization: number, target: number) => {
    if (utilization >= target * 0.9) return 'bg-green-100';
    if (utilization >= target * 0.7) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeResources = resources.filter(r => r.status === 'active');
  const benchResources = resources.filter(r => r.status === 'on_bench');
  const underutilizedResources = activeResources.filter(r => r.current_utilization < r.utilization_target * 0.7);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Resource Utilization
          </div>
          <Link href="/resources">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeResources.length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{benchResources.length}</div>
            <div className="text-xs text-muted-foreground">On Bench</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{underutilizedResources.length}</div>
            <div className="text-xs text-muted-foreground">Under-utilized</div>
          </div>
        </div>

        {/* Resource List */}
        <div className="space-y-4">
          {resources.slice(0, 6).map((resource) => (
            <div key={resource.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium truncate">{resource.name}</h4>
                  <div className="flex items-center space-x-2">
                    {resource.status === 'on_bench' && resource.bench_time > 30 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge 
                      variant="secondary" 
                      className={resource.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}
                    >
                      {resource.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">{resource.role}</div>
                
                {resource.status === 'active' ? (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={getUtilizationColor(resource.current_utilization, resource.utilization_target)}>
                        {resource.current_utilization.toFixed(1)}% utilization
                      </span>
                      <span className="text-muted-foreground">
                        Target: {resource.utilization_target}%
                      </span>
                    </div>
                    <Progress 
                      value={resource.current_utilization} 
                      className="h-2"
                    />
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {resource.bench_time} days on bench
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link href="/resources?filter=on_bench" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Bench Report
            </Button>
          </Link>
          <Link href="/resources?filter=underutilized" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Utilization Report
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}