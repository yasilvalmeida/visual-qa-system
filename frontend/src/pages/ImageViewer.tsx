import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  PanTool,
  Create,
  Save,
  Download,
  FilterList,
  Search,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { fabric } from 'fabric';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiService } from '@/services/api';
import { Image, Annotation } from '@/shared/types';

const ImageViewer: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    hasAnnotations: '',
    uploadedBy: '',
  });
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'select' | 'boundingBox' | 'polygon' | 'point'>('select');
  const [showAnnotations, setShowAnnotations] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch images
  const { data: imagesData, isLoading } = useQuery({
    queryKey: ['images', page, search, filters],
    queryFn: () => apiService.getImages({ page, limit: 12, ...filters, search }),
  });

  // Fetch annotations for selected image
  const { data: annotations } = useQuery({
    queryKey: ['annotations', selectedImage?.id],
    queryFn: () => selectedImage ? apiService.getAnnotationsByImage(selectedImage.id) : Promise.resolve([]),
    enabled: !!selectedImage,
  });

  // Update annotation mutation
  const updateAnnotationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.updateAnnotation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations'] });
      toast.success('Annotation updated successfully');
    },
    onError: () => {
      toast.error('Failed to update annotation');
    },
  });

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && selectedImage) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#f0f0f0',
      });

      // Load image
      fabric.Image.fromURL(`/uploads/images/${selectedImage.filename}`, (img) => {
        const canvas = fabricCanvas.getElement();
        const scale = Math.min(
          canvas.width / img.width!,
          canvas.height / img.height!
        );

        img.scale(scale);
        img.center();
        fabricCanvas.add(img);
        fabricCanvas.renderAll();

        // Load annotations
        if (annotations && showAnnotations) {
          annotations.forEach((annotation: Annotation) => {
            addAnnotationToCanvas(fabricCanvas, annotation);
          });
        }
      });

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [selectedImage, annotations, showAnnotations]);

  const addAnnotationToCanvas = (fabricCanvas: fabric.Canvas, annotation: Annotation) => {
    let fabricObject: fabric.Object | null = null;

    switch (annotation.type) {
      case 'boundingBox':
        if (annotation.coordinates.length >= 2) {
          const [topLeft, bottomRight] = annotation.coordinates;
          fabricObject = new fabric.Rect({
            left: topLeft.x,
            top: topLeft.y,
            width: bottomRight.x - topLeft.x,
            height: bottomRight.y - topLeft.y,
            fill: 'transparent',
            stroke: getAnnotationColor(annotation.confidence),
            strokeWidth: 2,
            selectable: true,
            data: annotation,
          });
        }
        break;

      case 'polygon':
        if (annotation.coordinates.length >= 3) {
          const points = annotation.coordinates.map(coord => ({ x: coord.x, y: coord.y }));
          fabricObject = new fabric.Polygon(points, {
            fill: 'transparent',
            stroke: getAnnotationColor(annotation.confidence),
            strokeWidth: 2,
            selectable: true,
            data: annotation,
          });
        }
        break;

      case 'point':
        if (annotation.coordinates.length >= 1) {
          const point = annotation.coordinates[0];
          fabricObject = new fabric.Circle({
            left: point.x - 5,
            top: point.y - 5,
            radius: 5,
            fill: getAnnotationColor(annotation.confidence),
            selectable: true,
            data: annotation,
          });
        }
        break;
    }

    if (fabricObject) {
      fabricCanvas.add(fabricObject);
    }
  };

  const getAnnotationColor = (confidence: number) => {
    if (confidence >= 0.8) return '#00ff00';
    if (confidence >= 0.6) return '#ffff00';
    return '#ff0000';
  };

  const handleZoomIn = () => {
    if (canvas && zoom < 3) {
      const newZoom = zoom + 0.1;
      setZoom(newZoom);
      canvas.setZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    if (canvas && zoom > 0.1) {
      const newZoom = zoom - 0.1;
      setZoom(newZoom);
      canvas.setZoom(newZoom);
    }
  };

  const handleRotate = (direction: 'left' | 'right') => {
    if (canvas) {
      const newRotation = direction === 'left' ? rotation - 90 : rotation + 90;
      setRotation(newRotation);
      canvas.setAngle(newRotation);
    }
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleExport = async (format: 'png' | 'pdf') => {
    if (!selectedImage) return;

    try {
      const response = await apiService.exportImage(selectedImage.id, {
        format,
        includeAnnotations: showAnnotations,
        includeMetadata: true,
      });

      const blob = new Blob([response], {
        type: format === 'png' ? 'image/png' : 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${selectedImage.id}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Image exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export image');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Image Viewer
      </Typography>

      <Grid container spacing={3}>
        {/* Filters and Search */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search images..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Has Annotations</InputLabel>
                  <Select
                    value={filters.hasAnnotations}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasAnnotations: e.target.value }))}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Uploaded By</InputLabel>
                  <Select
                    value={filters.uploadedBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, uploadedBy: e.target.value }))}
                  >
                    <MenuItem value="">All Users</MenuItem>
                    {/* Add user options here */}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Image Grid */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Images ({imagesData?.total || 0})
            </Typography>
            <Grid container spacing={2}>
              {imagesData?.data?.map((image: Image) => (
                <Grid item xs={6} key={image.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage?.id === image.id ? 2 : 1,
                      borderColor: selectedImage?.id === image.id ? 'primary.main' : 'divider',
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    <CardMedia
                      component="img"
                      height="120"
                      image={`/uploads/images/${image.filename}`}
                      alt={image.originalName}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="caption" noWrap>
                        {image.originalName}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="textSecondary">
                          {image.annotations?.length || 0} annotations
                        </Typography>
                        <Chip
                          size="small"
                          label={image.isProcessed ? 'Processed' : 'Pending'}
                          color={image.isProcessed ? 'success' : 'warning'}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil((imagesData?.total || 0) / 12)}
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Canvas */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {selectedImage ? selectedImage.originalName : 'Select an image'}
              </Typography>
              <Box>
                <IconButton onClick={() => setShowAnnotations(!showAnnotations)}>
                  {showAnnotations ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                <IconButton onClick={handleZoomOut}>
                  <ZoomOut />
                </IconButton>
                <IconButton onClick={handleZoomIn}>
                  <ZoomIn />
                </IconButton>
                <IconButton onClick={() => handleRotate('left')}>
                  <RotateLeft />
                </IconButton>
                <IconButton onClick={() => handleRotate('right')}>
                  <RotateRight />
                </IconButton>
                <Button
                  variant="outlined"
                  onClick={() => handleExport('png')}
                  disabled={!selectedImage}
                >
                  Export PNG
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleExport('pdf')}
                  disabled={!selectedImage}
                >
                  Export PDF
                </Button>
              </Box>
            </Box>
            
            <Box display="flex" justifyContent="center">
              <canvas
                ref={canvasRef}
                style={{
                  border: '1px solid #ccc',
                  cursor: isDrawing ? 'crosshair' : 'default',
                }}
              />
            </Box>

            {selectedImage && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Size: {selectedImage.width} x {selectedImage.height} | 
                  Annotations: {annotations?.length || 0} |
                  Zoom: {(zoom * 100).toFixed(0)}% |
                  Rotation: {rotation}°
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageViewer; 