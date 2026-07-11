# 📸 RentNest - Premium Gear Rental Platform

RentNest is a modern, full-stack gear rental platform designed to streamline the process of renting photography, outdoor, and sports equipment. It provides a robust marketplace for providers to list their gear and a seamless, secure rental solution for customers.

---

## 🚀 Key Features

*   **Multi-Role Authentication:** Secure JWT-based authentication for Admins, Providers, and Customers.
*   **Dynamic Gear Management:** Providers can list, update, and track their gear; customers can search and filter listings.
*   **Advanced Search & Pagination:** Powerful filtering by category, brand, and price range with optimized server-side pagination.
*   **Secure Payment Gateway:** Integrated with Stripe for seamless, secure online transactions.
*   **Dashboard Analytics:** Real-time dashboards for Admins and Providers to track performance and revenue.
*   **Review System:** Dedicated review and rating system for customers to share their rental experiences.

---

## 🛠 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Security:** JWT & Bcrypt
*   **Payments:** Stripe

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/rentnest-backend.git](https://github.com/your-username/rentnest-backend.git)
   cd rentnest-backend

2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root with:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_secure_jwt_secret"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   PAYMENT_SUCCESS_URL="http://localhost:3000/payment-success"
   PAYMENT_CANCEL_URL="http://localhost:3000/payment-cancelled"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📌 Notes

* Replace placeholders with real values before running.
* Add your API and deployment links when available.
* Update credentials for production use.

---

## 🔐 Test Admin Credentials