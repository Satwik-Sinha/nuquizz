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
  Chip
} from '@mui/material';
import { Add as AddIcon, TrendingUp, QuestionAnswer, Announcement } from '@mui/icons-material';
import DiscussionList from './DiscussionList';
import CreatePostDialog from './CreatePostDialog';
import DiscussionFilters from './DiscussionFilters';
import { DiscussionPost, DiscussionFilters as IDiscussionFilters } from './types';
import { useParams } from 'react-router-dom';

// Mock data - replace with actual API calls
const mockPosts: DiscussionPost[] = [
  {
    _id: '1',
    title: 'Question about React Hooks',
    content: 'Can someone explain the difference between useState and useEffect?',
    author: {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT'
    },
    courseId: 'course1',
    category: 'QUESTION',
    tags: ['react', 'hooks'],
    isAnonymous: false,
    isPinned: false,
    isResolved: false,
    votes: {
      upvotes: 5,
      downvotes: 0,
      userVotes: {}
    },
    views: 23,
    replies: [],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Important: Assignment 3 Due Date Extended',
    content: 'The due date for Assignment 3 has been extended to next Friday.',
    author: {
      _id: 'prof1',
      firstName: 'Professor',
      lastName: 'Smith',
      role: 'FACULTY'
    },
    courseId: 'course1',
    category: 'NOTE',
    tags: ['announcement', 'assignment'],
    isAnonymous: false,
    isPinned: true,
    isResolved: false,
    votes: {
      upvotes: 12,
      downvotes: 0,
      userVotes: {}
    },
    views: 87,
    replies: [],
    createdAt: '2025-01-09T14:30:00Z',
    updatedAt: '2025-01-09T14:30:00Z'
  }
];

export default function Discussions() {
  const [posts, setPosts] = useState<DiscussionPost[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<DiscussionPost[]>(mockPosts);
  const [filters, setFilters] = useState<IDiscussionFilters>({
    category: 'ALL',
    status: 'ALL',
    author: 'ALL',
    sortBy: 'RECENT'
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { cid } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    applyFilters();
  }, [filters, posts]);

  const applyFilters = () => {
    let filtered = [...posts];

    // Category filter
    if (filters.category && filters.category !== 'ALL') {
      filtered = filtered.filter(post => post.category === filters.category);
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'RESOLVED') {
        filtered = filtered.filter(post => post.isResolved);
      } else if (filters.status === 'UNRESOLVED') {
        filtered = filtered.filter(post => !post.isResolved);
      }
    }

    // Sort
    if (filters.sortBy === 'RECENT') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'POPULAR') {
      filtered.sort((a, b) => (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes));
    } else if (filters.sortBy === 'UNRESOLVED') {
      filtered.sort((a, b) => {
        if (a.isResolved === b.isResolved) return 0;
        return a.isResolved ? 1 : -1;
      });
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
      votes: {
        upvotes: 0,
        downvotes: 0,
        userVotes: {}
      },
      views: 0,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCreateDialogOpen(false);
  };

  // Calculate statistics
  const stats = {
    totalPosts: posts.length,
    unresolvedQuestions: posts.filter(post => post.category === 'QUESTION' && !post.isResolved).length,
    announcements: posts.filter(post => post.category === 'NOTE' && post.isPinned).length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0)
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Discussions
        </Typography>
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

      <Fab
        color="primary"
        aria-label="create post"
        onClick={() => setCreateDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
          zIndex: 1000
        }}
      >
        <AddIcon />
      </Fab>

      <CreatePostDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreatePost}
      />
    </Container>
  );
}
