import { useState, useEffect } from "react";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ModulesControlsMUI from "./ModulesControlsMUI";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtonsMUI from "./LessonControlButtonsMUI";
import ModuleControlButtonsMUI from "./ModuleControlButtonsMUI";
import { useParams } from "react-router";
import * as coursesClient from "../client";
import * as modulesClient from "./client";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
  IconButton,
  Collapse
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DragHandle,
  ExpandMore,
  MenuBook,
  Close,
  Schedule,
  Assignment,
  Quiz,
  VideoLibrary,
  Description,
  KeyboardArrowDown,
  KeyboardArrowRight
} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}));

const ModuleHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const LessonList = styled(List)(({ theme }) => ({
  padding: 0,
  backgroundColor: theme.palette.background.paper,
}));

// Dummy syllabus data
const dummySyllabusData = {
  "Week 1: Introduction to React": {
    overview: "This week introduces the fundamentals of React, including JSX, components, and the virtual DOM.",
    learningObjectives: [
      "Understand the basics of React and JSX syntax",
      "Create functional and class components",
      "Learn about props and state management",
      "Implement basic event handling"
    ],
    topics: [
      { title: "What is React?", duration: "30 min", type: "lecture" },
      { title: "JSX Fundamentals", duration: "45 min", type: "lecture" },
      { title: "Your First Component", duration: "60 min", type: "lab" },
      { title: "Props vs State", duration: "40 min", type: "lecture" }
    ],
    assignments: [
      { title: "React Basics Quiz", dueDate: "Friday", points: 10 },
      { title: "Component Creation Lab", dueDate: "Sunday", points: 25 }
    ],
    readings: [
      "React Documentation: Getting Started",
      "Modern JavaScript for React Developers",
      "Understanding Virtual DOM"
    ],
    prerequisites: ["HTML/CSS", "JavaScript ES6+"],
    estimatedTime: "4-6 hours"
  },
  "Week 2: State and Props": {
    overview: "Deep dive into React's state management and component communication through props.",
    learningObjectives: [
      "Master useState and useEffect hooks",
      "Implement parent-child component communication",
      "Handle complex state objects",
      "Optimize component re-renders"
    ],
    topics: [
      { title: "useState Hook Deep Dive", duration: "50 min", type: "lecture" },
      { title: "useEffect and Side Effects", duration: "45 min", type: "lecture" },
      { title: "Prop Drilling Solutions", duration: "60 min", type: "workshop" },
      { title: "State Management Patterns", duration: "55 min", type: "lecture" }
    ],
    assignments: [
      { title: "State Management Project", dueDate: "Thursday", points: 40 },
      { title: "Component Communication Exercise", dueDate: "Saturday", points: 20 }
    ],
    readings: [
      "React Hooks Documentation",
      "Component Lifecycle in Functional Components",
      "Best Practices for State Management"
    ],
    prerequisites: ["Week 1 completion"],
    estimatedTime: "5-7 hours"
  },
  "Week 3: Material-UI Integration": {
    overview: "Learn to integrate Material-UI components for professional, responsive designs.",
    learningObjectives: [
      "Set up Material-UI theme system",
      "Implement responsive layouts with Grid system",
      "Customize Material-UI components",
      "Create consistent design patterns"
    ],
    topics: [
      { title: "Material-UI Setup and Theming", duration: "40 min", type: "lecture" },
      { title: "Grid System and Breakpoints", duration: "50 min", type: "workshop" },
      { title: "Form Components and Validation", duration: "65 min", type: "lab" },
      { title: "Custom Component Styling", duration: "45 min", type: "lecture" }
    ],
    assignments: [
      { title: "MUI Theme Customization", dueDate: "Wednesday", points: 30 },
      { title: "Responsive Dashboard Project", dueDate: "Sunday", points: 50 }
    ],
    readings: [
      "Material-UI Documentation",
      "Design Systems in React",
      "Responsive Web Design Principles"
    ],
    prerequisites: ["Weeks 1-2 completion"],
    estimatedTime: "6-8 hours"
  }
};

export default function ModulesMUI() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Syllabus dialog state
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const handleModuleClick = (moduleName: string) => {
    setSelectedModule(moduleName);
    setSyllabusOpen(true);
  };

  const handleSyllabusClose = () => {
    setSyllabusOpen(false);
    setSelectedModule(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <VideoLibrary color="primary" />;
      case 'lab': return <Assignment color="secondary" />;
      case 'workshop': return <Quiz color="error" />;
      default: return <Description color="action" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'primary';
      case 'lab': return 'secondary';
      case 'workshop': return 'error';
      default: return 'default';
    }
  };

  // Get syllabus data for selected module (fallback to first available if not found)
  const currentSyllabus = selectedModule && dummySyllabusData[selectedModule as keyof typeof dummySyllabusData]
    ? dummySyllabusData[selectedModule as keyof typeof dummySyllabusData]
    : Object.values(dummySyllabusData)[0];

  const saveModule = async (module: any) => {
    setError(null);
    try {
      console.log("Saving module:", module);
      await modulesClient.updateModule(module);
      dispatch(updateModule(module));
    } catch (err) {
      const error = err as Error;
      console.error("Error saving module:", error);
      setError(error.message);
    }
  };

  const removeModule = async (moduleId: string) => {
    setError(null);
    try {
      console.log("Removing module:", moduleId);
      await modulesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (err) {
      const error = err as Error;
      console.error("Error removing module:", error);
      setError(error.message);
    }
  };

  const createModuleForCourse = async () => {
    if (!cid) return;
    setError(null);

    try {
      console.log("Creating module for course:", cid, moduleName);
      const newModule = { name: moduleName, course: cid };
      const module = await coursesClient.createModuleForCourse(cid, newModule);
      dispatch(addModule(module));
    } catch (err) {
      const error = err as Error;
      console.error("Error creating module:", error);
      setError(error.message);
    }
  };

  const fetchModules = async () => {
    if (!cid) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching modules for course:", cid);
      const modules = await coursesClient.findModulesForCourse(cid as string);
      dispatch(setModules(modules));
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching modules:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {currentUser?.role === "FACULTY" && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <ModulesControlsMUI
            setModuleName={setModuleName}
            moduleName={moduleName}
            addModule={createModuleForCourse}
          />
        </Paper>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading modules...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Box>
          {modules.length === 0 ? (
            <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No modules available for this course.
              </Typography>
            </Paper>
          ) : (
            modules.map((module: any) => (
              <StyledCard key={module._id}>
                <ModuleHeader>
                  <Box display="flex" alignItems="center" flexGrow={1}>
                    <DragHandle sx={{ mr: 2, color: "grey.500", cursor: "grab" }} />
                    {!module.editing ? (
                      <Box display="flex" alignItems="center" flexGrow={1}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                              color: '#4E2A84',
                              textDecoration: 'underline'
                            }
                          }}
                          onClick={() => handleModuleClick(module.name)}
                        >
                          {module.name}
                        </Typography>
                        <IconButton
                          onClick={() => handleModuleClick(module.name)}
                          sx={{
                            ml: 1,
                            color: '#4E2A84',
                            '&:hover': {
                              backgroundColor: 'rgba(78, 42, 132, 0.04)'
                            }
                          }}
                          size="small"
                          title="View Syllabus"
                        >
                          <MenuBook />
                        </IconButton>
                      </Box>
                    ) : (
                      <TextField
                        variant="outlined"
                        size="small"
                        defaultValue={module.name}
                        onChange={(e) =>
                          dispatch(updateModule({ ...module, name: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveModule({ ...module, editing: false });
                          }
                        }}
                        sx={{ flexGrow: 1, maxWidth: "50%" }}
                      />
                    )}
                  </Box>
                  {currentUser?.role === "FACULTY" && (
                    <ModuleControlButtonsMUI
                      moduleId={module._id}
                      deleteModule={(moduleId) => removeModule(moduleId)}
                      editModule={(moduleId) => dispatch(editModule(moduleId))}
                    />
                  )}
                </ModuleHeader>

                {module.lessons && module.lessons.length > 0 && (
                  <CardContent sx={{ p: 0 }}>
                    <LessonList>
                      {module.lessons.map((lesson: any, index: number) => (
                        <div key={lesson._id}>
                          <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <DragHandle sx={{ color: "grey.500", cursor: "grab" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={lesson.name}
                              primaryTypographyProps={{
                                variant: "body1",
                                fontWeight: 500,
                              }}
                            />
                            <LessonControlButtonsMUI />
                          </ListItem>
                          {index < module.lessons.length - 1 && <Divider />}
                        </div>
                      ))}
                    </LessonList>
                  </CardContent>
                )}
              </StyledCard>
            ))
          )}
        </Box>
      )}

      {/* Syllabus Dialog */}
      <Dialog
        open={syllabusOpen}
        onClose={handleSyllabusClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Syllabus for {selectedModule}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleSyllabusClose}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            {currentSyllabus.overview}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Learning Objectives
          </Typography>
          <ul>
            {currentSyllabus.learningObjectives.map((objective, index) => (
              <li key={index}>
                <Typography variant="body2" component="span">
                  {objective}
                </Typography>
              </li>
            ))}
          </ul>

          <Typography variant="h6" gutterBottom>
            Topics
          </Typography>
          {currentSyllabus.topics.map((topic, index) => (
            <Accordion key={index} expanded={expandedSections[`topic-${index}`]} onChange={() => toggleSection(`topic-${index}`)}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`topic-${index}-content`}
                id={`topic-${index}-header`}
              >
                <Typography variant="body1" sx={{ width: "90%", flexShrink: 0 }}>
                  {topic.title}
                </Typography>
                <Chip label={topic.duration} size="small" color={getTypeColor(topic.type)} variant="outlined" />
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="textSecondary">
                  Type: {topic.type}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Typography variant="h6" gutterBottom>
            Assignments
          </Typography>
          <ul>
            {currentSyllabus.assignments.map((assignment, index) => (
              <li key={index}>
                <Typography variant="body2" component="span">
                  {assignment.title} (Due: {assignment.dueDate}, Points: {assignment.points})
                </Typography>
              </li>
            ))}
          </ul>

          <Typography variant="h6" gutterBottom>
            Readings
          </Typography>
          <ul>
            {currentSyllabus.readings.map((reading, index) => (
              <li key={index}>
                <Typography variant="body2" component="span">
                  {reading}
                </Typography>
              </li>
            ))}
          </ul>

          <Typography variant="h6" gutterBottom>
            Prerequisites
          </Typography>
          <ul>
            {currentSyllabus.prerequisites.map((prerequisite, index) => (
              <li key={index}>
                <Typography variant="body2" component="span">
                  {prerequisite}
                </Typography>
              </li>
            ))}
          </ul>

          <Typography variant="h6" gutterBottom>
            Estimated Time
          </Typography>
          <Typography variant="body2" component="span">
            {currentSyllabus.estimatedTime}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSyllabusClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
