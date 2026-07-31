import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutlined,
  InventoryOutlined,
  KeyOutlined,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please enter both username/email and password.");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    const res = await login(username, password);

    setSubmitting(false);

    if (res.success) {
      navigate("/home", { replace: true });
    } else {
      setErrorMsg(res.message || "Failed to log in");
    }
  };

  const handleFillDemoCredentials = () => {
    setUsername("ParthPatel@gmail.com");
    setPassword("Parth123");
    setErrorMsg("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "#ffffff",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "#ffffff",
              p: 4,
              textAlign: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <InventoryOutlined sx={{ fontSize: 34 }} />
            </Box>
            <Typography variant="h5" fontWeight="700" letterSpacing={0.5}>
              Destiny Inventory Pro
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username / Email"
                name="username"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={submitting || authLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(25, 118, 210, 0.6)",
                  },
                }}
              >
                {submitting || authLoading ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>

            {/* <Divider sx={{ my: 3 }}>
              <Chip label="DEMO CREDENTIALS" size="small" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
            </Divider> */}

            <Paper
              variant="outlined"
              onClick={handleFillDemoCredentials}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#f8fafc",
                borderColor: "#cbd5e1",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  borderColor: "#1976d2",
                },
              }}
            >
              {/* <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <KeyOutlined fontSize="small" color="primary" />
                <Typography variant="subtitle2" color="primary.main" fontWeight="600">
                  Quick Fill Demo Account
                </Typography>
              </Stack>
              <Typography variant="caption" display="block" color="text.secondary">
                <strong>Username:</strong> ParthPatel@gmail.com
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                <strong>Password:</strong> Parth123
              </Typography> */}
            </Paper>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
}
