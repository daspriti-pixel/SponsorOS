import { createContext, useContext, useEffect, useState, type ReactNode, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

type AuthValue = { session: Session; signOut: () => Promise<void> };
const AuthContext = createContext<AuthValue | null>(null);
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("Authentication context unavailable");
  return value;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let observed = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      observed = true;
      setSession(next);
      setReady(true);
      setError("");
    });
    void supabase.auth.getSession().then(({ data, error: failure }) => {
      if (!active || observed) return;
      if (failure) setError(failure.message);
      setSession(data.session);
      setReady(true);
    }).catch((failure: unknown) => {
      if (!active || observed) return;
      setError(failure instanceof Error ? failure.message : "Unable to restore session");
      setReady(true);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [attempt]);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-background text-muted-foreground" role="status">Checking your session…</div>;
  if (error && !session) return <div className="grid min-h-screen place-items-center bg-background p-6"><div className="max-w-md space-y-4"><p role="alert">{error}</p><Button onClick={() => { setReady(false); setError(""); setAttempt(n => n + 1); }}>Retry</Button></div></div>;
  if (!session) return <Login />;
  return <AuthContext.Provider value={{ session, signOut: async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
    setSession(null);
  } }}>{children}</AuthContext.Provider>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to sign in");
    } finally { setBusy(false); }
  }
  return <div className="grid min-h-screen place-items-center bg-background p-5">
    <section className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">S</div><div><h1 className="text-xl font-bold">SponsorOS</h1><p className="text-sm text-muted-foreground">From Prospect to Payment.</p></div></div>
      <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">Sign in to your sponsorship growth command center.</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="login-email">Email</Label><Input id="login-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} /></div>
        <div className="space-y-2"><Label htmlFor="login-password">Password</Label><Input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} /></div>
        {error && <p className="rounded-md border border-destructive/30 p-3 text-sm text-destructive" role="alert">{error}</p>}
        <Button className="w-full" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
      <p className="mt-6 text-xs text-muted-foreground">Access is limited to authorized accounts.</p>
    </section>
  </div>;
}
