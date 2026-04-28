# 🚀 Project Tracker – Full Stack Web Application

🔗 **Live demo:** https://project-tracker.benameryckx.be

---

## 📌 Over het project

Project Tracker is een fullstack webapplicatie waarmee je klanten en hun projecten kan beheren.
De applicatie laat toe om klanten aan te maken, te bewerken en te verwijderen, en per klant meerdere projecten te beheren met status en budget.

Dit project werd volledig van scratch opgebouwd met focus op:

- duidelijke architectuur
- realistische use-case
- production-ready deployment

---

## ✨ Features

### 👤 Client management

- Nieuwe klanten aanmaken
- Klanten bewerken en verwijderen
- Unieke e-mailvalidatie
- Statusbeheer (active, inactive, pending)

### 📁 Project management

- Projecten per klant beheren
- Budget en status per project
- CRUD operaties voor projecten

### 📊 Dashboard

- Overzicht van alle klanten en projecten
- Statistieken (aantal klanten, projecten, budget)
- Filtering op status

### 🎯 UX & UI

- Responsive design
- Empty states (geen data, filters, afhankelijkheden)
- Error handling
- Success feedback (bv. na delete)
- Modals voor create/update flows

---

## 🧠 Technische stack

### Frontend

- React (Vite)
- Custom hooks (data fetching)
- Fetch API (met eigen request wrapper)
- Tailwind CSS
- Component-based architecture

### Backend

- FastAPI
- SQLAlchemy (ORM)
- SQLite database
- REST API (nested resources)

### DevOps / Deployment

- Uvicorn (ASGI server)
- systemd (process management)
- Nginx (reverse proxy + static hosting)
- Certbot (HTTPS/SSL)

---

## 🏗️ Architectuur

```txt
React Frontend
      ↓
Nginx (static + proxy /api)
      ↓
FastAPI (Uvicorn)
      ↓
SQLite Database
```

Frontend en backend communiceren via:

```txt
/api/clients/
/api/clients/{id}/projects/
```

---

## ⚙️ Belangrijke implementatiedetails

### 🔁 Custom API layer

Een centrale request-wrapper verwerkt:

- JSON parsing
- error handling
- status checks
- fallback messages

### 🔗 Data compositie

Frontend combineert:

- clients
- projecten per client

→ tot één consistente datastructuur voor UI rendering

### ⚠️ Edge cases

- Empty states (geen clients → geen projecten mogelijk)
- Filtered states
- API errors (user-friendly feedback)
- Loading states

---

## 🐛 Problemen & oplossingen

### ❌ Trailing slash bug (FastAPI)

API endpoints met en zonder `/` zorgden voor redirects en parsing issues.

✅ Oplossing:

- consistente trailing slashes in frontend API calls

---

### ❌ SQLite path probleem (deployment)

Database kon niet geopend worden op server.

✅ Oplossing:

- correcte absolute path
- juiste folderstructuur (`/data`)

---

### ❌ Relative imports FastAPI

Werkte lokaal maar faalde op server.

✅ Oplossing:

- app starten als package (`module:app`)
- correcte projectstructuur

---

### ❌ Nginx proxy issues

Frontend kon API niet bereiken.

✅ Oplossing:

- correcte `/api` proxy setup
- consistente routes

---

## 🚀 Deployment

De applicatie draait op een eigen Linux server:

- Frontend build gehost via Nginx
- Backend draait via systemd service
- API bereikbaar via `/api`
- HTTPS via Certbot

---

## 📸 Screenshots

### 🏠 Dashboard

Overzicht van alle klanten, projecten en budgetten in één centrale cockpit.

![Dashboard](./screenshots/dashboard.png)

---

### 👤 Clients overzicht

Beheer van klanten met gekoppelde projecten, statussen en budgetinformatie.

![Clients](./screenshots/clients.png)

---

### 📁 Projects overzicht

Alle projecten gegroepeerd en filterbaar per status (active, planned, completed).

![Projects](./screenshots/projects.png)

---

### ✨ Modals (Create / Update)

Gebruiksvriendelijke modals voor het aanmaken en bewerken van klanten en projecten.

![Modal](./screenshots/modal.png)

---

### 📭 Empty states

Duidelijke feedback wanneer er nog geen data beschikbaar is.

![Empty State](./screenshots/empty.png)

---

## 🎯 Leerdoelen

Met dit project heb ik geleerd:

- Fullstack applicaties bouwen
- API design en structuur
- Data flow tussen frontend en backend
- Deployment op eigen server
- Debuggen van real-world problemen
- UX denken (empty states, feedback, flows)

---

## 🔮 Mogelijke uitbreidingen

- 🔐 Authenticatie (login/register)
- 🗄️ Migratie naar PostgreSQL
- ⚡ React Query voor data management
- 📈 Geavanceerde dashboard statistieken
- 🧪 Unit & integration testing

---

## 💬 Conclusie

Dit project toont mijn vermogen om:

- een volledige applicatie te bouwen
- problemen zelfstandig op te lossen
- een productieklare setup op te zetten

👉 Van idee → tot live applicatie 🚀

---
