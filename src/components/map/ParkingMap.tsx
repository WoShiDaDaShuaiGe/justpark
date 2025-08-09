import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CircularProgress } from "@mui/material";
import { getMarkerColor } from "../../utils/parkingUtils";
import type { ParkingSpot } from "../../types/parking";
interface Props {
  spots: ParkingSpot[];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  onSpotClick: (spot: ParkingSpot) => void;
  searchLocation?: { lat: number; lng: number } | null;
}
export default function ParkingMap({
  spots,
  onBoundsChange,
  onSpotClick,
  searchLocation,
}: Props) {
  const center: [number, number] = [-37.8136, 144.9631];
  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <InnerMap
        spots={spots}
        onBoundsChange={onBoundsChange}
        onSpotClick={onSpotClick}
        searchLocation={searchLocation}
      />
    </MapContainer>
  );
}
function InnerMap({
  spots,
  onBoundsChange,
  onSpotClick,
  searchLocation,
}: {
  spots: ParkingSpot[];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  onSpotClick: (spot: ParkingSpot) => void;
  searchLocation?: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (searchLocation) {
      map.flyTo([searchLocation.lat, searchLocation.lng], 18, {
        duration: 1.5,
      });
    }
  }, [searchLocation, map]);
  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange(bounds);
    },
  });
  if (!spots) return <CircularProgress />;
  return (
    <>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={L.divIcon({
            className: "custom-icon",
            html: `<div style="background:${getMarkerColor(
              spot.status
            )};width:10px;height:10px;border-radius:50%"></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          })}
          eventHandlers={{
            click: () => onSpotClick(spot),
          }}
        >
          <Popup>
            <div style={{ textAlign: "center", minWidth: "120px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Status:</strong> {spot.status} <br />
                <strong>Zone:</strong> {spot.zone || "N/A"}
              </div>
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`,
                    "_blank"
                  );
                }}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  width: "100%",
                }}
              >
                Take me here
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
