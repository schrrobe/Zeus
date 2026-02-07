# Zeus Invoicing SaaS

Mehrmandantenfähige Web-App zur Verwaltung von Ausgangsrechnungen und Gutschriften.
Frontend basiert auf Vue 3 + Tailwind + TypeScript, Backend auf Express.js + TypeScript + Postgres (Prisma).

## Struktur

```
.
├── backend
├── frontend
└── docker-compose.yml
```

## Features (Konzeptuell)

- Mehrmandantenfähigkeit (Organisationen + Nutzerrollen)
- Rollenbasierte Rechte pro Feature (Lesen/Bearbeiten)
- Fortlaufende Rechnungsnummern pro Organisation
- Rechnungen & Gutschriften mit PDF/E-Rechnung Versand
- Kundenverwaltung inkl. Notizen + Umsatzauswertung
- Produkte & Dienstleistungen auswählbar oder Freitext
- Organisationsleiter steuert Steuer-Sätze, Kopf/Fußzeile, Theme-Variablen
- Admin-Ansicht mit Einblick in Organisationen
- SaaS-Logik: 10 Rechnungen/Jahr frei, danach 99€/Jahr

## Lokale Entwicklung

### Voraussetzungen

- Node.js 20+
- Docker Desktop (für Postgres, optional für App-Container)

### Option A: Alles via Docker Compose

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000 (Health: /health)
- Postgres: localhost:5432

### Option B: Lokal ohne Docker (nur DB via Docker)

1) Postgres starten:

```bash
docker compose up db
```

2) Backend starten:

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

3) Frontend starten:

```bash
cd frontend
npm install
npm run dev
```

## Datenbank & UUIDs

- Prisma-Schema ist in `backend/prisma/schema.prisma`.
- Alle IDs sind UUIDs.
- Rechnungsnummern werden über `InvoiceCounter` pro Organisation fortlaufend gespeichert.

## Theme & Design Variablen

Theme-Variablen werden im Frontend über CSS Custom Properties gesteuert.
Wenn keine Einstellungen vorliegen, greifen Standardwerte.
Organisationsleiter können u. a. definieren:

- Abstände (X/Y)
- Brand-Farben
- Schriftarten für Headline/Text
- Light/Dark Mode

## Rechte & Rollen

- `ORG_LEADER`: volle Rechte inkl. Einstellungen, Nutzerverwaltung
- `MEMBER`: Leserechte, ggf. Schreibrechte je Feature
- `ADMIN`: Zugriff auf Admin-Bereich

Permissions werden pro Feature als `READ` oder `WRITE` modelliert.

## SaaS-Abrechnung

- `FREE_INVOICE_LIMIT = 10`
- `PAID_PLAN_PRICE_EUR = 99`

Logik ist im Backend in `lib/billing.ts` dokumentiert.
Im Produktiven System kann daraus die Abrechnung via Stripe/PayPal erfolgen.

## E-Rechnung & PDF Versand

### Entwicklung

- Verwende in der Entwicklung einen lokalen SMTP-Service (z. B. Mailpit).
- Ergänze `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` im Backend.

### Produktion

- Verwende einen SMTP-Provider (Mailgun, Postmark, Amazon SES).
- Hinterlege DKIM/SPF für die Versanddomain.
- PDF-Generierung via Headless Chromium oder serverseitiger PDF-Engine.
- E-Rechnung (XRechnung/ZUGFeRD) über spezielle Generatoren + Validierung.

## Weiteres

- Die Frontend-Komponenten (`Headline`, `Text`, `Button`, `InputField`, `DataTable`) sind wiederverwendbar.
- Die Struktur ist ein Startpunkt für iteratives Feature-Rollout.
