import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function CourseNavigationMUI() {
  const location = useLocation();
  const cid = location.pathname.split("/")[3];

  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <Box id="wd-courses-navigation" sx={{ width: '100%' }}>
      <List disablePadding>
        {links.map((link) => {
          const linkPath = `/Kambaz/Courses/${cid}/${link}`;
          const isActive = location.pathname === linkPath;

          return (
            <ListItem key={link} disablePadding>
              <ListItemButton
                component={Link}
                to={linkPath}
                id={`wd-course-${link.toLowerCase()}-link`}
                sx={{
                  py: 1.5,
                  px: 2,
                  color: isActive ? 'white' : 'error.main',
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'grey.100',
                  },
                  fontSize: '1.125rem',
                  fontWeight: isActive ? 'medium' : 'normal'
                }}
              >
                <ListItemText
                  primary={link}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: 'inherit',
                      fontWeight: 'inherit'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
