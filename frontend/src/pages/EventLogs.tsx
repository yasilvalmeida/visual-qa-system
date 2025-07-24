import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const EventLogs: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Event Logs
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Event logs and activity tracking - Coming soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EventLogs; 