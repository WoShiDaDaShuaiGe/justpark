import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { ParkingSpot } from "../../types/parking";
import { getMarkerColor } from "../../utils/parkingUtils";
import L from "leaflet";

type Props = {
  data: ParkingSpot[];
  showAvailableOnly: boolean;
  onSelectSpot: (spot: ParkingSpot) => void;
};

export default function MapView({
  data,
  showAvailableOnly,
  onSelectSpot,
}: Props) {
  const center: [number, number] = [-37.8136, 144.9631];

  const filtered = showAvailableOnly
    ? data.filter((spot) => spot.status === "Unoccupied")
    : data;

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
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
            <div style={{ minWidth: "150px" }}>
              <strong>Status:</strong> {spot.status} <br />
              <strong>Zone:</strong> {spot.zone || "N/A"} <br />
              <button onClick={() => onSelectSpot(spot)}>More Info</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
