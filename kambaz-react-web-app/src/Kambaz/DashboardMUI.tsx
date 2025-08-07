import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Alert,
  Divider,
  Container
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCourse, addCourse, deleteCourse, updateCourse, setCourses } from "./Courses/reducer";
import {
  toggleShowAllCourses,
  enroll,
  unenroll,
  setEnrollments
} from "./Enrollments/reducer";
import * as enrollmentsClient from "./Enrollments/client";
import * as userClient from "./Account/client"
import { useEffect, useState, useRef } from "react";

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

        <Typography variant="h4" component="h2" id="wd-dashboard-published" gutterBottom>
          {currentUser?.role === "STUDENT" && !showAllCourses
            ? "My Enrollments"
            : "Published Courses"} ({Array.isArray(courses) ? courses.length : 0})
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Display message if no courses */}
        {(!Array.isArray(courses) || courses.length === 0) && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {currentUser?.role === "FACULTY"
              ? "No courses available. Create a new course using the form above."
              : "No courses available. Try changing to 'All Courses' mode or contact your administrator."}
          </Alert>
        )}

        <Box id="wd-dashboard-courses">
          <Grid container spacing={3}>
            {Array.isArray(courses) && courses.map((course: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course._id || `course-${index}`}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 300
                  }}
                  className="wd-dashboard-course"
                >
                  <Link
                    to={`/Kambaz/Courses/${course._id}/Home`}
                    className="wd-dashboard-course-link"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={(e) => handleCourseNavigation(e, course._id)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image="/images/reactjs.jpg"
                      alt={course.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h3"
                        className="wd-dashboard-course-title"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {course.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="wd-dashboard-course-description"
                        sx={{
                          height: 60,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {course.description}
                      </Typography>
                    </CardContent>
                  </Link>

                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    {currentUser?.role === "STUDENT" ? (
                      isEnrolled(course._id) ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.preventDefault();
                            handleUnenroll(course._id);
                          }}
                        >
                          Unenroll
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEnroll(course._id);
                          }}
                        >
                          Enroll
                        </Button>
                      )
                    ) : (
                      <Button variant="contained" color="primary">
                        Go
                      </Button>
                    )}

                    {currentUser?.role === "FACULTY" && (
                      <Box>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSetCourse(course);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteCourse(course._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
