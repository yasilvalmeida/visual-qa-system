# 🎯 Visual QA System (Canvas Inspector)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.5-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CircleCI](https://img.shields.io/badge/CircleCI-Build%20Status-blue.svg)](https://circleci.com/)

> A comprehensive admin panel for visualizing and reviewing annotations from image datasets with advanced canvas manipulation capabilities.

## 🌟 Features

### 🖼️ **Image Management**

- **Drag & Drop Upload**: Intuitive file upload with progress tracking
- **Image Processing**: Automatic metadata extraction and thumbnail generation
- **Batch Operations**: Upload multiple images simultaneously
- **Search & Filter**: Advanced filtering by name, uploader, and annotation status

### 🎨 **Canvas Inspector**

- **Interactive Canvas**: Fabric.js powered image manipulation
- **Zoom & Pan**: Smooth zoom (10% - 300%) and pan operations
- **Rotation**: 90-degree rotation controls
- **Real-time Editing**: Edit annotations directly on canvas
- **Multi-format Support**: JPEG, PNG, GIF, BMP, WebP

### 📝 **Annotation System**

- **Multiple Types**: Bounding boxes, polygons, and points
- **Confidence Scoring**: Color-coded confidence levels (0-100%)
- **Bulk Operations**: Mass update annotations
- **Review Workflow**: Mark annotations as reviewed with notes
- **Export Options**: Include/exclude annotations in exports

### 📊 **Analytics Dashboard**

- **Real-time Stats**: Image and annotation statistics
- **Progress Tracking**: Review completion rates
- **Activity Logs**: User action tracking
- **Performance Metrics**: Upload and processing statistics

### 🔐 **Security & Access**

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, Reviewer, and Annotator roles
- **User Management**: Complete user administration
- **Event Logging**: Comprehensive audit trail

### 🚀 **Export Capabilities**

- **PNG Export**: High-quality image export with annotations
- **PDF Export**: Multi-page PDF generation
- **Customizable**: Include metadata and annotations
- **Batch Export**: Export multiple images at once

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  NestJS Backend │    │  PostgreSQL DB  │
│                 │    │                 │    │                 │
│ • Material UI   │◄──►│ • REST API      │◄──►│ • User Data     │
│ • Fabric.js     │    │ • JWT Auth      │    │ • Images        │
│ • React Query   │    │ • File Upload   │    │ • Annotations   │
│ • Canvas Tools  │    │ • Export Engine │    │ • Event Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Material UI** - Professional component library
- **Fabric.js** - Advanced canvas manipulation
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Navigation and routing

### Backend

- **NestJS** - Scalable Node.js framework
- **TypeScript** - Type-safe backend development
- **TypeORM** - Database ORM
- **PostgreSQL** - Reliable database
- **JWT** - Authentication and authorization
- **Multer** - File upload handling
- **Sharp** - Image processing
- **PDF-lib** - PDF generation

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **CircleCI** - Continuous integration
- **Nginx** - Production web server

## 📦 Installation

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Yarn** package manager ([Install](https://yarnpkg.com/getting-started/install))
- **Docker** & **Docker Compose** ([Install](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/))

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/visual-qa-system.git
   cd visual-qa-system
   ```

2. **Run the setup script**

   ```bash
   ./setup.sh
   ```

3. **Start the development servers**

   ```bash
   # Terminal 1: Start backend
   cd backend && yarn start:dev

   # Terminal 2: Start frontend
   cd frontend && yarn start
   ```

4. **Access the application**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔧 **Backend API**: http://localhost:3001
   - 📚 **API Documentation**: http://localhost:3001/api/docs

### Manual Setup

If you prefer manual setup:

1. **Start database services**

   ```bash
   docker-compose up -d postgres redis
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend
   yarn install
   cp env.example .env

   # Frontend
   cd ../frontend
   yarn install
   cp env.example .env
   ```

3. **Configure environment variables**

   ```bash
   # Backend (.env)
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=visual_qa_user
   DB_PASSWORD=visual_qa_password
   DB_DATABASE=visual_qa_db
   JWT_SECRET=your-super-secret-jwt-key

   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Start the application**

   ```bash
   # Backend
   cd backend && yarn start:dev

   # Frontend
   cd frontend && yarn start
   ```

## 🚀 Usage

### First Time Setup

1. **Register an account** at http://localhost:3000
2. **Login** with your credentials
3. **Upload images** using the drag & drop interface
4. **View images** in the Image Viewer
5. **Create annotations** using the canvas tools
6. **Export results** in PNG or PDF format

### Key Features Walkthrough

#### 📤 Image Upload

```bash
# Drag & drop images or click to select
# Supported formats: JPEG, PNG, GIF, BMP, WebP
# Maximum file size: 10MB per image
```

#### 🎨 Canvas Operations

- **Zoom**: Use mouse wheel or zoom buttons
- **Pan**: Click and drag to move around
- **Rotate**: Use rotation buttons for 90° increments
- **Select**: Click on annotations to select them

#### 📝 Annotation Tools

- **Bounding Box**: Draw rectangular selections
- **Polygon**: Create custom polygon shapes
- **Point**: Mark specific points of interest
- **Edit**: Modify existing annotations

#### 📊 Dashboard Analytics

- **Total Images**: Count of uploaded images
- **Annotation Progress**: Review completion rates
- **Recent Activity**: Latest user actions
- **Performance Metrics**: Upload and processing stats

## 🔧 Configuration

### Environment Variables

#### Backend Configuration

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=visual_qa_user
DB_PASSWORD=visual_qa_password
DB_DATABASE=visual_qa_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

#### Frontend Configuration

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=Visual QA System
REACT_APP_VERSION=1.0.0
```

### Database Schema

The system uses PostgreSQL with the following main tables:

- `users` - User accounts and roles
- `images` - Image metadata and file information
- `annotations` - Annotation data and coordinates
- `event_logs` - User activity tracking

## 🧪 Testing

### Backend Tests

```bash
cd backend
yarn test              # Run all tests
yarn test:watch        # Run tests in watch mode
yarn test:cov          # Run tests with coverage
yarn test:e2e          # Run end-to-end tests
```

### Frontend Tests

```bash
cd frontend
yarn test              # Run all tests
yarn test:watch        # Run tests in watch mode
yarn test:coverage     # Run tests with coverage
```

## 🚀 Deployment

### Docker Deployment

1. **Build images**

   ```bash
   docker-compose build
   ```

2. **Start services**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Production Deployment

1. **Set production environment variables**
2. **Build production images**

   ```bash
   docker build -t visual-qa-backend:latest ./backend
   docker build -t visual-qa-frontend:latest ./frontend
   ```

3. **Deploy to your preferred platform**
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

## 📚 API Documentation

The API documentation is automatically generated using Swagger and available at:

- **Development**: http://localhost:3001/api/docs
- **Production**: https://your-domain.com/api/docs

### Key Endpoints

```bash
# Authentication
POST /api/auth/login
POST /api/auth/register

# Images
GET    /api/images
POST   /api/images
GET    /api/images/:id
PATCH  /api/images/:id
DELETE /api/images/:id

# Annotations
GET    /api/annotations
POST   /api/annotations
GET    /api/annotations/:id
PATCH  /api/annotations/:id
DELETE /api/annotations/:id

# Export
POST /api/export/:imageId

# Users
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id

# Events
GET /api/events
GET /api/events/stats
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- 📖 **Documentation**: Check the API docs at `/api/docs`
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/visual-qa-system/issues)
- 💬 **Discussions**: Join the conversation on [GitHub Discussions](https://github.com/yourusername/visual-qa-system/discussions)
- 📧 **Email**: Contact us at support@visual-qa-system.com

### Common Issues

#### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart the database
docker-compose restart postgres
```

#### File Upload Issues

```bash
# Check upload directory permissions
chmod 755 backend/uploads/images

# Verify file size limits
# Check MAX_FILE_SIZE in .env
```

#### Canvas Performance Issues

```bash
# Reduce image quality for better performance
# Use smaller images for testing
# Check browser memory usage
```

## 🙏 Acknowledgments

- **Fabric.js** - Canvas manipulation library
- **Material UI** - React component library
- **NestJS** - Progressive Node.js framework
- **TypeORM** - Database ORM
- **React Query** - Server state management

## 📈 Roadmap

### Upcoming Features

- [ ] **Real-time Collaboration** - Multi-user editing
- [ ] **Advanced Drawing Tools** - Freehand drawing, text annotations
- [ ] **AI Integration** - Automatic annotation suggestions
- [ ] **Cloud Storage** - AWS S3 integration
- [ ] **Mobile App** - React Native companion app
- [ ] **Video Support** - Video annotation capabilities
- [ ] **Advanced Analytics** - Machine learning insights
- [ ] **Plugin System** - Extensible architecture

### Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced canvas tools and export options
- **v1.2.0** - User management and role-based access
- **v1.3.0** - Advanced filtering and search capabilities

---

<div align="center">

**Made with ❤️ by the Visual QA System Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/visual-qa-system?style=social)](https://github.com/yourusername/visual-qa-system/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/visual-qa-system?style=social)](https://github.com/yourusername/visual-qa-system/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/visual-qa-system)](https://github.com/yourusername/visual-qa-system/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/visual-qa-system)](https://github.com/yourusername/visual-qa-system/pulls)

</div>
