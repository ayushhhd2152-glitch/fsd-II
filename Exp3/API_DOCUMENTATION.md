# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "editor"
}
```

**Roles:**
- `admin` - Full access
- `editor` - Create and edit posts
- `viewer` - View only

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "editor"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "editor"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Refresh Token
**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Logout
**POST** `/auth/logout`

Invalidate refresh token and logout.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

### Get Current User
**GET** `/auth/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "editor",
    "createdAt": "2024-08-11T10:30:00Z"
  }
}
```

---

## Post Endpoints

### Get All Posts
**GET** `/posts`

Retrieve all posts (published posts + user's own drafts).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional) - Filter by 'draft' or 'published'
- `authorId` (optional) - Filter by author

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is my first post...",
      "authorId": 1,
      "authorName": "john_doe",
      "status": "published",
      "createdAt": "2024-08-11T10:30:00Z",
      "updatedAt": "2024-08-11T10:30:00Z"
    }
  ]
}
```

---

### Get Dashboard Posts
**GET** `/posts/dashboard`

Get user's own posts (drafts and published).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is my first post...",
      "authorId": 1,
      "status": "draft",
      "createdAt": "2024-08-11T10:30:00Z",
      "updatedAt": "2024-08-11T10:30:00Z"
    }
  ]
}
```

---

### Get Single Post
**GET** `/posts/:id`

Retrieve a specific post by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "post": {
    "id": 1,
    "title": "My First Post",
    "content": "This is my first post...",
    "authorId": 1,
    "authorName": "john_doe",
    "status": "published",
    "createdAt": "2024-08-11T10:30:00Z",
    "updatedAt": "2024-08-11T10:30:00Z"
  }
}
```

---

### Create Post
**POST** `/posts`

Create a new post (Admin & Editor only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My New Post",
  "content": "This is the content of my new post...",
  "status": "draft"
}
```

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "title": "My New Post",
    "content": "This is the content of my new post...",
    "authorId": 1,
    "status": "draft",
    "createdAt": "2024-08-11T10:30:00Z"
  }
}
```

**Errors:**
- `400` - Title or content missing
- `403` - User role not allowed to create posts

---

### Update Post
**PUT** `/posts/:id`

Update a post (Admin can update all, Editor only own).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "status": "published"
}
```

**Response:**
```json
{
  "message": "Post updated successfully",
  "post": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content...",
    "authorId": 1,
    "status": "published",
    "updatedAt": "2024-08-11T11:30:00Z"
  }
}
```

**Errors:**
- `403` - Editor trying to edit another user's post
- `404` - Post not found
- `400` - Invalid status

---

### Delete Post
**DELETE** `/posts/:id`

Delete a post (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

**Errors:**
- `403` - Non-admin user attempting delete
- `404` - Post not found

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 400 Bad Request
```json
{
  "error": "Title and content are required"
}
```

---

## Authentication Flow

1. **Register** - Create new account
2. **Login** - Get access token and refresh token
3. **Use Token** - Include access token in `Authorization: Bearer <token>` header
4. **Token Expires** - Use refresh token to get new access token
5. **Logout** - Invalidate tokens

## Security Headers

All requests should include:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Rate Limiting

Currently not implemented. Recommended for production use.

## CORS

CORS is enabled for development. Configure for production URLs in `server.js`.
