# Zeus – Digital Asset Intelligence

Zeus ist eine Full-Stack-Anwendung aus Vue 3, Vite, Capacitor und Fastify, mit der du alle Krypto-Bestände aus Wallets und Börsen zentral überwachen kannst. Die Plattform unterstützt Multi-User-Setups, Premium-Abonnements via Stripe sowie ein Admin-Dashboard für Banner, Nutzerverwaltung und Umsatzanalysen.

## Inhaltsverzeichnis

1. [Architekturüberblick](#architekturüberblick)
2. [Schnellstart](#schnellstart)
3. [Backend](#backend)
   - [Lokale Entwicklung](#lokale-entwicklung)
   - [Tests](#tests)
   - [Deployment](#deployment)
   - [Stripe-Anbindung](#stripe-anbindung)
4. [Frontend & Mobile (Vue + Capacitor)](#frontend--mobile-vue--capacitor)
   - [Lokale Entwicklung](#lokale-entwicklung-1)
   - [Storybook](#storybook)
   - [Build & Deployment](#build--deployment)
   - [Capacitor Builds](#capacitor-builds)
5. [Admin-Funktionen](#admin-funktionen)
6. [Testumgebung](#testumgebung)
7. [Ordnerstruktur](#ordnerstruktur)

---

## Architekturüberblick

```
Zeus/
├── backend/        # Fastify API, Mock-Daten, Stripe Integration
└── frontend/       # Vue 3 + Vite App mit Pinia, Vue Router, Chart.js, Capacitor
```

- **Datenquellen**: Wallets (Ethereum, Solana, Bitcoin) sowie Börsen (Bitvavo, Coinbase, Bitpanda, Binance) werden über API-/Adress-Connectoren angebunden. In dieser Referenzimplementierung werden Mock-Daten genutzt – eigene Integrationen können über die Services im Backend ergänzt werden.
- **Sync-Intervalle**: Free User aktualisieren minütlich, Premium User erhalten Echtzeit-Updates (Polling in der Frontend-App, Backend-Queues einplanbar).
- **Premium-Abos**: Monatlich 5 € oder jährlich 36 €, Zahlungen via Stripe Checkout oder Billing Portal.
- **Admin**: Verwaltung von Bannern/Popups, Nutzer-Rollen (Free vs. Premium), Einsicht in alle Transaktionen und Umsatz-Charts.

## Schnellstart

```bash
# Repository-Abhängigkeiten installieren (Frontend & Backend)
cd frontend && npm install
cd ../backend && npm install
```

Starte anschließend Backend und Frontend in getrennten Terminals:

```bash
# Backend mit Hot-Reload (Port 4000)
npm run dev

# Frontend mit Vite (Port 5173)
npm run dev
```

## Backend

### Lokale Entwicklung

1. `.env` im Ordner `backend/` erstellen (siehe `.env.example` unten).
2. `npm run dev` startet den Fastify-Server inkl. Mock-Endpunkten.
3. Endpunkte laufen unter `http://localhost:4000/api` (Portfolio & User) bzw. `http://localhost:4000/api/admin` (Adminbereich).

Beispiel `.env`:

```
PORT=4000
STRIPE_SECRET_KEY=sk_test_xxx
JWT_SECRET=change-me-securely
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

### Tests

```bash
npm run test
```

> Derzeit sind keine automatisierten Tests implementiert. Ergänze Vitest-Suites in `src/**/*.test.ts`, um Integrationen (z. B. Stripe Webhooks) zu prüfen.

### Deployment

1. **Build**: `npm run build` erzeugt ein `dist/`-Verzeichnis mit JS-Ausgabe.
2. **Node Server**: Deploye das `dist/`-Verzeichnis auf eine Node 18+ Umgebung.
3. **Environment Variablen**: Stelle die Variablen aus der `.env` bereit (z. B. via Docker/Secrets).
4. **Reverse Proxy**: Hinterlege HTTPS-Terminierung (z. B. Traefik, Nginx) und leite `/api` an den Fastify-Server weiter.

### Stripe-Anbindung

1. Stripe Dashboard öffnen und ein Produkt „Zeus Premium“ mit den Preisen `price_monthly` (5 €) und `price_yearly` (36 €) erstellen.
2. `STRIPE_SECRET_KEY` in `.env` setzen.
3. Endpoint für Checkout Sessions hinzufügen (siehe `src/services/stripe.ts` – Stub, bitte implementieren).
4. Webhook Endpoint in Stripe konfigurieren (`/api/webhooks/stripe`) und das Signing Secret speichern.
5. Frontend: `SubscriptionCard` mit Stripe Checkout verknüpfen (Stripe.js `redirectToCheckout`).

> In dieser Vorlage existiert eine Mock-Implementierung. Die Integration lässt sich über eine reale Stripe-API erweitern.

## Frontend & Mobile (Vue + Capacitor)

### Lokale Entwicklung

```bash
cd frontend
npm install
npm run dev
```

- Standard-Port: `5173`
- `.env.local` (optional) mit `VITE_API_BASE_URL=http://localhost:4000/api`
- Authentifizierung & Polling werden über Pinia + Vue Query konfiguriert.

### Storybook

```bash
npm run storybook
```

Storybook zeigt die wiederverwendbaren Komponenten (z. B. StatCard, AdminBannerComposer) im isolierten Playground.

### Build & Deployment

```bash
npm run build
```

- Ergebnis (`dist/`) kann über Static Hosting (Netlify, Vercel, S3) ausgeliefert werden.
- Für SSR/Edge kann Nitro/Nuxt angebunden werden – aktuell SPA.

### Capacitor Builds

1. `npm install` (Frontend) und `npm run build`
2. `npx cap sync`
3. Plattform öffnen: `npx cap open ios` oder `npx cap open android`
4. Native Builds in Xcode/Android Studio durchführen. Push Notifications und Deep Links konfigurierst du in `capacitor.config.ts`.

## Admin-Funktionen

- **Login**: Admin-Account wird im Backend hinterlegt (Mock). Ergänze Auth in `adminRoutes`.
- **Banner/Popups**: Über das Formular `AdminBannerComposer` kann der Admin Meldungen an alle Nutzer senden. Die Informationen werden via `/api/admin/banners` gespeichert.
- **Nutzerverwaltung**: Tabelle zeigt alle User inkl. Tier. Buttons erlauben Löschen sowie Wechsel zwischen Free/Premium.
- **Transaktionen & Umsatz**: `RevenueChart` und `TransactionList` visualisieren Stripe-Zahlungen.

## Testumgebung

1. Backend mit Mockdaten starten (`npm run dev`).
2. Frontend `npm run dev` nutzen. Die Anwendung verbindet sich automatisch mit den Mock-Endpunkten.
3. Für E2E-Tests kann Playwright/Cypress integriert werden. Aktuell liegt der Fokus auf UI-Komponenten via Storybook.

## Ordnerstruktur

```
backend/
├── src/
│   ├── config/        # Environment, Secrets
│   ├── routes/        # Fastify-Routen (API & Admin)
│   ├── services/      # Mock-Daten, zukünftige Integrationen (Wallets, Börsen, Stripe)
│   └── types/         # Gemeinsame Typdefinitionen
└── ...

frontend/
├── src/
│   ├── components/    # UI-Bibliothek inkl. Charts, Tabellen, Admin-Komponenten
│   ├── layouts/       # App Shell
│   ├── router/        # Vue Router Definition
│   ├── stores/        # Pinia Stores (Theme, User, ...)
│   ├── services/      # API-Client (Kommunikation Backend)
│   ├── views/         # Seiten (Dashboard, Portfolio, Admin, Login)
│   └── styles/        # TailwindCSS Basis
└── .storybook/        # Storybook Konfiguration
```

---

> Diese README beschreibt die Referenz-Implementierung und dient als Startpunkt. Ergänze echte Exchange-Connectoren, Authentifizierung, Datenbanken (z. B. PostgreSQL + Prisma) sowie Stripe-Webhooks für produktive Szenarien.
