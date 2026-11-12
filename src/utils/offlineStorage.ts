import { Train, Station, PNRDetails } from '../types/railway';
import { ALL_TRAINS, ALL_STATIONS, SAMPLE_PNRS } from '../data/railwayData';

const OFFLINE_TRAINS_KEY = 'mystation_offline_trains';
const OFFLINE_STATIONS_KEY = 'mystation_offline_stations';
const OFFLINE_PNRS_KEY = 'mystation_offline_pnrs';
const OFFLINE_LAST_SYNC_KEY = 'mystation_offline_last_sync';
const SIMULATED_OFFLINE_KEY = 'mystation_simulated_offline';

export interface StorageStats {
  trainCount: number;
  stationCount: number;
  pnrCount: number;
  totalEstimatedKb: number;
  lastSyncTime: string;
}

// Helper to seed initial offline package so user has a working offline bundle right away
export const initializeOfflineDefaults = () => {
  try {
    if (!localStorage.getItem(OFFLINE_TRAINS_KEY)) {
      // Seed popular trains (Vande Bharat, Rajdhani, Tejas, Sampoorna Kranti)
      const initialTrains = ALL_TRAINS.slice(0, 4);
      localStorage.setItem(OFFLINE_TRAINS_KEY, JSON.stringify(initialTrains));
    }
    if (!localStorage.getItem(OFFLINE_STATIONS_KEY)) {
      // Seed major hub stations (NDLS, CSMT, HWH, BSB, CNB, PNBE)
      const initialStations = ALL_STATIONS.slice(0, 6);
      localStorage.setItem(OFFLINE_STATIONS_KEY, JSON.stringify(initialStations));
    }
    if (!localStorage.getItem(OFFLINE_PNRS_KEY)) {
      // Seed sample PNRs for offline travel demo
      localStorage.setItem(OFFLINE_PNRS_KEY, JSON.stringify(SAMPLE_PNRS.slice(0, 2)));
    }
    if (!localStorage.getItem(OFFLINE_LAST_SYNC_KEY)) {
      localStorage.setItem(OFFLINE_LAST_SYNC_KEY, new Date().toLocaleString());
    }
  } catch (e) {
    console.warn('LocalStorage error initializing offline defaults:', e);
  }
};

// Simulated Offline Toggle
export const getSimulatedOffline = (): boolean => {
  try {
    return localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setSimulatedOffline = (simulated: boolean) => {
  try {
    localStorage.setItem(SIMULATED_OFFLINE_KEY, String(simulated));
  } catch {}
};

// --- TRAINS ---
export const getDownloadedTrains = (): Train[] => {
  try {
    const data = localStorage.getItem(OFFLINE_TRAINS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isTrainDownloaded = (trainNumber: string): boolean => {
  const trains = getDownloadedTrains();
  return trains.some(t => t.number === trainNumber);
};

export const downloadTrain = (train: Train) => {
  const current = getDownloadedTrains();
  const filtered = current.filter(t => t.number !== train.number);
  localStorage.setItem(OFFLINE_TRAINS_KEY, JSON.stringify([...filtered, train]));
  updateSyncTime();
};

export const removeDownloadedTrain = (trainNumber: string) => {
  const current = getDownloadedTrains();
  const next = current.filter(t => t.number !== trainNumber);
  localStorage.setItem(OFFLINE_TRAINS_KEY, JSON.stringify(next));
};

export const downloadAllPopularTrains = () => {
  localStorage.setItem(OFFLINE_TRAINS_KEY, JSON.stringify(ALL_TRAINS));
  updateSyncTime();
};

// --- STATIONS ---
export const getDownloadedStations = (): Station[] => {
  try {
    const data = localStorage.getItem(OFFLINE_STATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isStationDownloaded = (stationCode: string): boolean => {
  const stations = getDownloadedStations();
  return stations.some(s => s.code === stationCode);
};

export const downloadStation = (station: Station) => {
  const current = getDownloadedStations();
  const filtered = current.filter(s => s.code !== station.code);
  localStorage.setItem(OFFLINE_STATIONS_KEY, JSON.stringify([...filtered, station]));
  updateSyncTime();
};

export const removeDownloadedStation = (stationCode: string) => {
  const current = getDownloadedStations();
  const next = current.filter(s => s.code !== stationCode);
  localStorage.setItem(OFFLINE_STATIONS_KEY, JSON.stringify(next));
};

export const downloadAllStations = () => {
  localStorage.setItem(OFFLINE_STATIONS_KEY, JSON.stringify(ALL_STATIONS));
  updateSyncTime();
};

// --- PNR STATUS ---
export const getDownloadedPnrs = (): PNRDetails[] => {
  try {
    const data = localStorage.getItem(OFFLINE_PNRS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isPnrDownloaded = (pnrNumber: string): boolean => {
  const pnrs = getDownloadedPnrs();
  return pnrs.some(p => p.pnrNumber === pnrNumber);
};

export const savePnrOffline = (pnr: PNRDetails) => {
  const current = getDownloadedPnrs();
  const filtered = current.filter(p => p.pnrNumber !== pnr.pnrNumber);
  localStorage.setItem(OFFLINE_PNRS_KEY, JSON.stringify([...filtered, pnr]));
  updateSyncTime();
};

export const removeDownloadedPnr = (pnrNumber: string) => {
  const current = getDownloadedPnrs();
  const next = current.filter(p => p.pnrNumber !== pnrNumber);
  localStorage.setItem(OFFLINE_PNRS_KEY, JSON.stringify(next));
};

// --- GLOBAL STORAGE MANAGEMENT ---
export const updateSyncTime = () => {
  try {
    localStorage.setItem(OFFLINE_LAST_SYNC_KEY, new Date().toLocaleString());
  } catch {}
};

export const getStorageStats = (): StorageStats => {
  const trains = getDownloadedTrains();
  const stations = getDownloadedStations();
  const pnrs = getDownloadedPnrs();

  const rawTrains = localStorage.getItem(OFFLINE_TRAINS_KEY) || '';
  const rawStations = localStorage.getItem(OFFLINE_STATIONS_KEY) || '';
  const rawPnrs = localStorage.getItem(OFFLINE_PNRS_KEY) || '';

  const totalBytes = (rawTrains.length + rawStations.length + rawPnrs.length) * 2;
  const totalKb = Math.max(12, Math.round(totalBytes / 1024));

  const sync = localStorage.getItem(OFFLINE_LAST_SYNC_KEY) || 'Recently';

  return {
    trainCount: trains.length,
    stationCount: stations.length,
    pnrCount: pnrs.length,
    totalEstimatedKb: totalKb,
    lastSyncTime: sync,
  };
};

export const downloadCompleteOfflinePack = () => {
  localStorage.setItem(OFFLINE_TRAINS_KEY, JSON.stringify(ALL_TRAINS));
  localStorage.setItem(OFFLINE_STATIONS_KEY, JSON.stringify(ALL_STATIONS));
  localStorage.setItem(OFFLINE_PNRS_KEY, JSON.stringify(SAMPLE_PNRS));
  updateSyncTime();
};

export const clearAllOfflineData = () => {
  try {
    localStorage.removeItem(OFFLINE_TRAINS_KEY);
    localStorage.removeItem(OFFLINE_STATIONS_KEY);
    localStorage.removeItem(OFFLINE_PNRS_KEY);
    localStorage.setItem(OFFLINE_LAST_SYNC_KEY, 'Cleared');
  } catch {}
};
