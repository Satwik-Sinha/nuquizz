import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Fab,
  useTheme,
  useMediaQuery,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  QuestionMark,
  StickyNote2,
  Poll,
  TrendingUp,
  Visibility,
  BookmarkBorder,
  Bookmark,
  NotificationsNone
} from '@mui/icons-material';
import DiscussionList from './DiscussionList';
import CreatePostDialog from './CreatePostDialog';
import DiscussionFilters from './DiscussionFilters';
import { DiscussionPost, DiscussionFilters as IDiscussionFilters, PostStats } from './types';
import { useParams } from 'react-router-dom';

// Enhanced mock data with more Piazza-like posts
const mockPosts: DiscussionPost[] = [
  {
    _id: '1',
    title: 'Question about React Hooks - useState vs useEffect',
    content: `Hi everyone! I'm having trouble understanding the difference between useState and useEffect hooks. 

Can someone explain:
1. When to use each one?
2. How they interact with each other?
3. Best practices for using them together?

I've been working on Assignment 2 and getting confused about state management. Any help would be appreciated!`,
    author: {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT'
    },
    courseId: 'course1',
    category: 'QUESTION',
    tags: ['react', 'hooks', 'assignment2', 'help'],
    isAnonymous: false,
    isPinned: false,
    isResolved: false,
    isFollowed: true,
    votes: { upvotes: 8, downvotes: 1, userVotes: {} },
    views: 45,
    replies: [
      {
        _id: 'r1',
        content: 'useState is for managing component state, while useEffect is for side effects like API calls or DOM manipulation.',
        author: { _id: 'ta1', firstName: 'Sarah', lastName: 'Johnson', role: 'TA' },
        postId: '1',
        isAnonymous: false,
        isInstructorAnswer: true,
        isEndorsed: true,
        votes: { upvotes: 12, downvotes: 0, userVotes: {} },
        replies: [],
        createdAt: '2025-01-10T11:00:00Z',
        updatedAt: '2025-01-10T11:00:00Z'
      }
    ],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
    folders: ['assignments']
  },
  {
    _id: '2',
    title: 'IMPORTANT: Assignment 3 Due Date Extended + Office Hours',
    content: `Hi everyone,

**Due to popular request, we're extending the Assignment 3 deadline to next Friday (Jan 17th) at 11:59 PM.**

Additional office hours this week:
- Wednesday 2-4 PM (TA: Sarah)
- Thursday 1-3 PM (Prof. Smith)
- Friday 10-12 PM (TA: Mike)

Please make use of these extra office hours if you need help!

Best regards,
Prof. Smith`,
    author: {
      _id: 'prof1',
      firstName: 'Professor',
      lastName: 'Smith',
      role: 'FACULTY'
    },
    courseId: 'course1',
    category: 'NOTE',
    tags: ['announcement', 'assignment3', 'deadline', 'office-hours'],
    isAnonymous: false,
    isPinned: true,
    isResolved: false,
    votes: { upvotes: 25, downvotes: 0, userVotes: {} },
    views: 142,
    replies: [],
    createdAt: '2025-01-09T14:30:00Z',
    updatedAt: '2025-01-09T14:30:00Z',
    folders: ['announcements']
  },
  {
    _id: '3',
    title: 'Poll: Preferred time for review session before midterm?',
    content: `When would you prefer to have the midterm review session? Please vote and comment with your availability!

Options:
A) Monday 6-8 PM
B) Tuesday 4-6 PM  
C) Wednesday 7-9 PM
D) Thursday 5-7 PM`,
    author: {
      _id: 'ta1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'TA'
    },
    courseId: 'course1',
    category: 'POLL',
    tags: ['midterm', 'review-session', 'scheduling'],
    isAnonymous: false,
    isPinned: false,
    isResolved: false,
    votes: { upvotes: 15, downvotes: 0, userVotes: {} },
    views: 67,
    replies: [],
    createdAt: '2025-01-08T16:00:00Z',
    updatedAt: '2025-01-08T16:00:00Z',
    folders: ['exams']
  },
  {
    _id: '4',
    title: 'Study group for Assignment 2 - anyone interested?',
    content: `Hi classmates! I'm organizing a study group for Assignment 2. We'll meet this weekend to work through the problems together and help each other out.

If you're interested, please reply with your availability:
- Saturday afternoon
- Sunday morning  
- Sunday afternoon

Let's help each other succeed! 🚀`,
    author: {
      _id: 'user2',
      firstName: 'Anonymous',
      lastName: 'Student',
      role: 'STUDENT'
    },
    courseId: 'course1',
    category: 'GENERAL',
    tags: ['study-group', 'assignment2', 'collaboration'],
    isAnonymous: true,
    isPinned: false,
    isResolved: false,
    votes: { upvotes: 6, downvotes: 0, userVotes: {} },
    views: 28,
    replies: [],
    createdAt: '2025-01-07T12:15:00Z',
    updatedAt: '2025-01-07T12:15:00Z',
    folders: ['study-groups']
  }
];

export default function Discussions() {
  const [posts, setPosts] = useState<DiscussionPost[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<DiscussionPost[]>(mockPosts);
  const [filters, setFilters] = useState<IDiscussionFilters>({
    category: 'ALL',
    status: 'ALL',
    author: 'ALL',
    sortBy: 'RECENT',
    searchQuery: ''
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { cid } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate statistics
  const stats: PostStats = {
    totalPosts: posts.length,
    resolvedQuestions: posts.filter(p => p.category === 'QUESTION' && p.isResolved).length,
    unresolvedQuestions: posts.filter(p => p.category === 'QUESTION' && !p.isResolved).length,
    notes: posts.filter(p => p.category === 'NOTE').length,
    polls: posts.filter(p => p.category === 'POLL').length
  };

  useEffect(() => {
    applyFilters();
  }, [filters, posts, searchQuery]);

  const applyFilters = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (!post.isAnonymous &&
          `${post.author.firstName} ${post.author.lastName}`.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'ALL') {
      filtered = filtered.filter(post => post.category === filters.category);
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'RESOLVED') {
        filtered = filtered.filter(post => post.isResolved);
      } else if (filters.status === 'UNRESOLVED') {
        filtered = filtered.filter(post => !post.isResolved && post.category === 'QUESTION');
      }
    }

    // Author filter
    if (filters.author && filters.author !== 'ALL') {
      if (filters.author === 'INSTRUCTORS') {
        filtered = filtered.filter(post => post.author.role === 'FACULTY' || post.author.role === 'TA');
      } else if (filters.author === 'ME') {
        filtered = filtered.filter(post => post.author._id === 'currentUser');
      }
    }

    // Followed filter
    if (filters.followed) {
      filtered = filtered.filter(post => post.isFollowed);
    }

    // Sort
    if (filters.sortBy === 'RECENT') {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (filters.sortBy === 'POPULAR') {
      filtered.sort((a, b) => (b.votes.upvotes - b.votes.downvotes + b.views/10) - (a.votes.upvotes - a.votes.downvotes + a.views/10));
    } else if (filters.sortBy === 'UNRESOLVED') {
      filtered.sort((a, b) => {
        if (a.isResolved === b.isResolved) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.isResolved ? 1 : -1;
      });
    } else if (filters.sortBy === 'OLDEST') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // Pinned posts first
    filtered.sort((a, b) => {
      if (a.isPinned === b.isPinned) return 0;
      return a.isPinned ? -1 : 1;
    });

    setFilteredPosts(filtered);
  };

  const handleCreatePost = (postData: any) => {
    const newPost: DiscussionPost = {
      _id: Date.now().toString(),
      ...postData,
      author: {
        _id: 'currentUser',
        firstName: 'Current',
        lastName: 'User',
        role: 'STUDENT'
      },
      courseId: cid || '',
      isPinned: false,
      isResolved: false,
      votes: { upvotes: 0, downvotes: 0, userVotes: {} },
      views: 0,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCreateDialogOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
          Discussions
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {stats.totalPosts}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Total Posts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography variant="h5" color="error" fontWeight="bold">
                  {stats.unresolvedQuestions}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Unresolved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {stats.resolvedQuestions}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Resolved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card variant="outlined" sx={{ textAlign: 'center', py: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography variant="h5" color="info.main" fontWeight="bold">
                  {stats.notes}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Notes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Quick Actions */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ minWidth: 100 }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{ minWidth: 120 }}
            >
              New Post
            </Button>
          </Stack>
        </Paper>
      </Box>

      <DiscussionFilters
        filters={filters}
        onFiltersChange={setFilters}
        sx={{ mb: 3 }}
      />

      <DiscussionList
        posts={filteredPosts}
        onPostUpdate={(updatedPost) => {
          setPosts(prevPosts =>
            prevPosts.map(post =>
              post._id === updatedPost._id ? updatedPost : post
            )
          );
        }}
      />

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="create post"
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <CreatePostDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setFilters({ ...filters, followed: !filters.followed }); setAnchorEl(null); }}>
          <BookmarkBorder sx={{ mr: 1 }} />
          {filters.followed ? 'Show All Posts' : 'Show Followed Only'}
        </MenuItem>
        <MenuItem onClick={() => { setFilters({ ...filters, status: 'UNRESOLVED' }); setAnchorEl(null); }}>
          <QuestionMark sx={{ mr: 1 }} />
          Unresolved Questions
        </MenuItem>
        <MenuItem onClick={() => { setFilters({ ...filters, author: 'INSTRUCTORS' }); setAnchorEl(null); }}>
          <NotificationsNone sx={{ mr: 1 }} />
          Instructor Posts
        </MenuItem>
      </Menu>
    </Container>
  );
}
