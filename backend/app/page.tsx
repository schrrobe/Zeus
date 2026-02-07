import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Zeus API</h1>
      <p>Backend für Rechnungen, Nutzerrechte, Mandanten und Abrechnung.</p>
      <ul>
        <li>Postgres + Prisma mit UUIDs</li>
        <li>Mehrmandantenfähige Rechnungsverwaltung</li>
        <li>Rollenbasierte Rechte pro Feature</li>
      </ul>
      <Link href="/api/health">Health Check</Link>
    </main>
  );
}
