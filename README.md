# Library Management System

## Description

I used MongoDB as the database and designed a user schema with two types of users: Authors and Readers, using discriminators to differentiate between them. The backend is built with Express, and I used Express Router to organize API routes into separate modules for users, books, and borrowing/returning books.

To manage authentication, I implemented JWT tokens and added middleware to verify tokens and enforce role-based access

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

## Drive Link
[Drive Link](https://drive.google.com/drive/folders/1-K5uPTcUffONRhyfbkyvluXNy-OGmu7Z?usp=sharing)

This drive link contains the folder wise screenshots of each api endpoint mentioned in the table

---
