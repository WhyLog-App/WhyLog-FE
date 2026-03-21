import { useLocation, useNavigate } from "react-router-dom";
import type { MenuItem } from "../types";

export const useSidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (item: MenuItem) => {
    if (item.id === "logout") {
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (item: MenuItem) => {
    if (!item.path) return false;
    if (item.path === "/") return location.pathname === "/";
    return location.pathname.startsWith(item.path);
  };

  return { handleMenuClick, isActive };
};
