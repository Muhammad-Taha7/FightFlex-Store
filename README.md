<div align="center">

# ⚡ FightFlex — Sports & Fitness E-Commerce Platform

**A production-ready, full-stack e-commerce application built with the MERN stack.**  
Featuring dual-role authentication, real-time order management, Google OAuth, OTP email verification, Cloudinary image uploads, and a powerful admin dashboard.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 📌 Table of Contents

- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Features](#-features)
- [Pages & Routes](#-pages--routes)
- [Database Models](#-database-models)
- [REST API Reference](#-rest-api-reference)
- [Security](#-security)
- [Environment Variables](#-environment-variables)
- [Local Setup](#-local-setup)
- [Deployment](#-deployment)
- [Developer](#-developer)

---

## 🔗 Live Demo

| Service | URL |
|---------|-----|
| 🌐 **Frontend** | [fightflex-store.vercel.app](https://fightflex-store.vercel.app) |
| 🔧 **Backend API** | [fightflex-store-backend.vercel.app](https://fightflex-store-backend.vercel.app) |

> **Admin Login:** Navigate to `/login` with your admin credentials.

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19 | UI Library |
| **Vite** | 8 | Build Tool & Dev Server |
| **Redux Toolkit** | 2.x | Global State Management |
| **React Router DOM** | 7 | Client-Side Routing |
| **Axios** | 1.x | HTTP Client |
| **TailwindCSS** | 4 | Utility-First CSS Framework |
| **Recharts** | 3.x | Analytics Charts (Admin) |
| **Lucide React** | — | Icon Library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | Runtime Environment |
| **Express.js** | 5 | REST API Framework |
| **MongoDB + Mongoose** | 9.x | NoSQL Database & ODM |
| **jsonwebtoken** | 9.x | JWT Authentication |
| **bcryptjs** | 3.x | Password Hashing |
| **Cloudinary** | 2.x | Cloud Image Storage |
| **Nodemailer + EJS** | — | Transactional Emails |
| **Zod** | 4.x | Schema & Input Validation |
| **cookie-parser** | — | HttpOnly Cookie Handling |

### Infrastructure
| Tool | Usage |
|------|-------|
| **Vercel** | Frontend & Serverless Backend Hosting |
| **MongoDB Atlas** | Managed Cloud Database |

---

## 🏗️ Project Architecture

```
FightFlex/
│
├── client/                        # React + Vite Frontend
│   ├── public/
│   └── src/
│       ├── Admin/                 # Admin panel
│       │   ├── Auth/              #   └── Login page
│       │   ├── Components/        #   └── Dashboard, Product, Order, User, Carousel management
│       │   └── Dashboard.jsx
│       │
│       ├── Client/                # Customer-facing storefront
│       │   ├── pages/             #   └── Home, Product, Checkout, Orders, Profile, Auth pages
│       │   └── Components/        #   └── Navbar, CartDrawer, ProductSlider, Carousel, Footer
│       │
│       ├── Components/            # Shared global components
│       │   ├── SplashLoader.jsx   #   └── Animated entry screen
│       │   ├── ProtectedRoute.jsx #   └── Admin route guard
│       │   └── ClientProtectedRoute.jsx
│       │
│       ├── store/                 # Redux Toolkit state
│       │   ├── authSlice.js
│       │   ├── cartSlice.js
│       │   ├── orderSlice.js
│       │   └── index.js
│       │
│       └── App.jsx                # Root routing configuration
│
└── server/                        # Node.js + Express Backend
    ├── controllers/               # Business logic layer
    │   ├── authController.js
    │   ├── productController.js
    │   ├── orderController.js
    │   └── carouselController.js
    ├── models/                    # Mongoose schemas
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   └── Carousel.js
    ├── routes/                    # Express route definitions
    ├── middleware/                # JWT auth + admin guard
    ├── utils/                     # Email utility (Nodemailer)
    ├── Public/                    # EJS email templates
    ├── app.js                     # Express app config & middleware
    └── server.js                  # Server entry point
```

---

## ✨ Features

### 🛍️ Customer Storefront
- Animated **Splash Screen** on every page load
- Browse products by **category**: Men, Women, Kids, Accessories, Nutrition
- **Product Detail** page with image gallery, size & color selector
- **Cart Drawer** with real-time quantity management (powered by Redux)
- **Checkout** with shipping address, phone number & Cash on Delivery
- **Order History** with live status tracking (Pending → Dispatched → Cleared)
- **User Profile** — update personal info, address, and phone number
- **Profile Picture Upload** via Cloudinary

### 🔐 Authentication
- **Email Registration with OTP** — 6-digit code sent via Gmail SMTP
- **OTP Modal** with resend functionality and expiry handling
- **Forgot Password** — secure time-limited reset link via email
- **Google OAuth** — one-click sign-in with Google account
- **JWT Auth** stored in secure HttpOnly cookies
- **Separate Admin Login** via dedicated `/login` route
- **Change Credentials** — update email and password from profile

### 🛠️ Admin Dashboard
- **Overview Panel** — key metrics with Recharts graphs (revenue, orders, users)
- **Product Management** — full CRUD with multi-image Cloudinary upload
- **Order Management** — view all orders, change status, filter & search
- **User Management** — view registered users, delete accounts
- **Carousel Management** — manage homepage hero banner images
- **Admin Password Change** — secure credential update

---

## 📁 Pages & Routes

### Client Routes
| Route | Page | Protected |
|-------|------|:---------:|
| `/` | Home | ❌ |
| `/men` | Men's Collection | ❌ |
| `/women` | Women's Collection | ❌ |
| `/kids` | Kids' Collection | ❌ |
| `/accessories` | Accessories | ❌ |
| `/nutrition` | Nutrition | ❌ |
| `/product/:id` | Product Detail | ❌ |
| `/checkout` | Checkout | ❌ |
| `/profile` | My Profile | ✅ User |
| `/orders` | My Orders | ✅ User |
| `/client-login` | Login | ❌ |
| `/signup` | Register | ❌ |
| `/forgot-password` | Forgot Password | ❌ |

### Admin Routes
| Route | Page | Protected |
|-------|------|:---------:|
| `/login` | Admin Login | ❌ |
| `/run/Dashboard` | Admin Dashboard | ✅ Admin |

---

## 🗃️ Database Models

### 👤 User
| Field | Type | Notes |
|-------|------|-------|
| `username` | String | Required |
| `email` | String | Unique, lowercase |
| `password` | String | Bcrypt hashed |
| `address` | String | Delivery address |
| `phone` | String | Contact number |
| `profileImage` | String | Cloudinary URL |
| `isVerified` | Boolean | OTP verification status |
| `otp` | String | Hashed OTP value |
| `otpExpires` | Date | OTP expiry timestamp |
| `role` | Enum | `'admin'` or `'user'` |

### 📦 Product
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Product name |
| `description` | String | Full description |
| `price` | Number | PKR / base currency |
| `category` | Enum | Men, Women, Kids, Accessories, Nutrition |
| `images` | Array | `[{ imageUrl, publicId }]` |
| `sizes` | Array | e.g., `['S','M','L','XL']` |
| `colors` | Array | e.g., `['Black','White']` |
| `stockQuantity` | Number | Available stock |

### 🛒 Order
| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId | Ref: User |
| `items` | Array | `[{ name, qty, price, image, size, color }]` |
| `totalPrice` | Number | Order total |
| `status` | Enum | pending / dispatched / cleared / cancelled |
| `shippingAddress` | String | Delivery location |
| `paymentMethod` | String | Default: COD |
| `phone` | String | Contact at delivery |
| `hiddenForUser` | Boolean | Soft-delete from user view |

---

## 🔌 REST API Reference

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/verify-otp` | Verify email OTP | Public |
| `POST` | `/resend-otp` | Resend OTP | Public |
| `POST` | `/client-login` | Client user login | Public |
| `POST` | `/login` | Admin login | Public |
| `POST` | `/google-login` | Google OAuth sign-in | Public |
| `POST` | `/forgot-password` | Send password reset email | Public |
| `POST` | `/reset-password` | Reset password via token | Public |
| `GET` | `/me` | Get authenticated user | 🔒 User |
| `PUT` | `/update-profile` | Update profile info | 🔒 User |
| `PUT` | `/change-credentials` | Update email/password | 🔒 User |
| `POST` | `/upload-avatar` | Upload profile image | 🔒 User |
| `POST` | `/logout` | Logout (clear cookie) | 🔒 User |
| `GET` | `/users` | List all users | 🔒 Admin |
| `DELETE` | `/users/:id` | Delete user by ID | 🔒 Admin |

### Products — `/api/products`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Get all products | Public |
| `POST` | `/` | Create product | 🔒 Admin |
| `PUT` | `/:id` | Update product | 🔒 Admin |
| `DELETE` | `/:id` | Delete product | 🔒 Admin |

### Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/` | Place a new order | 🔒 User |
| `GET` | `/my-orders` | Get current user's orders | 🔒 User |
| `GET` | `/` | Get all orders | 🔒 Admin |
| `PATCH` | `/:id/status` | Update order status | 🔒 Admin |
| `DELETE` | `/:id` | Delete an order | 🔒 Admin |

### Carousel — `/api/carousel`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Get all carousel slides | Public |
| `POST` | `/` | Upload new slide | 🔒 Admin |
| `DELETE` | `/:id` | Remove a slide | 🔒 Admin |

---

## 🔒 Security

| Measure | Implementation |
|---------|---------------|
| **JWT Storage** | HttpOnly cookies (XSS-resistant) |
| **Password Hashing** | bcryptjs — 10 salt rounds |
| **OTP Security** | Hashed OTP with expiry timestamp |
| **Access Control** | Role-based guards (`protect` + `admin` middleware) |
| **Input Validation** | Zod schemas on all write endpoints |
| **CORS Policy** | Whitelist-only (localhost + Vercel origins) |
| **Route Guards** | `ProtectedRoute` and `ClientProtectedRoute` on frontend |

---

## ⚙️ Environment Variables

### `server/.env`
```env
# Database
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# Server
PORT=5000

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=36500d

# Frontend URL (for CORS)
CLIENT_URL=https://your-client.vercel.app

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="FightFlex <no-reply@fightflex.com>"
ADMIN_EMAIL=your@gmail.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js **v18+**
- A **MongoDB Atlas** cluster (or local MongoDB)
- A **Cloudinary** account
- A **Gmail App Password** for transactional emails

### 1. Clone the Repositories

```bash
# Frontend
git clone https://github.com/Muhammad-Taha7/FightFlex-Store.git
cd FightFlex-Store

# Backend
git clone https://github.com/Muhammad-Taha7/FightFlex-Store-Backend-.git
cd FightFlex-Store-Backend-
```

### 2. Run the Backend

```bash
cd FightFlex-Store-Backend-
cp .env.example .env        # Fill in your credentials
npm install
npm run dev
# API running at: http://localhost:5000
```

### 3. Run the Frontend

```bash
cd FightFlex-Store
cp .env.example .env        # Set VITE_API_URL=http://localhost:5000
npm install
npm run dev
# App running at: http://localhost:5173
```

---

## 🌐 Deployment

Both repositories are **Vercel-ready** out of the box:

- **`client/vercel.json`** — Configures SPA routing fallback (all routes → `index.html`)
- **`server/vercel.json`** — Wraps Express as a serverless function

**Steps:**
1. Import both repos into [Vercel](https://vercel.com)
2. Add all environment variables in Vercel's project settings
3. Deploy — Vercel handles the rest automatically

---

## 👨‍💻 Developer

**Muhammad Taha**

Full-Stack MERN Developer passionate about building scalable, production-grade web applications.

[![GitHub](https://img.shields.io/badge/GitHub-Muhammad--Taha7-181717?style=for-the-badge&logo=github)](https://github.com/Muhammad-Taha7)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/your-profile)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your-email@gmail.com)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

**If this project was helpful or impressive, consider giving it a ⭐**

*Built with ❤️ using the MERN Stack*

</div>
