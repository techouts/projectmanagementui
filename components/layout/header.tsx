'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Settings, LogOut, User, Sun } from 'lucide-react';

interface HeaderProps {
  title?: string;
  sidebarCollapsed?: boolean;
}

export function Header({ title = 'Dashboard', sidebarCollapsed = false }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/95 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex-1 lg:ml-0 ml-12">
        <h1 className="text-xl font-bold text-gray-900 truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        {/* Search - Hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-[250px] lg:w-[300px] bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-200 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search Button */}
        <Button variant="outline" size="sm" className="md:hidden rounded-xl border-gray-200 hover:bg-gray-50">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="outline" size="sm" className="relative rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 border-0 shadow-sm">
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <Button variant="outline" size="sm" className="rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200">
          <Sun className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-indigo-200 transition-all duration-200">
              <Avatar className="h-10 w-10 shadow-sm">
                <AvatarImage src={profile?.avatar_url} alt={profile?.name || ''} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-xl shadow-xl border-gray-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-semibold leading-none truncate text-gray-900">{profile?.name}</p>
                <p className="text-xs leading-none text-gray-500 truncate">
                  {profile?.email}
                </p>
                <Badge className="w-fit text-xs capitalize bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
                  {profile?.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="p-3 rounded-lg mx-2 my-1 hover:bg-gray-50 transition-colors cursor-pointer">
              <User className="mr-3 h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 rounded-lg mx-2 my-1 hover:bg-gray-50 transition-colors cursor-pointer">
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="p-3 rounded-lg mx-2 my-1 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}