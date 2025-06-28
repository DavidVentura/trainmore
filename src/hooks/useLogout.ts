import { useNavigate } from "react-router";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return logout;
};
