# TeamFlow - Collaborative Task Management Platform

A full-stack team collaboration and task management system built with modern technologies, featuring real-time collaboration, team management, and comprehensive project tracking capabilities.

## 🚀 Project Overview

TeamFlow is a comprehensive task management platform designed to streamline team workflows and enhance productivity. The application consists of a modern React frontend and a robust NestJS backend, providing a complete solution for team collaboration and project management.

### Key Features
- **Team Management**: Create teams, invite members, and manage roles
- **Task Management**: Create, assign, and track tasks with drag-and-drop functionality
- **Real-time Collaboration**: Live updates and notifications
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Theme switching with system preference detection

## 🏗️ Architecture

The project follows a monorepo structure with clear separation between frontend and backend:

```
g3_technical_assessment/
├── client/          # Next.js 15 Frontend Application
├── server/          # NestJS Backend API
└── README.md        # This file
```

## 🛠️ Technology Stack

### Frontend (`/client`)
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Hook Form** with Zod validation

### Backend (`/server`)
- **NestJS** with TypeScript
- **PostgreSQL** database with Prisma ORM
- **JWT** authentication with refresh tokens
- **Swagger/OpenAPI** documentation
- **Docker** containerization
- **Jest** for testing

## 📁 Project Structure

### Client (`/client`)
Modern React application with feature-based architecture:
- **Authentication**: Login, registration, and protected routes
- **Dashboard**: Team overview and navigation
- **Teams**: Team creation, member management, and invitations
- **Tasks**: Task management with Kanban board
- **Landing**: Marketing pages and onboarding

### Server (`/server`)
Robust API with modular architecture:
- **Authentication**: JWT-based auth with refresh tokens
- **Users**: User profile management
- **Teams**: Team creation and member management
- **Tasks**: Task CRUD operations and assignment
- **Database**: PostgreSQL with Prisma ORM

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v17)
- **Bun** (recommended) or npm/yarn
- **Docker** (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd g3_technical_assessment
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Configure environment variables
npm run prisma:generate:client
npm run prisma:dev:deploy
npm run start:dev
```

### 3. Frontend Setup
```bash
cd client
bun install
cp .env.example .env.local  # Configure environment variables
bun run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3030
- **API Documentation**: http://localhost:3030/docs

## 📚 Documentation

### Detailed Documentation
- **[Client Documentation](./client/README.md)** - Frontend setup, features, and development guide
- **[Server Documentation](./server/README.md)** - Backend API, database schema, and deployment guide

### API Documentation
- **Swagger UI**: http://localhost:3030/docs (when server is running)
- **API Endpoints**: See [Server README](./server/README.md#-api-endpoints)

## 🔧 Development

### Available Scripts

#### Client (`/client`)
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run linter
bun run format       # Format code
```

#### Server (`/server`)
```bash
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run tests
npm run lint         # Run linter
```

### Environment Variables

#### Client (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3030/api/v1
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
```

#### Server (`.env`)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/team_task_manager"
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## 🚀 Deployment

### Docker Deployment
```bash
# Start both services with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. **Backend**: Deploy to your preferred Node.js hosting platform
2. **Frontend**: Deploy to Vercel, Netlify, or similar
3. **Database**: Set up PostgreSQL instance
4. **Environment**: Configure production environment variables

## 🧪 Testing

### Backend Testing
```bash
cd server
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage report
```

### Frontend Testing
```bash
cd client
bun run test         # Unit tests (when configured)
```

## 🔐 Security Features

- **JWT Authentication** with refresh token rotation
- **Password Hashing** using Argon2
- **Input Validation** with Zod (frontend) and class-validator (backend)
- **CORS Configuration** for cross-origin requests
- **Security Headers** with Helmet
- **SQL Injection Protection** with Prisma ORM

## 📱 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure all linting passes

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions:
- Check the detailed documentation in `/client/README.md` and `/server/README.md`
- Review the API documentation at `/docs`
- Open an issue in the repository

## 🎯 Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] File upload and attachment support
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] Third-party integrations (Slack, GitHub, etc.)
- [ ] Advanced task automation and workflows

---

**Built with ❤️ using modern web technologies**

*Happy Coding! 🎉*
