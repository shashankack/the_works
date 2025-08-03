import { useEffect, useCallback } from 'react';

/**
 * Custom hook for admin components to listen to global refresh events
 * and automatically refresh their data when the refresh button is clicked
 */
export const useAdminRefresh = (refreshCallback, dependencies = []) => {
  const handleRefresh = useCallback(async (event) => {
    if (refreshCallback && typeof refreshCallback === 'function') {
      try {
        console.log('🔄 Refreshing component data...', event.detail);
        await refreshCallback();
        console.log('✅ Component data refreshed');
      } catch (error) {
        console.error('❌ Error refreshing component data:', error);
      }
    }
  }, [refreshCallback, ...dependencies]);

  useEffect(() => {
    // Listen for the global refresh event
    window.addEventListener('adminRefreshAll', handleRefresh);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('adminRefreshAll', handleRefresh);
    };
  }, [handleRefresh]);

  return { handleRefresh };
};

export default useAdminRefresh;
