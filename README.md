# Snapify - Backend & Admin Setup

This guide explains how to set up the backend, database, and admin dashboard for **Snapify**.

## Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas** account (or local MongoDB)

## 1. Installation

Install the required dependencies:

```bash
npm install
```

## 2. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB Connection String (Get this from MongoDB Atlas)
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/snapify"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this"
```

## 3. Database Seeding

We have prepared scripts to populate your database with initial data.

### Seed Admin User
Creates a default admin account.

```bash
npx dotenv -e .env -- node scripts/seed-admin.js
```
*   **Email**: `admin@snapify.com`
*   **Password**: `password123`

### Seed Original Categories
Restores the original 7 categories (University, Weddings, etc.) with default images.

```bash
npx dotenv -e .env -- node scripts/seed-data.js
```

## 4. Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Admin Dashboard

Access the admin panel at:
**[http://localhost:3000/admin](http://localhost:3000/admin)**

Login with the admin credentials seeded above.

### Features
-   **Dashboard**: Overview of total categories and products.
-   **Categories**: Create, Edit, Delete categories.
-   **Products**: Manage products, set prices, and update status (Available/Sold).

## Tech Stack
-   **Framework**: Next.js 15 (App Router)
-   **Database**: MongoDB (via Mongoose)
-   **Auth**: NextAuth.js
-   **Styling**: Tailwind CSS + Lucide Icons
