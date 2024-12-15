# Library Management System

## Description

I used MongoDB as the database and designed a user schema with two types of users: Authors and Readers, using discriminators to differentiate between them. The backend is built with Express, and I used Express Router to organize API routes into separate modules for users, books, and borrowing/returning books.

To manage authentication, I implemented JWT tokens and added middleware to verify tokens and enforce role-based access (like only allowing authors to add or update books). All endpoints follow REST principles, with proper validations to ensure data accuracy—for example, checking if a book is in stock or limiting readers to borrowing a maximum of 5 books at a time.

The overall structure of the project is modular and easy to maintain, making it scalable for future enhancements. I focused on handling errors gracefully and returning clear, user-friendly messages for each API response.

## Setup Instructions

### Environment Variables
Create a `.env` file in the root directory with the following content:
```env
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
JWT_SECRET=<your-jwt-secret>
```

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/karthikpk-o/nitk.git
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

4. The server will be running on `http://localhost:3000`.

### Database Configuration
Ensure MongoDB is running and accessible. Update the `DBUSER` and `DBPASSWORD` fields in the `.env` file for a MongoDB Atlas connection or leave them blank for a local connection.

---

## API Endpoints
### User Management
#### POST `/users/create`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "Reader"
}
```
**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "123456",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "Reader"
  }
}
```

#### DELETE `/users/delete/:id`
**Response:**
```json
{
  "message": "User deleted successfully"
}
```
---

## Drive Link
Add your drive link here: [Drive Link](#)

---
