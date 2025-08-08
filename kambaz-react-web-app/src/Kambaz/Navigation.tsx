import { Link, useLocation } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup } from "react-bootstrap";
import { useKeyboardNavigation } from "../components/useKeyboardNavigation";

export default function KambazNavigation() {
  const { pathname } = useLocation();
  const links = [
    { label: "Dashboard", path: "/Kambaz/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses", path: "/Kambaz/Courses", icon: LiaBookSolid },
    { label: "Calendar", path: "/Kambaz/Calendar", icon: IoCalendarOutline },
    { label: "Inbox", path: "/Kambaz/Inbox", icon: FaInbox },
    { label: "Labs", path: "/Labs", icon: LiaCogSolid },
  ];

  const gradientStyle = {
    background: 'linear-gradient(135deg, #4E2A84 0%, #2D1B69 50%, #1A0F3A 100%)',
    width: 120
  };

  const isActiveRoute = (path: string, label: string) => {
    if (path === "/Kambaz/Account") {
      return pathname.includes("Account");
    }
    return pathname.includes(label);
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <ListGroup 
        id="wd-kambaz-navigation" 
        style={gradientStyle}
        className="rounded-0 position-fixed bottom-0 top-0 d-block z-2"
        as="nav"
        role="navigation"
        aria-label="Main navigation"
      >
        <ListGroup.Item 
          id="wd-neu-link" 
          target="_blank" 
          href="https://www.northeastern.edu/"
          action 
          className="border-0 text-center d-none d-md-block"
          style={{ background: 'linear-gradient(135deg, #4E2A84 0%, #2D1B69 100%)' }}
          aria-label="Northeastern University website (opens in new tab)"
        >
          <img 
            src="/images/NEU.png" 
            width="75px" 
            alt="Northeastern University logo" 
          />
        </ListGroup.Item>
        
        <ListGroup.Item 
          as={Link} 
          to="/Kambaz/Account" 
          className={`text-center border-0 text-white ${isActiveRoute("/Kambaz/Account", "Account") ? 'nav-item-active' : ''}`}
          style={!isActiveRoute("/Kambaz/Account", "Account") ? { background: 'transparent' } : undefined}
          aria-label="Account management"
          aria-current={isActiveRoute("/Kambaz/Account", "Account") ? 'page' : undefined}
          role="link"
        >
          <FaRegCircleUser className="fs-1 text-white" aria-hidden="true" />
          <br />
          <span className="d-none d-md-inline">Account</span>
          <span className="d-md-none">Account</span>
        </ListGroup.Item>
        
        {links.map((link) => (
          <ListGroup.Item 
            key={link.path} 
            as={Link} 
            to={link.path}
            className={`text-center border-0 text-white ${isActiveRoute(link.path, link.label) ? 'nav-item-active' : ''}`}
            style={!isActiveRoute(link.path, link.label) ? { background: 'transparent' } : undefined}
            aria-label={`Navigate to ${link.label}`}
            aria-current={isActiveRoute(link.path, link.label) ? 'page' : undefined}
            role="link"
          >
            {link.icon({ className: "fs-1 text-white", "aria-hidden": true })}
            <br />
            <span className="d-none d-md-inline">{link.label}</span>
            <span className="d-md-none">{link.label}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
