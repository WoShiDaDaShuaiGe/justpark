import { Container, Typography, Box } from "@mui/material";
import SignUpForm from "@/components/forms/auth/SignUpForm";

export default function SignupPage() {
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
          Sign Up
        </Typography>
        <SignUpForm />
      </Box>
    </Container>
  );
}
