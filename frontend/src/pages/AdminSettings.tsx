import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Settings have been merged into the main dashboard — redirect there
export default function AdminSettings() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/dashboard?section=settings", { replace: true });
  }, [navigate]);
  return null;
}
