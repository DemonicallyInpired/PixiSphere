# Pixisphere Frontend

A modern, responsive React frontend for the Pixisphere AI-powered photography marketplace. Built with React, Vite, Tailwind CSS, and modern web technologies.

## 🚀 Features

### Core Features
- **Modern React SPA** - Built with React 18 and Vite for optimal performance
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Role-based Authentication** - Support for Client, Partner, and Admin roles
- **Real-time State Management** - Zustand for efficient state management
- **API Integration** - Seamless integration with backend REST APIs
- **Form Handling** - React Hook Form with validation
- **Toast Notifications** - User-friendly feedback with React Hot Toast

### User Roles & Features

#### 🎯 Client Features
- Browse verified photographers by location and specialization
- Submit detailed photography inquiries
- View and manage inquiry status and responses
- Access personalized dashboard with inquiry tracking
- Filter photographers by category, location, and ratings

#### 📸 Partner (Photographer) Features
- Complete business profile setup and verification
- Portfolio management with image uploads
- Lead management and client inquiry responses
- Dashboard with business metrics and analytics
- Profile verification status tracking

#### 🛡️ Admin Features
- Comprehensive admin dashboard with KPIs
- Partner verification and approval workflow
- Review moderation and content management
- Category and location management
- Platform health monitoring and analytics

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack React Query (React Query v5)
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite with HMR
- **Linting**: ESLint with React plugins

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── layouts/      # Layout components
│   │   └── ui/           # UI components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── auth/         # Authentication pages
│   │   ├── client/       # Client pages
│   │   ├── partner/      # Partner pages
│   │   └── public/       # Public pages
│   ├── services/         # API services and HTTP client
│   ├── stores/           # Zustand stores
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles and Tailwind
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pixisphere-marketplace/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run test suite
- `npm run test:ui` - Run tests with UI

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and branding
- **Secondary**: Purple accents for highlights
- **Accent**: Warm orange for call-to-actions
- **Neutral**: Gray scale for text and backgrounds

### Component Library
- **Buttons**: Primary, secondary, outline variants with sizes
- **Forms**: Consistent input styling with validation states
- **Cards**: Shadow variants for content containers
- **Badges**: Status indicators with color coding
- **Loading**: Spinner components with size variants

### Typography
- **Headings**: Inter font family with weight variations
- **Body**: Optimized for readability with proper line heights
- **Code**: Monospace font for technical content

## 🔐 Authentication Flow

1. **Registration**: Multi-step signup with role selection
2. **Email Verification**: OTP-based verification (mocked in demo)
3. **Login**: JWT-based authentication with persistence
4. **Role-based Routing**: Automatic redirection based on user role
5. **Protected Routes**: Route guards for authenticated content

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet**: Responsive layouts for medium screens
- **Desktop**: Full-featured desktop experience
- **Touch-friendly**: Appropriate touch targets and gestures

## 🔌 API Integration

### HTTP Client Configuration
- **Base URL**: Configurable API endpoint
- **Request Interceptors**: Automatic JWT token attachment
- **Response Interceptors**: Error handling and token refresh
- **Error Handling**: Centralized error management

### API Services
- **Auth Service**: Login, signup, OTP verification
- **Client Service**: Inquiries, partner browsing
- **Partner Service**: Profile, portfolio, leads management
- **Admin Service**: Verification, moderation, analytics
- **File Service**: Image uploads (mocked)

## 🧪 Testing

### Test Setup
- **Framework**: Vitest for fast unit testing
- **Testing Library**: React Testing Library for component testing
- **User Events**: Comprehensive user interaction testing
- **Mocking**: API and service mocking for isolated tests

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options

#### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

#### Vercel
1. Import project to Vercel
2. Configure build settings automatically detected
3. Set environment variables in dashboard

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload `dist` folder to your web server
3. Configure server for SPA routing

### Environment Variables
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🔧 Configuration

### Vite Configuration
- **Plugins**: React plugin with Fast Refresh
- **Alias**: Path aliases for clean imports
- **Proxy**: Development API proxy configuration
- **Build**: Optimized production builds

### Tailwind Configuration
- **Custom Colors**: Brand-specific color palette
- **Typography**: Custom font configurations
- **Animations**: Smooth transitions and effects
- **Utilities**: Custom utility classes

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify backend is running on correct port
   - Check CORS configuration
   - Validate environment variables

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all imports are correct

3. **Styling Issues**
   - Ensure Tailwind is properly configured
   - Check PostCSS configuration
   - Verify custom CSS syntax

### Development Tips
- Use React DevTools for component debugging
- Use TanStack Query DevTools for API debugging
- Enable verbose logging in development mode

## 📈 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: Efficient API response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety
- Write tests for new features
- Follow the established code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- TanStack team for React Query
- Vite team for the fast build tool
- All open-source contributors

---

**Pixisphere Frontend** - Connecting clients with professional photographers through modern web technology.
