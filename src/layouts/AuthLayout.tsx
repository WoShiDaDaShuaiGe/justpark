import { Grid, Box, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

type AuthLayoutProps = {
  form: ReactNode;
  imageSide: ReactNode;
};

export default function AuthLayout({ form, imageSide }: AuthLayoutProps) {
  const theme = useTheme();

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {form}
      </Grid>

      <Grid
        item
        xs={false}
        md={6}
        sx={{
          background: theme.palette.grey[900],
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageSide}
      </Grid>
    </Grid>
  );
}
