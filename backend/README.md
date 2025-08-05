# Pixisphere Marketplace Backend

A comprehensive Node.js backend API for an AI-powered photography service marketplace that connects clients with verified photographers and studios across India.

## 🚀 Features

### Core Functionality
- **Role-Based Authentication**: JWT-based auth with three distinct roles (client, partner, admin)
- **Partner Onboarding**: Complete verification workflow with document submission
- **Smart Lead Management**: Intelligent inquiry matching and distribution system
- **Portfolio Management**: Full CRUD operations for partner portfolios
- **Admin Dashboard**: Comprehensive moderation and management tools

### Security & Performance
- **Rate Limiting**: Configurable rate limits for different endpoint types
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet.js for security best practices
- **Logging**: Winston-based structured logging
- **Error Handling**: Centralized error handling with detailed logging

### Development Features
- **API Documentation**: Swagger/OpenAPI 3.0 documentation
- **Docker Support**: Complete containerization with Docker Compose
- **Testing**: Jest-based unit and integration tests
- **Database Migrations**: Drizzle ORM with PostgreSQL
- **Mock Services**: Development-friendly mocked OTP and file uploads

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger UI
- **Testing**: Jest + Supertest
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd pixisphere-marketplace
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

### 3. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker-compose up postgres -d

# Generate and run migrations
npm run db:generate
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Full Stack with Docker Compose

```bash
# Start all services (PostgreSQL + Redis + API)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production Build

```bash
# Build Docker image
docker build -t pixisphere-api .

# Run container
docker run -p 3000:3000 --env-file .env pixisphere-api
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/request-otp` - Request OTP (mocked)
- `POST /api/auth/verify-otp` - Verify OTP (mocked)

### Client Endpoints
- `POST /api/inquiry` - Submit service inquiry
- `GET /api/client/inquiries` - Get client's inquiries
- `GET /api/client/inquiries/:id/responses` - Get inquiry responses
- `GET /api/partners` - Browse partners (public)
- `GET /api/partners/:id` - Get partner details (public)

### Partner Endpoints
- `POST /api/partner/profile` - Create/update partner profile
- `GET /api/partner/profile` - Get partner profile
- `GET /api/partner/leads` - Get assigned leads
- `PUT /api/partner/leads/:id/respond` - Respond to lead
- `POST /api/partner/portfolio` - Add portfolio item
- `GET /api/partner/portfolio` - Get portfolio items
- `PUT /api/partner/portfolio/:id` - Update portfolio item
- `DELETE /api/partner/portfolio/:id` - Delete portfolio item

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard KPIs
- `GET /api/admin/verifications` - Pending verifications
- `PUT /api/admin/verify/:id` - Approve/reject partner
- `GET /api/admin/reviews` - Reviews for moderation
- `PUT /api/admin/reviews/:id/moderate` - Moderate review
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/categories` - Manage categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/locations` - Manage locations
- `POST /api/admin/locations` - Create location
- `PUT /api/admin/locations/:id` - Update location
- `DELETE /api/admin/locations/:id` - Delete location
- `PUT /api/admin/partners/:id/promote` - Promote partner as featured

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Database Schema

### Core Tables
- **users**: User accounts with role-based access
- **partner_profiles**: Partner business information and verification status
- **portfolios**: Partner portfolio items with categories
- **inquiries**: Client service requests
- **lead_assignments**: Lead distribution to partners
- **reviews**: Client reviews with moderation support
- **categories**: Service categories management
- **locations**: Geographic locations management

## 🔒 Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "client|partner|admin"
}
```

### Role Permissions
- **Client**: Submit inquiries, browse partners, view responses
- **Partner**: Manage profile/portfolio, respond to leads
- **Admin**: Full system access, verification, moderation

## 🚦 Rate Limiting

- **General**: 100 requests per 15 minutes
- **Auth**: 5 requests per 15 minutes
- **Upload**: 20 requests per hour

## 📊 Logging

Logs are structured using Winston:
- **Development**: Console output with colors
- **Production**: File-based logging (error.log, combined.log)

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/pixisphere_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Mock Services (Development)
MOCK_OTP_ENABLED=true
MOCK_FILE_UPLOAD=true
```

## 🚀 Deployment

### Render/Railway Deployment

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with build command: `npm install && npm run db:push`
4. Start command: `npm start`

### Heroku Deployment

```bash
# Install Heroku CLI and login
heroku create pixisphere-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set DATABASE_URL=your-postgres-url

# Deploy
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Developer**: Node.js, Express, PostgreSQL specialist
- **Database Designer**: Drizzle ORM, PostgreSQL optimization
- **DevOps Engineer**: Docker, deployment, CI/CD

## 📞 Support

For support and questions:
- Email: support@pixisphere.com
- Documentation: `/api-docs`
- Issues: GitHub Issues

---

**Built with ❤️ for the Pixisphere Photography Marketplace**
