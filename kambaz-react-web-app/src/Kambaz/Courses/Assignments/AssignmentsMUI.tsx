import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { setAssignments, addAssignment, deleteAssignment as deleteAssignmentAction } from "./reducer";
import AssignmentsControlsMUI from "./AssignmentsControlsMUI";
import AssignmentControlButtonsMUI from "./AssignmentControlButtonsMUI";
import * as assignmentsClient from "./client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Skeleton,
  Fade,
  Zoom,
  Collapse,
  Avatar,
} from "@mui/material";
import { DragIndicator, Assignment, CalendarToday, Grade, MoreVert } from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";

export default function AssignmentsMUI() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignmentName, setAssignmentName] = useState("");
  const [draggedAssignment, setDraggedAssignment] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignments() {
      if (!cid) return;

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching assignments for course:", cid);
        const data = await assignmentsClient.findAssignmentsForCourse(cid);
        console.log("Assignments fetched:", data);

        if (Array.isArray(data)) {
          dispatch(setAssignments(data));
        } else {
          console.error("Assignments data is not an array:", data);
        }
      } catch (error) {
        const err = error as Error;
        console.error("Error fetching assignments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, [cid, dispatch]);

  const handleSaveAssignment = async (assignment: any) => {
    if (!cid) return;

    setError(null);

    try {
      console.log("Creating assignment for course:", cid, assignment);
      const createdAssignment = await assignmentsClient.createAssignmentForCourse(cid, assignment);
      console.log("Assignment created:", createdAssignment);

      dispatch(addAssignment(createdAssignment));
      setAssignmentName("");
    } catch (error) {
      const err = error as Error;
      console.error("Error creating assignment:", err);
      setError(err.message);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    setError(null);

    try {
      console.log("Deleting assignment:", assignmentId);
      await assignmentsClient.deleteAssignment(assignmentId);
      console.log("Assignment deleted successfully");

      dispatch(deleteAssignmentAction(assignmentId));
    } catch (error) {
      const err = error as Error;
      console.error("Error deleting assignment:", err);
      setError(err.message);
    }
  };

  const handleDragStart = (assignmentId: string) => {
    setDraggedAssignment(assignmentId);
  };

  const handleDragEnd = () => {
    setDraggedAssignment(null);
  };

  const courseAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {currentUser?.role === "FACULTY" && (
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <AssignmentsControlsMUI
              assignmentName={assignmentName}
              setAssignmentName={setAssignmentName}
              addAssignment={handleSaveAssignment}
            />
          </Box>
        </Fade>
      )}

      {error && (
        <Zoom in timeout={300}>
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Zoom>
      )}

      <List sx={{ width: '100%', p: 0 }}>
        {/* Assignment Header */}
        <ListItem sx={{ p: 0, mb: 2 }}>
          <Card sx={{ width: '100%' }}>
            <CardContent
              sx={{
                p: 3,
                backgroundColor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DragIndicator sx={{ color: 'grey.500', fontSize: '1.5rem' }} />
                <Typography variant="h5" fontWeight="bold">
                  ASSIGNMENTS
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Chip
                  label="40% of Total"
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'grey.600' }}>
                  <Assignment />
                  <MoreVert />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </ListItem>

        {courseAssignments.length === 0 ? (
          <Fade in timeout={800}>
            <ListItem sx={{ p: 0 }}>
              <Paper
                sx={{
                  width: '100%',
                  p: 4,
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
                }}
              >
                <Assignment sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No assignments available for this course.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {currentUser?.role === "FACULTY"
                    ? "Create your first assignment to get started!"
                    : "Check back later for new assignments."}
                </Typography>
              </Paper>
            </ListItem>
          </Fade>
        ) : (
          <TransitionGroup>
            {courseAssignments.map((assignment: any) => (
              <Collapse key={assignment._id} timeout={500}>
                <ListItem sx={{ p: 0, mb: 2 }}>
                  <Card
                    sx={{
                      width: '100%',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: draggedAssignment === assignment._id ? 'rotate(2deg) scale(1.02)' : 'none',
                      boxShadow: draggedAssignment === assignment._id ? 8 : 1,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      }
                    }}
                    draggable
                    onDragStart={() => handleDragStart(assignment._id)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            <DragIndicator sx={{ color: 'grey.400', cursor: 'grab' }} />
                            <Avatar
                              sx={{
                                bgcolor: 'success.main',
                                width: 32,
                                height: 32,
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                }
                              }}
                            >
                              <Assignment fontSize="small" />
                            </Avatar>
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              component="a"
                              href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                              sx={{
                                color: 'text.primary',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                transition: 'color 0.2s ease-in-out',
                                '&:hover': {
                                  color: 'primary.main',
                                  textDecoration: 'underline',
                                }
                              }}
                            >
                              {assignment.title}
                            </Typography>

                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label="Multiple Assignments"
                                color="error"
                                size="small"
                                variant="outlined"
                              />

                              <Typography variant="body2" color="text.secondary">
                                •
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Not available until</strong> {formatDate(assignment.availableFrom)}
                                </Typography>
                              </Box>

                              <Typography variant="body2" color="text.secondary">
                                •
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday fontSize="small" sx={{ color: 'error.main' }} />
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Due</strong> {formatDate(assignment.dueDate)}
                                </Typography>
                              </Box>

                              <Typography variant="body2" color="text.secondary">
                                •
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Grade fontSize="small" sx={{ color: 'warning.main' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {assignment.points} pts
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        <AssignmentControlButtonsMUI
                          assignmentId={assignment._id}
                          deleteAssignment={handleDeleteAssignment}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              </Collapse>
            ))}
          </TransitionGroup>
        )}
      </List>
    </Box>
  );
}
