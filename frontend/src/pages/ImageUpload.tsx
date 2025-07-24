import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  CheckCircle,
  Error,
  Upload,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiService } from '@/services/api';

interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const ImageUpload: React.FC = () => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: ({ file, description }: { file: File; description?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (description) {
        formData.append('description', description);
      }
      return apiService.uploadImage(formData);
    },
    onSuccess: (data, variables) => {
      setUploadFiles(prev => 
        prev.map(f => 
          f.file === variables.file 
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      );
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success(`${variables.file.name} uploaded successfully`);
    },
    onError: (error, variables) => {
      setUploadFiles(prev => 
        prev.map(f => 
          f.file === variables.file 
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        )
      );
      toast.error(`Failed to upload ${variables.file.name}`);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
    },
    multiple: true,
  });

  const handleUpload = async (uploadFile: UploadFile) => {
    if (uploadFile.status === 'uploading') return;

    setUploadFiles(prev => 
      prev.map(f => 
        f.file === uploadFile.file 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      )
    );

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadFiles(prev => 
        prev.map(f => 
          f.file === uploadFile.file && f.status === 'uploading'
            ? { ...f, progress: Math.min(f.progress + 10, 90) }
            : f
        )
      );
    }, 200);

    try {
      await uploadMutation.mutateAsync({
        file: uploadFile.file,
        description: descriptions[uploadFile.file.name],
      });
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleUploadAll = async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending');
    
    for (const uploadFile of pendingFiles) {
      await handleUpload(uploadFile);
    }
  };

  const handleRemove = (file: File) => {
    setUploadFiles(prev => prev.filter(f => f.file !== file));
    setDescriptions(prev => {
      const newDescriptions = { ...prev };
      delete newDescriptions[file.name];
      return newDescriptions;
    });
  };

  const handleDescriptionChange = (fileName: string, description: string) => {
    setDescriptions(prev => ({
      ...prev,
      [fileName]: description,
    }));
  };

  const pendingCount = uploadFiles.filter(f => f.status === 'pending').length;
  const uploadingCount = uploadFiles.filter(f => f.status === 'uploading').length;
  const successCount = uploadFiles.filter(f => f.status === 'success').length;
  const errorCount = uploadFiles.filter(f => f.status === 'error').length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Images
      </Typography>

      {/* Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          mb: 3,
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to select files
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Supported formats: JPEG, PNG, GIF, BMP, WebP (max 10MB each)
        </Typography>
      </Paper>

      {/* Upload Stats */}
      {uploadFiles.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Chip label={`Total: ${uploadFiles.length}`} />
            </Grid>
            <Grid item>
              <Chip label={`Pending: ${pendingCount}`} color="default" />
            </Grid>
            <Grid item>
              <Chip label={`Uploading: ${uploadingCount}`} color="info" />
            </Grid>
            <Grid item>
              <Chip label={`Success: ${successCount}`} color="success" />
            </Grid>
            <Grid item>
              <Chip label={`Error: ${errorCount}`} color="error" />
            </Grid>
            <Grid item xs />
            <Grid item>
              <Button
                variant="contained"
                onClick={handleUploadAll}
                disabled={pendingCount === 0 || uploadingCount > 0}
                startIcon={<Upload />}
              >
                Upload All ({pendingCount})
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* File List */}
      <Grid container spacing={2}>
        {uploadFiles.map((uploadFile) => (
          <Grid item xs={12} sm={6} md={4} key={uploadFile.file.name}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={uploadFile.preview}
                alt={uploadFile.file.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {uploadFile.file.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(uploadFile.file)}
                    disabled={uploadFile.status === 'uploading'}
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Typography variant="caption" color="textSecondary" display="block" mb={1}>
                  {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Description (optional)"
                  value={descriptions[uploadFile.file.name] || ''}
                  onChange={(e) => handleDescriptionChange(uploadFile.file.name, e.target.value)}
                  disabled={uploadFile.status === 'uploading'}
                  sx={{ mb: 1 }}
                />

                {uploadFile.status === 'uploading' && (
                  <Box mb={1}>
                    <LinearProgress variant="determinate" value={uploadFile.progress} />
                    <Typography variant="caption" color="textSecondary">
                      {uploadFile.progress}%
                    </Typography>
                  </Box>
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    size="small"
                    label={uploadFile.status}
                    color={
                      uploadFile.status === 'success' ? 'success' :
                      uploadFile.status === 'error' ? 'error' :
                      uploadFile.status === 'uploading' ? 'info' : 'default'
                    }
                    icon={
                      uploadFile.status === 'success' ? <CheckCircle /> :
                      uploadFile.status === 'error' ? <Error /> : undefined
                    }
                  />
                  
                  {uploadFile.status === 'pending' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleUpload(uploadFile)}
                      disabled={uploadingCount > 0}
                    >
                      Upload
                    </Button>
                  )}
                </Box>

                {uploadFile.error && (
                  <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                    {uploadFile.error}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageUpload; 