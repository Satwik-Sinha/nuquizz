import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Slide,
  IconButton,
  Grid,
  LinearProgress,
  Chip,
} from "@mui/material";
import { Close, Assignment, Save, Cancel, CalendarToday, Grade } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAssignment, addAssignment } from "./reducer";
import * as assignmentsClient from "./client";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AssignmentEditorMUIProps {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  assignmentName: string;
  setAssignmentName: (title: string) => void;
  addAssignment: (assignment: any) => void;
  assignment?: any;
}

export default function AssignmentEditorMUI({
  show,
  handleClose,
  dialogTitle,
  setAssignmentName,
  addAssignment,
  assignment,
}: AssignmentEditorMUIProps) {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [editedAssignment, setEditedAssignment] = useState({
    _id: assignment?._id || "",
    title: assignment?.title || "",
    description: assignment?.description || "",
    points: assignment?.points || 100,
    dueDate: assignment?.dueDate || "",
    availableFrom: assignment?.availableFrom || "",
    availableUntil: assignment?.availableUntil || "",
    course: assignment?.course || "",
  });

  useEffect(() => {
    if (assignment) {
      setEditedAssignment({
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        points: assignment.points,
        dueDate: assignment.dueDate,
        availableFrom: assignment.availableFrom,
        availableUntil: assignment.availableUntil,
        course: assignment.course,
      });
    }
  }, [assignment]);

  const validateForm = () => {
    const newErrors: any = {};

    if (!editedAssignment.title.trim()) {
      newErrors.title = "Assignment title is required";
    }

    if (editedAssignment.points < 0) {
      newErrors.points = "Points must be a positive number";
    }

    if (editedAssignment.availableFrom && editedAssignment.dueDate) {
      if (new Date(editedAssignment.availableFrom) > new Date(editedAssignment.dueDate)) {
        newErrors.dates = "Available from date must be before due date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      if (editedAssignment._id) {
        const updated = await assignmentsClient.updateAssignment(editedAssignment);
        dispatch(updateAssignment(updated));
      } else {
        addAssignment(editedAssignment);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving assignment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedAssignment({ ...editedAssignment, [field]: value });
    setAssignmentName(field === 'title' ? value : editedAssignment.title);

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible',
          position: 'relative',
        }
      }}
    >
      {isSaving && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            borderRadius: '12px 12px 0 0',
          }}
        />
      )}

      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assignment color="primary" />
          <Typography variant="h6" component="div">
            {dialogTitle}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isSaving}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'error.light',
              transform: 'rotate(90deg)',
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create a comprehensive assignment with clear instructions and deadlines.
        </Typography>

        {errors.dates && (
          <Chip
            label={errors.dates}
            color="error"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Assignment Title"
              value={editedAssignment.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Web Development Project"
              disabled={isSaving}
              error={!!errors.title}
              helperText={errors.title}
              sx={{
                '& .MuiOutlinedInput-root': {
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
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={editedAssignment.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed instructions for the assignment..."
              disabled={isSaving}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Points"
              value={editedAssignment.points}
              onChange={(e) => handleInputChange('points', Number(e.target.value))}
              disabled={isSaving}
              error={!!errors.points}
              helperText={errors.points}
              InputProps={{
                startAdornment: <Grade sx={{ color: 'warning.main', mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={editedAssignment.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              disabled={isSaving}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarToday sx={{ color: 'error.main', mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Available From"
              value={editedAssignment.availableFrom}
              onChange={(e) => handleInputChange('availableFrom', e.target.value)}
              disabled={isSaving}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarToday sx={{ color: 'success.main', mr: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Available Until"
              value={editedAssignment.availableUntil}
              onChange={(e) => handleInputChange('availableUntil', e.target.value)}
              disabled={isSaving}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <CalendarToday sx={{ color: 'warning.main', mr: 1 }} />,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 2 }}>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          startIcon={<Cancel />}
          disabled={isSaving}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 2,
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={isSaving}
          startIcon={<Save />}
          sx={{
            minWidth: 140,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
            '&:disabled': {
              opacity: 0.6,
            }
          }}
        >
          {isSaving ? 'Saving...' : editedAssignment._id ? 'Update Assignment' : 'Create Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
