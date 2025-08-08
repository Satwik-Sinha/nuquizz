import React, { useState, useEffect } from "react";
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
  CardContent,
  LinearProgress,
  Fade,
  Zoom,
  Snackbar,
  Chip,
  useTheme,
  useMediaQuery,
  Grid,
  FormHelperText
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  AccountCircle,
  Lock,
  Email,
  Badge,
  CheckCircleOutline,
  ErrorOutline,
  Person,
  School as SchoolIcon,
  Security,
  Info
} from "@mui/icons-material";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

interface FormErrors {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Signup() {
  const [user, setUser] = useState<User>({
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    firstName: false,
    lastName: false,
    email: false
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: '',
    suggestions: []
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score += 1;
    else suggestions.push("At least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push("Include uppercase letters");

    if (/[0-9]/.test(password)) score += 1;
    else suggestions.push("Include numbers");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else suggestions.push("Include special characters");

    let label: string;
    let color: string;

    if (score === 0) {
      label = '';
      color = '';
    } else if (score <= 2) {
      label = 'Weak';
      color = '#f44336';
    } else if (score <= 3) {
      label = 'Fair';
      color = '#ff9800';
    } else if (score <= 4) {
      label = 'Good';
      color = '#2196f3';
    } else {
      label = 'Strong';
      color = '#4caf50';
    }

    return { score, label, color, suggestions };
  };

  // Real-time validation
  useEffect(() => {
    const errors: FormErrors = {};

    if (touched.firstName && !user.firstName) {
      errors.firstName = "First name is required";
    }

    if (touched.lastName && !user.lastName) {
      errors.lastName = "Last name is required";
    }

    if (touched.username) {
      if (!user.username) {
        errors.username = "Username is required";
      } else if (user.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(user.username)) {
        errors.username = "Username can only contain letters, numbers, and underscores";
      }
    }

    if (touched.email) {
      if (!user.email) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (touched.password) {
      if (!user.password) {
        errors.password = "Password is required";
      } else if (user.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    setFormErrors(errors);
  }, [user, touched]);

  // Update password strength when password changes
  useEffect(() => {
    if (user.password) {
      setPasswordStrength(checkPasswordStrength(user.password));
    } else {
      setPasswordStrength({ score: 0, label: '', color: '', suggestions: [] });
    }
  }, [user.password]);

  const handleInputChange = (field: keyof typeof user) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [field]: e.target.value });
    setError(""); // Clear general error when user starts typing
  };

  const handleSelectChange = (e: { target: { value: string } }) => {
    setUser({ ...user, role: e.target.value });
  };

  const handleInputBlur = (field: keyof typeof touched) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const signup = async () => {
    // Validate all fields
    setTouched({
      username: true,
      password: true,
      firstName: true,
      lastName: true,
      email: true
    });

    if (!user.username || !user.password || !user.firstName || !user.lastName || !user.email) {
      setError("Please fill in all required fields");
      return;
    }

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      setShowSuccessMessage(true);

      // Delay navigation for better UX
      setTimeout(() => {
        navigate("/Kambaz/Account/Profile");
      }, 1000);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      signup();
    }
  };

  const isFormValid = user.username && user.password && user.firstName &&
                     user.lastName && user.email && Object.keys(formErrors).length === 0 &&
                     passwordStrength.score >= 3;

  return (
    <Container maxWidth="md" sx={{ py: isMobile ? 4 : 6 }}>
      <Fade in timeout={800}>
        <Box
          sx={{
            minHeight: isMobile ? 'auto' : '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 0,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FC 100%)',
              border: '1px solid rgba(78, 42, 132, 0.1)',
              boxShadow: '0 12px 40px rgba(78, 42, 132, 0.15)',
              overflow: 'hidden',
              width: '100%',
              maxWidth: 600,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4E2A84 0%, #7B5AA6 50%, #4E2A84 100%)',
                animation: loading ? 'slideProgress 2s ease-in-out infinite' : 'none',
              },
              '@keyframes slideProgress': {
                '0%': { transform: 'translateX(-100%)' },
                '50%': { transform: 'translateX(0%)' },
                '100%': { transform: 'translateX(100%)' },
              },
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #4E2A84 0%, #7B5AA6 50%, #342056 100%)',
                color: 'white',
                p: isMobile ? 3 : 4,
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                },
              }}
            >
              <Zoom in timeout={1000}>
                <Box>
                  <PersonAddIcon
                    sx={{
                      fontSize: isMobile ? 40 : 48,
                      mb: 2,
                      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                      },
                    }}
                  />
                </Box>
              </Zoom>

              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 1,
                }}
              >
                Join Kambaz
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  color: '#F0F4F8',
                  fontWeight: 300,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}
              >
                Create your{' '}
                <Chip
                  label="Kambaz"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                  }}
                />{' '}
                account and start learning
              </Typography>
            </Box>

            {/* Loading Progress Bar */}
            {loading && (
              <LinearProgress
                sx={{
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #4E2A84, #7B5AA6, #4E2A84)',
                  },
                }}
              />
            )}

            {/* Form Content */}
            <CardContent sx={{ p: isMobile ? 3 : 4, pt: 3 }}>
              <Stack spacing={3}>
                {/* Error Alert */}
                <Fade in={!!error} timeout={300}>
                  <Alert
                    severity="error"
                    variant="filled"
                    icon={<ErrorOutline />}
                    sx={{
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        fontWeight: 500,
                      },
                    }}
                    style={{ display: error ? 'flex' : 'none' }}
                  >
                    {error}
                  </Alert>
                </Fade>

                {/* Name Fields */}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={user.firstName}
                    onChange={handleInputChange('firstName')}
                    onBlur={handleInputBlur('firstName')}
                    onKeyDown={handleKeyDown}
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    disabled={loading}
                    autoComplete="given-name"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{
                              color: formErrors.firstName ? 'error.main' : '#4E2A84',
                              transition: 'color 0.2s ease'
                            }} />
                          </InputAdornment>
                        ),
                        endAdornment: user.firstName && !formErrors.firstName && (
                          <InputAdornment position="end">
                            <CheckCircleOutline sx={{ color: 'success.main' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(78, 42, 132, 0.1)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 12px rgba(78, 42, 132, 0.2)',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={user.lastName}
                    onChange={handleInputChange('lastName')}
                    onBlur={handleInputBlur('lastName')}
                    onKeyDown={handleKeyDown}
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    disabled={loading}
                    autoComplete="family-name"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{
                              color: formErrors.lastName ? 'error.main' : '#4E2A84',
                              transition: 'color 0.2s ease'
                            }} />
                          </InputAdornment>
                        ),
                        endAdornment: user.lastName && !formErrors.lastName && (
                          <InputAdornment position="end">
                            <CheckCircleOutline sx={{ color: 'success.main' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(78, 42, 132, 0.1)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 12px rgba(78, 42, 132, 0.2)',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Username Field */}
                <TextField
                  fullWidth
                  label="Username"
                  value={user.username}
                  onChange={handleInputChange('username')}
                  onBlur={handleInputBlur('username')}
                  onKeyDown={handleKeyDown}
                  error={!!formErrors.username}
                  helperText={formErrors.username || "Choose a unique username"}
                  disabled={loading}
                  autoComplete="username"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle sx={{
                            color: formErrors.username ? 'error.main' : '#4E2A84',
                            transition: 'color 0.2s ease'
                          }} />
                        </InputAdornment>
                      ),
                      endAdornment: user.username && !formErrors.username && (
                        <InputAdornment position="end">
                          <CheckCircleOutline sx={{ color: 'success.main' }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(78, 42, 132, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(78, 42, 132, 0.2)',
                      },
                    },
                  }}
                />

                {/* Email Field */}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={user.email}
                  onChange={handleInputChange('email')}
                  onBlur={handleInputBlur('email')}
                  onKeyDown={handleKeyDown}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={loading}
                  autoComplete="email"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{
                            color: formErrors.email ? 'error.main' : '#4E2A84',
                            transition: 'color 0.2s ease'
                          }} />
                        </InputAdornment>
                      ),
                      endAdornment: user.email && !formErrors.email && (
                        <InputAdornment position="end">
                          <CheckCircleOutline sx={{ color: 'success.main' }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(78, 42, 132, 0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(78, 42, 132, 0.2)',
                      },
                    },
                  }}
                />

                {/* Password Field with Strength Indicator */}
                <Box>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={handleInputChange('password')}
                    onBlur={handleInputBlur('password')}
                    onKeyDown={handleKeyDown}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    disabled={loading}
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{
                              color: formErrors.password ? 'error.main' : '#4E2A84',
                              transition: 'color 0.2s ease'
                            }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {user.password && !formErrors.password && passwordStrength.score >= 3 && (
                                <CheckCircleOutline sx={{ color: 'success.main' }} />
                              )}
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                disabled={loading}
                                size="small"
                                sx={{
                                  color: '#4E2A84',
                                  '&:hover': { backgroundColor: 'rgba(78, 42, 132, 0.04)' }
                                }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </Stack>
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(78, 42, 132, 0.1)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 12px rgba(78, 42, 132, 0.2)',
                        },
                      },
                    }}
                  />

                  {/* Password Strength Indicator */}
                  {user.password && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Security sx={{ fontSize: 16, color: passwordStrength.color || 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: passwordStrength.color || 'text.secondary', fontWeight: 500 }}>
                          Password Strength: {passwordStrength.label}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength.score / 5) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: passwordStrength.color || '#e0e0e0',
                            borderRadius: 3,
                          },
                        }}
                      />
                      {passwordStrength.suggestions.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Info sx={{ fontSize: 12 }} />
                            Suggestions: {passwordStrength.suggestions.slice(0, 2).join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Role Selection */}
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={user.role}
                    onChange={handleSelectChange}
                    label="Role"
                    disabled={loading}
                    startAdornment={
                      <InputAdornment position="start">
                        <Badge sx={{ color: '#4E2A84', ml: 1 }} />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        boxShadow: '0 4px 8px rgba(78, 42, 132, 0.1)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        boxShadow: '0 4px 12px rgba(78, 42, 132, 0.2)',
                      },
                    }}
                  >
                    <MenuItem value="STUDENT">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon sx={{ fontSize: 20 }} />
                        Student
                      </Box>
                    </MenuItem>
                    <MenuItem value="FACULTY">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge sx={{ fontSize: 20 }} />
                        Faculty
                      </Box>
                    </MenuItem>
                    <MenuItem value="ADMIN">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Security sx={{ fontSize: 20 }} />
                        Admin
                      </Box>
                    </MenuItem>
                  </Select>
                  <FormHelperText>Select your role in the system</FormHelperText>
                </FormControl>

                {/* Enhanced Sign Up Button */}
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={signup}
                  disabled={loading || !isFormValid}
                  startIcon={loading ? undefined : <PersonAddIcon />}
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    background: isFormValid
                      ? 'linear-gradient(135deg, #4E2A84 0%, #7B5AA6 100%)'
                      : 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
                    boxShadow: isFormValid
                      ? '0 4px 16px rgba(78, 42, 132, 0.3)'
                      : 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'left 0.5s',
                    },
                    '&:hover:not(:disabled)': {
                      background: 'linear-gradient(135deg, #342056 0%, #5A4178 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(78, 42, 132, 0.4)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    '&:active:not(:disabled)': {
                      transform: 'translateY(0px)',
                    },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      Creating Account...
                    </Box>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Divider */}
                <Divider sx={{
                  my: 2,
                  '&::before, &::after': {
                    borderColor: 'rgba(78, 42, 132, 0.2)',
                  }
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                    Already have an account?
                  </Typography>
                </Divider>

                {/* Enhanced Sign In Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/Kambaz/Account/Signin"
                  startIcon={<AccountCircle />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: '#4E2A84',
                    color: '#4E2A84',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#342056',
                      backgroundColor: 'rgba(78, 42, 132, 0.04)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(78, 42, 132, 0.15)',
                    },
                  }}
                >
                  Sign In Instead
                </Button>
              </Stack>
            </CardContent>
          </Paper>
        </Box>
      </Fade>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessMessage(false)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          Account created successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
}
