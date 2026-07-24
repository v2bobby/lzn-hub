import { useCallback } from "react";
import { trpc } from "@/providers/trpc-client";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean }) {
  const utils = trpc.useUtils();
  const { data: user, isLoading } = trpc.localAuth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: true,
  });

  if (isLoading === false && !user && options?.redirectOnUnauthenticated) {
    window.location.href = "/login";
  }

  const logout = useCallback(() => {
    localStorage.removeItem("lh_auth_token");
    utils.localAuth.me.invalidate();
    window.location.reload();
  }, [utils]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
