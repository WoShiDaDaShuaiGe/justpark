import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState } from "react";
import { useMapControls } from "../../context/MapControlsContext";
import style from "./style";
export default function Header() {
  const location = useLocation();
  const isMapPage = location.pathname === "/";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let mapControls = null;
  try {
    mapControls = isMapPage ? useMapControls() : null;
  } catch (error) {
    mapControls = null;
  }
  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRefresh = () => {
    if (mapControls?.refresh) {
      mapControls.refresh();
    }
    handleClose();
  };
  const handleToggleAvailable = () => {
    if (mapControls?.setShowAvailableOnly) {
      mapControls.setShowAvailableOnly(!mapControls.showAvailableOnly);
    }
  };
  return (
    <AppBar position="static" sx={style.appBar}>
      <Toolbar sx={style.toolbar}>
        <Typography variant="h6" sx={style.logo}>
          JustPark.
        </Typography>
        <Box sx={style.navLinks}>
          <Typography component={RouterLink} to="/" sx={style.link}>
            Home
          </Typography>
          <Typography component={RouterLink} to="/about" sx={style.link}>
            About
          </Typography>
          {}
          {isMapPage && mapControls && (
            <IconButton
              onClick={handleSettingsClick}
              sx={{ color: "#555", ml: 1 }}
              title="Map Settings"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        {}
        {mapControls && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: { minWidth: 200, mt: 1 },
            }}
          >
            {}
            <MenuItem onClick={handleRefresh}>
              <RefreshIcon sx={{ mr: 1, fontSize: 20 }} />
              <Box>
                <Typography variant="body2">Refresh Data</Typography>
                {mapControls.lastUpdated && (
                  <Typography variant="caption" color="text.secondary">
                    Last: {mapControls.lastUpdated.toLocaleTimeString()}
                  </Typography>
                )}
              </Box>
            </MenuItem>
            <Divider />
            {}
            <Box sx={{ px: 2, py: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mapControls.showAvailableOnly}
                    onChange={(e) =>
                      mapControls.setShowAvailableOnly(e.target.checked)
                    }
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">Show available only</Typography>
                }
                sx={{ m: 0, width: "100%" }}
              />
            </Box>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
}
