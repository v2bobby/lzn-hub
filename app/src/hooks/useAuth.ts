import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc-client";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean }) {
  const utils = trpc.useUtils();
  const navigate = useNavigate();
  const redirect = options?.redirectOnUnauthenticated ?? false;

  const { data: user, isLoading } = trpc.localAuth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: true,
  });

  // Redirecting during render is a side effect in the render phase; it fires
  // twice under StrictMode and races the query. Do it in an effect instead.
  useEffect(() => {
    if (redirect && !isLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [redirect, isLoading, user, navigate]);

  const logout = useCallback(async () => {
    localStorage.removeItem("lh_auth_token");
    await utils.invalidate();
    navigate("/", { replace: true });
  }, [utils, navigate]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
