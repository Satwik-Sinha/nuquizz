export interface DiscussionPost {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'FACULTY' | 'TA';
  };
  courseId: string;
  category: 'QUESTION' | 'NOTE' | 'POLL' | 'GENERAL';
  tags: string[];
  isAnonymous: boolean;
  isPinned: boolean;
  isResolved: boolean;
  isFollowed?: boolean;
  votes: {
    upvotes: number;
    downvotes: number;
    userVotes: { [userId: string]: 'up' | 'down' };
  };
  views: number;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
  folders?: string[];
  isPrivate?: boolean;
  duplicateOf?: string;
}

export interface Reply {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'FACULTY' | 'TA';
  };
  postId: string;
  parentReplyId?: string;
  isAnonymous: boolean;
  isInstructorAnswer: boolean;
  isEndorsed: boolean;
  votes: {
    upvotes: number;
    downvotes: number;
    userVotes: { [userId: string]: 'up' | 'down' };
  };
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionFilters {
  category?: 'QUESTION' | 'NOTE' | 'POLL' | 'GENERAL' | 'ALL';
  status?: 'UNRESOLVED' | 'RESOLVED' | 'ALL';
  author?: 'ME' | 'INSTRUCTORS' | 'ALL';
  tags?: string[];
  sortBy?: 'RECENT' | 'POPULAR' | 'UNRESOLVED' | 'OLDEST';
  searchQuery?: string;
  folder?: string;
  followed?: boolean;
}

export interface CreatePostData {
  title: string;
  content: string;
  category: 'QUESTION' | 'NOTE' | 'POLL' | 'GENERAL';
  tags: string[];
  isAnonymous: boolean;
  isPrivate?: boolean;
  folders?: string[];
}

export interface PostStats {
  totalPosts: number;
  resolvedQuestions: number;
  unresolvedQuestions: number;
  notes: number;
  polls: number;
}

export interface Folder {
  _id: string;
  name: string;
  description?: string;
  courseId: string;
  createdBy: string;
  isDefault: boolean;
  color?: string;
}
