import { Navigate } from "react-router";
import { useSelector } from "react-redux";

function LabsContent() {
  // Check if user is authenticated by looking at the Kambaz store
  const currentUser = useSelector((state: any) => state?.accountReducer?.currentUser);

  // If no user is authenticated, redirect to sign-in
  if (!currentUser) {
    return <Navigate to="/Kambaz/Account/Signin" replace />;
  }

  // Since all labs have been removed, redirect to Kambaz
  return <Navigate to="/Kambaz" replace />;
}

export default function Labs() {
  return <LabsContent />;
}
