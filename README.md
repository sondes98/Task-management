# Task Management System

A full-stack task management application built with NestJS (backend) and React (frontend).

## Features

- **User Authentication**:
  - Register and login
  - JWT-based authentication
  - Role-based access control (Admin and User roles)

- **Task Management**:
  - Create, read, update, and delete tasks
  - Filter tasks by status and priority
  - Responsive design for mobile and desktop

- **Security Features**:
  - Password hashing
  - Protected routes based on user roles
  - JWT token validation

## Tech Stack

### Backend
- NestJS
- PostgreSQL
- TypeORM
- JWT Authentication
- Class Validator & Class Transformer
- Data Transfer Objects (DTOs)

### Frontend
- React
- TypeScript
- Redux Toolkit
- Material UI
- Axios
- React Router
- Formik & Yup

## Project Structure

```
/
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── tasks/          # Tasks module
│   │   ├── users/          # Users module
│   │   └── app.module.ts   # Main application module
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Redux features (auth, tasks)
│   │   ├── pages/          # Application pages
│   │   ├── store/          # Redux store configuration
│   │   └── App.tsx         # Main application component
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   DATABASE_HOST=0.0.0.0
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=task_management
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1d
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

5. The backend API will be available at http://0.0.0.0:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_BASE_URL=http://0.0.0.0:3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The frontend application will be available at http://0.0.0.0:3000

## API Documentation

The complete API documentation is available on Postman:
[Task Management API Documentation](https://documenter.postman.com/preview/43270454-d5adf9e5-3cac-49e7-8bdc-5c7dd7160bd5?environment=&versionTag=latest&apiName=CURRENT&version=latest&documentationLayout=classic-double-column&documentationTheme=light)

### API Endpoints Overview

- **Authentication**
  - POST /auth/register - Create a new user
  - POST /auth/login - Authenticate a user

- **Tasks**
  - GET /tasks - Get all tasks
  - GET /tasks/:id - Get a specific task
  - POST /tasks - Create a new task
  - PATCH /tasks/:id - Update a task
  - DELETE /tasks/:id - Delete a task

## User Roles

- **Admin**: Has full access to all tasks in the system
- **User**: Can only manage their own tasks

## License

This project is licensed under the MIT License.


java -jar jenkins.war

