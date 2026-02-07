import './globals.css';

export const metadata = {
  title: 'Zeus Backend',
  description: 'API for the invoicing SaaS.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
