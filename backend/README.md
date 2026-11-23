<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
</p>

<h1 align="center">🎬 Cinezone — Backend API</h1>

<p align="center">
  RESTful API server for the <strong>Cinezone</strong> movie ticket booking platform.<br/>
  Built with Node.js, Express 5, MySQL, MongoDB, Socket.IO & Stripe.
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Real-time Features](#-real-time-features)
- [Background Jobs](#-background-jobs)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Cinezone Backend** is the core API service for a full-featured cinema booking system. It handles everything from user authentication and movie management to seat reservation, payment processing, and real-time seat status updates via WebSocket.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 Authentication | JWT-based auth + Google OAuth 2.0 via Passport.js |
| 🎥 Movie Management | CRUD for movies, showtimes, and cinema rooms |
| 💺 Seat Reservation | Real-time seat locking & booking with conflict prevention |
| 💳 Payment | Stripe integration for secure online payments |
| 📧 Email Notifications | Booking confirmation emails via Nodemailer |
| 🏆 Loyalty Points | Score/points system with history tracking |
| 📊 Analytics | Revenue & booking analytics dashboard |
| 🔔 Notifications | Real-time push notifications via Socket.IO + Firebase |
| 🛒 Combo Products | Food & beverage order system |
| 📄 API Docs | Auto-generated Swagger UI at `/` |

---

## 🛠 Tech Stack

### Core
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18.x+ | Runtime |
| **Express.js** | ^5.1.0 | Web framework |
| **MySQL2** | ^3.14.1 | Primary relational database |
| **Mongoose** | ^8.15.0 | MongoDB ODM for analytics |
| **Socket.IO** | ^4.8.1 | Real-time WebSocket communication |

### Auth & Security
| Technology | Purpose |
|---|---|
| **jsonwebtoken** | JWT token generation & verification |
| **bcrypt / bcryptjs** | Password hashing |
| **Passport.js + Google OAuth2** | Social login |
| **express-session** | Session management |

### Integrations
| Technology | Purpose |
|---|---|
| **Stripe** | Payment processing |
| **Firebase Admin** | Push notifications |
| **Nodemailer** | Transactional emails |
| **QRCode** | Ticket QR code generation |
| **Redis** | Caching layer |
| **Axios** | HTTP client for external APIs |

### Developer Tools
| Technology | Purpose |
|---|---|
| **Swagger (swagger-jsdoc + swagger-ui-express)** | Interactive API documentation |
| **Nodemon** | Hot-reload for development |
| **dotenv** | Environment variable management |
| **express-validator** | Request validation middleware |

---

## 📁 Project Structure

```
backend/
├── 📄 server.js                  # App entry point — Express, Socket.IO, routes, CORS
├── 📄 swagger.js                 # Swagger spec configuration
├── 📄 package.json
│
├── 📂 config/
│   ├── database.js               # MySQL connection pool
│   ├── firebase.js               # Firebase Admin SDK setup
│   ├── google.js                 # Google OAuth config
│   └── serviceAccountKey.json    # Firebase service account (⚠️ NOT committed)
│
├── 📂 controllers/               # Business logic layer
│   ├── analytics.controller.js
│   ├── booking.controller.js
│   ├── bookingseat.controller.js
│   ├── cinemaRoom.controller.js
│   ├── comboProduct.controller.js
│   ├── employee.controller.js
│   ├── movie.controller.js
│   ├── orderProduct.controller.js
│   ├── payment.controller.js
│   ├── product.controller.js
│   ├── promotion.controller.js
│   ├── rating.controller.js
│   ├── scorehistory.controller.js
│   ├── seat.controller.js
│   ├── showtime.controller.js
│   ├── ticket.controller.js
│   ├── user.controller.js
│   └── user.management.controller.js
│
├── 📂 routes/                    # API route definitions
│   ├── auth.js                   # POST /api/auth/*
│   ├── users.js                  # /api/user/*
│   ├── employees.js              # /api/employee/*
│   ├── movies.js                 # /api/movie/*
│   ├── cinemaRoom.js             # /api/cinema-rooms/*
│   ├── showtime.js               # /api/showtimes/*
│   ├── seat.js                   # /api/seats/*
│   ├── seatshowtime.js           # /api/seatshowtimes/*
│   ├── booking.js                # /api/bookings/*
│   ├── bookingseat.js            # /api/booking-seats/*
│   ├── ticket.js                 # /api/tickets/*
│   ├── payment.js                # /api/payment/*
│   ├── products.js               # /api/products/*
│   ├── comboProduct.js           # /api/combo-products/*
│   ├── orderProduct.js           # /api/order-products/*
│   ├── orderProductDetail.js     # /api/order-product-details/*
│   ├── promotions.js             # /api/promotions/*
│   ├── rating.js                 # /api/ratings/*
│   ├── scorehistory.js           # /api/scorehistory/*
│   └── analytics.js              # /api/analytics/*
│
├── 📂 models/                    # Mongoose / MySQL schema definitions
│   ├── user.model.js
│   ├── movie.model.js
│   ├── booking.model.js
│   ├── seat.moddel.js
│   ├── showtime.model.js
│   ├── payment.model.js
│   └── ...
│
├── 📂 middlewares/               # Express middleware
│   ├── auth.middleware.js        # JWT verification
│   ├── passport.js               # Google OAuth strategy
│   ├── booking.validator.js
│   ├── movie.validator.js
│   ├── seat.validator.js
│   ├── showtime.validator.js
│   └── user.validator.js
│
├── 📂 jobs/                      # Scheduled background tasks
│   ├── bookingCleanup.js         # Auto-cancel expired bookings (every 60s)
│   ├── orderProductCleanup.js    # Auto-cancel expired orders (every 60s)
│   └── seatCleanup.js            # Clean up stale seat locks
│
├── 📂 services/
│   └── bookingEmailService.js    # Email confirmation logic
│
├── 📂 utils/
│   ├── constants.js
│   └── date.js
│
└── 📂 public/
    └── swagger-custom.js         # Custom Swagger UI JavaScript
```

---

## 🌐 API Endpoints

> Full interactive documentation is available at **`http://localhost:4458/`** (Swagger UI) once the server is running.

| Group | Base Path | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, Google OAuth, refresh token |
| Users | `/api/user` | Profile CRUD, change password |
| Employees | `/api/employee` | Staff management |
| Movies | `/api/movie` | Movie CRUD, search, now-showing |
| Cinema Rooms | `/api/cinema-rooms` | Room management |
| Showtimes | `/api/showtimes` | Schedule management |
| Seats | `/api/seats` | Seat layout per room |
| Seat Showtimes | `/api/seatshowtimes` | Seat availability per showtime |
| Bookings | `/api/bookings` | Create & manage bookings |
| Booking Seats | `/api/booking-seats` | Seat assignment per booking |
| Tickets | `/api/tickets` | Ticket retrieval & QR code |
| Payments | `/api/payment` | Stripe payment intents |
| Products | `/api/products` | Concession items |
| Combo Products | `/api/combo-products` | Combo deals |
| Order Products | `/api/order-products` | Food & drink orders |
| Promotions | `/api/promotions` | Discount codes & campaigns |
| Ratings | `/api/ratings` | Movie ratings & reviews |
| Score History | `/api/scorehistory` | Loyalty points tracking |
| Analytics | `/api/analytics` | Admin revenue & usage stats |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MySQL** >= 8.x (running on the port configured in `.env`)
- **MongoDB** (for analytics, configured via `MONGODB_URI`)
- **Redis** (optional but recommended for caching)
- A **Stripe** account for payment features
- A **Firebase** project for push notifications

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KhietNDL/Cinezone-be.git
cd Cinezone-be

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Then edit .env with your actual values (see section below)

# 4. Start the development server
npm start
```

The server will start on **port 4458** by default.
Swagger UI will be available at: **http://localhost:4458/**

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the `backend/` directory. **Never commit this file.**

```env
# ─── Server ─────────────────────────────────
PORT=4458

# ─── MySQL Database ──────────────────────────
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie
DB_PORT=3306

# ─── MongoDB (Analytics) ─────────────────────
MONGODB_URI=mongodb://localhost:27017/cinezone_analytics

# ─── JWT ─────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=1d

# ─── Google OAuth ────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4458/api/auth/google/callback

# ─── Stripe ──────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─── Nodemailer (Email) ──────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# ─── Redis ───────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── Firebase ────────────────────────────────
# Place your serviceAccountKey.json in config/ and add path here
FIREBASE_PROJECT_ID=your_firebase_project_id
```

---

## ⚡ Real-time Features

This project uses **Socket.IO** for real-time communication between clients and server.

### Events

| Event | Direction | Description |
|---|---|---|
| `join` | Client → Server | Join a user-specific room using `userId` |
| Seat status updates | Server → Client | Broadcast seat lock/unlock in real time |
| Notifications | Server → Client | Send booking & system notifications |

### CORS Origins (Allowed)

```
http://localhost:5173     (Vite dev server)
http://localhost:4173     (Vite preview)
http://localhost:4458     (Local backend)
http://cinezone.info      (Production)
http://cinezone.info:4458 (Production API)
```

---

## ⏰ Background Jobs

The server runs two auto-cleanup jobs every **60 seconds** to maintain data integrity:

| Job | File | Description |
|---|---|---|
| **Booking Cleanup** | `jobs/bookingCleanup.js` | Cancels bookings that were not paid within the time limit and releases reserved seats |
| **Order Cleanup** | `jobs/orderProductCleanup.js` | Cancels expired food/drink orders |
| **Seat Cleanup** | `jobs/seatCleanup.js` | (Manual trigger) Removes stale seat locks |

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

> Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Made with ❤️ by the <strong>Cinezone Team</strong>
</p>
