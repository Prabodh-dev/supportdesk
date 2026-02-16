"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const name = String(form.get("name") || "");

    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, name: name || undefined }),
    });

    const data = await res.json();
    if (!res.ok) setMsg(data?.error?.message || "Register failed");
    else setMsg("Registered. Now login.");
  }

  return (
    <main className="auth">
      <header className="auth-header reveal">
        <div>
          <div className="brand">Helpdesk</div>
          <p className="helper">
            Create a customer profile and start a new ticket.
          </p>
        </div>
        <a className="btn btn--ghost" href="/">
          Back home
        </a>
      </header>

      <section className="form-card reveal reveal--delay-1">
        <h2>Register</h2>
        <p className="helper">
          Customer accounts are best for tracking requests and updates.
        </p>
        <form onSubmit={onSubmit} className="form-grid">
          <div>
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Your name"
              className="input"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              placeholder="you@company.com"
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
              placeholder="Minimum 8 characters"
              type="password"
              className="input"
              autoComplete="new-password"
            />
          </div>
          <div className="actions">
            <button className="btn btn--primary" type="submit">
              Create account
            </button>
            <a className="btn btn--ghost" href="/auth/login">
              I already have an account
            </a>
          </div>
        </form>

        {msg ? (
          <div className={`msg ${msg.includes("failed") ? "msg--error" : ""}`}>
            {msg}
          </div>
        ) : null}
      </section>
    </main>
  );
}
