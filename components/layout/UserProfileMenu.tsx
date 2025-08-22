'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth';
import { Loader2, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function UserProfileMenu() {
  const { user, signOut, isLoading } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle hydration mismatch - wait until component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Get initials for the avatar fallback
  const getInitials = () => {
    if (!user?.displayName) return 'U';
    return user.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Show loading state when fetching user profile
  if (!isMounted || isLoading) {
    return (
      <div className="h-9 w-9 relative">
        <Skeleton className="h-9 w-9 rounded-full absolute" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }
  
  // If no user is authenticated after loading, return null
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 hover:border-primary/50 transition-colors">
          {user.photoURL ? (
            <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
          ) : (
            <AvatarFallback>{getInitials()}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium leading-none">{user.displayName || 'User'}</p>
            <p className="text-sm leading-none text-muted-foreground mt-1">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-2 bg-muted px-2 py-0.5 rounded-sm inline-block">{user.role} • {user.department}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem 
          onClick={() => window.location.href = '/profile'}
          className="cursor-pointer p-2 focus:bg-primary/10"
        >
          <User className="mr-3 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Sign Out Menu Item with loading state
function SignOutMenuItem() {
  const { signOut } = useAuthStore();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleSignOut = () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    setIsSigningOut(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      signOut();
      // Redirect to login page
      window.location.href = '/';
    }, 500);
  };
  
  return (
    <DropdownMenuItem 
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="cursor-pointer p-2 text-destructive focus:text-destructive focus:bg-destructive/10"
    >
      {isSigningOut ? (
        <Loader2 className="mr-3 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-3 h-4 w-4" />
      )}
      <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
    </DropdownMenuItem>
  );
}
