import ThemeToggle from "../components/ThemeToggle";

const tickets = [
  {
    id: "HD-1042",
    title: "SAML login blocked for EU region",
    status: "In progress",
    priority: "Urgent",
    customer: "Nova Health",
    updated: "12 min ago",
    agent: "Agent One",
  },
  {
    id: "HD-1039",
    title: "Invoice PDF export fails",
    status: "Waiting on customer",
    priority: "High",
    customer: "SolarWind",
    updated: "44 min ago",
    agent: "Admin",
  },
  {
    id: "HD-1032",
    title: "Slack alert noise for closed tickets",
    status: "Open",
    priority: "Medium",
    customer: "Atlas Studio",
    updated: "2 hrs ago",
    agent: "Agent One",
  },
  {
    id: "HD-1028",
    title: "Refund workflow needs audit trail",
    status: "Resolved",
    priority: "Low",
    customer: "BrightPath",
    updated: "Yesterday",
    agent: "Admin",
  },
];

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">Helpdesk Console</div>
        <nav className="sidebar-nav">
          <a className="sidebar-link sidebar-link--active" href="/dashboard">
            Overview
          </a>
          <a className="sidebar-link" href="/dashboard">
            Tickets
          </a>
          <a className="sidebar-link" href="/dashboard">
            Teams
          </a>
          <a className="sidebar-link" href="/dashboard">
            Automations
          </a>
        </nav>
        <div className="sidebar-footer">
          <div>
            <p className="helper">Signed in as</p>
            <strong>Agent One</strong>
          </div>
          <a className="btn btn--ghost" href="/auth/login">
            Switch account
          </a>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="pill">Today</p>
            <h1 className="hero-title">Ticket command center</h1>
            <p className="hero-subtitle">
              Monitor active queues, SLA risk, and agent workload in one place.
            </p>
          </div>
          <div className="dashboard-actions">
            <ThemeToggle />
            <button className="btn btn--primary">New ticket</button>
          </div>
        </header>

        <section className="dashboard-grid">
          <div className="card">
            <p className="card-title">Queue health</p>
            <p className="card-subtitle">Real-time signal from API</p>
            <div className="stats">
              <div className="stat">
                <span>Open</span>
                <strong>18</strong>
              </div>
              <div className="stat">
                <span>SLA risk</span>
                <strong>4</strong>
              </div>
              <div className="stat">
                <span>Avg response</span>
                <strong>11m</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="card-title">Agent load</p>
            <p className="card-subtitle">Active conversations per agent</p>
            <div className="progress-list">
              <div>
                <div className="progress-header">
                  <span>Agent One</span>
                  <strong>7 tickets</strong>
                </div>
                <div className="progress-bar">
                  <span style={{ width: "70%" }} />
                </div>
              </div>
              <div>
                <div className="progress-header">
                  <span>Admin</span>
                  <strong>5 tickets</strong>
                </div>
                <div className="progress-bar">
                  <span style={{ width: "50%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="card-title">Resolution pace</p>
            <p className="card-subtitle">Weekly trend</p>
            <div className="sparkline">
              <span style={{ height: "32%" }} />
              <span style={{ height: "64%" }} />
              <span style={{ height: "52%" }} />
              <span style={{ height: "78%" }} />
              <span style={{ height: "58%" }} />
              <span style={{ height: "88%" }} />
            </div>
          </div>
        </section>

        <section className="ticket-shell">
          <div className="ticket-list">
            <div className="ticket-list-header">
              <h2>Priority queue</h2>
              <span className="helper">{tickets.length} tickets</span>
            </div>
            {tickets.map((ticket) => (
              <article key={ticket.id} className="ticket-card">
                <div>
                  <div className="ticket-title">
                    <strong>{ticket.title}</strong>
                    <span className="ticket-id">{ticket.id}</span>
                  </div>
                  <p className="ticket-meta">
                    {ticket.customer} · Updated {ticket.updated}
                  </p>
                </div>
                <div className="ticket-tags">
                  <span className="tag tag--status">{ticket.status}</span>
                  <span className="tag tag--priority">{ticket.priority}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="ticket-detail">
            <div className="card">
              <div className="card-header">
                <div>
                  <p className="card-title">SAML login blocked</p>
                  <p className="card-subtitle">HD-1042 · Nova Health</p>
                </div>
                <span className="status-dot" />
              </div>
              <p className="helper">
                Customer reports SSO failures for EU tenants. 401 after IdP
                handshake. Needs fix before enterprise rollout.
              </p>
              <div className="chip-grid">
                <span className="chip">Priority: Urgent</span>
                <span className="chip">Assigned: Agent One</span>
                <span className="chip">SLA: 32 min left</span>
              </div>
              <div className="actions">
                <button className="btn btn--primary">Open thread</button>
                <button className="btn btn--ghost">Add note</button>
              </div>
            </div>
            <div className="card">
              <p className="card-title">Latest activity</p>
              <ul className="activity">
                <li>
                  <strong>10:42</strong> Agent One escalated to engineering.
                </li>
                <li>
                  <strong>10:20</strong> Admin tagged ticket with "SAML".
                </li>
                <li>
                  <strong>09:58</strong> Customer uploaded IdP logs.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
