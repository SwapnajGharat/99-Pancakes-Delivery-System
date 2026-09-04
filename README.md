# 🥞 99 Pancakes Panvel - Online Delivery System

A full-stack web application for **99 Pancakes Panvel**, featuring online delivery, menu browsing, customer accounts, address management, reviews, and admin product administration.

---

## 🚀 Tech Stack

### Frontend (Week 1 Prototype Preserved)
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS v4, Glassmorphism, Custom Animations
- **Motion & Smooth Scroll:** Framer Motion, Lenis Smooth Scroll
- **Routing & State:** React Router DOM v7, React Context (CartContext)
- **HTTP Client:** Axios (configured in `src/services/api.js`)

### Backend (Week 2 Foundation Implemented)
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB Atlas via Mongoose ORM
- **Authentication:** JWT (JSON Web Tokens) with `Bearer` header scheme
- **Password Hashing:** `bcryptjs` (salt factor 10)
- **Validation:** `express-validator`
- **Security:** `helmet`, `cors`, `express-rate-limit`
- **Logging & Dev Tooling:** `morgan`, `nodemon`

---

## 📁 Project Structure

```
WP-99PANCAKES/
├── .env                     # Local environment variables (Git ignored)
├── .env.example             # Template for required environment variables
├── .gitignore               # Ignored files (node_modules, .env, dist, etc.)
├── API_DOCUMENTATION.md     # Complete REST API reference
├── README.md                # Project documentation
├── package.json             # Root scripts and frontend dependencies
├── index.html
├── vite.config.js
│
├── src/                     # React Frontend
│   ├── assets/              # Static media assets
│   ├── components/          # UI components (Header, Footer, ProductCard, etc.)
│   ├── context/             # React Context (CartContext.jsx)
│   ├── data/                # Static fallback mock data
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout wrappers
│   ├── pages/               # Application pages (Home, Menu, ProductDetails, etc.)
│   ├── routes/              # Client-side routing configuration
│   ├── services/            # Axios API service instance (`api.js`)
│   └── utils/               # Helper utilities
│
└── server/                  # Node.js / Express REST API Backend
    ├── config/              # MongoDB connection (`db.js`) & env loader (`env.js`)
    ├── controllers/         # REST API business logic
    │   ├── addressController.js
    │   ├── authController.js
    │   ├── categoryController.js
    │   ├── productController.js
    │   ├── reviewController.js
    │   └── userController.js
    ├── middleware/          # Security, Auth & Error Middlewares
    │   ├── adminMiddleware.js
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   ├── notFoundMiddleware.js
    │   └── validationMiddleware.js
    ├── models/              # Mongoose Database Schemas
    │   ├── Address.js
    │   ├── Category.js
    │   ├── Order.js         # (Week 3 Foundation)
    │   ├── Product.js
    │   ├── Review.js
    │   └── User.js
    ├── routes/              # Express API Routes
    ├── seed/                # Database Seeder (`seedData.js`)
    ├── scripts/             # API Verification Test Suite (`testApis.js`)
    ├── utils/               # JWT helper & API response formatters
    ├── validators/          # Input validation schemas
    ├── server.js            # Express server entry point
    └── package.json         # Backend dependencies
```

---

## ⚙️ Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/99pancakes?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_99pancakes_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Installation

Install root and backend dependencies:
```bash
# Install frontend dependencies in root
npm install

# Install backend dependencies in server directory
cd server
npm install
cd ..
```

---

## 🌱 Database Seeding

Populate categories, products, admin and customer test accounts:
```bash
npm run seed
```

### Seed Credentials
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@99pancakes.com` | `Admin@123456` |
| **Customer** | `customer@99pancakes.com` | `Customer@123456` |

---

## 🚀 Running the Application

### Option A: Run Backend Server
```bash
npm run server
```
Or in dev mode with auto-reload:
```bash
npm run server:dev
```

### Option B: Run Frontend Dev Server
```bash
npm run dev
```

### Option C: Run API Automated Test Suite
```bash
cd server
npm run test:api
```

---

## 📖 API Documentation

Complete REST API documentation is available in [API_DOCUMENTATION.md](file:///d:/WP-99PANCAKES/API_DOCUMENTATION.md).

### Quick Summary of Endpoints
- `GET /api/health` — API status health check
- `POST /api/auth/register` — Customer registration
- `POST /api/auth/login` — Authentication & JWT generation
- `GET /api/auth/me` — Authenticated profile info
- `GET /api/products` — Paginated products (filtering, search, sorting)
- `POST /api/products` — Admin product creation
- `GET /api/categories` — Product categories with item counts
- `GET/POST/PUT/DELETE /api/addresses` — Customer shipping address management
- `GET/POST /api/products/:productId/reviews` — Product ratings & reviews
