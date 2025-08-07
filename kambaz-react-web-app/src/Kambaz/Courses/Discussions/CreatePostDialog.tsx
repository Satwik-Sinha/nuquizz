import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  Stack,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { CreatePostData } from './types';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (postData: CreatePostData) => void;
}

export default function CreatePostDialog({ open, onClose, onSubmit }: CreatePostDialogProps) {
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    category: 'QUESTION',
    tags: [],
    isAnonymous: false
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      category: 'QUESTION',
      tags: [],
      isAnonymous: false
    });
    setTagInput('');
    setErrors({});
    onClose();
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="h2">
            Create New Discussion Post
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <Stack spacing={3}>
          {/* Category Selection */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                category: e.target.value as 'QUESTION' | 'NOTE' | 'POLL'
              }))}
            >
              <MenuItem value="QUESTION">Question</MenuItem>
              <MenuItem value="NOTE">Note</MenuItem>
              <MenuItem value="POLL">Poll</MenuItem>
            </Select>
          </FormControl>

          {/* Title */}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Enter a descriptive title for your post"
          />

          {/* Content */}
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            multiline
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            error={!!errors.content}
            helperText={errors.content}
            placeholder="Write your question, note, or poll details here..."
          />

          {/* Tags */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tags (optional)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </Box>

            {formData.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Anonymous Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isAnonymous}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                color="primary"
              />
            }
            label="Post anonymously"
            sx={{ alignSelf: 'flex-start' }}
          />

          {formData.isAnonymous && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: -2, ml: 4 }}>
              Your name will not be visible to other students, but instructors can see who posted.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title.trim() || !formData.content.trim()}
        >
          Create Post
        </Button>
      </DialogActions>
    </Dialog>
  );
}

