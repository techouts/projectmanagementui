'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FolderOpen, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total_projects: number;
    active_projects: number;
    total_revenue: number;
    total_profit: number;
    average_utilization: number;
    resources_on_bench: number;
  };
  userRole?: string;
}

export function StatsCards({ stats, userRole }: StatsCardsProps) {
  const profitMargin = stats.total_revenue > 0 ? (stats.total_profit / stats.total_revenue) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const allCards = [
    {
      title: 'Total Projects',
      value: stats.total_projects.toString(),
      description: `${stats.active_projects} active`,
      icon: FolderOpen,
      trend: stats.active_projects > 0 ? 'up' : 'neutral',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.total_revenue),
      description: `${profitMargin.toFixed(1)}% profit margin`,
      icon: DollarSign,
      trend: profitMargin > 20 ? 'up' : profitMargin > 10 ? 'neutral' : 'down',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      restrictedRoles: ['hr']
    },
    {
      title: 'Resource Utilization',
      value: `${stats.average_utilization.toFixed(1)}%`,
      description: `${stats.resources_on_bench} on bench`,
      icon: Users,
      trend: stats.average_utilization > 80 ? 'up' : stats.average_utilization > 60 ? 'neutral' : 'down',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      progress: stats.average_utilization,
    },
    {
      title: 'Bench Resources',
      value: stats.resources_on_bench.toString(),
      description: 'Awaiting assignment',
      icon: AlertTriangle,
      trend: stats.resources_on_bench > 5 ? 'down' : 'neutral',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
  ];

  // Filter cards based on user role
  const cards = allCards.filter(card => 
    !card.restrictedRoles || !card.restrictedRoles.includes(userRole || '')
  );

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-sm ${card.bgColor} ${card.borderColor} border overflow-hidden relative`}>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700 truncate">{card.title}</CardTitle>
            <div className={`p-2 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 truncate">{card.value}</div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate flex-1">{card.description}</p>
              {card.trend === 'up' && (
                <Badge className="ml-2 flex-shrink-0 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Good
                </Badge>
              )}
              {card.trend === 'down' && (
                <Badge className="ml-2 flex-shrink-0 bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Alert
                </Badge>
              )}
            </div>
            {card.progress !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Utilization</span>
                  <span>{card.progress.toFixed(1)}%</span>
                </div>
                <Progress value={card.progress} className="h-2 bg-gray-200" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}