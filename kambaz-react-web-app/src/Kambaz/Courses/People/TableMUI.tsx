import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Skeleton,
  Alert,
  Tooltip,
  Badge,
  Card,
  CardContent,
  Fab,
  Zoom,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as usersClient from "./client";
import * as coursesClient from "../client";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  loginId?: string;
  email?: string;
  role?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
  lastActivity: string;
  totalActivity: number;
}

interface Enrollment {
  user: string;
  course: string;
}

interface RootState {
  accountReducer: {
    currentUser: User;
  };
  enrollmentReducer: {
    enrollments: Enrollment[];
  };
}

const getRoleIcon = (role?: string) => {
  switch (role) {
    case 'FACULTY':
      return <SchoolIcon fontSize="small" />;
    case 'ADMIN':
      return <AdminIcon fontSize="small" />;
    case 'TA':
      return <PsychologyIcon fontSize="small" />;
    default:
      return <PersonIcon fontSize="small" />;
  }
};

const getRoleColor = (role?: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
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

export default function PeopleTableMUI({ users = [] }: { users?: User[] }) {
  const theme = useTheme();
  const { cid } = useParams();
  const [courseUsers, setCourseUsers] = useState<User[]>(users);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "password123",
    role: "STUDENT",
    lastActivity: "",
    totalActivity: 0,
  });

  const dataFetched = useRef(false);
  const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser);
  const enrollments = useSelector((state: RootState) => state.enrollmentReducer.enrollments);

  useEffect(() => {
    const loadUsers = async () => {
      if (!cid || dataFetched.current || users.length > 0) return;

      setLoading(true);
      try {
        let data: User[] = [];
        if (window.location.pathname.includes('/Account/Users')) {
          data = await usersClient.findAllUsers();
        } else {
          data = await coursesClient.findUsersForCourse(cid);
        }
        setCourseUsers(data || []);
        dataFetched.current = true;
      } catch (error) {
        console.error("Failed to load users:", error);
        setCourseUsers([]);
      } finally {
        setLoading(false);
      }
    };

    // Reset fetch flag when course changes
    if (cid !== undefined && !dataFetched.current) {
      loadUsers();
    }

    // If users are provided as props, use them directly
    if (users.length > 0 && !dataFetched.current) {
      setCourseUsers(users);
      dataFetched.current = true;
    }
  }, [cid, users]);

  // Reset data fetched flag when course ID changes
  useEffect(() => {
    dataFetched.current = false;
  }, [cid]);

  const userSections: Record<string, Set<string>> = {};
  (enrollments || []).forEach((enrollment: Enrollment) => {
    if (!userSections[enrollment.user]) userSections[enrollment.user] = new Set();
    userSections[enrollment.user].add(enrollment.course);
  });

  const handleSave = async () => {
    try {
      if (editingUser) {
        const updated = await usersClient.updateUser({
          ...editingUser,
          ...formData,
          username: formData.username || editingUser.username
        });
        setCourseUsers(courseUsers.map(u => u._id === updated._id ? updated : u));
      } else {
        const created = await usersClient.createUser({
          ...formData,
          username: formData.username,
          password: formData.password || "password123"
        });
        setCourseUsers([...courseUsers, created]);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersClient.deleteUser(userId);
        setCourseUsers(courseUsers.filter(u => u._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || user.loginId || '',
      password: "password123",
      role: user.role || 'STUDENT',
      lastActivity: user.lastActivity || '',
      totalActivity: user.totalActivity || 0,
    });
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      password: "password123",
      role: "STUDENT",
      lastActivity: "",
      totalActivity: 0
    });
    setEditingUser(null);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#0288d1', '#689f38', '#f9a825'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Course People
            </Typography>
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Course People
            </Typography>
            <Badge badgeContent={courseUsers.length} color="primary">
              <PersonIcon />
            </Badge>
          </Box>

          {courseUsers.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No users found in this course.
            </Alert>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Login ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Sections</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Activity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total Activity</TableCell>
                    {currentUser?.role === "FACULTY" && (
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02)
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(user.firstName || ''),
                              mr: 2,
                              width: 40,
                              height: 40
                            }}
                          >
                            {getInitials(user.firstName, user.lastName)}
                          </Avatar>
                          <Box>
                            <Typography
                              component={Link}
                              to={`/Kambaz/Account/Users/${user._id}`}
                              variant="subtitle2"
                              sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                fontWeight: 500,
                                '&:hover': {
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <EmailIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                              {user.email || 'No email'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {user.loginId || user.username}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {user._id && userSections[user._id] ?
                            [...userSections[user._id]].map((section, idx) => (
                              <Chip
                                key={idx}
                                label={section}
                                size="small"
                                variant="outlined"
                                color="secondary"
                              />
                            )) :
                            <Typography variant="body2" color="text.secondary">
                              No sections
                            </Typography>
                          }
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={user.role}
                          color={getRoleColor(user.role)}
                          variant="filled"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {user.lastActivity || 'Never'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.totalActivity || 0}
                        </Typography>
                      </TableCell>
                      {currentUser?.role === "FACULTY" && (
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit User">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(user)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(user._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button for Adding Users */}
      {currentUser?.role === "FACULTY" && (
        <Zoom in timeout={1000}>
          <Fab
            color="primary"
            aria-label="add user"
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
            }}
            onClick={() => setShowDialog(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}

      {/* User Creation/Edit Dialog */}
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 8,
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {editingUser ? "Edit User" : "Create New User"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Box>
          <TextField
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          {!editingUser && (
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
          )}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="STUDENT">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Student
                </Box>
              </MenuItem>
              <MenuItem value="TA">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PsychologyIcon sx={{ mr: 1 }} />
                  Teaching Assistant
                </Box>
              </MenuItem>
              <MenuItem value="FACULTY">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  Faculty
                </Box>
              </MenuItem>
              <MenuItem value="ADMIN">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminIcon sx={{ mr: 1 }} />
                  Administrator
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '2fr 1fr', mt: 2 }}>
            <TextField
              label="Last Activity"
              value={formData.lastActivity}
              onChange={(e) => setFormData({ ...formData, lastActivity: e.target.value })}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Total Activity"
              type="number"
              value={formData.totalActivity}
              onChange={(e) => setFormData({ ...formData, totalActivity: parseInt(e.target.value || "0") })}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={editingUser ? <EditIcon /> : <AddIcon />}
          >
            {editingUser ? "Update User" : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
