// Course poster images mapping
export const courseImages = {
  'RS101': '/images/courses/rocket-propulsion.jpg', // Rocket Propulsion
  'RS102': '/images/courses/aerodynamics.jpg',      // Aerodynamics
  'RS103': '/images/courses/spacecraft-design.jpg', // Spacecraft Design
  'RS104': '/images/courses/organic-chemistry.jpg', // Organic Chemistry
  'RS105': '/images/courses/inorganic-chemistry.jpg', // Inorganic Chemistry
  'RS106': '/images/courses/physical-chemistry.jpg', // Physical Chemistry
  'RS107': '/images/courses/middle-earth-languages.jpg', // Ancient Languages and Scripts of Middle-earth
  'RS108': '/images/courses/middle-earth-diplomacy.jpg', // Wizards, Elves, and Men: Inter-species Diplomacy
};

// Fallback image for courses without specific posters
export const defaultCourseImage = '/images/courses/default-course.jpg';

// Get course image with fallback
export const getCourseImage = (courseId: string): string => {
  return courseImages[courseId as keyof typeof courseImages] || defaultCourseImage;
};

// Course color themes for enhanced visual appeal
export const courseColors = {
  'RS101': { primary: '#FF6B35', secondary: '#F7931E', gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' },
  'RS102': { primary: '#4A90E2', secondary: '#357ABD', gradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)' },
  'RS103': { primary: '#7B68EE', secondary: '#6A5ACD', gradient: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)' },
  'RS104': { primary: '#50C878', secondary: '#2E8B57', gradient: 'linear-gradient(135deg, #50C878 0%, #2E8B57 100%)' },
  'RS105': { primary: '#FF69B4', secondary: '#FF1493', gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)' },
  'RS106': { primary: '#FFD700', secondary: '#FFA500', gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
  'RS107': { primary: '#8B4513', secondary: '#D2691E', gradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)' },
  'RS108': { primary: '#9370DB', secondary: '#8A2BE2', gradient: 'linear-gradient(135deg, #9370DB 0%, #8A2BE2 100%)' },
};

export const getCourseColors = (courseId: string) => {
  return courseColors[courseId as keyof typeof courseColors] || {
    primary: '#4E2A84',
    secondary: '#7B5AA6',
    gradient: 'linear-gradient(135deg, #4E2A84 0%, #7B5AA6 100%)'
  };
};
