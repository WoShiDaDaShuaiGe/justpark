export interface ParkingSpot {
  id: string;
  status: "Unoccupied" | "Present" | string;
  lat: number;
  lng: number;
  zone: string | null;
  lastUpdated: string | null;
}
