import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Fade,
  Chip,
  debounce
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  url?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  results?: SearchResult[];
  suggestions?: string[];
  recentSearches?: string[];
  showTrending?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search courses, assignments, quizzes...",
  onSearch,
  onResultClick,
  results = [],
  suggestions = [
    "Computer Science",
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Machine Learning",
    "Database Systems"
  ],
  recentSearches = [],
  showTrending = true,
  autoFocus = false,
  fullWidth = true
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    }, 300),
    [onSearch]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    setIsOpen(newQuery.length > 0 || isFocused);
    debouncedSearch(newQuery);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay to allow for click events on results
    setTimeout(() => {
      setIsFocused(false);
      setIsOpen(false);
    }, 200);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    if (onResultClick) {
      onResultClick(result);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showResults = results.length > 0 && query.length > 0;
  const showSuggestions = !showResults && (query.length === 0 || isFocused);

  return (
    <Box ref={searchRef} sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        ref={inputRef}
        fullWidth={fullWidth}
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#4E2A84' }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ color: '#716C7B' }}
                aria-label="Clear search"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            boxShadow: isOpen ? '0 4px 20px rgba(78, 42, 132, 0.1)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover fieldset': {
              borderColor: '#4E2A84',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 20px rgba(78, 42, 132, 0.15)',
              '& fieldset': {
                borderColor: '#4E2A84',
                borderWidth: 2,
              },
            },
          },
        }}
      />

      <Fade in={isOpen}>
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflowY: 'auto',
            zIndex: 1000,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(78, 42, 132, 0.15)',
            border: '1px solid #E8E8EA',
          }}
        >
          {showResults && (
            <Box sx={{ p: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  px: 2,
                  py: 1,
                  color: '#716C7B',
                  fontWeight: 600,
                  borderBottom: '1px solid #E8E8EA',
                  mb: 1,
                }}
              >
                Search Results
              </Typography>
              <List dense>
                {results.map((result) => (
                  <ListItem
                    key={result.id}
                    component="li"
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(78, 42, 132, 0.04)',
                      },
                    }}
                    onClick={() => handleResultClick(result)}
                  >
                    <ListItemText
                      primary={result.title}
                      secondary={result.description}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: '#2E2E2E',
                          fontWeight: 500,
                        },
                        '& .MuiListItemText-secondary': {
                          color: '#716C7B',
                        },
                      }}
                    />
                    <Chip
                      label={result.category}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(78, 42, 132, 0.1)',
                        color: '#4E2A84',
                        fontSize: '0.75rem',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {showSuggestions && (
            <Box sx={{ p: 1 }}>
              {recentSearches.length > 0 && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, mb: 1 }}>
                    <HistoryIcon sx={{ fontSize: 16, color: '#716C7B', mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ color: '#716C7B', fontWeight: 600 }}>
                      Recent Searches
                    </Typography>
                  </Box>
                  <Box sx={{ px: 2, pb: 2, mb: 2, borderBottom: '1px solid #E8E8EA' }}>
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <Chip
                        key={index}
                        label={search}
                        variant="outlined"
                        size="small"
                        onClick={() => handleSuggestionClick(search)}
                        sx={{
                          mr: 1,
                          mb: 1,
                          borderColor: '#C4B5FD',
                          color: '#4E2A84',
                          '&:hover': {
                            backgroundColor: 'rgba(78, 42, 132, 0.04)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}

              {showTrending && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, mb: 1 }}>
                    <TrendingIcon sx={{ fontSize: 16, color: '#716C7B', mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ color: '#716C7B', fontWeight: 600 }}>
                      Popular Searches
                    </Typography>
                  </Box>
                  <Box sx={{ px: 2, pb: 1 }}>
                    {suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        variant="outlined"
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{
                          mr: 1,
                          mb: 1,
                          borderColor: '#E8E8EA',
                          color: '#716C7B',
                          '&:hover': {
                            backgroundColor: 'rgba(78, 42, 132, 0.04)',
                            borderColor: '#C4B5FD',
                            color: '#4E2A84',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default SearchBar;