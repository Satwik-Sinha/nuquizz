import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardContent
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  AccountCircle,
  Lock,
  Email,
  Badge
} from "@mui/icons-material";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Signup() {
  const [user, setUser] = useState<any>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async () => {
    if (!user.username || !user.password || !user.firstName || !user.lastName) {
      setError("Please fill in all required fields");
      return;
    }

    if (user.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      navigate("/Kambaz/Account/Profile");
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      signup();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box
        sx={{
          minHeight: '90vh',
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
            maxWidth: 520,
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
            <PersonAddIcon
              sx={{
                fontSize: 48,
                mb: 2,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                animation: 'bounce 2.5s ease-in-out infinite',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-5px)' },
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
              Join <span style={{
                background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 50%, #F0F0F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
              }}>Kambaz</span>
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
              Create your account to get started
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Name Fields Row */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="First Name *"
                  variant="outlined"
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
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
                  label="Last Name *"
                  variant="outlined"
                  value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#4E2A84',
                      },
                    },
                  }}
                />
              </Stack>

              <TextField
                fullWidth
                label="Username *"
                variant="outlined"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
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
                label="Email"
                type="email"
                variant="outlined"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#4E2A84' }} />
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
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                onKeyPress={handleKeyPress}
                disabled={loading}
                helperText="Password must be at least 6 characters"
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

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={user.role}
                  label="Role"
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  disabled={loading}
                  startAdornment={
                    <InputAdornment position="start">
                      <Badge sx={{ color: '#4E2A84', ml: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4E2A84',
                    },
                  }}
                >
                  <MenuItem value="STUDENT">Student</MenuItem>
                  <MenuItem value="FACULTY">Faculty</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={signup}
                disabled={loading || !user.username || !user.password || !user.firstName || !user.lastName}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to="/Kambaz/Account/Signin"
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
                Sign In Instead
              </Button>
            </Stack>
          </CardContent>
        </Paper>
      </Box>
    </Container>
  );
}
