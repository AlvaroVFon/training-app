# Frontend Integration Guide

## API Contracts

All API contracts are documented using Swagger. You can access the interactive UI at:
`http://localhost:3000/api`

From there, you can:

- View all available endpoints.
- See request/response schemas (DTOs).
- Test endpoints directly from the browser.

## Authentication & Authorization

1. **Login/Register**: Send a POST request to `/auth/login` or `/auth/register`.
2. **Token**: On success, you will receive an `access_token`.
3. **Authorization**: Include this token in the `Authorization` header for protected requests:
   `Authorization: Bearer <your_token>`
4. **Roles**: The API uses Role-Based Access Control (RBAC). Some endpoints are restricted to `admin` users.

## Key Endpoints

### Auth

- `POST /auth/register`: Create a new account and get a JWT immediately.
- `POST /auth/login`: Authenticate and get a JWT.

### Users

- `GET /users`: List all users (Requires `admin` role).
- `POST /users`: Create a new user (Public).
- `GET /users/:id`: Get user details (Requires Auth).
- `PATCH /users/:id`: Update user details (Requires Auth).
- `DELETE /users/:id`: Remove a user (Requires `admin` role).

### Muscle Groups

- `GET /muscle-groups`: List all muscle groups (Requires `admin` role).
- `POST /muscle-groups`: Create a new muscle group (Requires `admin` role).
- `GET /muscle-groups/:id`: Get muscle group details (Requires `admin` role).
- `PATCH /muscle-groups/:id`: Update a muscle group (Requires `admin` role).
- `DELETE /muscle-groups/:id`: Remove a muscle group (Requires `admin` role).

### Exercises

- `GET /exercises`: List all accessible exercises (Default + User's own).
- `POST /exercises`: Create a new private exercise.
- `GET /exercises/:id`: Get exercise details (Must be default or owned by user).
- `PATCH /exercises/:id`: Update an exercise (Admins can update default ones, users can update their own).
- `DELETE /exercises/:id`: Remove an exercise (Admins can delete default ones, users can delete their own).

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
