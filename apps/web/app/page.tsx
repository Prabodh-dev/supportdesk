async function getHealth() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  const res = await fetch(`${apiBase}/api/v1/health`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main className="container">
      <header className="nav reveal">
        <div className="brand">Helpdesk</div>
        <div className="nav-actions">
          <a className="btn btn--ghost" href="/auth/login">
            Login
          </a>
          <a className="btn btn--primary" href="/auth/register">
            Get started
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="reveal reveal--delay-1">
          <span className="pill">Realtime support ops</span>
          <h1 className="hero-title">
            Resolve tickets with clarity, not chaos.
          </h1>
          <p className="hero-subtitle">
            A compact helpdesk for teams that want speed, accountability, and
            visibility. Start with a clean workflow, then grow your automations.
          </p>
          <div className="hero-actions">
            <a className="btn btn--primary" href="/auth/register">
              Create your workspace
            </a>
            <a className="btn btn--ghost" href="/auth/login">
              Sign in to console
            </a>
          </div>
        </div>

        <div className="card health-card reveal reveal--delay-2">
          <div className="card-header">
            <div>
              <p className="card-title">System status</p>
              <p className="card-subtitle">API health check</p>
            </div>
            <span className="status-dot" />
          </div>
          <pre className="code-block">{JSON.stringify(health, null, 2)}</pre>
          <div className="stats">
            <div className="stat">
              <span>Status</span>
              <strong>{health?.ok ? "Online" : "Offline"}</strong>
            </div>
            <div className="stat">
              <span>Service</span>
              <strong>{health?.service ?? "-"}</strong>
            </div>
            <div className="stat">
              <span>Latency</span>
              <strong>Low</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="grid reveal reveal--delay-3">
        <article className="feature">
          <h3>Unified ticket timeline</h3>
          <p>
            Track every reply, assignment, and handoff with clean audit logs.
          </p>
        </article>
        <article className="feature">
          <h3>Fast triage</h3>
          <p>Route requests by priority, category, and team in minutes.</p>
        </article>
        <article className="feature">
          <h3>Secure access</h3>
          <p>JWT-based sessions with refresh tokens and cookie safeguards.</p>
        </article>
      </section>
    </main>
  );
}
