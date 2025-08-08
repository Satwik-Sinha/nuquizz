# Kambaz React Web Application

Modern React frontend for the Kambaz quiz platform, featuring a responsive Material-UI interface for course management and quiz taking.

## 🚀 Overview

The Kambaz React application provides an intuitive user interface for both instructors and students. Built with React 18, TypeScript, and Material-UI, it offers a modern, responsive design that works seamlessly across desktop and mobile devices.

## ✨ Features

### User Interface
- **Material-UI Components**: Modern, accessible UI components
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Theme**: Configurable theme support
- **Rich Text Editing**: TinyMCE integration for content creation
- **Drag & Drop**: Interactive quiz and module organization
- **Real-time Feedback**: Instant validation and error handling

### Student Features
- **Dashboard**: Overview of enrolled courses and recent activity
- **Course Browser**: Discover and enroll in available courses
- **Quiz Interface**: Clean, distraction-free quiz taking experience
- **Progress Tracking**: Visual progress indicators and score history
- **Auto-save**: Automatic progress saving during quiz attempts
- **Multiple Attempts**: Support for retaking quizzes when allowed

### Instructor Features
- **Course Management**: Create, edit, and organize courses
- **Quiz Builder**: Intuitive quiz creation with multiple question types
- **Question Editor**: Rich text question authoring with media support
- **Student Analytics**: View enrollment and performance data
- **Grade Management**: Automated grading with manual override options
- **Bulk Operations**: Efficient management of multiple items

## 🛠️ Tech Stack

- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Material-UI (MUI)** - React component library
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **TinyMCE** - Rich text editor
- **Date-fns** - Modern date utility library
- **DND Kit** - Drag and drop functionality

## 📁 Project Structure

```
kambaz-react-web-app/
├── public/                     # Static assets
│   ├── index.html             # Main HTML template
│   ├── landing.html           # Landing page
│   ├── images/                # Course and UI images
│   └── tinymce/              # TinyMCE editor assets
├── src/                       # Source code
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── components/           # Reusable components
│   ├── Kambaz/               # Main application
│   │   ├── index.tsx         # Kambaz router
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── Navigation.tsx    # App navigation
│   │   ├── store.ts          # Redux store
│   │   ├── theme.ts          # MUI theme configuration
│   │   ├── Account/          # User account management
│   │   ├── Courses/          # Course management
│   │   ├── Calendar/         # Calendar features
│   │   ├── Grades/           # Grade management
│   │   └── utils/            # Utility functions
│   └── Labs/                 # Development exercises
├── dist/                      # Build output
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Running backend server

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE=http://localhost:4000
   VITE_APP_NAME=Kambaz
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 UI Components & Features

### Dashboard
- Course overview cards with enrollment status
- Recent activity timeline
- Quick access to assignments and quizzes
- Performance metrics and progress charts

### Course Management
- Course creation wizard with rich text descriptions
- Module organization with drag-and-drop
- Student enrollment management
- Course settings and permissions

### Quiz Interface
- Clean, focused quiz-taking environment
- Multiple question type support:
  - Multiple Choice with radio buttons
  - True/False with clear options
  - Fill-in-the-blank with text inputs
- Auto-save functionality
- Progress indicators
- Time management with warnings

### Question Editor
- Rich text editor with formatting options
- Image and media embedding
- Choice management for multiple choice questions
- Answer validation and feedback setup

### Navigation
- Responsive sidebar navigation
- Breadcrumb navigation for deep pages
- Search functionality
- User profile dropdown with quick actions

## 🗂️ State Management

### Redux Store Structure
```typescript
{
  user: {
    currentUser: User | null,
    isAuthenticated: boolean,
    loading: boolean
  },
  courses: {
    allCourses: Course[],
    enrolledCourses: Course[],
    currentCourse: Course | null
  },
  quizzes: {
    currentQuiz: Quiz | null,
    questions: Question[],
    userAnswers: { [questionId: string]: any }
  }
}
```

### Key Actions
- Authentication (signin, signout, profile)
- Course management (create, update, delete, enroll)
- Quiz operations (create, take, submit, grade)
- Real-time state updates

## 🎯 Routing Structure

```
/                           # Landing page
/Kambaz                     # Main application
├── /Dashboard              # User dashboard
├── /Account                # Account management
│   ├── /Profile           # User profile
│   └── /Settings          # Account settings
├── /Courses               # Course management
│   ├── /:courseId         # Course details
│   ├── /:courseId/Modules # Course modules
│   ├── /:courseId/Quizzes # Course quizzes
│   └── /:courseId/Grades  # Course grades
├── /Calendar              # Calendar view
└── /Labs                  # Development labs
```

## 📱 Responsive Design

### Breakpoints
- **xs**: 0-600px (Mobile)
- **sm**: 600-960px (Tablet)
- **md**: 960-1280px (Desktop)
- **lg**: 1280-1920px (Large Desktop)
- **xl**: 1920px+ (Extra Large)

### Mobile Optimizations
- Collapsible sidebar navigation
- Touch-friendly button sizes
- Optimized quiz interface for mobile
- Responsive data tables with horizontal scroll
- Bottom sheet modals for mobile actions

## 🎨 Theme Customization

### Material-UI Theme
The application uses a custom MUI theme with:
- Primary color: Northeastern University red
- Secondary color: Complementary accent
- Typography: Roboto font family
- Custom component overrides
- Dark mode support

### Custom Styling
- CSS modules for component-specific styles
- Global CSS variables for consistent spacing
- Responsive utility classes
- Animation and transition effects

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
```

### Code Organization
- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Hooks**: Custom React hooks
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions
- **Services**: API communication layer

### Development Tools
- **Vite HMR**: Fast hot module replacement
- **TypeScript**: Type checking and IntelliSense
- **ESLint**: Code linting and formatting
- **Redux DevTools**: State debugging
- **React Developer Tools**: Component debugging

## 🌐 Deployment

### Build Configuration
The app is optimized for static hosting with:
- Code splitting for optimal loading
- Asset optimization and compression
- Environment variable injection
- Source map generation for debugging

### Netlify Deployment
Configured with `netlify.toml` for:
- Automatic builds from Git
- SPA routing support
- Environment variable management
- Preview deployments for pull requests

### Other Hosting Options
- **Vercel**: Zero-configuration deployment
- **GitHub Pages**: Free static hosting
- **AWS S3 + CloudFront**: Scalable CDN hosting
- **Firebase Hosting**: Google cloud hosting

## 🧪 Testing

### Testing Setup
```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Strategy
- **Unit Tests**: Component logic testing
- **Integration Tests**: Feature workflow testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: WCAG compliance testing

## 🔒 Security Features

- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: Encrypted local storage
- **Input Validation**: Client-side validation
- **Authentication**: Secure session management

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker for offline support
- **Compression**: Gzip compression for assets

## 🎮 User Experience

### Accessibility
- **WCAG 2.1 AA**: Compliance with accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Logical focus order

### User Feedback
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages and animations
- **Form Validation**: Real-time validation with helpful hints

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with TypeScript
3. Add/update tests for new functionality
4. Run linting and type checking
5. Submit pull request with description

### Code Standards
- TypeScript for type safety
- ESLint configuration for consistent code style
- Prettier for code formatting
- Component composition over inheritance
- Custom hooks for reusable logic

---

*For backend API integration, see the Node.js server README*
