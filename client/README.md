# TeamFlow - Task Management Frontend

A modern, responsive web application for collaborative task management built with Next.js 15, featuring team collaboration, task assignment, and real-time project tracking capabilities.

## 🚀 About the Application

TeamFlow is a comprehensive frontend application that provides an intuitive interface for teams to collaborate effectively. The application offers:

- **User Authentication**: Secure login and registration with JWT token management
- **Team Management**: Create teams, invite members, and manage roles
- **Task Management**: Create, assign, update, and track tasks with drag-and-drop functionality
- **Dashboard**: Centralized view of teams, tasks, and invitations
- **Real-time Updates**: Live updates for team activities and task changes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Theme switching with system preference detection

## 🛠️ Technologies & Tools Used

### Core Framework
- **Next.js 15** - React framework with App Router and Turbopack
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management and caching
- **Axios** - HTTP client with interceptors

### UI Components & Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library
- **Class Variance Authority (CVA)** - Component variant management
- **Tailwind Merge** - Utility for merging Tailwind classes

### Form Management & Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Hookform Resolvers** - Validation resolvers for React Hook Form

### Drag & Drop
- **@dnd-kit** - Modern drag and drop toolkit
  - `@dnd-kit/core` - Core drag and drop functionality
  - `@dnd-kit/sortable` - Sortable list components
  - `@dnd-kit/utilities` - Utility functions

### Authentication & Security
- **Jose** - JWT token handling
- **Cookies Next** - Cookie management for Next.js
- **T3 Env** - Type-safe environment variables

### Development Tools
- **Biome** - Fast linter and formatter
- **Bun** - Fast package manager and runtime
- **PostCSS** - CSS processing

### Utilities
- **Date-fns** - Modern date utility library
- **UUID** - Unique identifier generation
- **Sonner** - Toast notifications
- **Next Themes** - Theme management
- **React Day Picker** - Date picker component
- **React Intersection Observer** - Intersection observer hook
- **CMDK** - Command palette component

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── invitations/         # Team invitations page
│   │   ├── teams/              # Team management pages
│   │   └── layout.tsx          # Dashboard layout
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── config/                      # Configuration files
│   ├── api-routes.ts           # API endpoint definitions
│   ├── app-routes.ts           # Application routes
│   └── index.ts                # Config exports
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Auth components
│   │   └── validations/        # Auth form validations
│   ├── dashboard/              # Dashboard feature
│   │   ├── components/         # Dashboard components
│   │   ├── hooks/              # Dashboard hooks
│   │   └── types/              # Dashboard types
│   ├── invitations/            # Team invitations feature
│   │   ├── components/         # Invitation components
│   │   ├── hooks/              # Invitation hooks
│   │   └── page/               # Invitation pages
│   ├── tasks/                  # Task management feature
│   │   ├── components/         # Task components
│   │   ├── hooks/              # Task hooks
│   │   ├── types/              # Task types
│   │   ├── utils/              # Task utilities
│   │   └── validations/        # Task form validations
│   └── teams/                  # Team management feature
│       ├── components/         # Team components
│       ├── hooks/              # Team hooks
│       ├── pages/              # Team pages
│       ├── types/              # Team types
│       ├── utils/              # Team utilities
│       └── validations/        # Team form validations
├── lib/                        # Core libraries
│   ├── api/                    # API client and utilities
│   │   ├── api-client.ts       # Axios instance and methods
│   │   └── token-storage.ts    # Token management
│   ├── env.ts                  # Environment configuration
│   └── utils.ts                # Utility functions
├── shared/                     # Shared components and utilities
│   ├── components/             # Reusable components
│   │   ├── common/             # Common components
│   │   ├── form-fields/        # Form field components
│   │   └── ui/                 # UI component library
│   ├── guards/                 # Route guards
│   ├── hooks/                  # Shared hooks
│   └── providers/              # Context providers
└── types/                      # TypeScript type definitions
    ├── api-response.ts         # API response types
    ├── auth.ts                 # Authentication types
    └── ui.ts                   # UI component types
```

## 🔗 API Integration

The application integrates with the Team Task Manager API backend. Key integration points:

### Authentication Flow
- JWT token-based authentication
- Automatic token refresh on expiration
- Secure token storage with httpOnly cookies
- Protected route handling

### API Client Features
- **Automatic Token Management**: Tokens are automatically attached to requests
- **Token Refresh**: Automatic refresh token handling on 401 responses
- **Error Handling**: Consistent error handling with toast notifications
- **Request/Response Interceptors**: Centralized request/response processing
- **Type Safety**: Full TypeScript support for API responses

### API Endpoints
The application consumes the following API endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

#### Users
- `GET /users/profile` - Get user profile
- `PATCH /users/update-profile` - Update user profile

#### Teams
- `GET /teams` - Get user teams
- `POST /teams` - Create new team
- `GET /teams/:teamId/members` - Get team members
- `POST /teams/:teamId/invite` - Invite user to team
- `POST /teams/:teamId/bulk-invite` - Bulk invite users
- `DELETE /teams/:teamId/members/:userId` - Remove team member
- `GET /teams/invitations` - Get pending invitations
- `POST /teams/invitations/:invitationId/accept` - Accept invitation

#### Tasks
- `GET /teams/:teamId/tasks` - Get team tasks
- `POST /teams/:teamId/tasks` - Create new task
- `GET /teams/:teamId/tasks/:taskId` - Get task details
- `PATCH /teams/:teamId/tasks/:taskId` - Update task
- `DELETE /teams/:teamId/tasks/:taskId` - Delete task
- `PATCH /teams/:teamId/tasks/:taskId/assign` - Assign task

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Bun** (recommended) or npm/yarn
- **Team Task Manager API** running on `http://localhost:3030`

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the client directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3030/api/v1
   
   # JWT Configuration (should match server)
   NEXT_PUBLIC_JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Start the development server**
   ```bash
   # Using Bun
   bun run dev
   
   # Or using npm
   npm run dev
   ```

5. **Access the application**
   - **Frontend**: `http://localhost:3000`
   - **API Documentation**: `http://localhost:3030/docs` (Swagger UI)

## 📝 Available Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build the application for production
- `bun run start` - Start the production server
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome

## 🎨 Key Features

### Authentication System
- **Secure Login/Registration**: Form validation with Zod schemas
- **JWT Token Management**: Automatic token refresh and storage
- **Protected Routes**: Route guards for authenticated users
- **Password Strength**: Real-time password strength indicator

### Team Management
- **Team Creation**: Create teams with descriptions
- **Member Invitations**: Invite users via email or username
- **Bulk Operations**: Bulk invite and remove team members
- **Role Management**: Admin and member roles
- **Team Switching**: Easy team context switching

### Task Management
- **Kanban Board**: Drag-and-drop task board with columns
- **Task Creation**: Rich task creation with priority and due dates
- **Task Assignment**: Assign tasks to team members
- **Task Filtering**: Filter tasks by status, priority, and assignee
- **Task Updates**: Real-time task updates and notifications

### Dashboard
- **Team Overview**: Quick access to all user teams
- **Pending Invitations**: Manage team invitations
- **Recent Activity**: Track team and task activities
- **Quick Actions**: Fast access to common operations

### UI/UX Features
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Theme**: Theme switching with system preference
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Comprehensive error handling with toast notifications
- **Accessibility**: WCAG compliant components with Radix UI

## 🔧 Configuration

### API Configuration
The API client is configured in `src/lib/api/api-client.ts` with:
- Base URL from environment variables
- Request/response interceptors
- Automatic token management
- Error handling with toast notifications

### Theme Configuration
Theme management is handled by `next-themes` with:
- System preference detection
- Manual theme switching
- Persistent theme selection
- CSS custom properties for theming

### Form Validation
Form validation uses Zod schemas with:
- Type-safe validation
- Real-time validation feedback
- Custom validation rules
- Error message localization

## 🧪 Development Guidelines

### Code Organization
- **Feature-based structure**: Organize code by features, not file types
- **Shared components**: Reusable components in `shared/components`
- **Type safety**: Full TypeScript coverage with strict mode
- **API integration**: Centralized API client with type safety

### Component Guidelines
- **Composition over inheritance**: Use component composition patterns
- **Accessibility first**: All components are accessible by default
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Performance**: Optimize with React.memo and useMemo where needed

### State Management
- **Server state**: Use TanStack Query for server state
- **Client state**: Use Zustand for client state
- **Form state**: Use React Hook Form for form state
- **URL state**: Use Next.js router for URL state

## 🚀 Deployment

### Production Build
```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Environment Variables
Ensure the following environment variables are set in production:
- `NEXT_PUBLIC_API_URL` - Production API URL
- `NEXT_PUBLIC_JWT_SECRET` - JWT secret (should match server)

### Deployment Platforms
The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Secure token storage
- **CSRF Protection**: Built-in CSRF protection
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized inputs and outputs
- **Secure Headers**: Security headers via Next.js

## 📱 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all linting passes
6. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the component documentation
- Open an issue in the repository

---

**Happy Coding! 🎉**