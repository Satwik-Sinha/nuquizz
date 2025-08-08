import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  useTheme 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LibraryBooks as LibraryBooksIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface EmptyStateProps {
  type?: 'courses' | 'assignments' | 'quizzes' | 'search' | 'general';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'general',
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  const theme = useTheme();
  
  const getDefaultContent = () => {
    switch (type) {
      case 'courses':
        return {
          title: 'No Courses Yet',
          description: 'Start your learning journey by enrolling in courses or creating new ones.',
          icon: <SchoolIcon sx={{ fontSize: 64 }} />,
          actionLabel: 'Browse Courses'
        };
      case 'assignments':
        return {
          title: 'No Assignments',
          description: 'No assignments have been created for this course yet.',
          icon: <AssignmentIcon sx={{ fontSize: 64 }} />,
          actionLabel: 'Create Assignment'
        };
      case 'quizzes':
        return {
          title: 'No Quizzes',
          description: 'No quizzes have been created for this course yet.',
          icon: <QuizIcon sx={{ fontSize: 64 }} />,
          actionLabel: 'Create Quiz'
        };
      case 'search':
        return {
          title: 'No Results Found',
          description: 'Try adjusting your search criteria or browse all available content.',
          icon: <SearchIcon sx={{ fontSize: 64 }} />,
          actionLabel: 'Clear Search'
        };
      default:
        return {
          title: 'Nothing Here Yet',
          description: 'This section is empty. Check back later or try refreshing the page.',
          icon: <LibraryBooksIcon sx={{ fontSize: 64 }} />,
          actionLabel: 'Refresh'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;
  const finalIcon = icon || defaultContent.icon;
  const finalActionLabel = actionLabel || defaultContent.actionLabel;

  return (
    <Card
      sx={{
        maxWidth: 480,
        margin: '2rem auto',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F7F7F9 100%)',
        border: '1px solid #E8E8EA',
        boxShadow: '0 4px 20px rgba(78, 42, 132, 0.08)',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ padding: 4, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Icon with animation */}
          <Box
            sx={{
              color: '#4E2A84',
              opacity: 0.7,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          >
            {finalIcon}
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#4E2A84',
              marginBottom: 1,
            }}
          >
            {finalTitle}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: '#716C7B',
              maxWidth: 320,
              lineHeight: 1.6,
              marginBottom: 2,
            }}
          >
            {finalDescription}
          </Typography>

          {/* Action Button */}
          {onAction && (
            <Button
              variant="contained"
              onClick={onAction}
              startIcon={type === 'assignments' || type === 'quizzes' ? <AddIcon /> : undefined}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4E2A84 0%, #2D1B69 100%)',
                boxShadow: '0 4px 12px rgba(78, 42, 132, 0.3)',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #342056 0%, #1A0F3A 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(78, 42, 132, 0.4)',
                },
              }}
            >
              {finalActionLabel}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmptyState;