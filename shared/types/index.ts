// Image and Annotation Types
export interface Image {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
  uploadedAt: Date;
  updatedAt: Date;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  imageId: string;
  type: 'boundingBox' | 'polygon' | 'point';
  label: string;
  confidence: number;
  coordinates: Coordinate[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Canvas and UI Types
export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  selectedAnnotationId?: string;
  isDrawing: boolean;
  drawingMode: 'boundingBox' | 'polygon' | 'point' | 'select';
}

export interface FilterOptions {
  labels?: string[];
  confidenceMin?: number;
  confidenceMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
  annotationTypes?: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Export Types
export interface ExportOptions {
  format: 'png' | 'pdf';
  includeAnnotations: boolean;
  includeMetadata: boolean;
  quality?: number;
  scale?: number;
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'annotator';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Event Logging Types
export interface EventLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// AWS Integration Types
export interface S3Config {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface LambdaConfig {
  functionName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}
