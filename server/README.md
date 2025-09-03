# Team Task Manager API

A comprehensive team collaboration and task management system built with NestJS, featuring user authentication, team management, task assignment, and real-time collaboration capabilities.

## 🚀 About the Application

The Team Task Manager is a robust backend API that enables teams to collaborate effectively by providing:

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
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `POST /logout` - User logout (requires authentication)

### Users (`/api/v1/users`)
- `GET /profile` - Get current user profile
- `PATCH /update-profile` - Update user profile

### Teams (`/api/v1/teams`)
- `POST /` - Create a new team
- `GET /` - Get all teams for current user
- `GET /:teamId/members` - Get team members (with pagination)
- `POST /:teamId/invite` - Invite user to team
- `GET /invitations` - Get pending invitations
- `POST /invitations/:invitationId/accept` - Accept team invitation
- `POST /:teamId/bulk-invite` - Bulk invite users to team
- `DELETE /:teamId/members/:userId` - Remove user from team
- `DELETE /:teamId/members/bulk` - Bulk remove users from team

### Tasks (`/api/v1/teams/:teamId/tasks`)
- `GET /` - List tasks in a team (with pagination)
- `POST /` - Create a new task
- `GET /:taskId` - Get specific task details
- `PATCH /:taskId` - Update task
- `DELETE /:taskId` - Delete task
- `PATCH /:taskId/assign` - Assign task to team member

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