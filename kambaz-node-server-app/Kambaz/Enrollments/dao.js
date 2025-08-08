// Data access layer for enrollment operations
import model from "./model.js";

// Fetch courses for a user (populated)
export async function findCoursesForUser(userId) {
  const enrolls = await model.find({ user: userId }).populate("course");
  return enrolls.map(e => e.course);
}

// Enroll a user in a course
export function enrollUserInCourse(user, course) {
  return model.create({ _id: `${user}-${course}`, user, course });
}

// Unenroll a user from a course
export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}

// Cleanup enrollments for a course
export function deleteEnrollmentsForCourse(courseId) {
  return model.deleteMany({ course: courseId });
}

// Cleanup enrollments for a user (if needed)
export function deleteEnrollmentsForUser(userId) {
  return model.deleteMany({ user: userId });
}

// List all enrollments
export function findAllEnrollments() {
  return model.find();
}
