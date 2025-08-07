import { Box, useTheme, useMediaQuery } from "@mui/material";
import ModulesMUI from "../Modules/ModulesMUI";
import CourseStatusMUI from "./StatusMUI";

export default function HomeMUI() {
  const theme = useTheme();
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <Box id="wd-home" sx={{ display: 'flex', gap: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <ModulesMUI />
      </Box>
      {isXlUp && (
        <Box sx={{ width: 350, flexShrink: 0 }}>
          <CourseStatusMUI />
        </Box>
      )}
    </Box>
  );
}
