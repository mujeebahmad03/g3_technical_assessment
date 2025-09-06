# TeamFlow API

A comprehensive team collaboration and task management system built with NestJS, featuring user authentication, team management, task assignment, and real-time collaboration capabilities.

## 🚀 About the Application

The TeamFlow is a robust backend API that enables teams to collaborate effectively by providing:

- **User Management**: Registration, authentication, and profile management
- **Team Collaboration**: Create teams, invite members, and manage roles
- **Task Management**: Create, assign, update, and track tasks within teams
- **Role-Based Access Control**: Admin and member roles with appropriate permissions
- **Invitation System**: Email-based team invitations with acceptance/rejection workflow
- **Activity Logging**: Track all team and task activities
- **Notification System**: Real-time notifications for team activities

## 🛠️ Technologies & Tools Used

### Core Framework
- **NestJS** - Progressive Node.js framework for building scalable server-side applications
- **TypeScript** - Type-safe JavaScript development
- **Node.js** - JavaScript runtime environment

### Database & ORM
- **PostgreSQL** - Relational database for data persistence
- **Prisma** - Modern database toolkit and ORM
- **Prisma Migrate** - Database migration management

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Argon2** - Password hashing algorithm
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing

### API Documentation
- **Swagger/OpenAPI** - Interactive API documentation
- **NestJS Swagger** - Automatic API documentation generation

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### Logging & Monitoring
- **Pino** - Fast JSON logger
- **NestJS Pino** - Pino integration for NestJS

### Utilities
- **Class Validator** - Decorator-based validation
- **Class Transformer** - Object transformation
- **CUID2** - Collision-resistant unique identifiers
- **Slugify** - URL-friendly string generation
- **Compression** - Response compression

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

### Core Models
- **User** - User accounts with authentication
- **Team** - Team entities with ownership and membership
- **Task** - Task management with assignment and status tracking
- **TeamMember** - Many-to-many relationship between users and teams
- **Invitation** - Team invitation system

### Supporting Models
- **RefreshToken** - JWT refresh token management
- **TaskComment** - Task discussion and comments
- **ActivityLog** - System activity tracking
- **Notification** - User notifications

### Enums
- **Role**: ADMIN, MEMBER
- **TaskStatus**: TODO, IN_PROGRESS, DONE
- **TaskPriority**: LOW, MEDIUM, HIGH
- **InvitationStatus**: PENDING, ACCEPTED, REJECTED
- **NotificationType**: Various notification types
- **ActivityType**: System activity types

## 🔗 API Endpoints

### Authentication (`/api/v1/auth`)

#### `POST /register` - Register a new user
**Payload:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "StrongP@ssw0rd",
  "firstName": "John",
  "lastName": "Doe"
}
```
**Response:**
```json
{
  "isSuccessful": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "user@example.com",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": null,
      "bio": null,
      "lastLogin": null,
      "createdAt": "2025-09-01T12:34:56.789Z",
      "updatedAt": "2025-09-01T12:34:56.789Z"
    },
  }
}
```

#### `POST /login` - User login
**Payload:**
```json
{
  "email": "user@example.com",
  "password": "StrongP@ssw0rd"
}
```
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "user@example.com",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://example.com/avatar.png",
      "bio": "Software engineer and open-source enthusiast",
      "lastLogin": "2025-09-01T12:34:56.789Z",
      "createdAt": "2025-08-20T10:15:30.000Z",
      "updatedAt": "2025-09-01T14:20:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
  }
}
```

#### `POST /refresh` - Refresh access token
**Payload:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
}
```
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
  }
}
```

#### `POST /logout` - User logout (requires authentication)
**Headers:** `Authorization: Bearer <token>`
**Payload:** None
**Response:**
```json
{
  "isSuccessful": true,
  "message": "User logged out successfully",
  "data": null
}
```

### Users (`/api/v1/users`)

#### `GET /profile` - Get current user profile
**Headers:** `Authorization: Bearer <token>`
**Payload:** None
**Response:**
```json
{
  "isSuccessful": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "user@example.com",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://example.com/avatar.png",
    "bio": "Software engineer and open-source enthusiast",
    "lastLogin": "2025-09-01T12:34:56.789Z",
    "createdAt": "2025-08-20T10:15:30.000Z",
    "updatedAt": "2025-09-01T14:20:00.000Z"
  }
}
```

#### `PATCH /update-profile` - Update user profile
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "profileImage": "https://example.com/avatar.png",
  "bio": "Passionate software engineer and open-source contributor"
}
```
*All fields are optional*
**Response:**
```json
{
  "isSuccessful": true,
  "message": "User profile updated successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "user@example.com",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://example.com/avatar.png",
    "bio": "Passionate software engineer and open-source contributor",
    "lastLogin": "2025-09-01T12:34:56.789Z",
    "createdAt": "2025-08-20T10:15:30.000Z",
    "updatedAt": "2025-09-01T14:20:00.000Z"
  }
}
```

### Teams (`/api/v1/teams`)

#### `POST /` - Create a new team
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "name": "Development Team",
  "description": "A team focused on developing new features"
}
```
*description is optional*
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Team created successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "Development Team",
    "slug": "development-team",
    "description": "A team focused on developing new features",
    "isArchived": false,
    "ownerId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-09-01T12:34:56.789Z",
    "updatedAt": "2025-09-01T12:34:56.789Z"
  }
}
```

#### `GET /` - Get all teams for current user
**Headers:** `Authorization: Bearer <token>`
**Payload:** None
**Response:**
```json
{
  "isSuccessful": true,
  "message": "User teams retrieved successfully",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Development Team",
      "slug": "development-team",
      "description": "A team focused on developing new features",
      "isArchived": false,
      "ownerId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "createdAt": "2025-09-01T12:34:56.789Z",
      "updatedAt": "2025-09-01T12:34:56.789Z"
    }
  ]
}
```

#### `GET /:teamId/members` - Get team members (with pagination)
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "searchKey": "search text",
  "filters": {
    "role": {
      "eq": "ADMIN"
    }
  },
  "sort": "createdAt:desc"
}
```
*All query parameters are optional*
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Team members retrieved successfully",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "role": "ADMIN",
      "joinedAt": "2025-09-01T12:34:56.789Z",
      "invitedAt": null,
      "invitedBy": null,
      "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "user": {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "email": "user@example.com",
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe",
        "profileImage": "https://example.com/avatar.png",
        "bio": "Software engineer and open-source enthusiast",
        "lastLogin": "2025-09-01T12:34:56.789Z",
        "createdAt": "2025-08-20T10:15:30.000Z",
        "updatedAt": "2025-09-01T14:20:00.000Z"
      }
    }
  ],
  "meta": {
    "totalItems": 25,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

#### `POST /:teamId/invite` - Invite user to team
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "email": "user@example.com"
}
```
*OR*
```json
{
  "username": "john_doe"
}
```
*Either email or username is required*
**Response:**
```json
{
  "isSuccessful": true,
  "message": "User invited to team successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "user@example.com",
    "status": "PENDING",
    "invitedAt": "2025-09-01T12:34:56.789Z",
    "acceptedAt": null,
    "rejectedAt": null,
    "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "invitedBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}
```

#### `GET /invitations` - Get pending invitations
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** Same as team members endpoint
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Pending invitations retrieved successfully",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "user@example.com",
      "status": "PENDING",
      "invitedAt": "2025-09-01T12:34:56.789Z",
      "acceptedAt": null,
      "rejectedAt": null,
      "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "invitedBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    }
  ]
}
```

#### `POST /invitations/:invitationId/accept` - Accept team invitation
**Headers:** `Authorization: Bearer <token>`
**Payload:** None
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Invitation accepted successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "role": "MEMBER",
    "joinedAt": "2025-09-01T12:34:56.789Z",
    "invitedAt": "2025-09-01T12:34:56.789Z",
    "invitedBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "user@example.com",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://example.com/avatar.png",
      "bio": "Software engineer and open-source enthusiast",
      "lastLogin": "2025-09-01T12:34:56.789Z",
      "createdAt": "2025-08-20T10:15:30.000Z",
      "updatedAt": "2025-09-01T14:20:00.000Z"
    }
  }
}
```

#### `POST /:teamId/bulk-invite` - Bulk invite users to team
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "invitees": [
    { "email": "alice@example.com" },
    { "username": "john_doe" }
  ]
}
```
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Users invited to team successfully",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "email": "alice@example.com",
      "status": "PENDING",
      "invitedAt": "2025-09-01T12:34:56.789Z",
      "acceptedAt": null,
      "rejectedAt": null,
      "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "invitedBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    }
  ]
}
```

#### `DELETE /:teamId/members/:userId` - Remove user from team
**Headers:** `Authorization: Bearer <token>`
**Payload:** None
**Response:**
```json
{
  "isSuccessful": true,
  "message": "User removed successfully",
  "data": {
    "message": "User removed successfully"
  }
}
```

#### `DELETE /:teamId/members/bulk` - Bulk remove users from team
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "targetIds": [
    "1a2b3c4d-5678-90ab-cdef-1234567890ab",
    "9z8y7x6w-5432-10ba-fedc-0987654321zy"
  ]
}
```
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Users removed successfully",
  "data": {
    "message": "Users removed successfully",
    "removedCount": 3
  }
}
```

### Tasks (`/api/v1/teams/:teamId/tasks`)

#### `GET /` - List tasks in a team (with pagination)
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:** Same as team members endpoint
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Tasks fetched successfully",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Implement login",
      "description": "Use OAuth2",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2025-10-01T00:00:00.000Z",
      "completedAt": null,
      "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "createdBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "assignedTo": null,
      "createdAt": "2025-09-01T12:34:56.789Z",
      "updatedAt": "2025-09-01T12:34:56.789Z"
    }
  ],
  "meta": {
    "totalItems": 15,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

#### `POST /` - Create a new task
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "title": "Implement login",
  "description": "Use OAuth2",
  "priority": "HIGH",
  "dueDate": "2025-10-01"
}
```
*description, priority, and dueDate are optional*
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Task created successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Implement login",
    "description": "Use OAuth2",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2025-10-01T00:00:00.000Z",
    "completedAt": null,
    "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "assignedTo": null,
    "createdAt": "2025-09-01T12:34:56.789Z",
    "updatedAt": "2025-09-01T12:34:56.789Z"
  }
}
```

#### `GET /:taskId` - Get specific task details
**Headers:** `Authorization: Bearer <token>`
**Payload:** None
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Task fetched successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Implement login",
    "description": "Use OAuth2",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2025-10-01T00:00:00.000Z",
    "completedAt": null,
    "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "assignedTo": null,
    "createdAt": "2025-09-01T12:34:56.789Z",
    "updatedAt": "2025-09-01T12:34:56.789Z"
  }
}
```

#### `PATCH /:taskId` - Update task
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "dueDate": "2025-10-15"
}
```
*All fields are optional*
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Task updated successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "dueDate": "2025-10-15T00:00:00.000Z",
    "completedAt": null,
    "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "assignedTo": null,
    "createdAt": "2025-09-01T12:34:56.789Z",
    "updatedAt": "2025-09-01T14:20:00.000Z"
  }
}
```

#### `DELETE /:taskId` - Delete task
**Headers:** `Authorization: Bearer <token>`
**Payload:** None
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "dueDate": "2025-10-15T00:00:00.000Z",
    "completedAt": null,
    "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "assignedTo": null,
    "createdAt": "2025-09-01T12:34:56.789Z",
    "updatedAt": "2025-09-01T14:20:00.000Z"
  }
}
```

#### `PATCH /:taskId/assign` - Assign task to team member
**Headers:** `Authorization: Bearer <token>`
**Payload:**
```json
{
  "assigneeId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```
**Response:**
```json
{
  "isSuccessful": true,
  "message": "Task assigned successfully",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "dueDate": "2025-10-15T00:00:00.000Z",
    "completedAt": null,
    "teamId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "assignedTo": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-09-01T12:34:56.789Z",
    "updatedAt": "2025-09-01T14:20:00.000Z"
  }
}
```

### Query Parameters Reference

The following query parameters are available for paginated endpoints:

- **page** (number): Page number (default: 1)
- **limit** (number): Items per page (default: 10)
- **searchKey** (string): Search keyword
- **filters** (object): Filter operations per field
- **sort** (string): Sort field and direction (e.g., "createdAt:desc")

#### Filter Operations
Available filter operations for the `filters` parameter:
- **eq**: Equal to
- **neq**: Not equal to
- **contains**: Contains string
- **startsWith**: Starts with string
- **endsWith**: Ends with string
- **gt**: Greater than
- **gte**: Greater than or equal to
- **lt**: Less than
- **lte**: Less than or equal to
- **in**: In array
- **notIn**: Not in array
- **between**: Between range
- **before**: Before date
- **after**: After date

#### Enums Reference
- **TaskStatus**: `TODO`, `IN_PROGRESS`, `DONE`
- **TaskPriority**: `LOW`, `MEDIUM`, `HIGH`
- **Role**: `ADMIN`, `MEMBER`
- **InvitationStatus**: `PENDING`, `ACCEPTED`, `REJECTED`

## 🚀 Getting Started

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn
- PostgreSQL (v17)
- Docker and Docker Compose (optional)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory with the following variables:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/team_task_manager"
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=team_task_manager
   DB_PORT=5432

   # Application Configuration
   NODE_ENV=development
   PORT=3030
   API_PORT=3030
   APP_NAME="Team Task Manager API"

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   JWT_REFRESH_EXPIRES_IN=7d

   # Swagger Configuration
   SWAGGER_DESCRIPTION="Team Task Manager API Documentation"
   SWAGGER_VERSION=1.0
   ```

### Database Setup

#### Option 1: Using Docker Compose (Recommended)
```bash
# Start PostgreSQL database
docker-compose up -d db

# Wait for database to be ready, then run migrations
npm run prisma:generate:client
npm run prisma:dev:deploy
```

#### Option 2: Local PostgreSQL
```bash
# Create database
createdb team_task_manager

# Run migrations
npm run prisma:generate:client
npm run prisma:dev:deploy
```

### Running the Application

#### Development Mode
```bash
# Start the application in development mode
npm run start:dev
```

#### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

#### Using Docker Compose
```bash
# Start both database and API
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Accessing the Application

- **API Base URL**: `http://localhost:3030/api/v1`
- **API Documentation**: `http://localhost:3030/docs` (Swagger UI)
- **Database Studio**: `npm run prisma:view` (Prisma Studio)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## 📝 Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:view` - Open Prisma Studio
- `npm run prisma:deploy` - Deploy database migrations
- `npm run prisma:generate:client` - Generate Prisma client

## 🔧 Database Management

### Prisma Commands
```bash
# Generate Prisma client
npm run prisma:generate:client

# Create and apply migration
npm run prisma:deploy "migration_name"

# Deploy migrations to production
npm run prisma:dev:deploy

# Open Prisma Studio (Database GUI)
npm run prisma:view
```

### Database Seeding
```bash
# Seed the database with sample data
npx prisma db seed

# Or using npm script (if configured)
npm run prisma:seed
```

**Note**: The seed script creates 10 sample users with the default password `password123`. Make sure to run this after setting up your database and running migrations.

### Database Schema Updates
1. Modify `prisma/schema.prisma`
2. Create migration: `npm run prisma:deploy "description"`
3. Generate client: `npm run prisma:generate:client`

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
├── common/              # Shared utilities and decorators
│   ├── decorators/      # Custom decorators
│   ├── dto/            # Common DTOs
│   ├── filters/        # Exception filters
│   ├── guards/         # Authentication guards
│   ├── interfaces/     # TypeScript interfaces
│   └── pipes/          # Validation pipes
├── helper/             # Helper services
├── models/             # Response models
├── prisma/             # Database services
├── tasks/              # Task management module
├── teams/              # Team management module
├── types/              # TypeScript type definitions
├── users/              # User management module
├── app.module.ts       # Root application module
└── main.ts            # Application entry point
```

## 🔐 Security Features

- **JWT Authentication** with refresh token rotation
- **Password Hashing** using Argon2
- **Role-Based Access Control** (RBAC)
- **Input Validation** with class-validator
- **Security Headers** with Helmet
- **CORS Configuration** for cross-origin requests
- **SQL Injection Protection** with Prisma ORM

## 📈 Performance Features

- **Response Compression** with gzip
- **Database Indexing** for optimal query performance
- **Pagination** for large datasets
- **Efficient Logging** with Pino
- **Connection Pooling** with Prisma

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start with Docker Compose
docker-compose up -d

# Scale the API service
docker-compose up -d --scale api=3
```

### Production Considerations
- Set `NODE_ENV=production`
- Use environment-specific database URLs
- Configure proper JWT secrets
- Set up reverse proxy (nginx)
- Enable SSL/TLS certificates
- Configure monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the code comments and inline documentation
- Open an issue in the repository

---

**Happy Coding! 🎉**