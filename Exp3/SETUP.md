# JWT Authentication System - Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Server will run on: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:3000`

## User Roles

### Admin
- ✅ Create posts
- ✅ Edit all posts
- ✅ Delete posts
- ✅ Publish/Unpublish posts
- ✅ View all posts

### Editor
- ✅ Create posts
- ✅ Edit own posts
- ✅ Publish/Unpublish own posts
- ✅ View published posts + own posts
- ❌ Cannot delete posts

### Viewer
- ✅ View published posts
- ❌ Cannot create posts
- ❌ Cannot edit posts
- ❌ Cannot delete posts

## Testing the System

### Test User 1 (Admin)
- Email: admin@example.com
- Password: admin123
- Role: Admin

### Test User 2 (Editor)
- Email: editor@example.com
- Password: editor123
- Role: Editor

### Test User 3 (Viewer)
- Email: viewer@example.com
- Password: viewer123
- Role: Viewer

## Features

1. **Secure Authentication**
   - JWT tokens (expires in 7 days)
   - Refresh token mechanism
   - Secure password hashing

2. **Post Management**
   - Create posts (Admin & Editor)
   - Edit posts with role restrictions
   - Delete posts (Admin only)
   - Publish/Draft status
   - Dashboard view of user's posts

3. **Role-Based Access Control**
   - Different permissions per role
   - Backend validation
   - Frontend UI adjustments based on role

## Database

SQLite database is automatically created with:
- Users table
- Posts table
- Refresh tokens table

## File Structure

```
├── backend/
│   ├── middleware/auth.js
│   ├── routes/auth.js
│   ├── routes/posts.js
│   ├── db.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── PostList.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## API Documentation

### Auth Endpoints

**Register**
```
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "editor" // admin, editor, viewer
}
```

**Login**
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Current User**
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Post Endpoints

**Get Dashboard Posts**
```
GET /api/posts/dashboard
Headers: Authorization: Bearer <token>
```

**Create Post**
```
POST /api/posts
Headers: Authorization: Bearer <token>
{
  "title": "Post Title",
  "content": "Post content...",
  "status": "draft" // or "published"
}
```

**Update Post**
```
PUT /api/posts/:id
Headers: Authorization: Bearer <token>
{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published"
}
```

**Delete Post**
```
DELETE /api/posts/:id
Headers: Authorization: Bearer <token>
```

## Troubleshooting

### Backend not connecting
- Check if port 5000 is available
- Verify .env file exists with correct JWT_SECRET
- Check database.db file is created

### Frontend not connecting to backend
- Ensure backend is running on port 5000
- Check proxy settings in vite.config.js
- Clear browser cache and localStorage if needed

### Token errors
- Token might be expired, try logging out and back in
- Check if JWT_SECRET in .env matches what backend is using

## Security Notes

⚠️ **Before Production:**
- Change JWT_SECRET in .env to a strong random string
- Set NODE_ENV to 'production'
- Use HTTPS instead of HTTP
- Store sensitive data in environment variables
- Implement rate limiting
- Add input validation on frontend
- Use secure headers (helmet.js for Express)
