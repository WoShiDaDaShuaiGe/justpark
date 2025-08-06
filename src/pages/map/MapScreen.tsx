import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ParkingMap from "../../components/map/ParkingMap";
import ParkingDetailsDrawer from "../../components/map/ParkingDetailsDrawer"; // New file
import type { ParkingSpot } from "../../types/parking";

export default function MapScreen() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  return (
    <Container maxWidth="xl" sx={{ paddingY: 4 }}>
      <Typography variant="h4" gutterBottom>
        Melbourne Parking Map
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
        }
        label="Show only available parking spots"
        sx={{ mb: 2 }}
      />

      <Box sx={{ height: "75vh", borderRadius: 2, overflow: "hidden" }}>
        <ParkingMap
          onSelectSpot={setSelectedSpot}
          showAvailableOnly={showAvailableOnly}
        />
      </Box>

      {selectedSpot && (
        <ParkingDetailsDrawer
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}
    </Container>
  );
}
