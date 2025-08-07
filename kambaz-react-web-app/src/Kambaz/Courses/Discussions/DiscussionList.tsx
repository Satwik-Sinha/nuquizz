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
  Button,
  Menu,
  MenuItem,
  CardActionArea,
  LinearProgress
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
  BookmarkBorder,
  Bookmark,
  Share,
  MoreVert,
  School,
  Person,
  CheckCircleOutline,
  Forum,
  TrendingUp
} from '@mui/icons-material';
import { DiscussionPost } from './types';
import { formatDistanceToNow } from 'date-fns';

interface DiscussionListProps {
  posts: DiscussionPost[];
  onPostUpdate: (post: DiscussionPost) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  const iconProps = { fontSize: 'small' as const };
  switch (category) {
    case 'QUESTION':
      return <HelpOutline {...iconProps} sx={{ color: '#1976d2' }} />;
    case 'NOTE':
      return <StickyNote2 {...iconProps} sx={{ color: '#388e3c' }} />;
    case 'POLL':
      return <Poll {...iconProps} sx={{ color: '#f57c00' }} />;
    case 'GENERAL':
      return <Forum {...iconProps} sx={{ color: '#7b1fa2' }} />;
    default:
      return <HelpOutline {...iconProps} />;
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

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'FACULTY':
    case 'TA':
      return <School fontSize="small" />;
    case 'STUDENT':
    default:
      return <Person fontSize="small" />;
  }
};

export default function DiscussionList({ posts, onPostUpdate }: DiscussionListProps) {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

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

  const handleFollow = (post: DiscussionPost) => {
    const updatedPost = {
      ...post,
      isFollowed: !post.isFollowed
    };
    onPostUpdate(updatedPost);
  };

  const handleMenuOpen = (postId: string, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl({ ...menuAnchorEl, [postId]: event.currentTarget });
  };

  const handleMenuClose = (postId: string) => {
    setMenuAnchorEl({ ...menuAnchorEl, [postId]: null });
  };

  const handleMarkResolved = (post: DiscussionPost) => {
    const updatedPost = {
      ...post,
      isResolved: !post.isResolved
    };
    onPostUpdate(updatedPost);
    handleMenuClose(post._id);
  };

  const getNetVotes = (post: DiscussionPost) => {
    return post.votes.upvotes - post.votes.downvotes;
  };

  const getEngagementScore = (post: DiscussionPost) => {
    return post.votes.upvotes + post.replies.length + Math.floor(post.views / 10);
  };

  if (posts.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}
      >
        <Forum sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
        <Typography variant="h6" gutterBottom>
          No discussions found
        </Typography>
        <Typography variant="body2">
          Be the first to start a conversation!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ space: 2 }}>
      {posts.map((post, index) => {
        const netVotes = getNetVotes(post);
        const engagementScore = getEngagementScore(post);
        const currentUserVote = post.votes.userVotes['currentUser'];

        return (
          <Card
            key={post._id}
            sx={{
              mb: 2,
              transition: 'all 0.2s ease-in-out',
              border: post.isPinned ? '2px solid' : '1px solid',
              borderColor: post.isPinned ? 'primary.main' : 'divider',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-1px)'
              }
            }}
          >
            <CardActionArea>
              <CardContent sx={{ pb: 1 }}>
                {/* Header Row */}
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                  {/* Left Side - Category Icon and Voting */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CategoryIcon category={post.category} />
                      {post.isPinned && (
                        <PushPin sx={{ fontSize: 16, color: 'primary.main', ml: 0.5 }} />
                      )}
                    </Box>

                    {/* Voting Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleVote(post, 'up'); }}
                        color={currentUserVote === 'up' ? 'primary' : 'default'}
                        sx={{ p: 0.5 }}
                      >
                        <ThumbUp fontSize="small" />
                      </IconButton>

                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={netVotes > 0 ? 'success.main' : netVotes < 0 ? 'error.main' : 'text.secondary'}
                        sx={{ py: 0.5, minWidth: 24, textAlign: 'center' }}
                      >
                        {netVotes > 0 ? `+${netVotes}` : netVotes}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleVote(post, 'down'); }}
                        color={currentUserVote === 'down' ? 'error' : 'default'}
                        sx={{ p: 0.5 }}
                      >
                        <ThumbDown fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Main Content */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    {/* Title and Status */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: post.isResolved ? 'normal' : 'bold',
                          textDecoration: post.isResolved ? 'line-through' : 'none',
                          opacity: post.isResolved ? 0.7 : 1,
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {post.title}
                      </Typography>

                      {post.isResolved && (
                        <Tooltip title="Resolved">
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                        </Tooltip>
                      )}
                    </Stack>

                    {/* Content Preview */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4
                      }}
                    >
                      {post.content}
                    </Typography>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                        {post.tags.slice(0, 4).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem', height: 24 }}
                          />
                        ))}
                        {post.tags.length > 4 && (
                          <Chip
                            label={`+${post.tags.length - 4} more`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: '0.75rem', height: 24 }}
                          />
                        )}
                      </Stack>
                    )}

                    {/* Author and Metadata */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: getRoleColor(post.author.role),
                            fontSize: '0.75rem'
                          }}
                        >
                          {getRoleIcon(post.author.role)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {post.isAnonymous ? 'Anonymous' : `${post.author.firstName} ${post.author.lastName}`}
                          {!post.isAnonymous && (
                            <Chip
                              label={post.author.role}
                              size="small"
                              sx={{
                                ml: 1,
                                height: 16,
                                fontSize: '0.65rem',
                                bgcolor: getRoleColor(post.author.role),
                                color: 'white'
                              }}
                            />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Typography>
                      </Stack>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mr: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.views}
                            </Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <ReplyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.replies.length}
                            </Typography>
                          </Stack>

                          {engagementScore > 10 && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <TrendingUp sx={{ fontSize: 16, color: 'warning.main' }} />
                              <Typography variant="caption" color="warning.main">
                                Hot
                              </Typography>
                            </Stack>
                          )}
                        </Stack>

                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleFollow(post); }}
                          color={post.isFollowed ? 'primary' : 'default'}
                        >
                          {post.isFollowed ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleMenuOpen(post._id, e); }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>

                    {/* Instructor Answer Indicator */}
                    {post.replies.some(reply => reply.isInstructorAnswer) && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleOutline sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="caption" color="success.main" fontWeight="bold">
                            Instructor Answer Available
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </CardActionArea>

            {/* Context Menu */}
            <Menu
              anchorEl={menuAnchorEl[post._id]}
              open={Boolean(menuAnchorEl[post._id])}
              onClose={() => handleMenuClose(post._id)}
            >
              <MenuItem onClick={() => handleMarkResolved(post)}>
                <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
                {post.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose(post._id)}>
                <Share sx={{ mr: 1, fontSize: 20 }} />
                Share
              </MenuItem>
            </Menu>
          </Card>
        );
      })}
    </Box>
  );
}
