import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {

  const { isSignedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // Ou um spinner de carregamento
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
