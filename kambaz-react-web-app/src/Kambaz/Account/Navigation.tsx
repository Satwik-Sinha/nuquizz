import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { pathname } = useLocation();

  const linkStyle = {
    color: "#4E2A84", // Northwestern Purple
    textDecoration: "none",
    padding: "12px 16px",
    borderBottom: "1px solid #E8E8EA",
    borderRadius: "8px",
    margin: "4px 0",
    transition: "all 0.3s ease",
    display: "block",
  };

  const activeLinkStyle = {
    ...linkStyle,
    fontWeight: "bold",
    background:
      "linear-gradient(135deg, #4E2A84 0%, #2D1B69 50%, #1A0F3A 100%)",
    color: "#FFFFFF",
    borderBottom: "none",
    boxShadow: "0 4px 12px rgba(78, 42, 132, 0.3)",
  };

  const hoverStyle = {
    background: "linear-gradient(135deg, #7B5AA6 0%, #4E2A84 100%)",
    color: "#FFFFFF",
  };

  return (
    <div
      id="wd-account-navigation"
      className="d-flex flex-column"
      style={{ padding: "16px 0" }}
    >
      {/* Show Signin & Signup only if there is no currentUser */}
      {!currentUser && (
        <>
          <Link
            to="/Kambaz/Account/Signin"
            style={pathname.includes("Signin") ? activeLinkStyle : linkStyle}
            onMouseEnter={(e) => {
              if (!pathname.includes("Signin")) {
                Object.assign((e.target as HTMLElement).style, hoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (!pathname.includes("Signin")) {
                Object.assign((e.target as HTMLElement).style, linkStyle);
              }
            }}
            className="mb-2"
          >
            Signin
          </Link>
          <Link
            to="/Kambaz/Account/Signup"
            style={pathname.includes("Signup") ? activeLinkStyle : linkStyle}
            onMouseEnter={(e) => {
              if (!pathname.includes("Signup")) {
                Object.assign((e.target as HTMLElement).style, hoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (!pathname.includes("Signup")) {
                Object.assign((e.target as HTMLElement).style, linkStyle);
              }
            }}
            className="mb-2"
          >
            Signup
          </Link>
        </>
      )}

      {/* Show Profile only if user is signed in */}
      {currentUser && (
        <Link
          to="/Kambaz/Account/Profile"
          style={pathname.includes("Profile") ? activeLinkStyle : linkStyle}
          onMouseEnter={(e) => {
            if (!pathname.includes("Profile")) {
              Object.assign((e.target as HTMLElement).style, hoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!pathname.includes("Profile")) {
              Object.assign((e.target as HTMLElement).style, linkStyle);
            }
          }}
          className="mb-2"
        >
          Profile
        </Link>
      )}

      {currentUser && currentUser.role === "ADMIN" && (
        <Link
          to={`/Kambaz/Account/Users`}
          style={pathname.includes("Users") ? activeLinkStyle : linkStyle}
          onMouseEnter={(e) => {
            if (!pathname.includes("Users")) {
              Object.assign((e.target as HTMLElement).style, hoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!pathname.includes("Users")) {
              Object.assign((e.target as HTMLElement).style, linkStyle);
            }
          }}
          className="mb-2"
        >
          Users
        </Link>
      )}
    </div>
  );
}
