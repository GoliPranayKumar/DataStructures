import { useAuth, UserType } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedUserTypes, 
  requireAuth = true,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-muted-foreground">Loading...</span>
        </motion.div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user type is allowed
  if (allowedUserTypes && user && !allowedUserTypes.includes(user.type)) {
    // Redirect to appropriate dashboard based on user type
    const dashboardRoute = `/${user.type}-dashboard`;
    return <Navigate to={dashboardRoute} replace />;
  }

  // Check if user needs onboarding (students and organizers)
  // Do NOT redirect if we're already on the onboarding route
  // Only students are forced into onboarding. Organizers can access dashboard with limited features.
  if (user && !user.isOnboarded) {
    if (user.type === 'student' && location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
}

// Component for redirecting authenticated users away from auth pages
export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-muted-foreground">Loading...</span>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Check if student needs onboarding first
    if (user.type === 'student' && !user.isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // Redirect to appropriate dashboard
    const dashboardRoute = `/${user.type}-dashboard`;
    return <Navigate to={dashboardRoute} replace />;
  }

  return <>{children}</>;
}