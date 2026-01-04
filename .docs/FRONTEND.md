# Frontend Integration Guide

## API Contracts

All API contracts are documented using Swagger. You can access the interactive UI at:
`http://localhost:3000/api`

From there, you can:

- View all available endpoints.
- See request/response schemas (DTOs).
- Test endpoints directly from the browser.

## Authentication Flow

1. **Login**: Send a POST request to `/auth/login` with `email` and `password`.
2. **Token**: On success, you will receive an `access_token`.
3. **Authorization**: Include this token in the `Authorization` header for protected requests:
   `Authorization: Bearer <your_token>`

## Key Endpoints

### Auth

- `POST /auth/register`: Create a new account and get a JWT immediately.
- `POST /auth/login`: Authenticate and get a JWT.

### Users

- `GET /users`: List all users (Requires Auth).
- `POST /users`: Create a new user (Public/Admin).
- `GET /users/:id`: Get user details.
- `PATCH /users/:id`: Update user details.
- `DELETE /users/:id`: Remove a user.

### Workouts (Coming Soon)

- `POST /workouts`: Register a new training session.
- `GET /workouts`: Retrieve workout history.
- `GET /workouts/:id/analysis`: Get AI-powered analysis for a specific session.

## Error Handling

The API returns standard HTTP status codes:

- `200/201`: Success
- `400`: Validation Error (check response body for details)
- `401`: Unauthorized (missing or invalid token)
- `404`: Resource Not Found
- `500`: Internal Server Error
