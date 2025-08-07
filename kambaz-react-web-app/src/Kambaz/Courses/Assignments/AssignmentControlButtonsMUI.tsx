import { Delete, Edit, Add, MoreVert } from "@mui/icons-material";
import GreenCheckmarkMUI from "./GreenCheckmarkMUI";
import { Box, IconButton, Tooltip, Menu, MenuItem, Fade } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AssignmentControlButtonsMUI({
  assignmentId,
  deleteAssignment
}: {
  assignmentId: string;
  deleteAssignment: (assignmentId: string) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showActions, setShowActions] = useState(false);
  const open = Boolean(anchorEl);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete button clicked for assignment:", assignmentId);
    deleteAssignment(assignmentId);
  };

  const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        opacity: showActions ? 1 : 0.7,
        transition: 'opacity 0.2s ease-in-out',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {currentUser?.role === "FACULTY" && (
        <Fade in={showActions} timeout={200}>
          <Tooltip title="Edit assignment" placement="top">
            <IconButton
              size="small"
              sx={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </Fade>
      )}

      {currentUser?.role === "FACULTY" && (
        <Fade in={showActions} timeout={300} style={{ transitionDelay: '50ms' }}>
          <Tooltip title="Delete assignment" placement="top">
            <IconButton
              onClick={handleDelete}
              size="small"
              sx={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'error.light',
                  transform: 'scale(1.1)',
                  color: 'error.main',
                }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Fade>
      )}

      <GreenCheckmarkMUI />

      <Fade in={showActions} timeout={200} style={{ transitionDelay: '100ms' }}>
        <Tooltip title="Add content" placement="top">
          <IconButton
            size="small"
            sx={{
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'scale(1.1) rotate(90deg)',
              }
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
      </Fade>

      <Tooltip title="More options" placement="top">
        <IconButton
          size="small"
          onClick={handleMoreClick}
          sx={{
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: open ? 'rotate(90deg) scale(1.1)' : 'rotate(90deg)',
            }
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            '& .MuiMenuItem-root': {
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateX(4px)',
              }
            }
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>Duplicate Assignment</MenuItem>
        <MenuItem onClick={handleMenuClose}>Move to Top</MenuItem>
        <MenuItem onClick={handleMenuClose}>Move to Bottom</MenuItem>
        <MenuItem onClick={handleMenuClose}>Send To...</MenuItem>
        <MenuItem onClick={handleMenuClose}>Copy To...</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share to Commons</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Delete Assignment
        </MenuItem>
      </Menu>
    </Box>
  );
}
