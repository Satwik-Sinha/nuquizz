import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Fab,
  Stack,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Zoom,
  Slide,
  Collapse,
  ButtonGroup,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
  isThisMonth,
  isThisWeek,
  differenceInDays,
  addWeeks,
  subWeeks
} from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import QuizIcon from '@mui/icons-material/Quiz';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import FilterListIcon from '@mui/icons-material/FilterList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TodayIcon from '@mui/icons-material/Today';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: Date;
  type: 'assignment' | 'exam' | 'meeting' | 'personal';
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
}

type ViewMode = 'month' | 'week' | 'agenda';

export default function PersonalCalendar() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showCompleted, setShowCompleted] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    description: string;
    date: Date;
    time: Date;
    type: 'assignment' | 'exam' | 'meeting' | 'personal';
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }>({
    title: '',
    description: '',
    date: new Date(),
    time: new Date(),
    type: 'personal',
    priority: 'medium',
    completed: false
  });

  // Generate calendar days including padding days from previous/next month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Generate week days
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get filtered events
  const getFilteredEvents = () => {
    return events.filter(event => {
      if (!showCompleted && event.completed) return false;
      if (filterType !== 'all' && event.type !== filterType) return false;
      return true;
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return getFilteredEvents().filter(event => isSameDay(event.date, date));
  };

  // Get upcoming events
  const getUpcomingEvents = () => {
    const today = new Date();
    return getFilteredEvents()
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  // Handle event creation/editing
  const handleSaveEvent = () => {
    if (!newEvent.title.trim()) return;

    const eventData: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      priority: newEvent.priority,
      completed: newEvent.completed
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? eventData : e));
    } else {
      setEvents([...events, eventData]);
    }

    handleCloseDialog();
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      date: selectedDate || new Date(),
      time: new Date(),
      type: 'personal',
      priority: 'medium',
      completed: false
    });
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      priority: event.priority,
      completed: event.completed || false
    });
    setDialogOpen(true);
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(events.map(e =>
      e.id === eventId ? { ...e, completed: !e.completed } : e
    ));
  };

  const getEventTypeConfig = (type: string) => {
    switch (type) {
      case 'assignment':
        return { color: 'primary', icon: <SchoolIcon fontSize="small" />, label: 'Assignment' };
      case 'exam':
        return { color: 'error', icon: <QuizIcon fontSize="small" />, label: 'Exam' };
      case 'meeting':
        return { color: 'warning', icon: <WorkIcon fontSize="small" />, label: 'Meeting' };
      default:
        return { color: 'default', icon: <PersonIcon fontSize="small" />, label: 'Personal' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      const weeks = direction === 'next' ? 1 : -1;
      const updatedDate = direction === 'next' ? addWeeks(currentDate, weeks) : subWeeks(currentDate, Math.abs(weeks));
      setCurrentDate(updatedDate);
      return;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  useEffect(() => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('personalCalendarEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((e: any) => ({
        ...e,
        date: new Date(e.date),
        time: new Date(e.time),
        priority: e.priority || 'medium',
        completed: e.completed || false
      }));
      setEvents(parsedEvents);
    }
  }, []);

  useEffect(() => {
    // Save events to localStorage
    localStorage.setItem('personalCalendarEvents', JSON.stringify(events));
  }, [events]);

  const renderMonthView = () => (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <Box key={index} sx={{ p: 0.5 }}>
              <Zoom in timeout={200 + index * 20}>
                <Card
                  sx={{
                    minHeight: { xs: 100, sm: 140 },
                    cursor: 'pointer',
                    border: isSelected ? `3px solid ${theme.palette.primary.main}` : '1px solid transparent',
                    bgcolor: isToday(day)
                      ? alpha(theme.palette.primary.main, 0.15)
                      : !isCurrentMonth
                        ? alpha(theme.palette.grey[300], 0.3)
                        : 'background.paper',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-2px) scale(1.02)',
                      zIndex: 10
                    }
                  }}
                  onClick={() => {
                    setSelectedDate(day);
                    setNewEvent(prev => ({ ...prev, date: day }));
                  }}
                  onDoubleClick={() => {
                    setSelectedDate(day);
                    setNewEvent(prev => ({ ...prev, date: day }));
                    setDialogOpen(true);
                  }}
                >
                  <CardContent sx={{ p: { xs: 1, sm: 1.5 }, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    {/* Priority indicator */}
                    {dayEvents.some(e => e.priority === 'high') && (
                      <Box sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: theme.palette.error.main
                      }} />
                    )}

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday(day) ? 'bold' : 'normal',
                        color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                        mb: 1,
                        fontSize: isToday(day) ? '1.1em' : '1em'
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      {dayEvents.slice(0, 3).map(event => {
                        const config = getEventTypeConfig(event.type);
                        return (
                          <Tooltip key={event.id} title={`${event.title} - ${format(event.time, 'h:mm a')}`}>
                            <Chip
                              label={event.title}
                              size="small"
                              color={config.color as any}
                              icon={config.icon}
                              sx={{
                                fontSize: '9px',
                                height: 18,
                                opacity: event.completed ? 0.6 : 1,
                                textDecoration: event.completed ? 'line-through' : 'none',
                                '& .MuiChip-label': { px: 0.5 },
                                '& .MuiChip-icon': { fontSize: '10px' },
                                position: 'relative',
                                '&::before': event.priority === 'high' ? {
                                  content: '""',
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: '3px',
                                  bgcolor: theme.palette.error.main,
                                  borderRadius: '3px 0 0 3px'
                                } : {}
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5, fontWeight: 'bold' }}>
                          +{dayEvents.length - 3} more
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const renderWeekView = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {weekDays.map(day => {
          const dayEvents = getEventsForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <Box key={day.toISOString()} sx={{ flex: '1 1 0', minWidth: '200px' }}>
              <Paper
                elevation={isSelected ? 4 : 1}
                sx={{
                  p: 2,
                  minHeight: 300,
                  cursor: 'pointer',
                  bgcolor: isToday(day) ? alpha(theme.palette.primary.main, 0.1) : 'background.paper',
                  border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                  '&:hover': { boxShadow: theme.shadows[4] }
                }}
                onClick={() => setSelectedDate(day)}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: isToday(day) ? 'bold' : 'normal' }}>
                  {format(day, 'EEE d')}
                </Typography>
                <Stack spacing={1}>
                  {dayEvents.map(event => {
                    const config = getEventTypeConfig(event.type);
                    return (
                      <Card key={event.id} sx={{ bgcolor: alpha(getPriorityColor(event.priority), 0.1) }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {config.icon}
                            <Typography variant="body2" sx={{ flex: 1, textDecoration: event.completed ? 'line-through' : 'none' }}>
                              {event.title}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {format(event.time, 'h:mm a')}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Paper>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  const renderAgendaView = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {getFilteredEvents()
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(event => {
            const config = getEventTypeConfig(event.type);
            const daysFromNow = differenceInDays(event.date, new Date());

            return (
              <Accordion key={event.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: getPriorityColor(event.priority) }}>
                      {config.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ textDecoration: event.completed ? 'line-through' : 'none' }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(event.date, 'MMM d, yyyy')} at {format(event.time, 'h:mm a')}
                      </Typography>
                    </Box>
                    <Chip
                      label={daysFromNow === 0 ? 'Today' : daysFromNow === 1 ? 'Tomorrow' : `${daysFromNow} days`}
                      color={daysFromNow <= 1 ? 'error' : daysFromNow <= 7 ? 'warning' : 'default'}
                      size="small"
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Typography>{event.description}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={config.label} color={config.color as any} size="small" />
                      <Chip label={event.priority} sx={{ bgcolor: getPriorityColor(event.priority), color: 'white' }} size="small" />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditEvent(event)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteEvent(event.id)}>
                        Delete
                      </Button>
                      <Button
                        size="small"
                        color={event.completed ? 'warning' : 'success'}
                        onClick={() => toggleEventCompletion(event.id)}
                      >
                        {event.completed ? 'Mark Incomplete' : 'Mark Complete'}
                      </Button>
                    </Stack>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
      </Stack>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Enhanced Header with Gradient Animation */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'shimmer 3s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <CalendarTodayIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  Personal Calendar
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Stay organized and never miss an important date
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
                onClick={goToToday}
                startIcon={<TodayIcon />}
              >
                Today
              </Button>
              <ButtonGroup variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Button
                  onClick={() => setViewMode('month')}
                  sx={{ bgcolor: viewMode === 'month' ? 'rgba(255,255,255,0.3)' : 'transparent' }}
                >
                  <ViewModuleIcon />
                </Button>
                <Button
                  onClick={() => setViewMode('week')}
                  sx={{ bgcolor: viewMode === 'week' ? 'rgba(255,255,255,0.3)' : 'transparent' }}
                >
                  <ViewWeekIcon />
                </Button>
                <Button
                  onClick={() => setViewMode('agenda')}
                  sx={{ bgcolor: viewMode === 'agenda' ? 'rgba(255,255,255,0.3)' : 'transparent' }}
                >
                  <ViewAgendaIcon />
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </Paper>

        {/* Control Bar */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={() => navigateTime('prev')}
                sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h5" fontWeight="600" color="primary" sx={{ minWidth: 200, textAlign: 'center' }}>
                {viewMode === 'week'
                  ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                  : format(currentDate, 'MMMM yyyy')
                }
              </Typography>
              <IconButton
                onClick={() => navigateTime('next')}
                sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                startIcon={<FilterListIcon />}
                onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              >
                Filter
              </Button>
              <FormControlLabel
                control={<Switch checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />}
                label="Show Completed"
              />
            </Stack>
          </Stack>
        </Paper>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Calendar View */}
          <Box sx={{ flex: viewMode === 'agenda' ? '2 1 0' : '2 1 0', minWidth: 0 }}>
            <Paper elevation={3} sx={{ overflow: 'hidden', minHeight: '60vh' }}>
              {viewMode === 'month' && renderMonthView()}
              {viewMode === 'week' && renderWeekView()}
              {viewMode === 'agenda' && renderAgendaView()}
            </Paper>
          </Box>

          {/* Enhanced Events Sidebar */}
          <Box sx={{ flex: '1 1 0', minWidth: { lg: '300px' } }}>
            <Stack spacing={2}>
              {/* Quick Stats */}
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Quick Stats</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">{events.length}</Typography>
                    <Typography variant="body2">Total Events</Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">{events.filter(e => e.completed).length}</Typography>
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>Completion Rate</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={events.length ? (events.filter(e => e.completed).length / events.length) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Paper>

              {/* Events List */}
              <Paper elevation={3} sx={{ maxHeight: '50vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="h6" fontWeight="600" color="primary">
                    <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {selectedDate ? `Events for ${format(selectedDate, 'MMM d, yyyy')}` : 'Upcoming Events'}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {(selectedDate ? getEventsForDate(selectedDate) : getUpcomingEvents()).length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No events scheduled
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {(selectedDate ? getEventsForDate(selectedDate) : getUpcomingEvents()).map(event => {
                        const config = getEventTypeConfig(event.type);
                        return (
                          <Slide key={event.id} direction="left" in timeout={300}>
                            <Card elevation={2} sx={{
                              '&:hover': { boxShadow: theme.shadows[6] },
                              opacity: event.completed ? 0.7 : 1,
                              transform: event.completed ? 'scale(0.98)' : 'scale(1)',
                              transition: 'all 0.2s ease'
                            }}>
                              <CardContent sx={{ p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={2}>
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                      {config.icon}
                                      <Typography variant="subtitle2" fontWeight="600" noWrap sx={{ textDecoration: event.completed ? 'line-through' : 'none' }}>
                                        {event.title}
                                      </Typography>
                                      <Box sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: getPriorityColor(event.priority)
                                      }} />
                                    </Stack>
                                    {event.description && (
                                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {event.description}
                                      </Typography>
                                    )}
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        📅 {format(event.date, 'MMM d, yyyy')}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        🕒 {format(event.time, 'h:mm a')}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.5}>
                                      <Chip
                                        label={config.label}
                                        size="small"
                                        color={config.color as any}
                                        icon={config.icon}
                                      />
                                      <Chip
                                        label={event.priority}
                                        size="small"
                                        sx={{ bgcolor: getPriorityColor(event.priority), color: 'white' }}
                                      />
                                    </Stack>
                                  </Box>
                                  <Stack>
                                    <IconButton size="small" onClick={() => toggleEventCompletion(event.id)}>
                                      <AutoAwesomeIcon fontSize="small" color={event.completed ? 'success' : 'disabled'} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleEditEvent(event)}>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteEvent(event.id)}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Stack>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Slide>
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Box>

        {/* Enhanced Speed Dial */}
        <SpeedDial
          ariaLabel="Calendar actions"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<SpeedDialIcon />}
          open={speedDialOpen}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
        >
          <SpeedDialAction
            key="add-event"
            icon={<AddIcon />}
            tooltipTitle="Add Event"
            onClick={() => {
              setSelectedDate(new Date());
              setDialogOpen(true);
              setSpeedDialOpen(false);
            }}
          />
          <SpeedDialAction
            key="export"
            icon={<DownloadIcon />}
            tooltipTitle="Export Calendar"
            onClick={() => {
              // Export functionality placeholder
              console.log('Export calendar');
              setSpeedDialOpen(false);
            }}
          />
          <SpeedDialAction
            key="share"
            icon={<ShareIcon />}
            tooltipTitle="Share Calendar"
            onClick={() => {
              // Share functionality placeholder
              console.log('Share calendar');
              setSpeedDialOpen(false);
            }}
          />
        </SpeedDial>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
        >
          <MenuItem onClick={() => { setFilterType('all'); setFilterMenuAnchor(null); }}>
            <ListItemText>All Events</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setFilterType('personal'); setFilterMenuAnchor(null); }}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText>Personal</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setFilterType('assignment'); setFilterMenuAnchor(null); }}>
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText>Assignments</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setFilterType('exam'); setFilterMenuAnchor(null); }}>
            <ListItemIcon><QuizIcon /></ListItemIcon>
            <ListItemText>Exams</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setFilterType('meeting'); setFilterMenuAnchor(null); }}>
            <ListItemIcon><WorkIcon /></ListItemIcon>
            <ListItemText>Meetings</ListItemText>
          </MenuItem>
        </Menu>

        {/* Enhanced Add/Edit Event Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EventIcon color="primary" />
              <Typography variant="h5">{editingEvent ? 'Edit Event' : 'Create New Event'}</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                multiline
                rows={4}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DatePicker
                  label="Date"
                  value={newEvent.date}
                  onChange={(date) => date && setNewEvent({ ...newEvent, date })}
                  sx={{ flex: 1 }}
                />
                <TimePicker
                  label="Time"
                  value={newEvent.time}
                  onChange={(time) => time && setNewEvent({ ...newEvent, time })}
                  sx={{ flex: 1 }}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  label="Event Type"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  sx={{ flex: 1 }}
                >
                  <option value="personal">📝 Personal</option>
                  <option value="assignment">📚 Assignment</option>
                  <option value="exam">📝 Exam</option>
                  <option value="meeting">👥 Meeting</option>
                </TextField>
                <TextField
                  select
                  label="Priority"
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as any })}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  sx={{ flex: 1 }}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </TextField>
              </Stack>
              {editingEvent && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={newEvent.completed}
                      onChange={(e) => setNewEvent({ ...newEvent, completed: e.target.checked })}
                    />
                  }
                  label="Mark as completed"
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} size="large">Cancel</Button>
            <Button
              onClick={handleSaveEvent}
              variant="contained"
              size="large"
              disabled={!newEvent.title.trim()}
              sx={{ borderRadius: 2 }}
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
