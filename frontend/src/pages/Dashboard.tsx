import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Image,
  Label,
  People,
  TrendingUp,
  CheckCircle,
  Pending,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const Dashboard: React.FC = () => {
  const { data: imageStats, isLoading: imageStatsLoading } = useQuery({
    queryKey: ['imageStats'],
    queryFn: apiService.getImageStats,
  });

  const { data: annotationStats, isLoading: annotationStatsLoading } = useQuery({
    queryKey: ['annotationStats'],
    queryFn: apiService.getAnnotationStats,
  });

  const { data: eventStats, isLoading: eventStatsLoading } = useQuery({
    queryKey: ['eventStats'],
    queryFn: apiService.getEventStats,
  });

  const isLoading = imageStatsLoading || annotationStatsLoading || eventStatsLoading;

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Images',
      value: imageStats?.totalImages || 0,
      icon: <Image color="primary" />,
      color: '#1976d2',
    },
    {
      title: 'Images with Annotations',
      value: imageStats?.imagesWithAnnotations || 0,
      icon: <Label color="secondary" />,
      color: '#dc004e',
    },
    {
      title: 'Total Annotations',
      value: annotationStats?.totalAnnotations || 0,
      icon: <CheckCircle color="success" />,
      color: '#2e7d32',
    },
    {
      title: 'Reviewed Annotations',
      value: annotationStats?.reviewedAnnotations || 0,
      icon: <TrendingUp color="info" />,
      color: '#0288d1',
    },
  ];

  const reviewRate = annotationStats?.reviewRate || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Review Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Annotation Review Progress
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h4" component="div" sx={{ mr: 2 }}>
                {reviewRate.toFixed(1)}%
              </Typography>
              <Chip
                label={reviewRate >= 80 ? 'Excellent' : reviewRate >= 60 ? 'Good' : 'Needs Attention'}
                color={reviewRate >= 80 ? 'success' : reviewRate >= 60 ? 'warning' : 'error'}
                size="small"
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={reviewRate}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2" color="textSecondary">
                Reviewed: {annotationStats?.reviewedAnnotations || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pending: {(annotationStats?.totalAnnotations || 0) - (annotationStats?.reviewedAnnotations || 0)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {eventStats?.recentActivity?.slice(0, 5).map((event: any, index: number) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mr: 2,
                  }}
                />
                <Box flex={1}>
                  <Typography variant="body2">
                    {event.user?.name} {event.action.toLowerCase()} {event.resourceType.toLowerCase()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(event.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Annotation Type Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Annotation Types
            </Typography>
            {annotationStats?.typeStats?.map((type: any, index: number) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  {type.type}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(type.count / (annotationStats?.totalAnnotations || 1)) * 100}
                  sx={{ flex: 1, mx: 2, height: 6, borderRadius: 3 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {type.count}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Top Labels */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Labels
            </Typography>
            {annotationStats?.labelStats?.slice(0, 5).map((label: any, index: number) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  {label.label}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(label.count / (annotationStats?.totalAnnotations || 1)) * 100}
                  sx={{ flex: 1, mx: 2, height: 6, borderRadius: 3 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {label.count}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 