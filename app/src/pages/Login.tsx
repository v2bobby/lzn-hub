import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { LogoMark } from "@/components/Logo";
import ContractField from "@/components/ContractField";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { trpc } from "@/providers/trpc-client";
import { site } from "@/lib/site";

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(
    params.get("intent") === "register" ? "register" : "login",
  );

  useDocumentMeta(
    mode === "login" ? "Sign in — LenzerHub" : "Create an account — LenzerHub",
    "Sign in to review contracts, track findings and get renewal alerts.",
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const googleUrl = trpc.googleAuth.url.useQuery(undefined, { retry: false });
  const hasGoogle = !!googleUrl.data?.url;

  const onSuccess = (data: { token: string }) => {
    localStorage.setItem("lh_auth_token", data.token);
    toast.success(mode === "login" ? "Signed in" : "Account created");
    navigate("/dashboard", { replace: true });
  };

  const onError = (err: { message: string }) => {
    setError(err.message || "That did not work. Check your details and retry.");
  };

  const loginMutation = trpc.localAuth.login.useMutation({ onSuccess, onError });
  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess,
    onError,
  });

  const pending = loginMutation.isPending || registerMutation.isPending;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const next: Record<string, string> = {};
    if (mode === "register" && !name.trim()) next.name = "Tell us your name.";
    if (!email.includes("@")) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "At least 6 characters.";

    setFieldErrors(next);
    if (Object.keys(next).length) return;

    if (mode === "login") loginMutation.mutate({ email, password });
    else registerMutation.mutate({ name: name.trim(), email, password });
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError(null);
    setFieldErrors({});
  };

  return (
    <div className="grid min-h-[100svh] overflow-x-hidden lg:grid-cols-[1fr_minmax(0,30rem)]">
      {/* Left: the same 3D field, so signing in feels like the same product. */}
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        <ContractField className="absolute inset-0 h-full w-full" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0E1620 6%, rgba(14,22,32,0.55) 55%, rgba(14,22,32,0.45) 100%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-end p-12">
          <p className="eyebrow text-insert">Contract review</p>
          <p className="display mt-5 max-w-[13ch] text-display-md text-paper">
            Eight clauses decide the deal.
          </p>
          <p className="mt-5 max-w-sm font-read text-[1.0625rem] leading-relaxed text-paper/60">
            Your first review is free. No card, no sales call.
          </p>
        </div>
      </aside>

      {/* Right: the form */}
      <main
        id="main"
        className="flex flex-col justify-center bg-paper px-6 py-14 sm:px-10 lg:px-14"
      >
        <Link
          to="/"
          aria-label="LenzerHub home"
          className="inline-flex w-fit items-center gap-2.5 rounded-sm"
        >
          <LogoMark size={26} />
          <span className="display text-[1.15rem] leading-none text-ink">
            Lenzer<span className="font-medium opacity-70">Hub</span>
          </span>
        </Link>

        <h1 className="display mt-12 text-display-sm text-ink">
          {mode === "login" ? "Sign in." : "Create your account."}
        </h1>
        <p className="mt-3 max-w-sm font-read text-[1rem] leading-relaxed text-graphite">
          {mode === "login"
            ? "Pick up where you left off."
            : "The first contract review is free."}
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-6 max-w-sm rounded-md border border-strike/30 bg-strike-wash px-4 py-3 text-sm text-strike"
          >
            {error}
          </p>
        ) : null}

        <form onSubmit={submit} noValidate className="mt-8 max-w-sm space-y-5">
          {mode === "register" ? (
            <div>
              <label htmlFor="name" className="field-label">
                Name
              </label>
              <input
                id="name"
                className="field"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              {fieldErrors.name ? (
                <p id="name-error" role="alert" className="mt-1.5 text-xs text-strike">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="field-label">
              Work email
            </label>
            <input
              id="email"
              type="email"
              className="field"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email ? (
              <p id="email-error" role="alert" className="mt-1.5 text-xs text-strike">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="field"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            {fieldErrors.password ? (
              <p id="password-error" role="alert" className="mt-1.5 text-xs text-strike">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button type="submit" disabled={pending} className="btn btn-primary w-full">
            {pending
              ? "Working…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {hasGoogle ? (
          <div className="mt-6 max-w-sm">
            <div className="flex items-center gap-4">
              <hr className="rule flex-1" />
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-graphite-light">
                or
              </span>
              <hr className="rule flex-1" />
            </div>
            <button
              type="button"
              onClick={() => {
                if (googleUrl.data?.url) window.location.href = googleUrl.data.url;
              }}
              className="btn btn-outline mt-6 w-full"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        ) : null}

        <p className="mt-8 max-w-sm text-sm text-graphite">
          {mode === "login" ? "No account yet? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="font-semibold text-insert-deep underline underline-offset-4 transition-colors hover:text-ink"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>

        <p className="mt-10 max-w-sm text-xs leading-relaxed text-graphite-light">
          By continuing you agree to the{" "}
          <Link to="/terms" className="underline underline-offset-4 hover:text-ink">
            terms of service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline underline-offset-4 hover:text-ink">
            privacy policy
          </Link>
          . Questions first?{" "}
          <a
            href={`mailto:${site.email}`}
            className="underline underline-offset-4 hover:text-ink"
          >
            {site.email}
          </a>
        </p>
      </main>
    </div>
  );
}
