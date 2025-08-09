export interface ParkingSpot {
  id: string;
  status: "Unoccupied" | "Present" | string;
  lat: number;
  lng: number;
  zone: string | null;
  lastUpdated: string | null;
  days?: string;
  startTime?: string;
  endTime?: string;
  rule?: string;
}
export interface ParkingBayApiResponse {
  Lastupdated: string;
  Status_Timestamp: string;
  Zone_Number: string;
  Status_Description: string;
  KerbsideID: string;
  Location: string;
  Days: string;
  Start_Time: string;
  End_Time: string;
  Rule: string;
}
export function transformApiResponse(
  apiData: ParkingBayApiResponse
): ParkingSpot {
  const [latStr, lngStr] = apiData.Location.split(", ");
  return {
    id: apiData.KerbsideID,
    status: apiData.Status_Description,
    lat: parseFloat(latStr),
    lng: parseFloat(lngStr),
    zone: apiData.Zone_Number || null,
    lastUpdated: apiData.Lastupdated || apiData.Status_Timestamp || null,
    days: apiData.Days || undefined,
    startTime: apiData.Start_Time || undefined,
    endTime: apiData.End_Time || undefined,
    rule: apiData.Rule || undefined,
  };
}
