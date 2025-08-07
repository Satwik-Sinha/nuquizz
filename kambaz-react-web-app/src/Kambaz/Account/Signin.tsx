import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Stack
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AccountCircle,
  Lock
} from "@mui/icons-material";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async () => {
    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
    } catch (e) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      signin();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={20}
          sx={{
            p: 0,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F7F7F9 100%)',
            border: '1px solid #E8E8EA',
            boxShadow: '0 8px 32px rgba(78, 42, 132, 0.15)',
            overflow: 'hidden',
            width: '100%',
            maxWidth: 480,
          }}
        >
          {/* Header Section with Gradient */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #7B5AA6 0%, #4E2A84 50%, #342056 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                animation: 'shimmer 3s ease-in-out infinite',
              },
              '@keyframes shimmer': {
                '0%, 100%': { opacity: 0.8 },
                '50%': { opacity: 1 },
              },
            }}
          >
            <LoginIcon
              sx={{
                fontSize: 48,
                mb: 2,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              }}
            />
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F5 50%, #E8E8F0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.95,
                color: '#F8F9FA',
                fontWeight: 300,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Sign in to your <span style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 500,
              }}>Kambaz</span> account
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: '#4E2A84' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#4E2A84',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#4E2A84' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={signin}
                disabled={loading || !credentials.username || !credentials.password}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4E2A84 0%, #2D1B69 100%)',
                  boxShadow: '0 4px 12px rgba(78, 42, 132, 0.3)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #342056 0%, #1A0F3A 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(78, 42, 132, 0.4)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #9B9A9E 0%, #716C7B 100%)',
                    transform: 'none',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to="/Kambaz/Account/Signup"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#4E2A84',
                  color: '#4E2A84',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#342056',
                    backgroundColor: 'rgba(78, 42, 132, 0.04)',
                  },
                }}
              >
                Create New Account
              </Button>
            </Stack>
          </CardContent>
        </Paper>
      </Box>
    </Container>
  );
}
