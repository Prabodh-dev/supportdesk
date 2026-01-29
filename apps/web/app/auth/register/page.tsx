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
    <main>
      <h2>Register (Customer)</h2>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, maxWidth: 360 }}
      >
        <input name="name" placeholder="Name (optional)" />
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="Password (min 8)" type="password" />
        <button type="submit">Create account</button>
      </form>
      <p>{msg}</p>
      <a href="/auth/login">Go Login</a>
    </main>
  );
}
