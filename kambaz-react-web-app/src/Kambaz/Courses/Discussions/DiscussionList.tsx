import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  TextField,
  InputAdornment,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Visibility,
  Reply as ReplyIcon,
  PushPin,
  CheckCircle,
  HelpOutline,
  StickyNote2,
  Poll,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DiscussionPost, PostType } from './types';
import { formatDistanceToNow } from 'date-fns';

interface DiscussionListProps {
  posts: DiscussionPost[];
  onPostUpdate: (post: DiscussionPost) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'QUESTION':
      return <HelpOutline fontSize="small" />;
    case 'NOTE':
      return <StickyNote2 fontSize="small" />;
    case 'POLL':
      return <Poll fontSize="small" />;
    default:
      return <HelpOutline fontSize="small" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'FACULTY':
      return '#d32f2f';
    case 'TA':
      return '#ed6c02';
    case 'STUDENT':
      return '#2e7d32';
    default:
      return '#757575';
  }
};

export default function DiscussionList({ posts, onPostUpdate }: DiscussionListProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | PostType>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'replies'>('recent');

  const handleVote = (post: DiscussionPost, voteType: 'up' | 'down') => {
    const currentUserId = 'currentUser'; // Replace with actual user ID
    const currentVote = post.votes.userVotes[currentUserId];

    let newUpvotes = post.votes.upvotes;
    let newDownvotes = post.votes.downvotes;
    const newUserVotes = { ...post.votes.userVotes };

    // Remove previous vote if exists
    if (currentVote === 'up') {
      newUpvotes--;
    } else if (currentVote === 'down') {
      newDownvotes--;
    }

    // Add new vote if different from current
    if (currentVote !== voteType) {
      if (voteType === 'up') {
        newUpvotes++;
      } else {
        newDownvotes++;
      }
      newUserVotes[currentUserId] = voteType;
    } else {
      // Remove vote if same as current
      delete newUserVotes[currentUserId];
    }

    const updatedPost = {
      ...post,
      votes: {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVotes: newUserVotes
      }
    };

    onPostUpdate(updatedPost);
  };

  const filteredAndSortedDiscussions = posts
    .filter(post => {
      return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
             post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      // Pinned posts always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'votes':
          return (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes);
        case 'replies':
          return b.replies.length - a.replies.length;
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (filteredAndSortedDiscussions.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6">No discussions found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Discussions
        </Typography>

        {/* Search and Filter */}
        <Stack spacing={2}>
          <TextField
            size="small"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                  >
                    <FilterIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              size="small"
              label={`Filter: ${selectedFilter}`}
              color={selectedFilter !== 'all' ? 'primary' : 'default'}
            />
            <Chip
              size="small"
              label={`Sort: ${sortBy}`}
              color="default"
            />
          </Stack>
        </Stack>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem onClick={() => { setSelectedFilter('all'); setFilterAnchorEl(null); }}>
          All Posts
        </MenuItem>
        <MenuItem onClick={() => { setSelectedFilter('QUESTION'); setFilterAnchorEl(null); }}>
          Questions
        </MenuItem>
        <MenuItem onClick={() => { setSelectedFilter('NOTE'); setFilterAnchorEl(null); }}>
          Notes
        </MenuItem>
        <MenuItem onClick={() => { setSelectedFilter('POLL'); setFilterAnchorEl(null); }}>
          Polls
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setSortBy('recent'); setFilterAnchorEl(null); }}>
          Sort by Recent
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('votes'); setFilterAnchorEl(null); }}>
          Sort by Votes
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('replies'); setFilterAnchorEl(null); }}>
          Sort by Replies
        </MenuItem>
      </Menu>

      {/* Discussion List */}
      <Stack spacing={2} sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {filteredAndSortedDiscussions.map((post) => (
          <Card
            key={post._id}
            elevation={1}
            sx={{
              borderRadius: 2,
              border: post.isPinned ? `2px solid ${theme.palette.primary.main}` : 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                elevation: 3,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <CategoryIcon category={post.category} />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {post.title}
                  </Typography>

                  {post.isPinned && (
                    <Tooltip title="Pinned">
                      <PushPin color="primary" fontSize="small" />
                    </Tooltip>
                  )}

                  {post.isResolved && (
                    <Tooltip title="Resolved">
                      <CheckCircle color="success" fontSize="small" />
                    </Tooltip>
                  )}
                </Box>

                <Chip
                  label={post.category}
                  size="small"
                  color={
                    post.category === 'QUESTION' ? 'primary' :
                    post.category === 'NOTE' ? 'secondary' : 'default'
                  }
                  variant="outlined"
                />
              </Box>

              {/* Content Preview */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.5 }}
              >
                {post.content.length > 150
                  ? `${post.content.substring(0, 150)}...`
                  : post.content
                }
              </Typography>

              {/* Tags */}
              {post.tags.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {post.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Footer */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Author and Time */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: getRoleColor(post.author.role),
                      fontSize: '0.875rem'
                    }}
                  >
                    {post.isAnonymous ? '?' :
                      `${post.author.firstName[0]}${post.author.lastName[0]}`
                    }
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {post.isAnonymous ? 'Anonymous' :
                        `${post.author.firstName} ${post.author.lastName}`
                      }
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Vote buttons */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleVote(post, 'up')}
                      color={post.votes.userVotes['currentUser'] === 'up' ? 'primary' : 'default'}
                    >
                      <ThumbUp fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                      {post.votes.upvotes - post.votes.downvotes}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleVote(post, 'down')}
                      color={post.votes.userVotes['currentUser'] === 'down' ? 'error' : 'default'}
                    >
                      <ThumbDown fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Views */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {post.views}
                    </Typography>
                  </Box>

                  {/* Replies */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Badge badgeContent={post.replies.length} color="primary">
                      <ReplyIcon fontSize="small" color="action" />
                    </Badge>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Results Count */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Showing {filteredAndSortedDiscussions.length} of {posts.length} discussions
        </Typography>
      </Box>
    </Box>
  );
}
