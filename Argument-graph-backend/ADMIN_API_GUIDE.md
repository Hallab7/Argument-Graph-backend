# Admin API Guide

This guide covers the comprehensive admin API endpoints for managing users, content, and system administration.

## 🔐 Authentication & Authorization

### User Roles
- **User**: Regular users with basic access
- **Moderator**: Can access regular application features (no admin access)
- **Admin**: Full access to all admin endpoints

### Access Levels
- **Public**: No authentication required
- **Authenticated**: Requires valid JWT token
- **Admin Only**: Requires admin role (ALL admin endpoints)

## 🚨 IMPORTANT SECURITY NOTICE

**ALL ADMIN ENDPOINTS REQUIRE ADMIN ROLE**

- Only users with `role: "admin"` can access any `/api/v1/admin/*` endpoint
- Moderators and regular users are completely denied access to admin endpoints
- This ensures maximum security for administrative functions

## 📊 System Statistics

### GET /api/v1/admin/stats
**Access Level**: Admin Only

Get comprehensive system statistics including user counts, content metrics, and recent activity.

**Response Example**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 150,
      "activeUsers": 142,
      "totalDebates": 45,
      "activeDebates": 38,
      "totalArguments": 234,
      "totalRatings": 567,
      "totalConnections": 123
    },
    "distributions": {
      "userRoles": {
        "user": 145,
        "moderator": 4,
        "admin": 1
      },
      "debateStatuses": {
        "active": 38,
        "closed": 5,
        "archived": 2
      }
    },
    "recent": {
      "users": [...],
      "debates": [...]
    }
  }
}
```

## 👥 User Management

### GET /api/v1/admin/users
**Access Level**: Admin Only

Get all users with pagination, search, and sorting.

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `limit` (integer): Users per page (default: 20)
- `search` (string): Search by username or email
- `sortBy` (string): Field to sort by (default: createdAt)
- `sortOrder` (string): asc or desc (default: desc)

**Example**: `GET /api/v1/admin/users?page=1&limit=10&search=john&sortBy=username&sortOrder=asc`

### GET /api/v1/admin/users/:userId
**Access Level**: Admin Only

Get detailed user information including statistics.

**Response Example**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "reputation": 150,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "statistics": {
      "debates": 5,
      "arguments": 23,
      "ratings": 45
    }
  }
}
```

### PUT /api/v1/admin/users/:userId/role
**Access Level**: Admin Only

Update user role.

**Request Body**:
```json
{
  "role": "moderator"
}
```

**Valid Roles**: `user`, `moderator`, `admin`

### PUT /api/v1/admin/users/:userId/toggle-status
**Access Level**: Admin Only

Toggle user active/inactive status.

### DELETE /api/v1/admin/users/:userId
**Access Level**: Admin Only

Delete user account and all associated data. Cannot delete admin users.

**Response Example**:
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully",
    "deletedAt": "2024-01-01T12:00:00.000Z",
    "deletedData": {
      "user": true,
      "debates": 3,
      "arguments": 15,
      "ratings": 25,
      "connections": 8
    }
  }
}
```

### PUT /api/v1/admin/users/bulk-update
**Access Level**: Admin Only

Bulk update multiple users.

**Request Body**:
```json
{
  "userIds": ["userId1", "userId2", "userId3"],
  "updateData": {
    "role": "moderator",
    "isActive": true
  }
}
```

## 💬 Content Management

### GET /api/v1/admin/debates
**Access Level**: Admin Only

Get all debates with pagination and filtering.

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `limit` (integer): Debates per page (default: 20)
- `status` (string): Filter by status (active, closed, archived)
- `search` (string): Search by title or description

### PUT /api/v1/admin/debates/:debateId/status
**Access Level**: Admin Only

Update debate status.

**Request Body**:
```json
{
  "status": "archived"
}
```

**Valid Statuses**: `active`, `closed`, `archived`

### DELETE /api/v1/admin/debates/:debateId
**Access Level**: Admin Only

Delete debate and all related content (arguments, ratings, connections).

## 🔧 Setup Instructions

### 1. Create Admin User

Run the following script to create admin and moderator users:

```javascript
// create-admin-user.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './src/modules/users/user.model.js';

dotenv.config();

async function createAdminUser() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const hashedPassword = await bcrypt.hash('AdminPassword123', 12);
  const adminUser = await User.create({
    email: 'admin@argumentgraph.com',
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    verified: true
  });
  
  console.log('Admin user created:', adminUser.email);
  await mongoose.disconnect();
}

createAdminUser();
```

### 2. Login Credentials

**Admin**:
- Email: `admin@argumentgraph.com`
- Password: `AdminPassword123`

**Moderator**:
- Email: `moderator@argumentgraph.com`
- Password: `ModeratorPassword123`

### 3. API Usage

1. Login to get JWT token:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@argumentgraph.com","password":"AdminPassword123"}'
```

2. Use token in admin requests:
```bash
curl -X GET http://localhost:5000/api/v1/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Features

### Access Control
- **Role-based permissions**: Different endpoints require different role levels
- **JWT authentication**: All admin endpoints require valid JWT tokens
- **User status checking**: Inactive users are denied access
- **Admin protection**: Cannot delete admin users

### Validation
- **Input validation**: All request data is validated
- **Parameter sanitization**: Query parameters are properly sanitized
- **Error handling**: Comprehensive error responses with appropriate HTTP status codes

### Audit Trail
- **Action logging**: All admin actions are logged
- **User tracking**: Admin actions include user ID for accountability
- **Timestamp tracking**: All operations include timestamps

## 📚 API Documentation

Complete API documentation is available at:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **OpenAPI Spec**: `http://localhost:5000/api-docs.json`

## 🔍 Testing

### Manual Testing
1. Use Swagger UI for interactive testing
2. Use Postman or similar tools
3. Test different user roles and permissions

### Automated Testing
```javascript
// Example test
const response = await fetch('/api/v1/admin/stats', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});
const data = await response.json();
console.log('System stats:', data.data.overview);
```

## 🚨 Important Notes

1. **Admin User Protection**: Admin users cannot be deleted by other admins
2. **Cascading Deletion**: Deleting users removes all their associated data
3. **Rate Limiting**: Authentication endpoints have rate limiting
4. **Data Integrity**: All operations maintain referential integrity
5. **Backup Recommended**: Always backup data before bulk operations

## 📞 Support

For issues or questions regarding the admin API:
1. Check the Swagger documentation
2. Review error messages and status codes
3. Ensure proper authentication and authorization
4. Verify user roles and permissions

## 🔄 Version History

- **v1.0**: Initial admin API implementation
  - User management endpoints
  - Content management endpoints
  - System statistics
  - Role-based access control
  - Comprehensive documentation