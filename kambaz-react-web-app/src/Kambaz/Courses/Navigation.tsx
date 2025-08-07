import { Link, useLocation } from "react-router-dom";

export default function CourseNavigation() {
  const location = useLocation();
  const cid = location.pathname.split("/")[3];

  const links = [
    { name: "Home", path: "Home" },
    { name: "Modules", path: "Modules" },
    { name: "Piazza", path: "Discussions" },
    { name: "Zoom", path: "Zoom" },
    { name: "Assignments", path: "Assignments" },
    { name: "Quizzes", path: "Quizzes" },
    { name: "Grades", path: "Grades" },
    { name: "People", path: "People" }
  ];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const linkPath = `/Kambaz/Courses/${cid}/${link.path}`;
        const isActive = location.pathname === linkPath;

        return (
          <Link
            key={link.name}
            to={linkPath}
            id={`wd-course-${link.name.toLowerCase()}-link`}
            className={`list-group-item border border-0 ${isActive ? "active" : "text-danger"}`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
