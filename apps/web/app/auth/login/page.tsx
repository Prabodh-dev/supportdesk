"use client";

import { useState } from "react";

export default function LoginPage() {
  const [msg, setMsg] = useState<string>("");
  const [me, setMe] = useState<any>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) setMsg(data?.error?.message || "Login failed");
    else setMsg("Logged in. Try /me.");
  }

  async function loadMe() {
    const res = await fetch("/api/v1/auth/me", { credentials: "include" });
    const data = await res.json();
    setMe(data);
  }

  async function logout() {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setMe(null);
    setMsg("Logged out");
  }

  return (
    <main className="auth">
      <header className="auth-header reveal">
        <div>
          <div className="brand">Helpdesk</div>
          <p className="helper">Sign in to manage tickets and responses.</p>
        </div>
        <a className="btn btn--ghost" href="/">
          Back home
        </a>
      </header>

      <section className="form-card reveal reveal--delay-1">
        <h2>Welcome back</h2>
        <p className="helper">Use your admin or agent credentials.</p>
        <form onSubmit={onSubmit} className="form-grid">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="agent1@helpdesk.local"
              className="input"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              placeholder="Your password"
              type="password"
              className="input"
              autoComplete="current-password"
            />
          </div>
          <div className="actions">
            <button className="btn btn--primary" type="submit">
              Sign in
            </button>
            <button className="btn btn--ghost" type="button" onClick={loadMe}>
              Who am I
            </button>
            <button className="btn btn--ghost" type="button" onClick={logout}>
              Log out
            </button>
            <a className="btn btn--ghost" href="/dashboard">
              Go to dashboard
            </a>
          </div>
        </form>

        {msg ? (
          <div className={`msg ${msg.includes("failed") ? "msg--error" : ""}`}>
            {msg}
          </div>
        ) : null}

        {me ? (
          <pre className="code-block">{JSON.stringify(me, null, 2)}</pre>
        ) : null}
      </section>
    </main>
  );
}
