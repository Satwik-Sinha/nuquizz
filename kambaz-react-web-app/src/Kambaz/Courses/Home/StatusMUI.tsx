import {
  Box,
  Typography,
  Button,
  Stack
} from "@mui/material";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { AiOutlineHome, AiOutlineBell } from "react-icons/ai";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FiBarChart2 } from "react-icons/fi";

export default function CourseStatusMUI() {
  return (
    <Box id="wd-course-status" sx={{ width: 350 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Course Status
      </Typography>

      {/* Publish/Unpublish buttons */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<MdDoNotDisturbAlt />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          Unpublish
        </Button>
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          startIcon={<FaCheckCircle />}
          sx={{
            textTransform: 'none'
          }}
        >
          Publish
        </Button>
      </Stack>

      {/* Action buttons */}
      <Stack spacing={1}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<BiImport />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          Import Existing Content
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<LiaFileImportSolid />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          Import from Commons
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<AiOutlineHome />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          Choose Home Page
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<FaEye />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          View Course Stream
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<HiOutlineSpeakerphone />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          New Announcement
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<FiBarChart2 />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          New Analytics
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<AiOutlineBell />}
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start'
          }}
        >
          View Course Notifications
        </Button>
      </Stack>
    </Box>
  );
}
