import { RailwayComplaint } from '../types/railway';

const FAVOURITE_TRAINS_KEY = 'mystation_fav_trains';
const FAVOURITE_STATIONS_KEY = 'mystation_fav_stations';
const RECENT_SEARCHES_KEY = 'mystation_recent_searches';
const SAVED_PNRS_KEY = 'mystation_saved_pnrs';
const COMPLAINTS_KEY = 'mystation_complaints';

export interface RecentSearch {
  id: string;
  type: 'train' | 'route' | 'pnr' | 'station';
  query: string;
  title: string;
  timestamp: number;
}

export const getFavouriteTrains = (): string[] => {
  try {
    const data = localStorage.getItem(FAVOURITE_TRAINS_KEY);
    return data ? JSON.parse(data) : ['22436', '12301'];
  } catch {
    return ['22436', '12301'];
  }
};

export const toggleFavouriteTrain = (trainNumber: string): string[] => {
  const current = getFavouriteTrains();
  const next = current.includes(trainNumber)
    ? current.filter(n => n !== trainNumber)
    : [...current, trainNumber];
  localStorage.setItem(FAVOURITE_TRAINS_KEY, JSON.stringify(next));
  return next;
};

export const getFavouriteStations = (): string[] => {
  try {
    const data = localStorage.getItem(FAVOURITE_STATIONS_KEY);
    return data ? JSON.parse(data) : ['NDLS', 'CSMT', 'HWH'];
  } catch {
    return ['NDLS', 'CSMT', 'HWH'];
  }
};

export const toggleFavouriteStation = (stationCode: string): string[] => {
  const current = getFavouriteStations();
  const next = current.includes(stationCode)
    ? current.filter(c => c !== stationCode)
    : [...current, stationCode];
  localStorage.setItem(FAVOURITE_STATIONS_KEY, JSON.stringify(next));
  return next;
};

export const getRecentSearches = (): RecentSearch[] => {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [
      { id: '1', type: 'train', query: '22436', title: '22436 - Vande Bharat Express', timestamp: Date.now() - 3600000 },
      { id: '2', type: 'route', query: 'NDLS-BSB', title: 'New Delhi to Varanasi', timestamp: Date.now() - 7200000 },
      { id: '3', type: 'pnr', query: '2458912340', title: 'PNR 2458912340', timestamp: Date.now() - 10800000 },
    ];
  } catch {
    return [];
  }
};

export const addRecentSearch = (search: Omit<RecentSearch, 'id' | 'timestamp'>) => {
  const current = getRecentSearches();
  const filtered = current.filter(s => s.query !== search.query);
  const updated = [
    { ...search, id: String(Date.now()), timestamp: Date.now() },
    ...filtered,
  ].slice(0, 8);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

export const getComplaints = (): RailwayComplaint[] => {
  try {
    const data = localStorage.getItem(COMPLAINTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveComplaint = (complaint: RailwayComplaint) => {
  const current = getComplaints();
  const updated = [complaint, ...current];
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated));
};
