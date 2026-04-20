# 🏥 NurseSathi — Nursing Job Portal

NurseSathi connects nursing students with hospitals for internships and entry-level nursing jobs across India.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- A [Neon](https://neon.tech) PostgreSQL database
- A Google Cloud OAuth 2.0 app (for Google login)

---

## ⚙️ Setup

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in:
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_long_random_secret
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials → Create OAuth 2.0 Client
3. Application type: **Web application**
4. Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
5. Copy Client ID and Secret into `.env`

### 4. Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string into `DATABASE_URL`
4. Tables are **auto-created** on server start — no manual migrations needed!

---

## ▶️ Run Locally

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → Running on http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → Running on http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## 📁 Project Structure

```
NurseSathi/
├── backend/
│   ├── config/
│   │   ├── db.js           # Neon DB connection + table init
│   │   └── passport.js     # Google OAuth strategy
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── auth.js         # JWT + role guard middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── jobService.js
│   │   └── applicationService.js
│   ├── utils/
│   │   └── jwt.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── JobCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Jobs.jsx
    │   │   ├── JobDetail.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   ├── HospitalDashboard.jsx
    │   │   ├── Profile.jsx
    │   │   └── GoogleAuthSuccess.jsx
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── jobService.js
    │   │   └── applicationService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register with email/password |
| POST | `/auth/login` | — | Login with email/password |
| GET | `/auth/google` | — | Google OAuth redirect |
| GET | `/auth/google/callback` | — | Google OAuth callback |
| GET | `/auth/me` | JWT | Get current user |
| PATCH | `/auth/profile` | JWT | Update profile |
| GET | `/jobs` | — | List all jobs (with filters) |
| GET | `/jobs/:id` | — | Get single job |
| POST | `/jobs` | Hospital | Post a job |
| GET | `/jobs/mine` | Hospital | Get hospital's jobs |
| DELETE | `/jobs/:id` | Hospital | Delete a job |
| POST | `/jobs/:id/apply` | Student | Apply to a job |
| GET | `/jobs/:id/applications` | Hospital | Get applicants for a job |
| GET | `/applications` | Hospital | All applicants across jobs |
| GET | `/applications/mine` | Student | Student's own applications |
| PATCH | `/applications/:id/status` | Hospital | Update application status |

---

## 🗄️ Database Schema

```sql
users        — id, role, name, email, password, phone, education, skills, hospital_name, location, google_id, avatar
jobs         — id, title, description, location, salary, type, requirements, posted_by (→users.id)
applications — id, job_id, student_id, status, cover_letter  (UNIQUE: job_id+student_id)
```

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (12 rounds)
- **JWT** tokens expire in 7 days
- Role-based middleware protects hospital/student routes
- **UNIQUE** constraint prevents duplicate applications (DB-level)
- CORS restricted to `FRONTEND_URL`

---

## 🎨 Features

### Students
- Register with email or Google
- Browse & filter nursing jobs
- Apply with cover letter
- Track application statuses (Applied → Reviewed → Accepted/Rejected)
- Edit profile (education, skills, location)

### Hospitals
- Register and set up profile
- Post, manage, and delete job listings
- View all applicants with their profiles
- Accept / Review / Reject applicants

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon Serverless) |
| Auth | JWT, bcryptjs, Passport.js (Google OAuth) |
| Frontend | React 19 (Vite) |
| HTTP Client | Axios |
| Routing | React Router v6 |
| State | Context API |
| Styling | Vanilla CSS (custom design system) |
