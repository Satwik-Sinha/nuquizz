import React from 'react';
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  SxProps,
  Theme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DiscussionFilters as IDiscussionFilters } from './types';

interface DiscussionFiltersProps {
  filters: IDiscussionFilters;
  onFiltersChange: (filters: IDiscussionFilters) => void;
  sx?: SxProps<Theme>;
}

export default function DiscussionFilters({ filters, onFiltersChange, sx }: DiscussionFiltersProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFilterChange = (field: keyof IDiscussionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category && filters.category !== 'ALL') count++;
    if (filters.status && filters.status !== 'ALL') count++;
    if (filters.author && filters.author !== 'ALL') count++;
    if (filters.tags && filters.tags.length > 0) count++;
    return count;
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        ...sx
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        alignItems: isMobile ? 'stretch' : 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <TextField
          placeholder="Search discussions..."
          variant="outlined"
          size="small"
          sx={{
            minWidth: isMobile ? '100%' : 250,
            flex: isMobile ? 1 : 'none'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category || 'ALL'}
            label="Category"
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="QUESTION">Questions</MenuItem>
            <MenuItem value="NOTE">Notes</MenuItem>
            <MenuItem value="POLL">Polls</MenuItem>
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || 'ALL'}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="UNRESOLVED">Unresolved</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
          </Select>
        </FormControl>

        {/* Author Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Author</InputLabel>
          <Select
            value={filters.author || 'ALL'}
            label="Author"
            onChange={(e) => handleFilterChange('author', e.target.value)}
          >
            <MenuItem value="ALL">Everyone</MenuItem>
            <MenuItem value="ME">My Posts</MenuItem>
            <MenuItem value="INSTRUCTORS">Instructors</MenuItem>
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'RECENT'}
            label="Sort By"
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <MenuItem value="RECENT">Most Recent</MenuItem>
            <MenuItem value="POPULAR">Most Popular</MenuItem>
            <MenuItem value="UNRESOLVED">Unresolved First</MenuItem>
          </Select>
        </FormControl>

        {/* Active Filters Indicator */}
        {getActiveFilterCount() > 0 && (
          <Chip
            icon={<FilterIcon />}
            label={`${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? 's' : ''} active`}
            color="primary"
            variant="outlined"
            size="small"
            onClick={() => onFiltersChange({
              category: 'ALL',
              status: 'ALL',
              author: 'ALL',
              sortBy: 'RECENT'
            })}
            onDelete={() => onFiltersChange({
              category: 'ALL',
              status: 'ALL',
              author: 'ALL',
              sortBy: 'RECENT'
            })}
          />
        )}
      </Box>
    </Paper>
  );
}
