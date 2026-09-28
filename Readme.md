# 🎟️ Eventora — Event Booking Platform

Eventora is a full-stack **event booking platform** built with the MERN stack. It allows users to discover events, select multiple tickets, verify bookings through email OTP, and manage their bookings. Administrators can create and manage events, review booking requests, approve or reject bookings, and manage seat availability.

---

## 🚀 Features

### 👤 User Features

* User registration and login
* Email OTP verification
* Resend OTP functionality
* Forgot password with OTP verification
* Secure JWT-based authentication
* Browse available events
* View detailed event information
* Select multiple tickets/people
* Automatic total price calculation
* Booking verification through email OTP
* View personal bookings
* Cancel confirmed bookings
* Booking confirmation emails
* Booking rejection emails
* Responsive user interface

### 🎫 Multiple Ticket Booking

Users can select the number of people/tickets before booking.

For example:

```text
Ticket Price: ₹100
Quantity:     3
----------------
Total:        ₹300
```

The system validates available seats before creating the booking.

After admin confirmation, the selected number of seats is deducted from the event.

---

## 👨‍💼 Admin Features

* Admin authentication
* Admin dashboard
* View booking statistics
* Create events
* Update events
* Delete events
* Manage events
* View pending bookings
* Approve bookings
* Reject bookings
* Set payment status
* Manage seat availability
* Booking confirmation notifications
* Booking rejection notifications

---

## 🔐 OTP Verification

Eventora uses email OTP verification for important actions.

### Registration

```text
Register
   ↓
OTP sent to email
   ↓
Enter OTP
   ↓
Account verified
```

### Booking

```text
Select tickets
   ↓
Request booking
   ↓
OTP sent to registered email
   ↓
Enter OTP
   ↓
Booking request created
   ↓
Admin confirmation
```

### Forgot Password

```text
Forgot Password
      ↓
Enter email
      ↓
OTP sent
      ↓
Verify OTP
      ↓
Create new password
```

OTP records expire automatically after **5 minutes**.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* React Icons
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Nodemailer
* Gmail OAuth2

## Development Tools

* VS Code
* MongoDB Atlas / MongoDB Compass
* Postman
* Git
* GitHub
* Nodemon

---

# 📁 Project Structure

```text
Eventora/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentFailed.jsx
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   └── UserProfile.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageEvents.jsx
│   │   │       ├── AddEvent.jsx
│   │   │       └── ManageBookings.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── axios.js
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── eventController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Booking.js
│   │   └── OTP.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── booking.js
│   │   └── event.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── utils/
│   │   └── email.js
│   │
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/rahul-7800/Eventora.git
```

Navigate into the project:

```bash
cd Eventora
```

---

# 🖥️ Backend Setup

Go to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

### Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

> ⚠️ Never upload your `.env` file to GitHub.

Start the backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open a new terminal.

Go to the frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# 🗄️ Database

Eventora uses **MongoDB** for storing:

* Users
* Events
* Bookings
* OTP records

Example database:

```text
Database: eventora
```

Collections:

```text
users
events
bookings
otps
```

---

# 🎫 Booking Workflow

The complete booking workflow is:

```text
User Login
    ↓
Browse Events
    ↓
Open Event Details
    ↓
Select Number of Tickets
    ↓
Calculate Total Amount
    ↓
Request Booking OTP
    ↓
OTP Sent to Email
    ↓
Enter OTP
    ↓
Booking Request Created
    ↓
Admin Reviews Booking
    ↓
 ┌───────────────┐
 │               │
 ↓               ↓
Approve         Reject
 │               │
 ↓               ↓
Confirmed      Cancelled
 │
 ↓
Seats Updated
 │
 ↓
Confirmation Email
```

---

# 💰 Booking Calculation

Eventora automatically calculates the total booking amount.

### Formula

```text
Total Amount = Ticket Price × Number of People
```

### Example

```text
Ticket Price = ₹100
People       = 3

Total Amount = ₹100 × 3
             = ₹300
```

---

# 💺 Seat Management

Eventora maintains both:

```text
totalSeat
availableSeat
```

When an admin confirms a booking:

```text
availableSeat =
availableSeat - numberOfPeople
```

Example:

```text
Available Seats = 20
Booked People   = 3

Remaining Seats = 17
```

When a confirmed booking is cancelled:

```text
availableSeat =
availableSeat + numberOfPeople
```

---

# 📧 Email Notifications

Eventora uses Gmail OAuth2 for email communication.

Emails are used for:

* Registration OTP
* Booking OTP
* Booking confirmation
* Booking rejection
* Password reset OTP

---

# 🔑 Authentication

Eventora uses **JWT (JSON Web Token)** authentication.

### Authentication Flow

```text
Login
  ↓
Server validates credentials
  ↓
JWT generated
  ↓
Token stored on client
  ↓
Token sent with protected requests
```

### User Roles

```text
User
Admin
```

Role-based access controls admin functionality.

---

# 🔗 Main API Routes

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/resend-otp
POST /api/auth/forgot-password
POST /api/auth/verify-reset-otp
POST /api/auth/reset-password
```

## Events

```text
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

## Bookings

```text
POST   /api/bookings/send-otp
POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/pending
PUT    /api/bookings/:id/confirm
PUT    /api/bookings/:id/reject
DELETE /api/bookings/:id
```

---

# 🧪 Testing

Eventora can be tested manually using the following flow.

### Registration

* Valid registration
* Invalid email
* Duplicate email
* Wrong OTP
* Expired OTP
* Resend OTP

### Login

* Valid credentials
* Invalid password
* Invalid email
* Logout
* Protected routes

### Booking

* One ticket
* Multiple tickets
* Invalid OTP
* Expired OTP
* Insufficient seats
* Booking confirmation
* Booking rejection
* Booking cancellation

### Multiple Ticket Example

```text
Available Seats: 20
Ticket Price: ₹100

Select: 3 People

Expected:
Quantity = 3
Total = ₹300
```

After admin confirmation:

```text
Available Seats: 17
```

---

# 🛡️ Security

Security features include:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Role-based authorization
* Email OTP verification
* OTP expiration
* Environment variables for sensitive credentials
* Input validation

---

# 📱 Responsive Design

The Eventora frontend is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The UI is built using Tailwind CSS.

---

# 🎯 Future Enhancements

Possible future improvements include:

* Online payment integration
* QR-code based event tickets
* Downloadable PDF tickets
* Event search and filtering
* Event categories
* User reviews and ratings
* Event reminders
* Push notifications
* Organizer profiles
* Advanced analytics dashboard
* Real-time booking updates
* Cloud image storage

---

# 👨‍💻 Author

**Rahul Verma**

MCA Student
Full Stack Developer

### Technologies

```text
React.js
Node.js
Express.js
MongoDB
Tailwind CSS
JWT
REST API
Git & GitHub
```

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is developed for educational and project purposes.
