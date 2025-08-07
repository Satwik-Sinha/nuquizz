import { FaPlus } from "react-icons/fa6";
import AssignmentEditorMUI from "./AssignmentEditorMUI";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Fade,
  Paper,
} from "@mui/material";
import { Add, Search, Group, MoreVert } from "@mui/icons-material";

export default function AssignmentsControlsMUI(
  { assignmentName, setAssignmentName, addAssignment }:
    { assignmentName: string; setAssignmentName: (title: string) => void; addAssignment: (assignment: any) => void; }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [show, setShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        background: 'linear-gradient(45deg, #fafafa 30%, #ffffff 90%)',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for Assignment"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'grey.400' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
              },
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
              }
            }
          }}
        />

        {/* Action Buttons */}
        {currentUser?.role === "FACULTY" && (
          <Fade in timeout={500}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              <Tooltip title="Create assignment group">
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Group />}
                  sx={{
                    minWidth: 120,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                      backgroundColor: 'grey.50',
                    }
                  }}
                >
                  Group
                </Button>
              </Tooltip>

              <Tooltip title="Create new assignment">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add sx={{ transition: 'transform 0.2s' }} />}
                  onClick={handleShow}
                  sx={{
                    minWidth: 140,
                    bgcolor: 'error.main',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'error.dark',
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: 6,
                      '& .MuiSvgIcon-root': {
                        transform: 'rotate(90deg)',
                      }
                    }
                  }}
                >
                  Assignment
                </Button>
              </Tooltip>

              <Tooltip title="More options">
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    minWidth: 50,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: 'action.hover',
                      '& .MuiSvgIcon-root': {
                        transform: 'rotate(90deg)',
                      }
                    }
                  }}
                >
                  <MoreVert />
                </Button>
              </Tooltip>
            </Box>
          </Fade>
        )}
      </Box>

      <AssignmentEditorMUI
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Assignment"
        assignmentName={assignmentName}
        setAssignmentName={setAssignmentName}
        addAssignment={addAssignment}
      />
    </Paper>
  );
}
