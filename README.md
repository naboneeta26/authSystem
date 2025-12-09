⭐ Authentication System (MERN + TailwindCSS)

A full-stack authentication system built using the MERN stack (MongoDB, Express, React, Node.js) with TailwindCSS for UI styling.
This project includes JWT-based login, email verification using Nodemailer, forgot password, and secure protected routes for both frontend and backend.

🚀 Features
🔐 Authentication

Register new users

Secure password hashing (bcrypt)

Login with JWT access + refresh tokens

Logout & token invalidation

📧 Email Verification

On signup, user receives an email with a verification link

Nodemailer + Gmail/SMTP used for sending OTP/verification URL

🔁 Forgot Password

Forgot password email with secure token

Reset password page

Token expiration & validation

🎨 Frontend (React + Vite + TailwindCSS)

UI with Tailwind

React Router for navigation

Axios for API calls

Protected routes for authenticated users

⚙️ Backend (Node.js + Express + MongoDB)

JWT authentication & middleware

Nodemailer service for email verification

MongoDB with Mongoose schemas

Environment variable support with dotenv

API error handling & validation

🛠️ Tech Stack
Frontend

React (Vite)

TailwindCSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB + Mongoose

Nodemailer

JSON Web Tokens (JWT)

▶️ How to Run the Project
Backend Setup
cd server
npm install
npm start


Backend runs on:

http://localhost:3001

Frontend Setup
cd client
npm install
npm run dev

Frontend runs on:
http://localhost:5173


bcrypt.js

dotenv
