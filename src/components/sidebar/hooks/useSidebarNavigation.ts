import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/apis/auth";
import { ROUTES } from "@/constants/routes";
import { tokenStore } from "@/utils/tokenStore";
import type { MenuItem } from "../types";

export const useSidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = async (item: MenuItem) => {
    if (item.id === "logout") {
      try {
        await logout();
        tokenStore.clearToken();
        navigate(ROUTES.LOGIN);
      } catch (error) {
        console.error("로그아웃 요청이 실패해 로컬 세션만 정리했습니다.", {
          status: isAxiosError(error) ? error.response?.status : undefined,
        });
        tokenStore.clearToken();
        navigate(ROUTES.LOGIN);
      }
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
