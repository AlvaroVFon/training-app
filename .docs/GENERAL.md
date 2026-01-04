# General Documentation - Training App

## Project Overview

Training App is a comprehensive platform designed for registering and tracking physical workouts. The core value proposition includes an integrated AI model that analyzes workout data to provide insights, performance optimizations, and personalized recommendations.

## Core Features

- **User Management**: Secure registration and authentication.
- **Muscle Group Management**: CRUD operations for muscle groups (Admin only).
- **Exercise Management**: System-wide default exercises and user-specific custom exercises.
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
- `src/muscle-groups`: Muscle group management (CRUD).
- `src/exercises`: Exercise management (CRUD with ownership logic).
- `src/workouts`: Workout tracking and history (User-specific CRUD).
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

### Database Seeding

To populate the database with initial data (admin and test users), run:

```bash
docker-compose exec app pnpm seed
```

This process is idempotent and can be run multiple times safely.

## Testing

- **Unit Tests**: `pnpm test`
- **E2E Tests**: `pnpm test:e2e`
- **Integration Flows**: See [INTEGRATION_TESTS.md](INTEGRATION_TESTS.md) for manual verification using `curl`.
