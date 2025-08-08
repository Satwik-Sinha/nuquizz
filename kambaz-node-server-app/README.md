# Kambaz Node.js Server

Backend API server for the Kambaz quiz application, providing RESTful endpoints for course management, quiz creation, user authentication, and more.

## 🚀 Overview

This Node.js server provides the backend infrastructure for the Kambaz quiz platform. It handles user authentication, course management, quiz operations, and student enrollment using MongoDB for data persistence and Express for the web framework.

## ✨ Features

- **User Authentication**: Session-based authentication with MongoDB session storage
- **Course Management**: CRUD operations for courses and modules
- **Quiz System**: Complete quiz creation, management, and taking functionality
- **Question Types**: Support for Multiple Choice, True/False, and Fill-in-the-Blank questions
- **Automatic Grading**: Real-time scoring and grade calculation
- **Cross-Origin Support**: Configured CORS for frontend integration
- **Session Management**: Secure session handling with MongoDB store
- **Data Validation**: Mongoose schema validation for all models

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database with Mongoose ODM
- **Express Session** - Session management
- **Connect-Mongo** - MongoDB session store
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation
- **dotenv** - Environment variable management

## 📁 Project Structure

```
kambaz-node-server-app/
├── index.js                    # Main server entry point
├── Hello.js                    # Basic hello world route
├── package.json               # Dependencies and scripts
├── Kambaz/                    # Main application modules
│   ├── Users/                 # User management
│   │   ├── dao.js            # Data access layer
│   │   ├── model.js          # Mongoose model
│   │   ├── routes.js         # API routes
│   │   └── schema.js         # Database schema
│   ├── Courses/               # Course management
│   ├── Modules/               # Course modules
│   ├── Quizzes/               # Quiz system
│   │   ├── Questions/         # Quiz questions
│   │   └── Answers/          # Student submissions
│   ├── Enrollments/           # Course enrollment
│   ├── Assignments/           # Assignment management
│   ├── Grades/                # Grading system
│   └── Database/              # Static data and utilities
└── Lab5/                      # Development exercises
    ├── index.js
    ├── PathParameters.js
    ├── QueryParameters.js
    ├── WorkingWithArrays.js
    └── WorkingWithObjects.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGO_CONNECTION_STRING=mongodb://localhost:27017/kambaz
   # OR for MongoDB Atlas:
   # MONGO_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/kambaz
   
   SESSION_SECRET=your-secure-session-secret
   NODE_ENV=development
   PORT=4000
   NETLIFY_URL=https://your-frontend-domain.netlify.app
   ```

3. **Start the server**
   ```bash
   # Development
   npm start
   
   # With nodemon for auto-restart
   npm run dev
   ```

4. **Verify the server is running**
   - Server: http://localhost:4000
   - Health check: http://localhost:4000/api/hello

## 📡 API Endpoints

### Authentication & Users
```
GET    /api/users                    # Get all users
POST   /api/users                    # Create new user
GET    /api/users/:userId            # Get user by ID
PUT    /api/users/:userId            # Update user
DELETE /api/users/:userId            # Delete user
POST   /api/users/signin             # User login
POST   /api/users/signout            # User logout
GET    /api/users/profile            # Get current user profile
```

### Courses
```
GET    /api/courses                  # Get all courses
POST   /api/courses                  # Create new course
GET    /api/courses/:courseId        # Get course by ID
PUT    /api/courses/:courseId        # Update course
DELETE /api/courses/:courseId        # Delete course
```

### Quizzes
```
GET    /api/courses/:courseId/quizzes     # Get quizzes for course
POST   /api/courses/:courseId/quizzes     # Create quiz for course
GET    /api/quizzes/:quizId               # Get quiz by ID
PUT    /api/quizzes/:quizId               # Update quiz
DELETE /api/quizzes/:quizId               # Delete quiz
```

### Questions
```
GET    /api/quizzes/:quizId/questions     # Get questions for quiz
POST   /api/quizzes/:quizId/questions     # Create question
PUT    /api/quizzes/:quizId/questions/:qid # Update question
DELETE /api/quizzes/:quizId/questions/:qid # Delete question
```

### Quiz Attempts & Answers
```
GET    /api/quiz-attempts/:quizId         # Get previous attempt
POST   /api/quiz-attempts/:quizId/submit  # Submit quiz answers
PUT    /api/quiz-attempts/:quizId         # Auto-save progress
GET    /api/quiz-attempts/:quizId/meta    # Get quiz metadata
```

### Enrollments
```
GET    /api/users/:userId/courses         # Get user's courses
POST   /api/users/:userId/courses/:courseId # Enroll in course
DELETE /api/users/:userId/courses/:courseId # Unenroll from course
```

### Debug & Development
```
GET    /api/debug/quizzes/count           # Quiz count
GET    /api/debug/quizzes/stats           # Quiz statistics
GET    /api/debug/answers                 # All answers (limited)
GET    /api/debug/answers/stats           # Answer statistics
```

## 🗄️ Database Models

### User Schema
```javascript
{
  _id: String,
  username: String (required, unique),
  password: String (required),
  firstName: String,
  lastName: String,
  email: String,
  role: String (enum: ["STUDENT", "FACULTY", "ADMIN"]),
  loginId: String,
  section: String,
  lastActivity: Date,
  totalActivity: String
}
```

### Quiz Schema
```javascript
{
  _id: String,
  title: String,
  description: String,
  quizType: String (enum: ["Graded Quiz", "Practice Quiz", ...]),
  points: Number,
  timeLimit: Number,
  multipleAttempts: Boolean,
  maxAttempts: Number,
  published: Boolean,
  course: String (ref: Course),
  createdBy: String (ref: User),
  // ... additional settings
}
```

### Question Schema
```javascript
{
  _id: String,
  quizId: String (ref: Quiz),
  title: String,
  text: String,
  type: String, // 'True/False', 'Multiple Choice', 'Fill in the Blank'
  choices: [String], // For multiple choice
  correctAnswer: Mixed,
  points: Number
}
```

## 🔧 Development

### Adding New Routes
1. Create route handlers in the appropriate module's `routes.js`
2. Import and register routes in `index.js`
3. Add corresponding DAO functions for database operations

### Database Operations
Each module follows the DAO (Data Access Object) pattern:
- `schema.js` - Mongoose schema definition
- `model.js` - Mongoose model creation
- `dao.js` - Database operations
- `routes.js` - Express route handlers

### Session Management
The server uses express-session with MongoDB store:
- Sessions are stored in MongoDB for persistence
- CORS is configured for cross-origin requests
- Session cookies are configured for production deployment

### Environment Variables
- `MONGO_CONNECTION_STRING` - MongoDB connection URL
- `SESSION_SECRET` - Secret for session encryption
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 4000)
- `NETLIFY_URL` - Frontend deployment URL

## 🚀 Deployment

### Production Setup
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Set `NODE_ENV=production`
4. Configure trusted proxy settings for session cookies

### Supported Platforms
- **Heroku**: Add MongoDB Atlas connection string
- **Railway**: Configure environment variables
- **DigitalOcean App Platform**: Set build/run commands
- **AWS Elastic Beanstalk**: Configure Node.js environment

### Health Checks
The server provides several endpoints for monitoring:
- `GET /api/hello` - Basic health check
- `GET /api/check-session` - Session verification
- `GET /api/debug/quizzes/count` - Database connectivity

## 🧪 Testing

### Manual Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test server health
curl http://localhost:4000/api/hello

# Test quiz creation
curl -X POST http://localhost:4000/api/courses/COURSE_ID/quizzes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Quiz", "description": "A test quiz"}'
```

### Debug Endpoints
Several debug endpoints are available for development:
- Quiz statistics and counts
- Answer validation
- Session debugging

## 🔒 Security Features

- **Session-based Authentication**: Secure session management
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Mongoose schema validation
- **Environment Variables**: Sensitive data protection
- **Secure Cookies**: HTTPS-only in production

## 📝 Logging

The server includes comprehensive logging:
- Request/response logging
- Database operation tracking
- Error logging with stack traces
- Session debugging information

## 🤝 Contributing

1. Follow the existing code structure
2. Add appropriate error handling
3. Update API documentation for new endpoints
4. Test all database operations
5. Ensure CORS configuration supports your changes

---

*For frontend integration, see the React app README*
