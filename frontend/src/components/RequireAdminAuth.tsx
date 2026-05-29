import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { clearAdminSession, getToken } from "@/lib/adminFetch";

interface RequireAdminAuthProps {
  children: ReactNode;
}

export default function RequireAdminAuth({ children }: RequireAdminAuthProps) {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus("unauthorized");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.valid) {
          setStatus("authorized");
        } else {
          clearAdminSession();
          setStatus("unauthorized");
        }
      })
      .catch(() => {
        clearAdminSession();
        setStatus("unauthorized");
      });
  }, []);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
