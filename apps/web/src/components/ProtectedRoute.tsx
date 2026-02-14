import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        await getCurrentUser();
      } catch (err: unknown) {
        localStorage.removeItem("access_token");
        navigate("/basic-login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
