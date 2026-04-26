# 🎓 LearnHub Backend - Powering Educational Insights

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

LearnHub Backend is a robust, production-ready API built with Node.js and Express. It serves as the core engine for assignment management, student submissions, and AI-driven analytics, utilizing MongoDB for flexible data storage and Prisma for type-safe database interactions.

---

## 🏛️ Architecture & System Design

The system follows a modular **Controller-Route** pattern, ensuring clear separation of concerns and scalability.

### 🔌 Core Modules
- **Auth System**: Secure dual-role (Instructor/Student) authentication with hashed passwords using `bcryptjs`.
- **Assignment Engine**: Advanced CRUD operations with metadata for difficulty levels and deadlines.
- **Submission Pipeline**: Real-time tracking of student work with automated status transitions.
- **AI Integration**: Intelligent feedback generation and assignment refinement capabilities.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: A cluster on MongoDB Atlas or a local instance

### 2. Quick Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# MongoDB Connection String
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/prohero"

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### 4. Database Initialization
Synchronize the Prisma schema with your MongoDB collections:
```bash
npx prisma db push
```

### 5. Launch the Service
```bash
npm run dev
```

---

## 📂 Project Structure

```text
├── prisma/
│   └── schema.prisma      # Single source of truth for Data Models
├── src/
│   ├── controllers/       # Business logic & Request handling
│   │   ├── auth.controller.ts
│   │   ├── assignment.controller.ts
│   │   └── submission.controller.ts
│   ├── routes/            # API Route definitions
│   ├── lib/               # Database client & Shared utilities
│   └── index.ts           # Application entry point & Middleware
└── package.json           # Dependencies & Scripts
```

---

## 🗝️ Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Instructor** | `instructor@example.com` | `password` |
| **Student** | `student@example.com` | `password` |

> [!TIP]
> Use the **Signup** page on the frontend to create a new user and test the password hashing system.

---

## 🛡️ Security Implementation
- **CORS**: Configured for secure frontend communication.
- **Helmet**: Set up for HTTP header security.
- **Data Validation**: Schema-based validation for all incoming requests.
- **Error Handling**: Centralized global error handler for consistent API responses.
