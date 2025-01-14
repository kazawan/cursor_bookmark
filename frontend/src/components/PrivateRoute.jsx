import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function PrivateRoute({ children, requireAuth = true }) {
  const { user } = useUser();
  const location = useLocation();

  // 如果需要认证且用户未登录，重定向到登录页
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果用户已登录且试图访问登录/注册页，重定向到书签页
  if (!requireAuth && user) {
    return <Navigate to="/bookmarks" replace />;
  }

  return children;
} 