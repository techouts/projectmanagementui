'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  LayoutDashboard,
  FolderOpen,
  Users,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  Menu,
  X,
  BarChart3,
  Calendar,
  DollarSign,
  UserCheck,
  Crown,
  Zap,
  Plus
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { profile } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        badge: null,
        roles: ['admin', 'ceo', 'pm', 'finance', 'hr', 'resource'],
        color: 'text-blue-600'
      },
      {
        title: 'Projects',
        href: '/projects',
        icon: FolderOpen,
        badge: null,
        roles: ['admin', 'ceo', 'pm', 'finance', 'resource'],
        color: 'text-emerald-600'
      },
      {
        title: 'Resources',
        href: '/resources',
        icon: Users,
        badge: null,
        roles: ['admin', 'ceo', 'pm', 'hr', 'resource'],
        color: 'text-purple-600'
      },
      {
        title: 'Documents',
        href: '/documents',
        icon: FileText,
        badge: null,
        roles: ['admin', 'ceo', 'pm', 'finance', 'resource'],
        color: 'text-orange-600'
      },
      {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
        badge: '3',
        roles: ['admin', 'ceo', 'pm', 'finance', 'hr', 'resource'],
        color: 'text-red-600'
      },
    ];

    // Role-specific items
    const roleSpecificItems = [];
    
    if (profile?.role === 'ceo') {
      roleSpecificItems.push({
        title: 'Executive View',
        href: '/executive',
        icon: Crown,
        badge: null,
        roles: ['ceo'],
        color: 'text-yellow-600'
      });
    }
    
    if (profile?.role === 'finance' || profile?.role === 'ceo') {
      roleSpecificItems.push({
        title: 'Financial Reports',
        href: '/finance',
        icon: DollarSign,
        badge: null,
        roles: ['finance', 'ceo'],
        color: 'text-green-600'
      });
    }
    
    if (profile?.role === 'hr' || profile?.role === 'ceo' || profile?.role === 'admin') {
      roleSpecificItems.push({
        title: 'HR Analytics',
        href: '/hr',
        icon: UserCheck,
        badge: null,
        roles: ['hr', 'ceo', 'admin'],
        color: 'text-pink-600'
      });
    }
    
    if (profile?.role === 'pm' || profile?.role === 'ceo') {
      roleSpecificItems.push({
        title: 'Project Analytics',
        href: '/analytics',
        icon: BarChart3,
        badge: null,
        roles: ['pm', 'ceo'],
        color: 'text-indigo-600'
      });
    }

    // Finance-specific submenu items
    const financeItems = [];
    if (profile?.role === 'finance' || profile?.role === 'ceo' || profile?.role === 'admin') {
      financeItems.push(
        {
          title: 'Clients',
          href: '/finance/clients',
          icon: Building2,
          badge: null,
          roles: ['finance', 'ceo', 'admin'],
          color: 'text-blue-600',
          isSubmenu: true
        },
        {
          title: 'SOWs',
          href: '/finance/sows',
          icon: FileText,
          badge: null,
          roles: ['finance', 'ceo', 'admin'],
          color: 'text-purple-600',
          isSubmenu: true
        }
      );
    }

    const settingsItem = {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      badge: null,
      roles: ['admin', 'ceo', 'pm', 'finance', 'hr', 'resource'],
      color: 'text-gray-600'
    };

    // Filter items based on user role
    const allItems = [...baseItems, ...roleSpecificItems, ...financeItems, settingsItem];
    
    return allItems.filter(item => 
      !profile || item.roles.includes(profile.role)
    );
  };

  const navigationItems = getNavigationItems();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900">
                Techouts
              </h2>
              <p className="text-xs text-gray-500 font-medium">Nexus Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.isSubmenu && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-left h-12 rounded-xl transition-all duration-200 group relative',
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                    isCollapsed && 'px-3 justify-center',
                    item.isSubmenu && 'ml-4 h-10'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? item.color : 'text-gray-500 group-hover:text-gray-700',
                    !isCollapsed && 'mr-3',
                    item.isSubmenu && 'h-4 w-4'
                  )} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-red-500 text-white border-0 shadow-sm text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {isActive && !item.isSubmenu && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* User Profile */}
      {profile && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{profile.name}</p>
                <p className="text-xs text-gray-500 capitalize truncate">{profile.role}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg border-gray-200 hover:bg-gray-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:flex fixed left-0 top-0 z-40 h-full flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-72',
          className
        )}
      >
        <Button
          variant="outline"
          size="sm"
          className="absolute -right-4 top-8 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={cn('h-4 w-4 text-gray-600 transition-transform duration-200', isCollapsed && 'rotate-180')} />
        </Button>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsMobileOpen(false)} 
          />
          <div className="relative flex flex-col w-72 max-w-xs shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}