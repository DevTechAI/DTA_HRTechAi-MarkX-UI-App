
# Project Context: Internal Company App with MySQL and Microsoft OAuth

## 🧠 Project Summary
This project is an internal company application designed to handle employee attendance (punch-in/punch-out), leave management, expense claims, and time tracking (timesheets). It is built with a scalable architecture using Next.js for the frontend with MySQL on Clever Cloud for the database and Microsoft OAuth for authentication.

## 👥 Team Size
3–5 developers

## 🚀 Project Goal
To build a modular, maintainable, and scalable internal tool that provides employees with an intuitive interface for self-service HR-related actions.

## 🏗️ Frontend Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **State Management**: Zustand (lightweight and scalable)
- **Routing**: App Router
- **Form Handling**: React Hook Form + Zod for validation
- **Icons**: Lucide

## 🔐 Authentication & Authorization
- **Microsoft OAuth**: Handles login and user sessions securely using Microsoft's authentication system.
- **Custom Authorization Logic**: Implements role-based access control based on user claims from Microsoft OAuth.

## 🔥 Backend & Database
**Database**: The application uses **MySQL on Clever Cloud** as its primary database to store all user, attendance, leave, expense, and timesheet data.
- **MySQL**: Relational database for structured data storage and complex querying.
- **Clever Cloud**: Managed database hosting solution for MySQL.
- **API Routes**: Next.js API routes for backend business logic and database operations.

## ☁️ Hosting & Storage
- **Vercel**: For hosting the Next.js application with global CDN delivery.
- **Clever Cloud Object Storage**: Used for storing receipts and expense-related files.

## 🧩 Folder Structure
```
/app               → Next.js App Router pages and layouts
/components        → Reusable React components
/hooks             → Custom React hooks
/store             → Zustand stores
/lib               → Utility functions and database helpers
/types             → Global TypeScript types
/styles            → Global Tailwind config and CSS
/auth              → Microsoft OAuth configuration and auth helpers
/db                → Database models, schemas, and query helpers
/public            → Static assets
```
> � Microsoft OAuth is configured under `/auth/microsoft.ts` and the MySQL database connection is managed in `/db/connection.ts`. All database operations are performed using a structured query approach.

## 📦 Dev Tools & Tooling
- **ESLint + Prettier** for consistent code formatting
- **Husky + Lint-Staged** for Git pre-commit checks
- **VSCode Settings Sync** for team editor consistency
- **Vite / Turbopack** (as needed) for faster builds in dev

## ✅ Notes
- App should scale to multiple departments and support RBAC (Role-Based Access Control) in the future.
- Database schema should be properly designed with appropriate relationships and constraints.
- Microsoft OAuth integration requires proper Azure AD app registration and configuration.
- MySQL connection pooling should be implemented for efficient database access.
- Clever Cloud infrastructure should be properly configured for scalability and security.
