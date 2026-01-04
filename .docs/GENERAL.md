# General Documentation - Training App

## Project Overview

Training App is a comprehensive platform designed for registering and tracking physical workouts. The core value proposition includes an integrated AI model that analyzes workout data to provide insights, performance optimizations, and personalized recommendations.

## Core Features

- **User Management**: Secure registration and authentication.
- **Workout Tracking**: Register exercises, sets, reps, and weights.
- **AI Analysis**: Automated analysis of training sessions using machine learning models.
- **Progress Monitoring**: Historical data and performance trends.

## Architecture

- **Framework**: NestJS (v11)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport.js (Local & JWT strategies)
- **Authorization**: Role-Based Access Control (RBAC) with custom Guards.
- **AI Integration**: (Planned) Python-based microservice or integrated TensorFlow/ONNX model.
- **Documentation**: Swagger (OpenAPI)

## Project Structure

- `src/auth`: Authentication logic, strategies, and guards.
- `src/users`: User management (CRUD).
- `src/tokens`: JWT generation and management.
- `src/crypto`: Hashing and encryption services.
- `src/config`: Environment configuration.

## Setup & Running

### Prerequisites

- Docker & Docker Compose
- Node.js & pnpm (optional if using Docker)

### Development

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`.
Swagger documentation is at `http://localhost:3000/api`.

## Testing

- **Unit Tests**: `pnpm test`
- **E2E Tests**: `pnpm test:e2e`
