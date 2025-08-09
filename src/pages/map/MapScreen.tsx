import { useEffect, useState } from "react";
import {
  Box,
  Fab,
  CircularProgress,
  Typography,
  Alert,
  Button,
  Paper,
  IconButton,
  Slide,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import ParkingMap from "../../components/map/ParkingMap";
import HeroSection from "../../components/home/HeroSection";
import LocationSearchBar from "../../components/forms/search/LocationSearchBar";
import ParkingResultsList from "../../components/map/ParkingResultsList";
import { useMapControls } from "../../context/MapControlsContext";
import type { ParkingSpot } from "../../types/parking";
import styles from "./styles";
type MapMode = "browse" | "searching" | "spotSelected";
export default function MapScreen() {
  const {
    loading,
    error,
    refresh,
    filteredSpots,
    searchLocation,
    setSearchLocation,
  } = useMapControls();
  const [visibleSpots, setVisibleSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [mode, setMode] = useState<MapMode>("browse");
  const [activeSpot, setActiveSpot] = useState<ParkingSpot | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    if (!loading && filteredSpots.length > 0) {
      setVisibleSpots(filteredSpots);
    }
  }, [filteredSpots, loading]);
  const handleBoundsChange = (bounds: L.LatLngBounds) => {
    if (mode === "browse") {
      setVisibleSpots(
        filteredSpots.filter((spot) => bounds.contains([spot.lat, spot.lng]))
      );
    } else if (mode === "searching" && searchLocation) {
      const filtered = filteredSpots
        .filter((spot) => bounds.contains([spot.lat, spot.lng]))
        .filter(
          (spot) =>
            Math.abs(spot.lat - searchLocation.lat) < 0.003 &&
            Math.abs(spot.lng - searchLocation.lng) < 0.003
        );
      setVisibleSpots(filtered);
    }
  };
  const handleSearch = (location: { lat: number; lng: number }) => {
    setSearchLocation(location);
    setMode("searching");
    setHasSearched(true);
    const filtered = filteredSpots.filter(
      (spot) =>
        Math.abs(spot.lat - location.lat) < 0.003 &&
        Math.abs(spot.lng - location.lng) < 0.003
    );
    setVisibleSpots(filtered);
  };
  const handleSelectSpot = (spotId: string) => {
    const spot = filteredSpots.find((s) => s.id === spotId);
    if (!spot) return;
    setSelectedSpotId(spotId);
    setSearchLocation({ lat: spot.lat, lng: spot.lng });
    setMode("spotSelected");
    setActiveSpot(spot);
  };
  const handleViewOnMap = (spotId: string) => {
    const spot = filteredSpots.find((s) => s.id === spotId);
    if (!spot) return;
    setSelectedSpotId(spotId);
    setSearchLocation({ lat: spot.lat, lng: spot.lng });
    setMode("spotSelected");
  };
  const handleCloseSpotModal = () => {
    setActiveSpot(null);
  };
  const handleCloseOverlay = () => {
    setShowSearchOverlay(false);
    setMode("browse");
    setHasSearched(false);
    setVisibleSpots(filteredSpots);
  };
  const handleOpenSearch = () => {
    setShowSearchOverlay(true);
    setMode("searching");
    setHasSearched(false);
  };
  if (loading) {
    return (
      <Box sx={styles.container}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography>Loading parking data...</Typography>
        </Box>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={styles.container}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: 2,
            p: 4,
          }}
        >
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            <Typography variant="h6">Failed to load parking data</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={refresh}
              sx={{ mt: 2 }}
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
          </Alert>
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={styles.container}>
      {}
      <Box sx={styles.mapSection}>
        <ParkingMap
          spots={
            mode === "spotSelected" && selectedSpotId
              ? filteredSpots.filter((s) => s.id === selectedSpotId)
              : visibleSpots
          }
          onBoundsChange={handleBoundsChange}
          onSpotClick={(spot) => handleViewOnMap(spot.id)}
          searchLocation={searchLocation}
        />
      </Box>
      {}
      <Box sx={styles.heroSection}>
        {!showSearchOverlay && <HeroSection />}
        <Fab color="primary" onClick={handleOpenSearch} sx={styles.fab}>
          <SearchIcon />
        </Fab>
        {}
        <Slide direction="up" in={showSearchOverlay} mountOnEnter unmountOnExit>
          <Paper sx={styles.overlay} elevation={4}>
            <IconButton onClick={handleCloseOverlay} sx={styles.closeButton}>
              <CloseIcon />
            </IconButton>
            {}
            <Box sx={{ mb: 2 }}>
              <LocationSearchBar
                onSelectLocation={handleSearch}
                value=""
                onClear={() => {}}
              />
            </Box>
            {}
            {hasSearched ? (
              <ParkingResultsList
                spots={visibleSpots}
                selectedSpotId={selectedSpotId}
                onSelectSpot={handleSelectSpot}
                onViewOnMap={handleViewOnMap}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">
                  Search for a location to see parking spots
                </Typography>
              </Box>
            )}
          </Paper>
        </Slide>
      </Box>
      {}
      {activeSpot && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleCloseSpotModal}
        >
          <Box
            sx={{
              width: { xs: "90%", sm: "400px" },
              maxHeight: "80vh",
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              onClick={handleCloseSpotModal}
              sx={{ alignSelf: "flex-end", mb: 1 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Parking Spot Details
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}
            >
              <Typography variant="body2">
                <strong>ID:</strong> {activeSpot.id}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {activeSpot.status}
              </Typography>
              <Typography variant="body2">
                <strong>Zone:</strong> {activeSpot.zone || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Last Updated:</strong>{" "}
                {activeSpot.lastUpdated
                  ? new Date(activeSpot.lastUpdated).toLocaleString()
                  : "Unknown"}
              </Typography>
              {activeSpot.days && (
                <Typography variant="body2">
                  <strong>Days:</strong> {activeSpot.days}
                </Typography>
              )}
              {activeSpot.startTime && activeSpot.endTime && (
                <Typography variant="body2">
                  <strong>Hours:</strong> {activeSpot.startTime} -{" "}
                  {activeSpot.endTime}
                </Typography>
              )}
              {activeSpot.rule && (
                <Typography variant="body2">
                  <strong>Rule:</strong> {activeSpot.rule}
                </Typography>
              )}
            </Box>
            <Fab
              color="primary"
              variant="extended"
              sx={{
                width: "100%",
                borderRadius: 28,
              }}
              onClick={() => {
                const { lat, lng } = activeSpot;
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                );
              }}
            >
              Get Directions
            </Fab>
          </Box>
        </Box>
      )}
    </Box>
  );
}
