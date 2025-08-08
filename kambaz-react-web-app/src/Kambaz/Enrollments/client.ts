// src/Kambaz/Enrollments/client.ts
import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER_A6 || "http://localhost:4000";
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

// Create axios instance with credentials
const axiosWithCredentials = axios.create({
  baseURL: REMOTE_SERVER,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle authentication
axiosWithCredentials.interceptors.request.use(
  (config) => {
    console.log(`Enrollments API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Enrollments API request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosWithCredentials.interceptors.response.use(
  (response) => {
    console.log(`Enrollments API response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Enrollments API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const enrollInCourse = async (userId: string, courseId: string) => {
  try {
    console.log(`Enrolling user ${userId} in course ${courseId}`);
    const { data } = await axiosWithCredentials.post('/api/enrollments', { userId, courseId });
    console.log("Enrollment successful");
    return data;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  try {
    console.log(`Unenrolling user ${userId} from course ${courseId}`);
    // Try the user-specific endpoint first
    const { data } = await axiosWithCredentials.delete(`/api/users/${userId}/courses/${courseId}`);
    console.log("Unenrollment successful");
    return data;
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    throw error;
  }
};

export const getAllEnrollments = async () => {
  try {
    console.log("Fetching all enrollments");
    const { data } = await axiosWithCredentials.get('/api/enrollments');
    console.log(`Successfully fetched ${data.length} enrollments`);
    return data;
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    throw error;
  }
};