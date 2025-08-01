import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Storage as StorageIcon,
  Cached as CachedIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useCache } from '../context/CacheContext';

const CacheDebugPanel = () => {
  const cache = useCache();
  
  const getCacheKeys = () => {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('cache_')) {
        keys.push(key.replace('cache_', ''));
      }
    }
    return keys;
  };

  const formatCacheData = (key) => {
    const info = cache.getCacheInfo(key);
    const data = cache.getCachedData(key);
    
    return {
      key,
      hasData: info.hasData,
      isExpired: info.isExpired,
      age: Math.floor(info.age / 1000), // seconds
      dataLength: Array.isArray(data) ? data.length : typeof data === 'object' ? Object.keys(data || {}).length : 0,
      timestamp: info.timestamp ? new Date(info.timestamp).toLocaleTimeString() : null
    };
  };

  const cacheKeys = getCacheKeys();
  const cacheData = cacheKeys.map(formatCacheData);

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: 'rgba(177, 83, 36, 0.05)',
          border: '1px solid rgba(177, 83, 36, 0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CachedIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Hind Siliguri, sans-serif', 
              fontWeight: 'bold',
              color: 'primary.main' 
            }}
          >
            Cache Debug Panel
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total cached items: {cacheKeys.length}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Refresh Page
        </Button>
        
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            cache.clearAllCache();
            window.location.reload();
          }}
        >
          Clear All Cache
        </Button>
      </Paper>

      {cacheData.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <StorageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No cached data found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Navigate to admin pages to populate cache
            </Typography>
          </CardContent>
        </Card>
      ) : (
        cacheData.map((item, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Hind Siliguri, sans-serif',
                    fontWeight: 'bold' 
                  }}
                >
                  {item.key}
                </Typography>
                
                <Chip
                  label={item.isExpired ? 'Expired' : 'Fresh'}
                  color={item.isExpired ? 'error' : 'success'}
                  size="small"
                />
                
                <Chip
                  label={`${item.dataLength} items`}
                  variant="outlined"
                  size="small"
                />
                
                <Chip
                  label={`${item.age}s ago`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Has Data:</strong> {item.hasData ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Is Expired:</strong> {item.isExpired ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Data Items:</strong> {item.dataLength}
                </Typography>
                <Typography variant="body2">
                  <strong>Cached At:</strong> {item.timestamp || 'Unknown'}
                </Typography>
                <Typography variant="body2">
                  <strong>Age:</strong> {item.age} seconds
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default CacheDebugPanel;
