import { useAuth as useAuthContext } from '@/providers/AuthProvider';

type UserRole = 'customer' | 'sales_ops' | 'admin';

export function useAuth() {
  // Use the context from our Auth Provider
  const auth = useAuthContext();
  
  // Add a role property for backward compatibility
  const role = auth.user?.role || 'customer';
  
  // Convert the new API format to match the old API format for compatibility
  const signIn = async (email: string, password: string) => {
    try {
      await auth.signIn(email, password);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    try {
      await auth.signUp(email, password, name);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
  
  return {
    ...auth,
    role,
    signIn,
    signUp
  };
}