import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Chip,
  Divider,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon,
  BarChart as BarChartIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from "react-router";
import * as client from "../../Account/client";

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'FACULTY':
      return <SchoolIcon />;
    case 'ADMIN':
      return <AdminIcon />;
    case 'TA':
      return <PsychologyIcon />;
    default:
      return <PersonIcon />;
  }
};

const getRoleColor = (role: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (role) {
    case 'FACULTY':
      return 'primary';
    case 'ADMIN':
      return 'error';
    case 'TA':
      return 'warning';
    default:
      return 'default';
  }
};

export default function PeopleDetailsMUI() {
  const theme = useTheme();
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const deleteUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        await client.deleteUser(uid);
        navigate(-1);
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const saveUser = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ");
      const updatedUser = { ...user, firstName, lastName };

      await client.updateUser(updatedUser);
      setUser(updatedUser);
      setEditing(false);
      navigate(-1);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    if (!uid) return;

    try {
      setLoading(true);
      setError(null);
      const userData = await client.findUserById(uid);
      setUser(userData);
      setName(`${userData.firstName || ''} ${userData.lastName || ''}`.trim());
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  const getAvatarColor = (name: string) => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#0288d1', '#689f38', '#f9a825'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!uid) return null;

  return (
    <Drawer
      anchor="right"
      open={Boolean(uid)}
      onClose={() => navigate(-1)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          bgcolor: 'background.default',
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 0,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              User Details
            </Typography>
            <IconButton onClick={() => navigate(-1)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          {loading && !user._id ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <Fade in timeout={500}>
              <Stack spacing={3}>
                {/* Avatar and Name Section */}
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: getAvatarColor(user.firstName || ''),
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                    }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </Avatar>

                  {!editing ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setEditing(true)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <TextField
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveUser();
                          if (e.key === "Escape") {
                            setEditing(false);
                            setName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
                          }
                        }}
                        autoFocus
                        sx={{ minWidth: 200 }}
                      />
                      <IconButton
                        size="small"
                        onClick={saveUser}
                        disabled={loading}
                        sx={{ color: 'success.main' }}
                      >
                        {loading ? <CircularProgress size={16} /> : <CheckIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Divider />

                {/* User Information */}
                <Stack spacing={2}>
                  {/* Role */}
                  <Paper elevation={1} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getRoleIcon(user.role)}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Role
                      </Typography>
                    </Box>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role || 'Not specified'}
                      color={getRoleColor(user.role)}
                      variant="filled"
                    />
                  </Paper>

                  {/* Login ID */}
                  <Paper elevation={1} sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <BadgeIcon />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Login ID
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      {user.loginId || user.username || 'Not specified'}
                    </Typography>
                  </Paper>

                  {/* Email */}
                  {user.email && (
                    <Paper elevation={1} sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Email
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Paper>
                  )}

                  {/* Section */}
                  <Paper elevation={1} sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SchoolIcon />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Section
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {user.section || 'Not assigned'}
                    </Typography>
                  </Paper>

                  {/* Activity Information */}
                  <Paper elevation={1} sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BarChartIcon />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Activity
                      </Typography>
                    </Box>

                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">Last Activity:</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {user.lastActivity || 'Never'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Total Activity:</Typography>
                        <Chip
                          label={user.totalActivity || 0}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>
            </Fade>
          )}
        </Box>

        {/* Footer Actions */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 0,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.error.main, 0.05)
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
              onClick={() => deleteUser(uid!)}
              disabled={loading}
            >
              Delete User
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Drawer>
  );
}
