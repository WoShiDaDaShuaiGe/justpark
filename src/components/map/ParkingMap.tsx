import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CircularProgress, Typography } from "@mui/material";
import L from "leaflet";
import { useParkingData } from "../../hooks/useParkingData";
import type { ParkingSpot } from "../../types/parking";
import { getMarkerColor } from "../../utils/parkingUtils";

type Props = {
  onSelectSpot: (spot: ParkingSpot) => void;
  showAvailableOnly: boolean;
};

export default function ParkingMap({ onSelectSpot, showAvailableOnly }: Props) {
  const { data, loading, error } = useParkingData();
  const center: [number, number] = [-37.8136, 144.9631]; // Melbourne CBD

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const filtered = showAvailableOnly
    ? data.filter((spot) => spot.status === "Unoccupied")
    : data;

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100vw" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {filtered.map((spot) => (
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
        >
          <Popup>
            <strong>Status:</strong> {spot.status} <br />
            <strong>Zone:</strong> {spot.zone || "N/A"} <br />
            <button
              onClick={() => onSelectSpot(spot)}
              style={{
                marginTop: "5px",
                background: "none",
                border: "none",
                color: "#007BFF",
                textDecoration: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              More Info
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
