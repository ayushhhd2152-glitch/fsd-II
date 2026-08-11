# JWT Authentication System with Role-Based Post Management

A complete full-stack authentication system using JWT with role-based access control for post management.

## Features

### Authentication
- User registration and login with JWT
- Secure password hashing using bcryptjs
- Token refresh mechanism for session management
- Role-based access control (Admin, Editor, Viewer)

### Post Management
- **Admin**: Create, edit, delete, and publish/unpublish all posts
- **Editor**: Create and edit only their own posts
- **Viewer**: Only view published posts
- Posts saved to dashboard automatically
- Draft and published states

### Database
- SQLite database with user and post management
- Refresh token storage for session persistence

## Project Structure

```
├── backend/
│   ├── middleware/
│   │   └── auth.js           # JWT verification and role checking
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   └── posts.js          # Post management endpoints
│   ├── db.js                 # Database initialization
│   ├── server.js             # Express server setup
│   ├── .env                  # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx      # Login/Register form
    │   │   ├── Dashboard.jsx  # Main dashboard
    │   │   ├── PostForm.jsx   # Create/Edit post form
    │   │   └── PostList.jsx   # Display posts
    │   ├── App.jsx            # Main App component
    │   ├── main.jsx           # React entry point
    │   └── index.css          # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/dashboard` - Get user's posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (Admin, Editor)
- `PUT /api/posts/:id` - Update post (Admin, Editor)
- `DELETE /api/posts/:id` - Delete post (Admin only)

## Usage

1. Register a new account with a role (Admin, Editor, or Viewer)
2. Login with your credentials
3. Based on your role:
   - **Admin**: Full control over all posts and user management
   - **Editor**: Create and edit your own posts
   - **Viewer**: Only view published posts
4. Create posts that are saved to your dashboard
5. Publish posts to make them visible to all users

## Security Features

- JWT tokens for secure authentication
- Bcrypt for password hashing
- Role-based access control on backend
- Token expiration (7 days)
- Refresh token mechanism for session management
- CORS enabled for secure cross-origin requests

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
DB_PATH=./database.db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

## Technology Stack

### Backend
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- Bcryptjs
- CORS

### Frontend
- React
- Vite
- Axios
- CSS3

## Linting

The frontend uses oxlint for code quality checks:

```bash
cd frontend
npm run lint
```

## Development

For development with hot reload:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Production Build

```bash
# Frontend
cd frontend
npm run build

# Serve with preview
npm run preview
```

## License

ISC
