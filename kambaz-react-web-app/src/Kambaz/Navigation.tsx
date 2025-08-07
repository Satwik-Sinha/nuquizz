import { Link, useLocation } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup } from "react-bootstrap";

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

  const activeGradientStyle = {
    background: 'linear-gradient(135deg, #342056 0%, #1A0F3A 50%, #0D0820 100%)'
  };

  return (
    <ListGroup id="wd-kambaz-navigation" style={gradientStyle}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block z-2">
      <ListGroup.Item id="wd-neu-link" target="_blank" href="https://www.northeastern.edu/"
        action className="border-0 text-center"
        style={{ background: 'linear-gradient(135deg, #4E2A84 0%, #2D1B69 100%)' }}>
        <img src="/images/NEU.png" width="75px" /></ListGroup.Item>
      <ListGroup.Item as={Link} to="/Kambaz/Account" className={`text-center border-0 text-white`}
        style={pathname.includes("Account") ? activeGradientStyle : { background: 'transparent' }}>
        <FaRegCircleUser className="fs-1 text-white" />
        <br />
        Account
      </ListGroup.Item>
      {links.map((link) => (
        <ListGroup.Item key={link.path} as={Link} to={link.path}
          className="text-center border-0 text-white"
          style={pathname.includes(link.label) ? activeGradientStyle : { background: 'transparent' }}>
          {link.icon({ className: "fs-1 text-white" })}
          <br />
          {link.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
