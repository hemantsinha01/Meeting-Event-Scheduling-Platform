# Meeting & Event Scheduling Platform

A full-stack event management platform built using React.js and Node.js, providing seamless user authentication and robust event creation and management features.

## Features

- **User Authentication**
  - Secure login and signup process
  - JWT-based authentication mechanism
  - Role-based permissions for different user types

- **Event Handling**
  - Create, update, view, and delete events
  - Event details include name, description, date, time, and location
  - Categorization and filtering options for efficient event management

- **User Experience**
  - Modern and responsive UI with Material-UI
  - Smooth and intuitive navigation
  - Real-time event updates

## Technology Stack

### Frontend
- React.js
- Material-UI
- React Router for navigation
- Axios for API communication
- Date-fns for date formatting and manipulation

### Backend
- Node.js with Express.js
- MongoDB and Mongoose for database handling
- JWT for secure authentication
- Bcrypt for password encryption
- Helmet for enhanced security
- CORS support for cross-origin requests
- Morgan for logging requests

## Installation Guide

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or cloud-based instance)
- npm or yarn as the package manager

### Backend Setup
1. Move to the backend directory:
   ```bash
   cd backend
   ```

2. Install required dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside the backend directory and add:
   ```plaintext
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Move to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside the frontend directory with:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and log in a user
- `GET /api/auth/profile` - Fetch the logged-in user's details

### Event Management
- `GET /api/events` - Retrieve all available events
- `GET /api/events/:id` - Get details of a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an existing event
- `DELETE /api/events/:id` - Remove an event from the system

## Contribution Guidelines
1. Fork this repository.
2. Create a new feature branch: `git checkout -b feature/NewFeature`.
3. Commit your updates: `git commit -m 'Added NewFeature'`.
4. Push the changes: `git push origin feature/NewFeature`.
5. Open a Pull Request for review.

## License
This project is open-source and available under the MIT License.



