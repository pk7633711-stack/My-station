export type Language = 'en' | 'hi';

export type TrainType = 
  | 'Vande Bharat'
  | 'Rajdhani'
  | 'Shatabdi'
  | 'Duronto'
  | 'Tejas'
  | 'Superfast'
  | 'Express'
  | 'Mail'
  | 'Passenger'
  | 'Garib Rath';

export type TravelClass = 
  | '1A' // First AC
  | '2A' // Second AC
  | '3A' // Third AC
  | '3E' // 3 AC Economy
  | 'CC' // AC Chair Car
  | 'EC' // Executive Chair Car
  | 'EA' // Anubhuti
  | 'SL' // Sleeper
  | '2S'; // Second Sitting

export type QuotaType = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS' | 'HP';

export interface StationFacility {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  available: boolean;
  details?: string;
}

export interface Station {
  code: string;
  name: string;
  nameHi: string;
  city: string;
  state: string;
  zone: string;
  division: string;
  address: string;
  platforms: number;
  latitude: number;
  longitude: number;
  category: 'NSG-1' | 'NSG-2' | 'NSG-3' | 'NSG-4';
  facilities: StationFacility[];
  helpline: string;
  isPopular?: boolean;
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  stationNameHi: string;
  arrivalTime: string; // "14:20" or "Source"
  departureTime: string; // "14:25" or "Destination"
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform: string;
  status?: 'passed' | 'current' | 'upcoming';
  delayMinutes?: number;
  actualArrival?: string;
  actualDeparture?: string;
}

export interface Train {
  number: string;
  name: string;
  nameHi: string;
  type: TrainType;
  sourceStationCode: string;
  destinationStationCode: string;
  runsOnDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  classes: TravelClass[];
  totalDistanceKm: number;
  durationHours: string;
  speedKmph: number;
  pantryAvailable: boolean;
  stops: TrainStop[];
  currentLocationInfo?: {
    lastStationCode: string;
    nextStationCode: string;
    distanceFromLastKm: number;
    speed: number;
    delayMinutes: number;
    statusText: string;
    statusTextHi: string;
    updatedAt: string;
  };
}

export interface PassengerStatus {
  number: number;
  bookingStatus: string; // "CNF", "RAC 24", "WL 45"
  currentStatus: string; // "CNF", "RAC 12", "WL 18"
  coach: string; // "B4", "S5", "A1", "C2"
  berth: number; // 24
  berthType: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window' | 'Aisle' | 'Cabin';
  quota: QuotaType;
}

export interface PNRDetails {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  trainNameHi: string;
  dateOfJourney: string;
  fromStationCode: string;
  toStationCode: string;
  boardingStationCode: string;
  travelClass: TravelClass;
  chartStatus: 'Chart Prepared' | 'Chart Not Prepared';
  chartPreparedTime?: string;
  confirmationProbability: number; // 0 - 100%
  passengers: PassengerStatus[];
  farePaid: number;
}

export interface LiveStationTrain {
  trainNumber: string;
  trainName: string;
  trainNameHi: string;
  type: TrainType;
  platform: string;
  scheduledTime: string;
  expectedTime: string;
  delayMinutes: number;
  direction: 'Arrival' | 'Departure';
  origin: string;
  destination: string;
  status: 'On Time' | 'Delayed' | 'Arrived' | 'Departed';
}

export interface SeatAvailabilityResult {
  trainNumber: string;
  trainName: string;
  trainNameHi: string;
  type: TrainType;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromStation: string;
  toStation: string;
  classes: {
    travelClass: TravelClass;
    status: string; // "AVAILABLE 42", "RAC 14", "WL 28", "REGRET"
    fare: number;
    probability?: number;
    updatedTime: string;
  }[];
}

export interface RailwayZone {
  code: string;
  name: string;
  nameHi: string;
  headquarters: string;
  divisions: string[];
  routeKm: number;
}

export interface RailwayUpdate {
  id: string;
  title: string;
  titleHi: string;
  category: 'Special Train' | 'Cancellation' | 'Mega Block' | 'Policy' | 'Vande Bharat' | 'Festival';
  date: string;
  summary: string;
  summaryHi: string;
  details: string;
  detailsHi: string;
  zone?: string;
  isImportant?: boolean;
}

export interface RailwayComplaint {
  id: string;
  referenceId: string;
  category: string;
  pnrOrTrain: string;
  coachBerth: string;
  description: string;
  submittedAt: string;
  status: 'Registered' | 'In Progress' | 'Resolved';
  resolutionNote?: string;
}
