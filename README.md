# 🎓 Math Point — JEE & NEET Coaching Management System

> **Owned by Ashish Upadhyay** | 10+ Years Experience | Guiding Lakhs of Students

A full-stack coaching center management system built with **MERN Stack** (MongoDB, Express, React, Node.js) with a beautiful dark-themed UI using **Vite + React + TailwindCSS + Framer Motion + Redux**.

---

## 🚀 Tech Stack

### Backend
- **Node.js + Express.js** — REST API
- **MongoDB + Mongoose** — Database
- **JWT** — Authentication
- **Socket.io** — Real-time notifications
- **Multer + express-fileupload** — File uploads

### Frontend
- **Vite + React 18** — Frontend framework
- **TailwindCSS** — Styling
- **Framer Motion** — Animations
- **Redux Toolkit** — State management
- **React Router v6** — Routing
- **Chart.js + React-Chartjs-2** — Analytics charts

---

## 📁 Project Structure

```
mathpoint/
├── backend/
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── controllers/     # Route logic
│   │   ├── middleware/       # Auth, error handlers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Seeder
│   ├── uploads/             # Uploaded files
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Layout components
    │   ├── pages/           # Admin + Student + Public pages
    │   ├── store/           # Redux slices
    │   └── services/        # API service
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ Quick Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd mathpoint/backend
npm install

# Frontend
cd mathpoint/frontend
npm install
```

### 2. Configure Environment

```bash
cd mathpoint/backend
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

**Important `.env` values:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mathpoint
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database (Demo Data)

```bash
cd mathpoint/backend
npm run seed
```

This creates:
- ✅ SuperAdmin: `admin@mathpoint.in` / `Admin@1234`
- ✅ Teacher: `rahul@mathpoint.in` / `Teacher@1234`
- ✅ Student: `arjun@student.com` / `Student@1234`

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd mathpoint/backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd mathpoint/frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 🔐 Default Credentials

| Role       | Email                   | Password      |
|------------|-------------------------|---------------|
| SuperAdmin | admin@mathpoint.in      | Admin@1234    |
| Teacher    | rahul@mathpoint.in      | Teacher@1234  |
| Student    | arjun@student.com       | Student@1234  |

---

## 🎨 Features

### 🏠 Public Website
- Beautiful landing page with hero, stats, courses, toppers & testimonials
- Courses page with detailed program info
- About page with founder profile & faculty team
- Contact / Enquiry form

### 👨‍💼 Admin Panel
| Feature | Description |
|---------|-------------|
| Dashboard | Live KPIs, charts, recent activity |
| Analytics | Enrollment trends, revenue, attendance |
| Student Management | Add/Edit/Delete students, view profiles |
| Teacher Management | Manage faculty with permissions |
| Courses & Batches | Create courses, assign teachers & students |
| Fees Management | Track payments, collect dues, overdue alerts |
| Attendance | Mark daily attendance per batch, reports |
| Tests & Exams | Create MCQ/Numerical tests with auto-grading |
| Study Materials | Upload PDFs, notes, DPPs |
| Notifications | Send in-app/email/SMS/WhatsApp alerts |
| Doubts & Support | Manage and reply to student queries |
| Roles & Permissions | Granular permission management for staff |

### 👨‍🎓 Student Portal
| Feature | Description |
|---------|-------------|
| Dashboard | Attendance, fees, scores, notifications at a glance |
| Profile | View & edit personal info, change password |
| Fees | View payment history, due amounts, receipts |
| Attendance | Daily log with percentage tracker and alerts |
| My Batches | Schedule, teacher, and batch details |
| Study Materials | Download PDFs, notes, assignments |
| Tests | Attempt timed MCQ tests with negative marking |
| Results | Score analysis, rank, subject-wise breakdown |
| Notifications | Real-time announcements and alerts |
| Doubt Support | Ask doubts, chat with teachers |

---

## 🌐 API Endpoints

```
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile

GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id

GET    /api/teachers
POST   /api/teachers

GET    /api/courses
POST   /api/courses
GET    /api/courses/batches
POST   /api/courses/batches

GET    /api/fees
POST   /api/fees
PUT    /api/fees/:id/pay
GET    /api/fees/my

POST   /api/attendance
GET    /api/attendance/batch
GET    /api/attendance/my

GET    /api/tests
POST   /api/tests
POST   /api/tests/:id/start
POST   /api/tests/:id/submit
GET    /api/tests/my

GET    /api/materials
POST   /api/materials
GET    /api/materials/my

GET    /api/notifications
POST   /api/notifications
GET    /api/notifications/my

GET    /api/analytics/admin
GET    /api/analytics/student
```

---

## 🎨 Design System

- **Colors**: Dark slate theme with orange (#f97316) primary accent
- **Fonts**: Sora (headings) + DM Sans (body) + JetBrains Mono (code)
- **Components**: Cards, Badges, Buttons, Tables, Modals — all custom-styled
- **Animations**: Framer Motion for page transitions, hovers, and reveals

---

## 📝 License

© 2024 Math Point. All rights reserved. Owned by **Ashish Upadhyay**.

Built with ❤️ for JEE & NEET aspirants across India.
