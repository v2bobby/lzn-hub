import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { LogoMark } from "@/components/Logo";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export default function AuthCallback() {
  useDocumentMeta("Signing you in — LenzerHub");

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");
  const error = params.get("error");
  // Derived during render rather than stored in state: the query string is
  // already the source of truth, so an extra state round-trip buys nothing.
  const failed = !!error || !token;

  useEffect(() => {
    if (failed || !token) return;
    localStorage.setItem("lh_auth_token", token);
    navigate("/dashboard", { replace: true });
  }, [failed, token, navigate]);

  return (
    <main
      id="main"
      className="flex min-h-[100svh] flex-col items-center justify-center bg-paper px-6 text-center"
    >
      <LogoMark size={32} />
      {failed ? (
        <>
          <h1 className="display mt-8 text-display-sm text-ink">
            Sign-in didn't complete.
          </h1>
          <p className="mt-4 max-w-sm font-read text-[1rem] leading-relaxed text-graphite">
            The provider returned without a valid token. Start again and it
            usually goes through.
          </p>
          <Link to="/login" className="btn btn-primary mt-8">
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <p className="eyebrow mt-8 text-graphite" aria-live="polite">
            Signing you in
          </p>
          <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-paper-sunk">
            <span className="block h-full w-1/3 animate-sweep rounded-full bg-insert" />
          </div>
        </>
      )}
    </main>
  );
}
