# Implementierungsstatus (Audit)

## Kurzfazit

Das Repository ist ein **Scaffold/Prototyp** mit UI-Ansichten und einer Prisma-Datenbasis.
Viele Features sind konzeptionell angelegt, aber noch **nicht funktional umgesetzt**.
Insbesondere fehlt die vollständige API-Schicht (Create/Update/Permissions/Invoice-Flow),
und das Backend ist aktuell **Express**, nicht Next.js.

## Frontend (Vue 3 + Tailwind + TypeScript)

**Vorhanden (UI/Scaffold):**

- Seiten: Dashboard, Kundenübersicht, Kundendetail, Rechnungsübersicht, Rechnung erstellen,
  Produkte, Nutzer, Admin, Einstellungen, Login, Organisation registrieren.
- Wiederverwendbare Komponenten: Headline, Text, Button, InputField, DataTable.
- Theme-Variablen + Light/Dark-Styles über CSS Custom Properties.

**Fehlt/noch offen (funktional):**

- Keine echte Authentifizierung/Session-Handling.
- Keine API-Anbindung (Fetch/Pinia-Store) für Kunden, Rechnungen, Produkte, Nutzer.
- Rechte-/Rollenprüfung pro Feature ist im UI nicht implementiert.
- Tabellen/Diagramme nutzen Platzhalterdaten.
- PDF/E-Rechnung-Versand und „Als bezahlt markieren“ sind UI-Buttons ohne Backend-Flow.

## Backend (Express + Prisma + PostgreSQL)

**Vorhanden:**

- Prisma-Schema mit UUIDs, Organisationsmodell, Users/Memberships, Permissions, Kunden, Produkte,
  Rechnungen, Steuer-Sätze, ThemeSettings, InvoiceMeta, InvoiceCounter.
- Basale Read-APIs + Dashboard-Summary.
- Registrierung einer Organisation inkl. Org-Leader.

**API-Endpunkte (aktuell in `src/server.ts`):**

- `GET /health`
- `GET /`
- `GET /api/products`
- `GET /api/customers`
- `GET /api/customers/:id`
- `GET /api/users`
- `GET /api/invoices` (Filter: `year`, `month`)
- `GET /api/admin/organizations`
- `GET /api/dashboard`
- `POST /api/organizations/register`

**Fehlt/noch offen (funktional):**

- Kein Next.js Backend (Anforderung), sondern Express.
- Keine Authentifizierung/Autorisierung.
- Keine Create/Update/DELETE-APIs für:
  - Kunden inkl. Notizen
  - Produkte/Dienstleistungen
  - Rechnungen/Gutschriften (inkl. fortlaufender Nummern, Status-Update)
  - Steuer-Sätze, InvoiceMeta (Header/Footer), ThemeSettings
  - Nutzerverwaltung/Permissions pro Feature
- Keine E-Rechnung/PDF-Erstellung und Versand (nur Konzept).
- Keine SaaS-Abrechnungsintegration (Stripe/PayPal).

## Zusammenfassung der Lücke zum Anforderungskatalog

- **Backend-Technologie**: gefordert Next.js (TS), vorhanden Express (TS).
- **Business-Logik**: Rollen/Permissions, Rechnungsflow, PDF/E-Rechnung Versand, Zahlstatus,
  Steuer-Sätze, Kopf/Fußzeile, Theme-Variablen sind nicht implementiert.
- **SaaS-Plan**: nur Konstanten, keine Abrechnung.

Wenn du möchtest, setze ich als nächsten Schritt die fehlenden APIs und den
Next.js-Backend-Switch um (inkl. Auth, Permissions, Invoice-Flow, PDF/E-Rechnung)
und verbinde das Frontend mit echten Daten.
