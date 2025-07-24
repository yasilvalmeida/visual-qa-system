import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const AnnotationEditor: React.FC = () => {
  const { imageId } = useParams();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Annotation Editor
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Annotation editor for image {imageId} - Advanced canvas editing features coming soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AnnotationEditor; 