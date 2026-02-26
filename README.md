# 🏋️ GymForge Pro — AI-Powered Fitness Platform

<div align="center">

![GymForge Pro](https://img.shields.io/badge/GymForge-PRO-ff6b00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDAgNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNCIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSI4IiByeD0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

**A full-stack AI-powered gym management SaaS platform with personalized workouts, nutrition tracking, gamification, and smart analytics.**

</div>

---

## ✨ Features

### 👤 Member Dashboard
- AI-generated personalized workout plans
- Smart nutrition calculator & macro tracking
- XP/leveling gamification system with leaderboards
- QR code gym check-in
- Health data sync & progress tracking
- AI fitness assistant (Arabic + English)
- Workout history & activity logs

### 🏋️ Trainer Panel
- Member progress monitoring
- Manual plan modifications
- Direct feedback system

### ⚙️ Admin Dashboard
- Revenue analytics & attendance tracking
- Member management with role-based access
- Subscription plan management
- Churn prediction & risk member detection
- Challenge creation system

### 🔒 Security
- JWT authentication with refresh tokens
- Email OTP verification
- bcrypt password hashing (12 salt rounds)
- Helmet security headers
- Rate limiting (general + auth + OTP)
- Role-based access control (Super Admin, Admin, Trainer, Member)
- Input validation via express-validator

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 15 |
| **Auth** | JWT + bcrypt + OTP |
| **AI Engine** | Built-in workout/nutrition AI |
| **Charts** | Chart.js |
| **Fonts** | Google Fonts (Outfit) |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) >= 18.0.0
- [PostgreSQL](https://www.postgresql.org/) >= 13

### 1. Clone the Repository
```bash
git clone https://github.com/MohamedElbihery/gym-management.git
cd gym-management
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your database credentials and secrets
```

### 4. Start the Server
```bash
npm start
```

The server will:
- Auto-create the database if it doesn't exist
- Run schema migrations
- Seed the Super Admin account
- Start on `http://localhost:5000`

### 5. Open the App
Visit **http://localhost:5000** in your browser.

---

## ☁️ Production Deployment

| Service | Platform | Plan |
|---------|----------|------|
| Database | [Supabase](https://supabase.com) | Free |
| Backend | [Render](https://render.com) | Free |
| Frontend | [Vercel](https://vercel.com) | Free |

### Deploy Backend to Render
1. Push code to GitHub
2. Create a new **Web Service** on Render
3. Set root directory to `server`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (see `.env.example`)

### Deploy Frontend to Vercel
1. Import GitHub repo on Vercel
2. Deploy as static site (uses `vercel.json` config)
3. Update `CORS_ORIGIN` on Render with your Vercel URL

### Deploy Database to Supabase
1. Create a new Supabase project
2. Copy the connection string
3. Set `DATABASE_URL` in Render environment variables

---

## 📁 Project Structure

```
gym-management/
├── index.html          # Main SPA entry point
├── styles.css          # Full UI stylesheet (dark theme)
├── api-client.js       # Frontend API client with JWT handling
├── app.js              # Core application logic
├── ai-engine.js        # AI workout & nutrition engine
├── chat.js             # AI fitness assistant
├── user.js             # Member dashboard logic
├── trainer.js          # Trainer panel logic
├── admin.js            # Admin dashboard logic
├── gamification.js     # XP, levels, leaderboard system
├── challenges.js       # Challenge system
├── churn.js            # Churn prediction analytics
├── health-sync.js      # Health data integration
├── i18n.js             # Internationalization (EN/AR)
├── user-history.js     # Activity history tracking
├── vercel.json         # Vercel deployment config
├── .gitignore          # Git ignore rules
│
└── server/
    ├── server.js           # Express server entry point
    ├── package.json        # Backend dependencies
    ├── render.yaml         # Render deployment blueprint
    ├── .env.example        # Environment variable template
    ├── config/
    │   └── db.js           # PostgreSQL connection (DATABASE_URL support)
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── admin.controller.js
    │   └── user.controller.js
    ├── middleware/
    │   ├── auth.js         # JWT verification & RBAC
    │   ├── security.js     # Helmet, CORS, rate limiting
    │   └── validator.js    # Input validation rules
    ├── models/
    │   ├── schema.sql      # Full database schema (11 tables, 21 indexes)
    │   └── migrate.js      # Auto-migration script
    ├── routes/
    │   ├── auth.routes.js
    │   ├── admin.routes.js
    │   └── user.routes.js
    ├── services/
    │   ├── token.service.js    # JWT token generation
    │   ├── otp.service.js      # OTP management
    │   └── email.service.js    # Email sending (SMTP)
    └── utils/
        ├── hash.js         # bcrypt hashing utility
        └── logger.js       # Activity logging
```

---

## 🔑 Environment Variables

See [`server/.env.example`](server/.env.example) for the full template.

| Variable | Description |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL connection string (for hosted DB) |
| `JWT_SECRET` | Secret key for access tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `CORS_ORIGIN` | Allowed frontend origins (comma-separated) |
| `SUPER_ADMIN_EMAIL` | Super admin email (seeded on first run) |
| `SMTP_USER` / `SMTP_PASS` | Gmail credentials for OTP emails |

---

## 📄 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh JWT token |
| GET | `/api/auth/me` | Get current user |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id/profile` | Get user profile |
| PUT | `/api/users/:id/profile` | Update profile |
| GET | `/api/users/:id/workouts` | Get workout plans |
| POST | `/api/users/:id/nutrition` | Log nutrition |
| POST | `/api/users/:id/attendance` | QR check-in |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/stats` | Dashboard statistics |
| PUT | `/api/admin/users/:id/role` | Change user role |
| DELETE | `/api/admin/users/:id` | Delete user |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by Mohamed Elbihery**

</div>
