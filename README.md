# E-commerce MERN Stack Application

This project is a full-stack e-commerce application using the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- `frontend/`: Next.js frontend application
- `backend/`: Express.js backend API

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000

## Authentication

The application includes user authentication with the following features:
- User registration
- User login
- JWT-based authentication
- Role-based access control (Admin and regular users)

Demo accounts:
- Admin: admin@demo.com / admin123
- User: user@demo.com / user123

## Admin Features

The admin dashboard provides the following functionality:
- Product management (CRUD operations)
- Order management
- Statistics dashboard

## API Configuration

The frontend is configured to work with both Next.js API routes and the Express backend API. If the Next.js API routes fail, the application will automatically fall back to the Express backend.

## Backend API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/auth/profile`: Get user profile
- `GET /api/auth/verify`: Verify JWT token

### Products
- `GET /api/admin/products`: Get all products (admin only)
- `POST /api/admin/products`: Create a new product (admin only)
- `PUT /api/admin/products/:id`: Update a product (admin only)
- `DELETE /api/admin/products/:id`: Delete a product (admin only)

### Orders
- `GET /api/admin/orders`: Get all orders (admin only)
- `PUT /api/admin/orders/:id`: Update order status (admin only)

## Frontend Library

The frontend uses the following libraries:
- Next.js for server-side rendering and routing
- Tailwind CSS for styling
- shadcn/ui for UI components
- Context API for state management
