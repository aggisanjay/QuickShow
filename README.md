# 🎬 QuickShow – Movie Ticket Booking Platform

QuickShow is a full-stack **movie ticket booking application** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and powered by **Inngest** for background workflows. The platform allows users to register, browse movies, select shows, book seats, and receive real-time booking confirmations and reminders via email.

---


### LIVE LINK 

https://quick-show-frontend-r37adlce2-tourism-websites-projects.vercel.app


---

## 🚀 Features

### ✅ User Features
- Register/login with **Clerk Authentication**
- Browse available movies and shows
- Select seats and book tickets
- Get email confirmation after successful payment
- Receive reminders 8 hours before the showtime

### 🛠 Admin Features
- Add new movies and create shows
- Monitor bookings and show occupancy
- Trigger notifications on new show additions

### ⚙️ Background Workflows (via Inngest)
- Automatically delete **unpaid bookings after 10 minutes**
- Send **booking confirmation emails** with movie details
- Send **reminder emails** 8 hours before the show
- Notify users about **newly added shows**

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS / Bootstrap (based on your setup)
- Axios

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Inngest (event-driven workflows)
- Clerk (Authentication)
- Nodemailer (Transactional Emails)

## 🔧 Setup Instructions

### 1. Clone the repository

git clone https://github.com/aggisanjay/QuickShow
cd QuickShow

## 2. Install dependencies

## Backend:

   cd server
   npm install
   npm run dev
   
## Frontend:

   cd client
   npm install
   npm run dev
