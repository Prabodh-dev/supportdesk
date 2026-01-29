async function getHealth() {
  const res = await fetch("http://localhost:3000/api/v1/health", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const health = await getHealth();

  return (
    <main>
      <h1>Helpdesk Web</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <a href="/auth/register">Register</a>
        <a href="/auth/login">Login</a>
      </div>
    </main>
  );
}
