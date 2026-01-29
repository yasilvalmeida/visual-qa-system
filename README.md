# Visual QA System (Canvas Inspector)

A comprehensive admin panel for visualizing and reviewing annotations from image datasets. Features interactive canvas manipulation, annotation management, and export capabilities for teams working with labeled image data.

---

## 1. Project Overview

### The Problem

Machine learning teams working with image datasets need tools to review, correct, and manage annotations. Generic image viewers lack annotation overlay capabilities, while specialized tools are often expensive or don't integrate with existing workflows. Teams resort to spreadsheets and separate tools, creating friction in the annotation review process.

### The Solution

This Visual QA System provides an integrated platform for annotation review. Upload images, view existing annotations overlaid on an interactive canvas, make corrections, and export results—all in one application with multi-user support and comprehensive audit logging.

### Why It Matters

- **Accelerate ML workflows**: Review annotations faster with purpose-built tooling
- **Improve data quality**: Catch and correct annotation errors before model training
- **Enable collaboration**: Multiple reviewers work on the same dataset with audit trails
- **Standardize exports**: Consistent output formats for downstream ML pipelines
- **Track progress**: Dashboard shows review completion rates and reviewer activity

---

## 2. Real-World Use Cases

| Application | How This System Helps |
|-------------|------------------------|
| **Object Detection** | Review bounding box annotations for training data quality |
| **Image Segmentation** | Verify polygon annotations for semantic segmentation datasets |
| **Medical Imaging** | QA radiologist annotations on diagnostic images |
| **Autonomous Vehicles** | Review labeled driving scenarios for perception systems |
| **Document Processing** | Validate OCR region annotations for document AI |
| **Retail Analytics** | Verify product detection annotations for inventory systems |

---

## 3. Core Features

| Feature | Business Value |
|---------|----------------|
| **Interactive Canvas** | Fabric.js-powered zoom (10%-300%), pan, and rotation controls |
| **Multi-Format Support** | JPEG, PNG, GIF, BMP, WebP image handling |
| **Annotation Types** | Bounding boxes, polygons, and point annotations |
| **Confidence Scoring** | Color-coded confidence levels (0-100%) for prioritized review |
| **Bulk Operations** | Mass update annotations across multiple images |
| **Review Workflow** | Mark annotations as reviewed with notes and timestamps |
| **Export Options** | PNG and multi-page PDF export with configurable options |
| **User Management** | Role-based access (Admin, Reviewer, Annotator) with JWT auth |

---

## 4. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Visual QA System                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │  React Frontend  │    │  NestJS Backend  │    │  PostgreSQL   │  │
│  │                  │◄──►│                  │◄──►│               │  │
│  │ • Material UI    │    │ • REST API       │    │ • User Data   │  │
│  │ • Fabric.js      │    │ • JWT Auth       │    │ • Images      │  │
│  │ • React Query    │    │ • File Upload    │    │ • Annotations │  │
│  │ • Canvas Tools   │    │ • Export Engine  │    │ • Event Logs  │  │
│  └──────────────────┘    └──────────────────┘    └───────────────┘  │
│           │                       │                       │          │
│           └───────────────────────┼───────────────────────┘          │
│                                   │                                  │
│                    ┌──────────────▼──────────────┐                  │
│                    │      File Storage           │                  │
│                    │  (Local or Cloud)           │                  │
│                    └─────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, TypeScript | Modern component-based UI |
| **UI Framework** | Material UI | Professional design system |
| **Canvas** | Fabric.js | Interactive image manipulation |
| **State Management** | React Query, Zustand | Server and client state |
| **Backend** | NestJS, TypeScript | Scalable API framework |
| **Database** | PostgreSQL, TypeORM | Relational data storage |
| **Authentication** | JWT, Passport | Secure user authentication |
| **File Handling** | Multer, Sharp | Upload and image processing |
| **PDF Generation** | PDF-lib | Export to PDF format |
| **Infrastructure** | Docker, Nginx | Containerization and serving |

---

## 6. How the System Works

### Image Upload Flow

```
Drag & Drop → Validate → Process → Store → Display
```

1. **Upload**: User drags images or clicks to select files
2. **Validate**: Check file type, size limits (10MB max)
3. **Process**: Generate thumbnails and extract metadata
4. **Store**: Save to file storage with database record
5. **Display**: Show in image grid with upload progress

### Annotation Review Flow

```
Select Image → Load Canvas → Display Annotations → Review → Save
```

1. **Select**: Click image from gallery to open in Canvas Inspector
2. **Load**: Fabric.js canvas initialized with image
3. **Overlay**: Existing annotations rendered as shapes
4. **Review**: Zoom, pan, select annotations for review
5. **Update**: Mark as reviewed, add notes, adjust if needed
6. **Save**: Changes persisted with audit trail

### Export Flow

```
Select Images → Configure Options → Generate Export → Download
```

1. **Select**: Choose images for export (single or batch)
2. **Configure**: Set format (PNG/PDF), include annotations toggle
3. **Generate**: Server renders images with annotation overlays
4. **Package**: Create downloadable file(s)
5. **Download**: User receives export package

---

## 7. Setup & Run

### Prerequisites

- Node.js 18+
- Yarn package manager
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/visual-qa-system.git
cd visual-qa-system

# Run setup script
./setup.sh

# Or manual setup:
docker-compose up -d postgres redis

# Install backend
cd backend && yarn install && cp env.example .env

# Install frontend
cd ../frontend && yarn install && cp env.example .env

# Start development servers
cd backend && yarn start:dev    # Terminal 1
cd frontend && yarn start       # Terminal 2
```

### Environment Configuration

```bash
# Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=visual_qa_user
DB_PASSWORD=visual_qa_password
DB_DATABASE=visual_qa_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NAME=Visual QA System
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Web application |
| **Backend API** | http://localhost:3001 | REST API endpoints |
| **API Documentation** | http://localhost:3001/api/docs | Swagger UI |

---

## 8. API & Usage

### Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123", "name": "John Doe"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123"}'
```

### Image Management

```bash
# Upload image
curl -X POST http://localhost:3001/api/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@image.jpg"

# List images
curl http://localhost:3001/api/images \
  -H "Authorization: Bearer $TOKEN"

# Get image with annotations
curl http://localhost:3001/api/images/123 \
  -H "Authorization: Bearer $TOKEN"
```

### Annotation Operations

```bash
# Create annotation
curl -X POST http://localhost:3001/api/annotations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageId": 123,
    "type": "bbox",
    "coordinates": {"x": 100, "y": 100, "width": 200, "height": 150},
    "label": "car",
    "confidence": 0.95
  }'

# Update annotation (mark reviewed)
curl -X PATCH http://localhost:3001/api/annotations/456 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reviewed": true, "notes": "Verified correct"}'
```

### Export

```bash
# Export image with annotations as PNG
curl -X POST http://localhost:3001/api/export/123 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"format": "png", "includeAnnotations": true}' \
  --output exported.png
```

---

## 9. Scalability & Production Readiness

### Current Architecture Strengths

| Aspect | Implementation |
|--------|----------------|
| **Type Safety** | Full TypeScript implementation frontend and backend |
| **Authentication** | JWT with role-based access control |
| **Audit Trail** | Comprehensive event logging for all actions |
| **Container Ready** | Docker Compose for consistent deployment |
| **API Documentation** | Swagger UI for developer onboarding |

### Production Enhancements (Recommended)

| Enhancement | Purpose |
|-------------|---------|
| **Cloud Storage** | AWS S3 or GCS for scalable image storage |
| **CDN Integration** | CloudFront/CloudFlare for image delivery |
| **Redis Caching** | Cache frequently accessed images and metadata |
| **Background Jobs** | Bull queues for async export generation |
| **Monitoring** | Prometheus/Grafana for system observability |
| **SSO Integration** | SAML/OIDC for enterprise authentication |

---

## 10. Screenshots & Demo

### Suggested Visuals

- [ ] Image gallery with upload interface
- [ ] Canvas Inspector with annotation overlays
- [ ] Annotation properties panel
- [ ] Review workflow with approval buttons
- [ ] Export configuration dialog
- [ ] Dashboard with review progress metrics

---

## Project Structure

```
visual-qa-system/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── store/          # State management
│   └── package.json
├── backend/                  # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── images/         # Image management
│   │   ├── annotations/    # Annotation CRUD
│   │   ├── export/         # Export generation
│   │   ├── users/          # User management
│   │   └── events/         # Audit logging
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Testing

```bash
# Backend tests
cd backend
yarn test              # Unit tests
yarn test:e2e          # E2E tests
yarn test:cov          # Coverage report

# Frontend tests
cd frontend
yarn test              # Component tests
yarn test:coverage     # Coverage report
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

*Streamlined annotation review for machine learning teams.*
