import { useState } from "react";
import GreenCheckmarkMUI from "./GreenCheckmarkMUI";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  MoreVert,
  Publish,
} from "@mui/icons-material";

export default function ModuleControlButtonsMUI({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleMenuClose();
    console.log("Delete button clicked for module:", moduleId);
    deleteModule(moduleId);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit button clicked for module:", moduleId);
    editModule(moduleId);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Edit module">
        <IconButton
          size="small"
          onClick={handleEdit}
          sx={{
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.50",
            },
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete module">
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.50",
            },
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>

      <GreenCheckmarkMUI sx={{ mx: 0.5 }} />

      <Tooltip title="Add item">
        <IconButton size="small" sx={{ color: "grey.600" }}>
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="More options">
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ color: "grey.600" }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Publish fontSize="small" />
          </ListItemIcon>
          <ListItemText>Publish</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
