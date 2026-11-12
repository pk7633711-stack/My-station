import { useEffect, useState } from 'react';
import { getSimulatedOffline, setSimulatedOffline } from '../utils/offlineStorage';

export function useOnlineStatus() {
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [simulatedOffline, setSimulatedOfflineState] = useState<boolean>(getSimulatedOffline());

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    const next = !simulatedOffline;
    setSimulatedOfflineState(next);
    setSimulatedOffline(next);
  };

  // Effective online status: false if real browser is offline OR if user simulated offline mode
  const effectiveOnline = browserOnline && !simulatedOffline;

  return {
    isOnline: effectiveOnline,
    browserOnline,
    simulatedOffline,
    toggleSimulatedOffline,
  };
}
