import { FaPlus } from "react-icons/fa6";
import GreenCheckmarkMUI from "./GreenCheckmarkMUI";
import ModuleEditorMUI from "./ModuleEditorMUI";
import { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack
} from "@mui/material";
import {
  Add,
  Publish,
  Visibility,
  UnfoldLess,
  ExpandMore
} from "@mui/icons-material";

export default function ModulesControlsMUI(
  { moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }
) {
  const [show, setShow] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<UnfoldLess />}
          sx={{ textTransform: "none" }}
        >
          Collapse All
        </Button>

        <Button
          variant="outlined"
          size="medium"
          startIcon={<Visibility />}
          sx={{ textTransform: "none" }}
        >
          View Progress
        </Button>

        <Button
          variant="contained"
          size="medium"
          startIcon={<GreenCheckmarkMUI />}
          endIcon={<ExpandMore />}
          onClick={handleMenuClick}
          sx={{
            textTransform: "none",
            backgroundColor: "success.main",
            "&:hover": {
              backgroundColor: "success.dark",
            },
          }}
        >
          Publish All
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "publish-button",
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 280,
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <GreenCheckmarkMUI />
            </ListItemIcon>
            <ListItemText>Publish All</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <GreenCheckmarkMUI />
            </ListItemIcon>
            <ListItemText>Publish all modules and items</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <GreenCheckmarkMUI />
            </ListItemIcon>
            <ListItemText>Publish modules only</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <GreenCheckmarkMUI />
            </ListItemIcon>
            <ListItemText>Unpublish all modules and items</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <GreenCheckmarkMUI />
            </ListItemIcon>
            <ListItemText>Unpublish modules only</ListItemText>
          </MenuItem>
        </Menu>

        <Button
          variant="contained"
          color="error"
          size="medium"
          startIcon={<Add />}
          onClick={handleShow}
          sx={{ textTransform: "none" }}
        >
          Module
        </Button>
      </Stack>

      <ModuleEditorMUI
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
    </Box>
  );
}
