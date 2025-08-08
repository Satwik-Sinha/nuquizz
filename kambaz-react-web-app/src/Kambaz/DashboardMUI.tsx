import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Alert,
  Divider,
  Container,
  Chip,
  Fade,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCourses } from "./Courses/reducer";
import {
  toggleShowAllCourses,
  enroll,
  unenroll,
  setEnrollments
} from "./Enrollments/reducer";
import * as enrollmentsClient from "./Enrollments/client";
import * as userClient from "./Account/client"
import { useEffect, useState, useRef } from "react";
import { getCourseImage, getCourseColors } from "./utils/courseImages";
import {
  School as SchoolIcon,
  AccessTime,
  People,
  Star,
  Bookmark,
  BookmarkBorder
} from "@mui/icons-material";

export default function DashboardMUI({
  courses,
  course,
  setCourse,
  addNewCourse,
  deleteCourse,
  updateCourse,
  enrolling,
  setEnrolling
}: {
  courses: any[];
  course: any;
  setCourse: (course: any) => void;
  addNewCourse: () => void;
  deleteCourse: (id: string) => void;
  updateCourse: () => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const enrollmentState = useSelector((state: any) => state.enrollmentReducer);
  const { enrollments, showAllCourses } = enrollmentState || { enrollments: [], showAllCourses: false };

  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    coursesCount: 0,
    enrollmentsCount: 0,
    userRole: ''
  });

  // Use ref to track if enrollments have been fetched
  const enrollmentsFetched = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Dashboard - Current User:", currentUser);
    console.log("Dashboard - Courses:", courses);
    console.log("Dashboard - Enrollments:", enrollments);

    setDebugInfo({
      coursesCount: Array.isArray(courses) ? courses.length : 0,
      enrollmentsCount: Array.isArray(enrollments) ? enrollments.length : 0,
      userRole: currentUser?.role || 'None'
    });

    // Only fetch enrollments once
    if (!enrollmentsFetched.current) {
      const fetchEnrollments = async () => {
        try {
          console.log("Fetching enrollments...");
          const serverEnrollments = await enrollmentsClient.getAllEnrollments();
          console.log("Enrollments fetched:", serverEnrollments);
          dispatch(setEnrollments(serverEnrollments));
          enrollmentsFetched.current = true;
        } catch (error) {
          console.error("Failed to load enrollments:", error);
        }
      };
      fetchEnrollments();
    }
  }, [dispatch]);

  const handleSetCourse = (newCourseData: any) => {
    console.log("Setting course data:", newCourseData);
    setCourse(newCourseData);
  };

  const handleToggleShowAllCourses = () => {
    console.log("Toggling show all courses from", showAllCourses, "to", !showAllCourses);
    dispatch(toggleShowAllCourses());
    console.log("Toggling enrolling from", enrolling, "to", !enrolling);
    setEnrolling(!enrolling);
  };

  const handleEnroll = async (courseId: string) => {
    if (currentUser) {
      try {
        console.log("Enrolling user", currentUser._id, "in course", courseId);
        await userClient.enrollIntoCourse(currentUser._id, courseId);
        dispatch(enroll({ userId: currentUser._id, courseId }));

        // Update UI optimistically, but provide a fallback if the API call fails
        const updatedCourses = courses.map(c =>
          c._id === courseId ? { ...c, enrolled: true } : c
        );
        setCourses(updatedCourses);
      } catch (error) {
        console.error("Failed to enroll:", error);
        // Show an error message to the user
        alert("Failed to enroll in course. Please try again.");
      }
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (currentUser) {
      try {
        console.log("Unenrolling user", currentUser._id, "from course", courseId);
        await userClient.unenrollFromCourse(currentUser._id, courseId);
        dispatch(unenroll({ userId: currentUser._id, courseId }));

        // Update UI optimistically, but provide a fallback if the API call fails
        const updatedCourses = courses.map(c =>
          c._id === courseId ? { ...c, enrolled: false } : c
        );
        setCourses(updatedCourses);
      } catch (error) {
        console.error("Failed to unenroll:", error);
        // Show an error message to the user
        alert("Failed to unenroll from course. Please try again.");
      }
    }
  };

  const isEnrolled = (courseId: string) => {
    // First check if the course has an enrolled flag
    const course = courses.find(c => c._id === courseId);
    if (course && 'enrolled' in course) {
      return course.enrolled === true;
    }

    // Fallback to checking enrollments
    return Array.isArray(enrollments) && enrollments.some(
      e => e.user === currentUser?._id && e.course === courseId
    );
  };

  const handleCourseNavigation = (event: React.MouseEvent, courseId: string) => {
    if (currentUser?.role === "STUDENT" && !isEnrolled(courseId)) {
      event.preventDefault();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box id="wd-dashboard">
        <Typography variant="h3" component="h1" id="wd-dashboard-title" gutterBottom>
          Dashboard
        </Typography>

        <Divider sx={{ my: 2 }} />

        {currentUser?.role === "STUDENT" && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant={showAllCourses ? "outlined" : "contained"}
              onClick={handleToggleShowAllCourses}
              startIcon={<SchoolIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(78, 42, 132, 0.3)',
                }
              }}
            >
              {showAllCourses ? "My Courses" : "All Courses"}
            </Button>
          </Box>
        )}

        {currentUser?.role === "FACULTY" && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                New Course
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={updateCourse}
                  sx={{ mr: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addNewCourse}
                >
                  Add
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Course Name"
              value={course.name || ''}
              onChange={(e) => handleSetCourse({ ...course, name: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Course Description"
              value={course.description || ''}
              onChange={(e) => handleSetCourse({ ...course, description: e.target.value })}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h2" id="wd-dashboard-published" sx={{ flexGrow: 1 }}>
            {currentUser?.role === "STUDENT" && !showAllCourses
              ? "My Enrollments"
              : "Published Courses"}
          </Typography>
          <Chip
            label={`${Array.isArray(courses) ? courses.length : 0} courses`}
            color="primary"
            variant="outlined"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              px: 2,
              py: 0.5
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Display message if no courses */}
        {(!Array.isArray(courses) || courses.length === 0) && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            {currentUser?.role === "FACULTY"
              ? "No courses available. Create a new course using the form above."
              : "No courses available. Try changing to 'All Courses' mode or contact your administrator."}
          </Alert>
        )}

        <Box id="wd-dashboard-courses">
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3
          }}>
            {Array.isArray(courses) && courses.map((course: any, index: number) => {
              const courseColors = getCourseColors(course._id);
              const enrolled = isEnrolled(course._id);

              return (
                <Fade in timeout={600 + (index * 100)} key={course._id || `course-${index}`}>
                  <Box>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: `0 20px 40px rgba(78, 42, 132, 0.3)`,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: courseColors.gradient,
                          zIndex: 1,
                        }
                      }}
                      className="wd-dashboard-course"
                    >
                      <Link
                        to={`/Kambaz/Courses/${course._id}/Home`}
                        className="wd-dashboard-course-link"
                        style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}
                        onClick={(e) => handleCourseNavigation(e, course._id)}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={getCourseImage(course._id)}
                            alt={course.name}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              }
                            }}
                          />

                          {/* Course overlay with enrollment status */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              display: 'flex',
                              gap: 1,
                              alignItems: 'center'
                            }}
                          >
                            {enrolled && (
                              <Chip
                                label="Enrolled"
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(76, 175, 80, 0.9)',
                                  color: 'white',
                                  fontWeight: 600,
                                  backdropFilter: 'blur(10px)',
                                }}
                              />
                            )}

                            <Chip
                              label={course.credits ? `${course.credits} Credits` : '3 Credits'}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                fontWeight: 500,
                                backdropFilter: 'blur(10px)',
                              }}
                            />
                          </Box>

                          {/* Course number badge */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 16,
                              left: 16,
                            }}
                          >
                            <Chip
                              label={course.number || course._id}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: courseColors.primary,
                                fontWeight: 600,
                                backdropFilter: 'blur(10px)',
                              }}
                            />
                          </Box>
                        </Box>

                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Stack spacing={2}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="h3"
                              className="wd-dashboard-course-title"
                              sx={{
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                lineHeight: 1.3,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                color: 'text.primary'
                              }}
                            >
                              {course.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="wd-dashboard-course-description"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.5,
                                fontSize: '0.9rem'
                              }}
                            >
                              {course.description}
                            </Typography>

                            {/* Course metadata */}
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 'auto' }}>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {course.department || 'General'}
                                </Typography>
                              </Stack>

                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  15 weeks
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Link>

                      <CardActions sx={{ p: 3, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
                        {currentUser?.role === "STUDENT" ? (
                          <Button
                            variant={enrolled ? "outlined" : "contained"}
                            color={enrolled ? "error" : "success"}
                            size="large"
                            onClick={(e) => {
                              e.preventDefault();
                              enrolled ? handleUnenroll(course._id) : handleEnroll(course._id);
                            }}
                            sx={{
                              borderRadius: 3,
                              px: 3,
                              py: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '1rem',
                              minWidth: 120,
                              background: enrolled ? 'transparent' : courseColors.gradient,
                              '&:hover': {
                                background: enrolled ? 'rgba(244, 67, 54, 0.04)' : courseColors.gradient,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px ${enrolled ? 'rgba(244, 67, 54, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
                              }
                            }}
                          >
                            {enrolled ? "Unenroll" : "Enroll"}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                              borderRadius: 3,
                              px: 3,
                              py: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '1rem',
                              background: courseColors.gradient,
                              '&:hover': {
                                background: courseColors.gradient,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px rgba(78, 42, 132, 0.4)`,
                              }
                            }}
                          >
                            Enter Course
                          </Button>
                        )}

                        {currentUser?.role === "FACULTY" && (
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit Course">
                              <IconButton
                                color="warning"
                                size="small"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSetCourse(course);
                                }}
                                sx={{
                                  borderRadius: 2,
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              >
                                <SchoolIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Course">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteCourse(course._id);
                                }}
                                sx={{
                                  borderRadius: 2,
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              >
                                <SchoolIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </CardActions>
                    </Card>
                  </Box>
                </Fade>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}


