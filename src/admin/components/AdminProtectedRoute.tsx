import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function AdminProtectedRoute() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      setIsAdmin(!error && data === true);
    }

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <p className="text-center mt-5">Checking access...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
