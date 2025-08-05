# Pixisphere Marketplace

A comprehensive marketplace platform connecting clients with photography service providers, built with modern web technologies.

## Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Role-based Dashboards**: Separate dashboards for clients, partners (photographers), and administrators
- **Service Marketplace**: Browse and connect with photography service providers
- **Inquiry System**: Clients can submit inquiries and partners can respond to leads
- **Portfolio Management**: Partners can showcase their work with a portfolio gallery
- **Admin Panel**: Comprehensive admin dashboard for managing users, reviews, and content

## Technology Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Zustand for state management
- TanStack React Query for data fetching
- React Router DOM for navigation
- React Hook Form for form handling

### Backend
- Node.js with Express.js
- PostgreSQL database with Drizzle ORM
- JWT for authentication
- Cloudinary for image uploads
- Resend for email services

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pixisphere-marketplace
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/pixisphere_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend Configuration (for OTP emails)
RESEND_API_KEY=your_resend_api_key

# Mock Services (set to false for production)
MOCK_OTP_ENABLED=true
MOCK_FILE_UPLOAD=true
```

### 3. Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE pixisphere_db;
   ```

2. Run database migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your backend URL:

```env
VITE_API_URL=http://localhost:3000/api
```

## Running the Application

### Start the Backend Server

From the `backend` directory:

```bash
npm run dev
```

The backend server will start on `http://localhost:3000`.

### Start the Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The frontend development server will start on `http://localhost:3001`.

## Testing

### Backend Tests

Run backend tests:

```bash
cd backend
npm test
```

### Frontend Tests

Run frontend tests:

```bash
cd frontend
npm test
```

## API Documentation

When the backend server is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api-docs
```

## Deployment

For deployment instructions on Renderer (backend) and Vercel (frontend), please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Project Structure

```
pixisphere-marketplace/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── DEPLOYMENT.md
├── README.md
└── render.yaml
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact the development team.
