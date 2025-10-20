# Zeus – Multi-Plattform Krypto Command Center

Zeus ist eine moderne Portfolio-Plattform für Web & Mobile (Vue 3 + Capacitor) inklusive Node.js Backend. Sie konsolidiert Wallets und Börsen wie Bitvavo, Coinbase, Binance und Bitpanda, überwacht Wallet-Adressen (Ethereum, Solana, Bitcoin) und liefert Echtzeit-Analysen für Premium-Kund:innen. Ein Admin-Dashboard bietet Umsatz- und Nutzerkontrolle inklusive Banner-/Popup-Verwaltung.

## Architekturüberblick

```
Zeus/
├── frontend/        # Vue 3 + Vite + Tailwind + Storybook + Capacitor
└── backend/         # Express + TypeScript API (Stripe, Wallet/Exchange Integrationen)
```

- **Frontend**: Vite + Vue 3 + Pinia + Vue Router + Tailwind + ApexCharts, Storybook für UI-Komponenten, Capacitor-Konfiguration für Mobile Builds.
- **Backend**: Express (TypeScript), In-Memory Services als Referenzimplementierung, Stripe-Anbindung, Auth & Admin-Rollen, simulierte Krypto-Preisfeeds.

---

## Voraussetzungen

- Node.js ≥ 18
- npm oder pnpm oder yarn (Beispiele nutzen npm)
- Stripe Konto (für Produktivbetrieb)
- Optional: Android/iOS SDKs für native Builds via Capacitor

---

## Frontend – Setup, Entwicklung & Deployment

```bash
cd frontend
npm install
```

### Entwicklung starten

```bash
npm run dev
```
- Läuft standardmäßig auf `http://localhost:5173`
- Backend-URL per `.env` konfigurierbar (`VITE_API_URL`)

### Storybook für Komponenten

```bash
npm run storybook
```
- Erzeugt interaktive Dokumentation für wiederverwendbare Komponenten (z. B. `SubscriptionPlanCard`, `AdminUserTable`, `ZeusTopBar`).

### Tests & Linting

```bash
npm run test      # Vitest Unit Tests
npm run lint      # ESLint + Vue/Tailwind Regeln
```

### Production-Build (Web)

```bash
npm run build
npm run preview   # lokales Preview des gebauten Bundles
```

### Capacitor Mobile Builds

1. `npm run build` (erzeugt `dist/` als Web-Asset)
2. `npx cap sync` (plattformabhängige Verzeichnisse aktualisieren)
3. `npx cap open android` oder `npx cap open ios`
4. Native Build & Deployment wie gewohnt (Android Studio / Xcode)

> **Hinweis:** Für mobile Builds `capacitor.config.ts` und `android/`, `ios/` Plattformen anpassen. HTTPS-Backends erfordern ggf. zusätzliche Zertifikat-Konfigurationen.

### Theme-Support

- `useTheme`-Composable speichert Light-/Darkmode in `localStorage`
- Komponenten und Seiten folgen UI/UX Best Practices (großzügige Abstände, Fokuszustände, Accessible Contrast)

---

## Backend – Setup, Entwicklung & Deployment

```bash
cd backend
npm install
```

### Entwicklung

```bash
npm run dev
```
- Startet Express API auf `http://localhost:4000`
- CORS erlaubt Frontend-Entwicklung (`http://localhost:5173`)

### Tests

```bash
npm run test
```
- Vitest prüft Kern-Services (`billingService` u. a.)

### Produktion

```bash
npm run build
npm start
```
- Build erzeugt `dist/`
- Verwenden Sie Prozessmanager (PM2, systemd) oder Container Deployment (Docker, Kubernetes)

### Konfiguration (.env Beispiel)

```dotenv
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-me
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_FREE_PRICE_ID=price_free_optional
WEBAPP_URL=https://app.zeus.io
```

> Für Tests ohne Stripe können `STRIPE_*` Variablen leer bleiben. Checkout-Endpunkt liefert dann einen 500er Hinweis. Subscription-Upgrades funktionieren dennoch über das Mocking im `billingService`.

---

## Stripe-Anbindung

1. Erstellen Sie in Stripe zwei Preise: monatlich (5 €) und jährlich (36 €) oder nutzen bestehende Produkte.
2. Hinterlegen Sie `STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`, optional `STRIPE_FREE_PRICE_ID` in der `.env` des Backends.
3. Definieren Sie `VITE_STRIPE_PUBLISHABLE_KEY` im Frontend (`.env`) für Checkout Redirects.
4. Webhooks (optional für produktive Systeme) können mit `stripe listen` eingerichtet werden, um Subscription-Status serverseitig zu synchronisieren.

---

## Authentifizierung & Benutzerrollen

- Registrierung / Login über `/api/auth` (JWT basiert).
- Pinia Store persistiert Token & User-Objekt.
- Rollen: `user` (Free/Premium) und `admin`.
- Premium: Echtzeit-Refresh (5 Sekunden), unbegrenzte Exchange-Verbindungen.
- Free: max. 2 Börsen, Refresh alle 60 Sekunden.

### Admin Account

- Ein Default-Admin wird beim Start erzeugt: `admin@zeus.app` / Passwort `ChangeMe123!`
- Nach Login (`/auth/signin`) `currentUser.role === 'admin'` → Zugriff auf `/admin`

### Admin-Dashboard Features

- **Nutzerverwaltung:** Nutzer löschen, auf Premium hochstufen / zurücksetzen (Buttons je Zeile)
- **Banner & Pop-ups:** Formular im Admin-Panel erzeugt globale Mitteilungen; Frontend zeigt Banner (oder modales Popup) im TopBar-Layout an.
- **Transaktionsübersicht:** `AdminRevenueChart` visualisiert Umsätze der letzten 6 Monate, basierend auf `billingService` Daten.

Popup/Banner schalten:
1. Admin-Dashboard öffnen (`/admin`).
2. Formular „Banner & Pop-ups“ ausfüllen.
3. Aktiviertes Notice absenden → erscheint sofort im Header aller Nutzer.

---

## Integrationen & Datenquellen

- **Wallet-Tracking:** Ethereum, Solana, Bitcoin (Adresse hinterlegen). Backend simuliert Kurswerte via `pricingService`.
- **Börsen:** Bitvavo, Coinbase, Binance, Bitpanda. API Keys werden serverseitig gespeichert (Mock). Für produktive Integrationen ersetzen Sie `integrationService` durch echte API-Clients.
- **Preisfeed:** `pricingService` ruft Cryptocompare API ab (Fallback auf Randomdaten bei Rate-Limits).

---

## Test-Umgebung & Demo-Daten

- Beim ersten Start generiert das Backend automatisch einen Snapshot mit Wallet- & Exchange-Verteilung.
- `pricingService` erzeugt deterministische Struktur mit Zufalls-Performancewerten → Charts zeigen Trends.
- Tests (`npm run test`) laufen ohne externe Dienste; Preis-API wird nur bei Bedarf aufgerufen.

---

## Deployment-Empfehlungen

### Docker (Kurzbeispiel)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY backend/package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/index.js"]
```

Frontend kann via `npm run build` erzeugt und mit beliebigem Static Host (Netlify, Vercel, S3, nginx) deployt werden. Für mobile Stores (Android/iOS) nutzen Sie Capacitor Sync & native Toolchains.

---

## Sicherheit & Erweiterbarkeit

- JWT Secret & Stripe Keys sicher verwalten (Secrets Manager, Environment Variables).
- Für produktive Systeme: Persistente Datenbank (PostgreSQL, MongoDB) für Nutzer, Transaktionen, Verbindungen, Notices.
- Implementieren Sie Webhooks zur Validierung von Stripe-Ereignissen (Subscription Aktivierung/Deaktivierung).
- Tauschen Sie Mock-Services (`portfolioService`, `integrationService`, `billingService`) gegen echte Implementierungen (z. B. Exchange APIs, Blockchain Indexer, Redis Queue).
- Logging & Monitoring über Tools wie Winston + Loki, Prometheus/Grafana.

---

## Roadmap-Ideen

- Multi-Währungs-Unterstützung (USD, CHF etc.)
- Automatische Alarmierung (Push Notifications via Capacitor / FCM / APNs)
- Erweiterte Analysetools (Sharpe Ratio, Steuerschätzungen)
- Benutzerdefinierte Widgets im Dashboard

---

Viel Erfolg beim Ausbau von **Zeus** – möge der Blitz immer vor euch sein!
