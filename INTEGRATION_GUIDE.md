# Frontend-Backend Integration Guide

## Overview
This guide explains how the SwiftBank frontend and backend communicate.

## Authentication Flow

### 1. Login Process
```
User enters credentials → Frontend sends POST /auth/login → Backend validates
                                                              ↓
                                                    Returns JWT + User data
                                                              ↓
Frontend stores token in localStorage → Redirects to dashboard
```

### 2. Backend Response Format
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### 3. Frontend Storage
- Token stored in: `localStorage.getItem('authToken')`
- User data stored in: `localStorage.getItem('user')`
- Session data stored in: `localStorage.getItem('bankingSession')`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user (requires token)

### Accounts
- `GET /accounts` - Get user accounts (requires token)
- `POST /accounts` - Create new account (requires token)
- `GET /accounts/{id}` - Get account details (requires token)
- `PUT /accounts/{id}` - Update account (requires token)
- `DELETE /accounts/{id}` - Delete account (requires token)

### Statements
- `GET /accounts/{id}/statement/pdf` - Export PDF statement
- `GET /accounts/{id}/statement/csv` - Export CSV statement
- `GET /accounts/{id}/statement/text` - Export text statement

### Customer Support
- `POST /customer-support/chat` - Send support message
- `GET /customer-support/categories` - Get support categories
- `GET /customer-support/quick-help` - Get quick help topics

## Request Headers

All authenticated requests must include:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## Demo Mode

When `VITE_ENABLE_DEMO=true`:
- Frontend works without backend
- Uses mock data for all API calls
- Demo credentials: demo@swiftbank.com / Demo123!

## Testing Integration

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test
```
Backend runs on: http://localhost:8080

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### 3. Test Login
1. Go to http://localhost:5173/login
2. Use demo credentials or register new user
3. Check browser console for API calls
4. Check backend logs for requests

## Troubleshooting

### CORS Errors
- Backend allows: localhost:3000, localhost:5173
- Check SecurityConfig.java corsConfigurationSource()

### 401 Unauthorized
- Token expired or invalid
- Check localStorage.getItem('authToken')
- Re-login to get new token

### 404 Not Found
- Check API_BASE_URL in frontend/.env
- Should be: http://localhost:8080/api/v1
- Verify backend is running

### White Screen After Login
- Check browser console for errors
- Verify token is stored in localStorage
- Check dashboard is loading accounts from API

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api/v1
VITE_ENABLE_DEMO=true
VITE_DEMO_EMAIL=demo@swiftbank.com
VITE_DEMO_PASSWORD=Demo123!
```

### Backend (application.yml)
```yaml
spring:
  profiles:
    active: test  # or dev, prod
```

## Data Flow Example

### Get User Accounts
```
1. User clicks "Dashboard"
2. Frontend: ApiService.getUserAccounts()
3. Frontend sends: GET http://localhost:8080/api/v1/accounts
   Headers: { Authorization: "Bearer <token>" }
4. Backend: AccountController.getUserAccounts()
5. Backend: AccountService.getUserAccounts()
6. Backend: Returns List<AccountResponseDTO>
7. Frontend: Maps to UI format and displays
```

## Account Data Mapping

### Backend Format
```json
{
  "id": 1,
  "accountNumber": "SWB1234567890",
  "accountType": "CHECKING",
  "accountName": "Main Checking",
  "balance": 5420.50,
  "currency": "USD",
  "status": "ACTIVE"
}
```

### Frontend Format
```javascript
{
  id: "1",
  name: "Main Checking",
  type: "checking",
  accountNumber: "SWB1234567890",
  balance: 5420.50,
  lastActivity: "Recently"
}
```

## Security Notes

1. JWT tokens expire after 24 hours (configurable)
2. Passwords hashed with BCrypt (strength 12)
3. CORS restricted to allowed origins
4. All sensitive endpoints require authentication
5. Demo mode should be disabled in production

## Production Deployment

1. Set `VITE_ENABLE_DEMO=false` in frontend
2. Update `VITE_API_URL` to production backend URL
3. Configure backend with production database
4. Set secure JWT_SECRET in backend
5. Enable HTTPS for both frontend and backend
