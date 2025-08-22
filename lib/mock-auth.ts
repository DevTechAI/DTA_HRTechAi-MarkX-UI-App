import { User, useAuthStore } from '@/store/auth';
import { useCallback } from 'react';

/**
 * This is a development utility function to setup a mock user for testing.
 * In a real application, this would be replaced with actual Firebase authentication.
 */
export const mockUser: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  displayName: 'John Doe',
  photoURL: null, // We'll use avatar fallback with initials
  role: 'employee',
  department: 'Engineering'
};

// Custom hook to setup a mock user
export const useSetupMockUser = () => {
  const { setUser, user, setLoading } = useAuthStore();
  
  // Use useCallback to memoize the setupUser function
  // This prevents infinite loops in useEffect dependencies
  const setupUser = useCallback(async () => {
    if (!user) {
      // Simulate loading state
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Set up a mock user for development
      setUser(mockUser);
      
      setLoading(false);
    }
    
    return user;
  }, [user, setUser, setLoading]);
  
  return setupUser;
};
