import { Container, Typography, Box } from "@mui/material";
import LoginForm from "@/components/forms/auth/LoginForm";

export default function LoginPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
}
