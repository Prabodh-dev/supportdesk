import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-body">
        <div className="bg-orb bg-orb--one" aria-hidden="true" />
        <div className="bg-orb bg-orb--two" aria-hidden="true" />
        <div className="bg-grid" aria-hidden="true" />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
