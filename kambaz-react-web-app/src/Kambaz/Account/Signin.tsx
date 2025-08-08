import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
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
  Stack,
  LinearProgress,
  Fade,
  Zoom,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AccountCircle,
  Lock,
  CheckCircleOutline,
  ErrorOutline,
  School as SchoolIcon
} from "@mui/icons-material";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

interface FormErrors {
  username?: string;
  password?: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Real-time validation
  useEffect(() => {
    const errors: FormErrors = {};

    if (touched.username) {
      if (!credentials.username) {
        errors.username = "Username is required";
      } else if (credentials.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      }
    }

    if (touched.password) {
      if (!credentials.password) {
        errors.password = "Password is required";
      } else if (credentials.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    setFormErrors(errors);
  }, [credentials, touched]);

  const handleInputChange = (field: keyof typeof credentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [field]: e.target.value });
    setError(""); // Clear general error when user starts typing
  };

  const handleInputBlur = (field: keyof typeof touched) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const signin = async () => {
    // Validate all fields
    setTouched({ username: true, password: true });

    if (!credentials.username || !credentials.password) {
      setError("Please enter both username and password");
      return;
    }

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));
      setShowSuccessMessage(true);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberUser', credentials.username);
      }

      // Delay navigation for better UX
      setTimeout(() => {
        navigate("/Kambaz/Dashboard");
      }, 1000);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Invalid credentials. Please check your username and password.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      signin();
    }
  };

  // Load remembered username on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
      setCredentials(prev => ({ ...prev, username: rememberedUser }));
      setRememberMe(true);
    }
  }, []);

  const isFormValid = credentials.username && credentials.password && Object.keys(formErrors).length === 0;

  return (
    <Container maxWidth="sm" sx={{ py: isMobile ? 4 : 8 }}>
      <Fade in timeout={800}>
        <Box
          sx={{
            minHeight: isMobile ? 'auto' : '80vh',
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
              maxWidth: 480,
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
            {/* Header Section with Enhanced Styling */}
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
                  <SchoolIcon
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
                Welcome Back
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
                Sign in to your{' '}
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
                account
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
                {/* Error Alert with Enhanced Styling */}
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

                {/* Username Field with Enhanced Validation */}
                <TextField
                  fullWidth
                  label="Username"
                  value={credentials.username}
                  onChange={handleInputChange('username')}
                  onBlur={handleInputBlur('username')}
                  onKeyDown={handleKeyDown}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
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
                      endAdornment: credentials.username && !formErrors.username && (
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

                {/* Password Field with Enhanced Features */}
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleInputChange('password')}
                  onBlur={handleInputBlur('password')}
                  onKeyDown={handleKeyDown}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={loading}
                  autoComplete="current-password"
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
                            {credentials.password && !formErrors.password && (
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

                {/* Remember Me Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: '#4E2A84',
                        '&.Mui-checked': {
                          color: '#4E2A84',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Remember me on this device
                    </Typography>
                  }
                />

                {/* Enhanced Sign In Button */}
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={signin}
                  disabled={loading || !isFormValid}
                  startIcon={loading ? undefined : <LoginIcon />}
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
                      Signing in...
                    </Box>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Divider with Enhanced Styling */}
                <Divider sx={{
                  my: 2,
                  '&::before, &::after': {
                    borderColor: 'rgba(78, 42, 132, 0.2)',
                  }
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                    Don't have an account?
                  </Typography>
                </Divider>

                {/* Enhanced Sign Up Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/Kambaz/Account/Signup"
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
                  Create New Account
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
          Successfully signed in! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
}
