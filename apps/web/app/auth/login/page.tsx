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
    <main>
      <h2>Login</h2>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, maxWidth: 360 }}
      >
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="Password" type="password" />
        <button type="submit">Login</button>
      </form>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={loadMe}>GET /me</button>
        <button onClick={logout}>Logout</button>
      </div>

      <p>{msg}</p>
      <pre>{me ? JSON.stringify(me, null, 2) : ""}</pre>
    </main>
  );
}
