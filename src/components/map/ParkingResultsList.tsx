// src/components/map/ParkingResultsList.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { ParkingSpot } from "../../types/parking";

interface ParkingResultsListProps {
  spots: ParkingSpot[];
  selectedSpotId: string | null;
  onSelectSpot: (spotId: string) => void;
  onViewOnMap?: (spotId: string) => void; // Made optional
}

export default function ParkingResultsList({
  spots,
  selectedSpotId,
  onSelectSpot,
  onViewOnMap,
}: ParkingResultsListProps) {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  if (spots.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", py: 4 }}
      >
        No parking spots found in this area
      </Typography>
    );
  }

  return (
    <Box sx={{ overflowY: "auto", maxHeight: "60vh" }}>
      {spots.map((spot) => (
        <Accordion
          key={spot.id}
          expanded={expandedAccordion === spot.id}
          onChange={handleAccordionChange(spot.id)}
          sx={{
            mb: 1,
            "&:before": {
              display: "none",
            },
            boxShadow: 1,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor:
                spot.status === "Unoccupied" ? "#e8f5e8" : "#ffeaea",
              "&:hover": {
                backgroundColor:
                  spot.status === "Unoccupied" ? "#d4edda" : "#ffcccc",
              },
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="body2" fontWeight="bold">
                Spot {spot.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {spot.status} • Zone: {spot.zone || "N/A"}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2">
                <strong>Status:</strong> {spot.status}
              </Typography>
              <Typography variant="body2">
                <strong>Zone:</strong> {spot.zone || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Last Updated:</strong>{" "}
                {spot.lastUpdated
                  ? new Date(spot.lastUpdated).toLocaleString()
                  : "Unknown"}
              </Typography>
              {spot.days && (
                <Typography variant="body2">
                  <strong>Days:</strong> {spot.days}
                </Typography>
              )}
              {spot.startTime && spot.endTime && (
                <Typography variant="body2">
                  <strong>Hours:</strong> {spot.startTime} - {spot.endTime}
                </Typography>
              )}
              {spot.rule && (
                <Typography variant="body2">
                  <strong>Rule:</strong> {spot.rule}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                {/* Only show "View on Map" button if onViewOnMap is provided */}
                {onViewOnMap && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onViewOnMap(spot.id)}
                  >
                    View on Map
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`,
                      "_blank"
                    );
                  }}
                >
                  Get Directions
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
