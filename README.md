# Kambaz Quiz Application

A full-stack web application for creating, managing, and taking quizzes, built with React and Node.js.

## 🚀 Overview

Kambaz is a comprehensive quiz platform that allows instructors to create and manage courses, quizzes, and questions, while students can enroll in courses and take quizzes. The application features a modern React frontend with Material-UI components and a Node.js backend with MongoDB integration.

## 🏗️ Project Structure

```
cs5610-quiz-project-vs-main/
├── kambaz-node-server-app/     # Backend API server
├── kambaz-react-web-app/       # Frontend React application
├── netlify.toml               # Netlify deployment configuration
└── README.md                  # This file
```

## ✨ Features

### For Instructors
- **Course Management**: Create, edit, and delete courses
- **Quiz Creation**: Build comprehensive quizzes with multiple question types
- **Question Types**: Support for Multiple Choice, True/False, and Fill-in-the-Blank
- **Quiz Settings**: Configure time limits, attempts, access codes, and more
- **Student Management**: View enrolled students and their progress
- **Grading**: Automatic scoring and grade management

### For Students
- **Course Enrollment**: Browse and enroll in available courses
- **Quiz Taking**: Interactive quiz interface with progress tracking
- **Multiple Attempts**: Configurable retry options for quizzes
- **Progress Tracking**: View scores and quiz history
- **Responsive Design**: Works on desktop and mobile devices

### Question Types Supported
- **Multiple Choice**: Single correct answer from multiple options
- **True/False**: Boolean questions
- **Fill in the Blank**: Text input with multiple acceptable answers

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **Redux Toolkit** for state management
- **Vite** for build tooling
- **Axios** for API communication
- **React Router** for navigation
- **TinyMCE** for rich text editing

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **Express Session** for authentication
- **CORS** for cross-origin requests
- **UUID** for unique identifiers
- **Connect-Mongo** for session storage

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cs5610-quiz-project-vs-main
   ```

2. **Set up the backend**
   ```bash
   cd kambaz-node-server-app
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../kambaz-react-web-app
   npm install
   ```

4. **Environment Configuration**
   Create `.env` files in both directories with your configuration:
   
   Backend (`kambaz-node-server-app/.env`):
   ```
   MONGO_CONNECTION_STRING=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   PORT=4000
   ```

   Frontend (`kambaz-react-web-app/.env`):
   ```
   VITE_API_BASE=http://localhost:4000
   ```

5. **Start the development servers**
   
   Backend:
   ```bash
   cd kambaz-node-server-app
   npm start
   ```
   
   Frontend (in a new terminal):
   ```bash
   cd kambaz-react-web-app
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 🌐 Deployment

### Frontend (Netlify)
The frontend is configured for Netlify deployment with the `netlify.toml` file. It includes:
- Build settings for React/Vite
- Redirect rules for SPA routing
- Environment variable configuration

### Backend (Any Node.js hosting)
The backend can be deployed to platforms like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 📁 Key Directories

### Backend Structure
- `Kambaz/` - Main application modules
  - `Users/` - User management (authentication, profiles)
  - `Courses/` - Course creation and management
  - `Modules/` - Course module organization
  - `Quizzes/` - Quiz creation and management
  - `Questions/` - Question types and logic
  - `Answers/` - Student submissions and grading
  - `Enrollments/` - Course enrollment system
  - `Assignments/` - Assignment management
  - `Grades/` - Grading system
- `Lab5/` - Development exercises and examples

### Frontend Structure
- `src/Kambaz/` - Main application components
  - `Dashboard/` - User dashboard
  - `Courses/` - Course management interface
  - `Account/` - User account management
  - `Navigation/` - App navigation components
- `src/Labs/` - Development lab exercises

## 🔧 Development

### Running Tests
```bash
# Backend
cd kambaz-node-server-app
npm test

# Frontend
cd kambaz-react-web-app
npm run test
```

### Linting
```bash
# Frontend
cd kambaz-react-web-app
npm run lint
```

### Building for Production
```bash
# Frontend
cd kambaz-react-web-app
npm run build
```

## 📝 API Documentation

The backend provides a RESTful API with the following main endpoints:

- `GET /api/courses` - List all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/:id/quizzes` - Get quizzes for a course
- `POST /api/courses/:id/quizzes` - Create a quiz
- `GET /api/quizzes/:id/questions` - Get quiz questions
- `POST /api/quiz-attempts/:id/submit` - Submit quiz answers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Xiaoyang Fei** - Backend Development
- **Satwik Sinha** - Full Stack Development

## 🆘 Support

For support and questions:
1. Check the documentation in each module's README
2. Create an issue on the GitHub repository
3. Review the API endpoints and component documentation

---

*Built for CS5610 Web Development at Northeastern University*
