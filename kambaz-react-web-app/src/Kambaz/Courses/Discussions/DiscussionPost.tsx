import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Button,
  TextField,
  Divider,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
  PushPin as PinIcon,
  CheckCircle as ResolvedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Discussion, Reply, DiscussionWithReplies } from './types';

interface DiscussionPostProps {
  discussion: Discussion;
  onBack?: () => void;
}

const DiscussionPost: React.FC<DiscussionPostProps> = ({ discussion, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(discussion.content);

  // Sample replies data
  useEffect(() => {
    const sampleReplies: Reply[] = [
      {
        _id: '1',
        content: 'You can pass props by adding them as attributes to your component when you use it. For example: <MyComponent name="John" age={25} />',
        author: {
          _id: '2',
          firstName: 'Teaching',
          lastName: 'Assistant',
          role: 'TA',
        },
        postId: discussion._id,
        isAnonymous: false,
        isInstructorAnswer: false,
        isEndorsed: true,
        votes: {
          upvotes: 8,
          downvotes: 0,
          userVotes: {}
        },
        replies: [],
        createdAt: '2024-12-01T11:15:00Z',
        updatedAt: '2024-12-01T11:15:00Z',
      },
      {
        _id: '2',
        content: 'Great explanation! Just to add to this, make sure you\'re destructuring the props correctly in your component function: function MyComponent({ name, age }) { ... }',
        author: {
          _id: '4',
          firstName: 'Jane',
          lastName: 'Wilson',
          role: 'STUDENT',
        },
        postId: discussion._id,
        isAnonymous: false,
        isInstructorAnswer: false,
        isEndorsed: false,
        votes: {
          upvotes: 3,
          downvotes: 0,
          userVotes: {}
        },
        replies: [],
        createdAt: '2024-12-01T12:30:00Z',
        updatedAt: '2024-12-01T12:30:00Z',
      },
      {
        _id: '3',
        content: 'This is exactly right. Props flow down from parent to child components. Remember that props are read-only - you cannot modify them within the child component.',
        author: {
          _id: '3',
          firstName: 'Prof.',
          lastName: 'Johnson',
          role: 'FACULTY',
        },
        postId: discussion._id,
        isAnonymous: false,
        isInstructorAnswer: true,
        isEndorsed: true,
        votes: {
          upvotes: 12,
          downvotes: 0,
          userVotes: {}
        },
        replies: [],
        createdAt: '2024-12-01T14:45:00Z',
        updatedAt: '2024-12-01T14:45:00Z',
      }
    ];

    if (discussion._id === '1') {
      setReplies(sampleReplies);
    }
  }, [discussion._id]);

  const handleVote = (type: 'up' | 'down') => {
    setUserVote(userVote === type ? null : type);
  };

  const handleReply = () => {
    if (newReply.trim()) {
      const reply: Reply = {
        _id: Date.now().toString(),
        content: newReply,
        author: {
          _id: 'current-user',
          firstName: 'Current',
          lastName: 'User',
          role: 'STUDENT',
        },
        postId: discussion._id,
        isAnonymous: false,
        isInstructorAnswer: false,
        isEndorsed: false,
        votes: {
          upvotes: 0,
          downvotes: 0,
          userVotes: {}
        },
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setReplies([...replies, reply]);
      setNewReply('');
      setShowReplyBox(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return '#1976d2';
      case 'announcement': return '#ed6c02';
      case 'note': return '#2e7d32';
      default: return '#666';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        {onBack && (
          <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {discussion.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={discussion.category}
              sx={{
                bgcolor: getPostTypeColor(discussion.category),
                color: 'white',
                textTransform: 'capitalize'
              }}
            />
            {discussion.isPinned && (
              <Tooltip title="Pinned">
                <PinIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              </Tooltip>
            )}
            {discussion.isResolved && (
              <Tooltip title="Resolved">
                <ResolvedIcon sx={{ fontSize: 16, color: 'success.main' }} />
              </Tooltip>
            )}
          </Stack>
        </Box>
        <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* Original Post */}
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: discussion.author.role === 'FACULTY' ? 'error.main' :
                        discussion.author.role === 'TA' ? 'warning.main' : 'primary.main'
              }}
            >
              {discussion.author.firstName[0]}{discussion.author.lastName[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {discussion.author.firstName} {discussion.author.lastName}
                </Typography>
                <Chip
                  size="small"
                  label={discussion.author.role}
                  variant="outlined"
                  sx={{ textTransform: 'capitalize', fontSize: '0.7rem', height: 20 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatTimeAgo(new Date(discussion.createdAt))}
                </Typography>
                {new Date(discussion.createdAt).getTime() !== new Date(discussion.updatedAt).getTime() && (
                  <Typography variant="caption" color="text.secondary">
                    (edited)
                  </Typography>
                )}
              </Stack>

              {editMode ? (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    variant="outlined"
                  />
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button size="small" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setEditMode(false)}
                    >
                      Save
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                  {discussion.content}
                </Typography>
              )}

              {/* Tags */}
              {discussion.tags.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {discussion.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: getPostTypeColor(discussion.category),
                        color: getPostTypeColor(discussion.category)
                      }}
                    />
                  ))}
                </Stack>
              )}

              {/* Actions */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleVote('up')}
                    color={userVote === 'up' ? 'primary' : 'default'}
                  >
                    {userVote === 'up' ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  </IconButton>
                  <Typography variant="body2">{discussion.votes.upvotes - discussion.votes.downvotes}</Typography>
                </Box>

                <Button
                  size="small"
                  startIcon={<ReplyIcon />}
                  onClick={() => setShowReplyBox(!showReplyBox)}
                >
                  Reply
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {discussion.views} views
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* Replies Section */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </Typography>

        {replies.map((reply) => (
          <Paper key={reply._id} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: reply.author.role === 'FACULTY' ? 'error.main' :
                          reply.author.role === 'TA' ? 'warning.main' : 'primary.main'
                }}
              >
                {reply.author.firstName[0]}{reply.author.lastName[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {reply.author.firstName} {reply.author.lastName}
                  </Typography>
                  <Chip
                    size="small"
                    label={reply.author.role}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize', fontSize: '0.7rem', height: 18 }}
                  />
                  {reply.isInstructorAnswer && (
                    <Chip
                      size="small"
                      label="Instructor Answer"
                      sx={{ bgcolor: 'error.main', color: 'white', fontSize: '0.7rem', height: 18 }}
                    />
                  )}
                  {reply.isEndorsed && (
                    <Tooltip title="Endorsed by Instructor">
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </Tooltip>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeAgo(new Date(reply.createdAt))}
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                  {reply.content}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small">
                      <ThumbUpOutlinedIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{reply.votes.upvotes}</Typography>
                  </Box>
                  <Button size="small" startIcon={<ReplyIcon />}>
                    Reply
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
        ))}

        {/* Reply Box */}
        {showReplyBox && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Add a reply
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Type your reply..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleReply}
                disabled={!newReply.trim()}
              >
                Post Reply
              </Button>
              <Button onClick={() => setShowReplyBox(false)}>
                Cancel
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => { setEditMode(true); setMenuAnchorEl(null); }}>
          <EditIcon sx={{ mr: 1 }} /> Edit Post
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchorEl(null)}>
          <PinIcon sx={{ mr: 1 }} /> {discussion.isPinned ? 'Unpin' : 'Pin'} Post
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchorEl(null)}>
          <ResolvedIcon sx={{ mr: 1 }} /> Mark as Resolved
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchorEl(null)}>
          <FlagIcon sx={{ mr: 1 }} /> Report
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchorEl(null)} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DiscussionPost;
