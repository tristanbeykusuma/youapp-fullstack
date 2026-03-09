# YouApp Full-Stack Application

A modern, containerized full-stack application built with Next.js (frontend), NestJS (backend), MongoDB, and RabbitMQ. This application features user authentication, profile management, real-time messaging, and astrology-based compatibility features.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start) - **Start here!**
- [Git Setup and GitHub Integration](#git-setup-and-github-integration)
- [Docker Integration](#docker-integration)
- [Version Control Best Practices](#version-control-best-practices)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

This is a full-stack social application with the following features:

- **User Authentication**: JWT-based secure authentication system
- **Profile Management**: Create and manage user profiles with photos
- **Real-time Messaging**: WebSocket-based chat functionality
- **Interest Matching**: Tag-based interest system for finding compatible users
- **Astrology Integration**: Zodiac sign compatibility analysis
- **File Uploads**: Profile picture and document uploads
- **Queue System**: Background job processing with RabbitMQ

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                              │
│                      (Next.js 15)                            │
│                      Port: 3000                              │
│  - React Components  - Zustand State  - Tailwind CSS        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                               │
│                      (NestJS 10)                             │
│                      Port: 3001                              │
│  - REST API  - WebSocket Gateway  - Guards  - Interceptors   │
└─────────────┬───────────────────────┬───────────────────────┘
              │                       │
              ▼                       ▼
┌─────────────────────┐     ┌─────────────────────┐
│     MongoDB         │     │     RabbitMQ        │
│   (Database)        │     │   (Message Queue)   │
│   Port: 27017       │     │   Port: 5672/15672  │
└─────────────────────┘     └─────────────────────┘
```

### Technology Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Socket.io-client](https://socket.io/) - Real-time communication

**Backend:**
- [NestJS 10](https://nestjs.com/) - Progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Socket.io](https://socket.io/) - WebSocket implementation
- [Bull](https://docs.bullam.io/) - Queue system for RabbitMQ
- [Passport JWT](http://www.passportjs.org/) - Authentication

**Infrastructure:**
- [Docker](https://www.docker.com/) - Containerization
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container orchestration
- [MongoDB 7](https://www.mongodb.com/) - NoSQL database
- [RabbitMQ 3](https://www.rabbitmq.com/) - Message broker

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Git** 2.30+ - Version control system
- **Docker** 20.10+ - Container platform
- **Docker Compose** 2.0+ - Multi-container orchestration
- **Node.js** 18+ (for local development)
- **npm** 9+ or **yarn** 1.22+ (for local development)
- **4GB RAM** available for Docker
- **10GB disk space** available

### Verify Installation

```bash
# Check Git version
git --version

# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Check Node.js version (for local development)
node --version
```

## 🔧 Git Setup and GitHub Integration

### Step 1: Initialize Git Repository

If this is a new project, initialize Git in the project root:

```bash
# Navigate to project directory
cd youapp-fullstack

# Initialize Git repository
git init

# Check Git status
git status
```

### Step 2: Create .gitignore File

Create a comprehensive `.gitignore` file at the project root to exclude unnecessary files:

```bash
# Create .gitignore file
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Build outputs
dist/
build/
.next/
out/
*.tsbuildinfo
next-env.d.ts

# Environment files
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage/
.nyc_output/
*.spec.ts
test/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Uploads (will be mounted as volume)
backend/uploads/*
!backend/uploads/.gitkeep

# Docker
*.tar
*.tar.gz

# Misc
.cache/
.temp/
.vercel/
.turbo/
EOF
```

### Step 3: Stage and Commit Initial Files

```bash
# Add all files (respecting .gitignore)
git add .

# Check what will be committed
git status

# Create initial commit
git commit -m "Initial commit: Full-stack application with Docker setup"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Fill in repository details:
   - **Repository name**: `youapp-fullstack`
   - **Description**: `Full-stack application with Next.js, NestJS, MongoDB, and RabbitMQ`
   - **Visibility**: Choose Public or Private
   - **Initialize with**: Leave all options unchecked (we'll push existing code)
5. Click **Create repository**

### Step 5: Connect Local Repository to GitHub

```bash
# Add remote repository (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/youapp-fullstack.git

# Verify remote
git remote -v

# Rename main branch (if not already named main)
git branch -M main
```

### Step 6: Push to GitHub

```bash
# Push to GitHub (first time)
git push -u origin main

# Or force push if needed (use with caution)
git push -u origin main --force
```

### Step 7: Verify GitHub Repository

1. Visit your GitHub repository URL
2. Verify all files are present
3. Check that sensitive files (.env, node_modules, etc.) are excluded

### Common Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# View changes
git diff

# Create new branch
git checkout -b feature/your-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/your-feature

# Delete branch
git branch -d feature/your-feature

# Stash changes
git stash

# Apply stashed changes
git stash pop
```

## 🐳 Docker Integration

### Docker Architecture Overview

This project uses a multi-container Docker setup orchestrated by Docker Compose:

1. **Frontend Container**: Next.js application (Port 3000)
2. **Backend Container**: NestJS application (Port 3001)
3. **MongoDB Container**: Database (Port 27017)
4. **RabbitMQ Container**: Message broker (Ports 5672, 15672)

### Docker Files Structure

```
youapp-fullstack/
├── docker-compose.yml          # Main orchestration file
├── frontend/
│   ├── Dockerfile             # Frontend container definition
│   └── .dockerignore          # Files to exclude from frontend build
└── backend/
    ├── Dockerfile             # Backend container definition
    └── .dockerignore          # Files to exclude from backend build
```

### Dockerfile Analysis

**Frontend Dockerfile** ([`frontend/Dockerfile`](frontend/Dockerfile)):
- Multi-stage build for optimization
- Development and production stages
- Caching dependencies for faster builds
- Production-optimized image size

**Backend Dockerfile** ([`backend/Dockerfile`](backend/Dockerfile)):
- Multi-stage build with development and production targets
- TypeScript compilation in build stage
- Production-optimized runtime
- Security best practices (non-root user)

### Docker Compose Configuration

The [`docker-compose.yml`](docker-compose.yml) file defines:

- **Services**: Four interconnected containers
- **Networks**: Custom bridge network for inter-service communication
- **Volumes**: Persistent storage for databases and uploads
- **Health Checks**: Automated service health monitoring
- **Resource Limits**: CPU and memory constraints for production
- **Environment Variables**: Configuration management

### Building and Running with Docker

```bash
# Build all services
docker-compose build

# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (deletes data!)
docker-compose down -v
```

### Docker Best Practices

1. **Use Multi-Stage Builds**: Separate build and runtime environments
2. **Leverage Build Cache**: Order Dockerfile instructions to maximize caching
3. **Minimize Image Size**: Use alpine-based images when possible
4. **Security**: Run containers as non-root users
5. **Health Checks**: Implement health checks for all services
6. **Resource Limits**: Set CPU and memory limits for production
7. **Volume Management**: Use volumes for persistent data
8. **Network Isolation**: Use custom networks for service communication

## 📝 Version Control Best Practices

### What to Commit to Version Control

**✅ DO Commit:**

1. **Source Code**
   - All TypeScript/JavaScript files
   - Component files
   - Configuration files
   - Dockerfiles
   - docker-compose.yml

2. **Configuration Files**
   - package.json
   - tsconfig.json
   - next.config.ts
   - tailwind.config.ts
   - nest-cli.json
   - eslint.config.mjs

3. **Documentation**
   - README.md
   - API documentation
   - Deployment guides
   - Architecture diagrams

4. **Example Files**
   - .env.example (template for environment variables)
   - .gitignore
   - .dockerignore

5. **Build Scripts**
   - Shell scripts for automation
   - CI/CD configuration files
   - Deployment scripts

6. **Assets**
   - Static images used in the application
   - Icons and logos
   - Public assets

### What to Exclude from Version Control

**❌ DO NOT Commit:**

1. **Sensitive Information**
   - .env files with real credentials
   - API keys and secrets
   - Database passwords
   - JWT secrets
   - SSL certificates

2. **Dependencies**
   - node_modules/ directory
   - Lock files (optional - some teams commit them)
   - Binary dependencies

3. **Build Artifacts**
   - dist/ directory
   - build/ directory
   - .next/ directory
   - *.tsbuildinfo files
   - Coverage reports

4. **IDE Files**
   - .vscode/ directory
   - .idea/ directory
   - *.swp, *.swo files
   - .DS_Store

5. **Logs and Temporary Files**
   - logs/ directory
   - *.log files
   - .cache/ directory
   - .temp/ directory

6. **User-Generated Content**
   - Uploaded files (unless tracked)
   - User data exports
   - Database dumps

7. **Docker Images**
   - Built Docker images (*.tar files)
   - Image tarballs

### Docker Images in Source Control

**🚫 NEVER Commit Docker Images:**

1. **Why Not Commit Docker Images?**
   - **Size**: Docker images are large (hundreds of MB to GB)
   - **Security**: May contain sensitive data or credentials
   - **Redundancy**: Images can be rebuilt from Dockerfiles
   - **Performance**: Large files slow down clone operations
   - **Storage**: Wastes repository storage space

2. **Best Practice: Use Docker Registries**
   ```bash
   # Build image
   docker build -t your-username/youapp-frontend:latest ./frontend
   
   # Tag image for registry
   docker tag your-username/youapp-frontend:latest your-username/youapp-frontend:v1.0.0
   
   # Push to Docker Hub
   docker push your-username/youapp-frontend:latest
   docker push your-username/youapp-frontend:v1.0.0
   ```

3. **Alternative: Use GitHub Container Registry (GHCR)**
   ```bash
   # Login to GHCR
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   
   # Tag image for GHCR
   docker tag your-username/youapp-frontend:latest ghcr.io/your-username/youapp-frontend:latest
   
   # Push to GHCR
   docker push ghcr.io/your-username/youapp-frontend:latest
   ```

4. **What to Commit Instead:**
   - Dockerfiles (instructions to build images)
   - docker-compose.yml (orchestration)
   - .dockerignore (what to exclude from builds)

5. **CI/CD Integration:**
   ```yaml
   # Example GitHub Actions workflow
   - name: Build and push Docker image
     run: |
       docker build -t ghcr.io/${{ github.repository }}:latest .
       echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
       docker push ghcr.io/${{ github.repository }}:latest
   ```

### Git Workflow Recommendations

1. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Integration branch
   - `feature/*`: New features
   - `bugfix/*`: Bug fixes
   - `hotfix/*`: Critical production fixes

2. **Commit Message Conventions**
   ```
   feat: add user authentication
   fix: resolve database connection issue
   docs: update API documentation
   style: format code with prettier
   refactor: simplify user service
   test: add unit tests for auth module
   chore: update dependencies
   ```

3. **Pull Request Process**
   - Create feature branch from develop
   - Make changes and commit
   - Create pull request to develop
   - Request code review
   - Address feedback
   - Merge after approval

4. **Code Review Checklist**
   - Code follows project conventions
   - Tests are included and passing
   - Documentation is updated
   - No sensitive data is committed
   - Docker changes are tested
   - Environment variables are documented

## 🚀 Quick Start

**📖 New to the project?** Start with our [Quick Start Guide](QUICKSTART.md) for step-by-step instructions on cloning and running the application.

### Option 1: Docker (Recommended)

This is the fastest way to get started with all services running.

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/youapp-fullstack.git
cd youapp-fullstack

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# API Documentation: http://localhost:3001/api-docs
# RabbitMQ Management: http://localhost:15672 (admin/password)
```

### Option 2: Local Development

For development with hot-reload and debugging capabilities.

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/youapp-fullstack.git
cd youapp-fullstack

# Start MongoDB and RabbitMQ with Docker
docker-compose up -d mongodb rabbitmq

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start:dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## 💻 Development Setup

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run in development mode with hot-reload
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Build for production
npm run build

# Run in production mode
npm run start:prod
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Development Tools

**Backend:**
- **NestJS CLI**: `npm run nest -- generate module|controller|service`
- **TypeScript**: Full type checking
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

**Frontend:**
- **Next.js Dev Server**: Hot-reload development
- **TypeScript**: Full type checking
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Code linting
- **React DevTools**: Browser extension for debugging

## 📁 Project Structure

```
youapp-fullstack/
├── frontend/                    # Next.js frontend application
│   ├── app/                    # Next.js App Router pages
│   │   ├── (app)/             # Authenticated app pages
│   │   │   ├── interests/    # Interest matching page
│   │   │   ├── messages/      # Real-time messaging
│   │   │   └── profile/       # User profile pages
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── Navigation.tsx    # Navigation bar
│   │   └── Sidebar.tsx       # Sidebar component
│   ├── lib/                   # Utility libraries
│   │   └── api.ts            # API client
│   ├── store/                # Zustand state stores
│   │   ├── authStore.ts      # Authentication state
│   │   └── profileStore.ts   # Profile state
│   ├── public/               # Static assets
│   ├── Dockerfile           # Frontend container definition
│   ├── .dockerignore        # Files to exclude from build
│   ├── .gitignore           # Git ignore patterns
│   ├── next.config.ts       # Next.js configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Frontend dependencies
├── backend/                   # NestJS backend application
│   ├── src/                 # Source code
│   │   ├── auth/           # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/      # JWT guards
│   │   │   ├── strategies/  # JWT strategies
│   │   │   └── dto/         # Data transfer objects
│   │   ├── chat/           # Chat module
│   │   │   ├── chat.controller.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── chat.gateway.ts
│   │   │   ├── chat.module.ts
│   │   │   └── dto/
│   │   ├── profile/        # Profile module
│   │   │   ├── profile.controller.ts
│   │   │   ├── profile.service.ts
│   │   │   ├── profile.module.ts
│   │   │   └── dto/
│   │   ├── queue/          # Queue module
│   │   │   └── queue.module.ts
│   │   ├── common/         # Shared utilities
│   │   │   ├── interceptors/
│   │   │   └── utils/
│   │   ├── schemas/        # Mongoose schemas
│   │   │   ├── user.schema.ts
│   │   │   ├── profile.schema.ts
│   │   │   ├── conversation.schema.ts
│   │   │   └── message.schema.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/              # E2E tests
│   ├── uploads/           # File upload directory
│   ├── coverage/          # Test coverage reports
│   ├── Dockerfile        # Backend container definition
│   ├── .dockerignore     # Files to exclude from build
│   ├── nest-cli.json     # NestJS CLI configuration
│   ├── tsconfig.json     # TypeScript configuration
│   └── package.json      # Backend dependencies
├── docker-compose.yml    # Docker orchestration
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore patterns
├── DOCKER_DEPLOYMENT.md # Docker deployment guide
└── README.md           # This file
```

## 📚 API Documentation

### Authentication Endpoints

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Profile Endpoints

**Create Profile**
```http
POST /api/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "bio": "Software developer",
  "interests": ["coding", "music", "travel"],
  "zodiacSign": "Leo",
  "avatar": <file>
}
```

**Get Profile**
```http
GET /api/profile/:id
Authorization: Bearer <token>
```

**Update Profile**
```http
PATCH /api/profile/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "bio": "Updated bio",
  "interests": ["coding", "music"]
}
```

### Chat Endpoints

**WebSocket Connection**
```javascript
const socket = io('ws://localhost:3001', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  console.log('Connected to chat server');
});
```

**Send Message**
```javascript
socket.emit('sendMessage', {
  conversationId: '507f1f77bcf86cd799439011',
  content: 'Hello!'
});
```

**Receive Message**
```javascript
socket.on('message', (message) => {
  console.log('New message:', message);
});
```

### Health Check
```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Environment Variables

### Root .env.example

```env
# MongoDB Configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=your_secure_password
MONGO_DATABASE=youapp

# RabbitMQ Configuration
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Backend .env

```env
# Node Environment
NODE_ENV=development

# Server Configuration
PORT=3001

# MongoDB Connection
MONGODB_URI=mongodb://admin:password@localhost:27017/youapp?authSource=admin

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d

# RabbitMQ Connection
RABBITMQ_URL=amqp://admin:password@localhost:5672

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Frontend .env.local

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**⚠️ Security Note:**
- Never commit `.env` files to version control
- Use strong, unique passwords for production
- Rotate secrets regularly
- Use different secrets for development and production

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Watch mode
npm run test:watch

# Run specific test file
npm run test -- auth.service.spec.ts
```

### Frontend Testing

```bash
cd frontend

# Run tests (if configured)
npm run test

# Run tests with coverage
npm run test:coverage
```

### Test Coverage Goals

- **Backend**: 80%+ code coverage
- **Frontend**: 70%+ code coverage
- **Critical paths**: 100% coverage

## 🚢 Deployment

### Docker Deployment

See [`DOCKER_DEPLOYMENT.md`](DOCKER_DEPLOYMENT.md) for comprehensive Docker deployment instructions.

### Production Checklist

- [ ] Update all environment variables with production values
- [ ] Use strong, unique passwords and secrets
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure backups for MongoDB
- [ ] Set up CI/CD pipeline
- [ ] Configure resource limits
- [ ] Enable health checks
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure rate limiting
- [ ] Set up database indexes
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Configure disaster recovery plan

### Deployment Platforms

**Recommended:**
- **AWS**: ECS, EKS, or EC2 with Docker
- **Google Cloud**: Cloud Run, GKE, or Compute Engine
- **Azure**: Container Instances, AKS, or VMs
- **DigitalOcean**: App Platform or Droplets
- **Heroku**: Container Registry & Deployment

**For Frontend Only:**
- **Vercel**: Optimized for Next.js
- **Netlify**: Easy deployment with continuous deployment

## 🔍 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Check what's using the port
netstat -tuln | grep 3000

# Kill the process
kill -9 <PID>
```

**2. Docker Container Won't Start**
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild without cache
docker-compose build --no-cache

# Check disk space
df -h
```

**3. Database Connection Issues**
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

**4. RabbitMQ Connection Issues**
```bash
# Check RabbitMQ is running
docker-compose ps rabbitmq

# Check RabbitMQ logs
docker-compose logs rabbitmq

# Access management UI
# http://localhost:15672
```

**5. Build Failures**
```bash
# Clean Docker cache
docker builder prune -f

# Remove all containers
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
```

**6. Permission Issues (Linux)**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -aG docker $USER
```

### Getting Help

- Check the [Docker Deployment Guide](DOCKER_DEPLOYMENT.md)
- Review application logs: `docker-compose logs -f`
- Check GitHub Issues for known problems
- Consult framework documentation:
  - [Next.js Documentation](https://nextjs.org/docs)
  - [NestJS Documentation](https://docs.nestjs.com)
  - [Docker Documentation](https://docs.docker.com)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Write tests for your changes**
5. **Ensure all tests pass**: `npm run test`
6. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Style

- Follow existing code style
- Use meaningful variable and function names
- Write descriptive commit messages
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NestJS](https://nestjs.com/) - Node.js framework
- [MongoDB](https://www.mongodb.com/) - Database
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker
- [Docker](https://www.docker.com/) - Containerization
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

---

**Built with ❤️ using modern web technologies**
