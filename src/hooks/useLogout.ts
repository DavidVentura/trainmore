import { useNavigate } from "react-router";
import { toast } from "sonner";
export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    toast.error("Logged out");
    navigate("/login");
  };

  return logout;
};
