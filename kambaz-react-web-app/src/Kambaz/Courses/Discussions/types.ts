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
  category: 'QUESTION' | 'NOTE' | 'POLL';
  tags: string[];
  isAnonymous: boolean;
  isPinned: boolean;
  isResolved: boolean;
  votes: {
    upvotes: number;
    downvotes: number;
    userVotes: { [userId: string]: 'up' | 'down' };
  };
  views: number;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

// Add missing type exports
export type PostType = 'QUESTION' | 'NOTE' | 'POLL';

export interface Discussion extends DiscussionPost {}

export interface DiscussionWithReplies extends DiscussionPost {
  replies: Reply[];
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
  category?: 'QUESTION' | 'NOTE' | 'POLL' | 'ALL';
  status?: 'UNRESOLVED' | 'RESOLVED' | 'ALL';
  author?: 'ME' | 'INSTRUCTORS' | 'ALL';
  tags?: string[];
  sortBy?: 'RECENT' | 'POPULAR' | 'UNRESOLVED';
}

export interface CreatePostData {
  title: string;
  content: string;
  category: 'QUESTION' | 'NOTE' | 'POLL';
  tags: string[];
  isAnonymous: boolean;
}
