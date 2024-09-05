import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui";
import { auth } from "../../firebaseConfig";
import { useState } from "react";

const LogoutButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleLogout} loading={loading}>
      Logout
    </Button>
  );
};

export default LogoutButton;
