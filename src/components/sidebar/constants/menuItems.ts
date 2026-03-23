import IconGit from "@/assets/icons/ic_git.svg?react";
import IconHeadphones from "@/assets/icons/ic_headphones.svg?react";
import IconHome from "@/assets/icons/ic_home.svg?react";
import IconLogout from "@/assets/icons/ic_logout.svg?react";
import IconNotebook from "@/assets/icons/ic_notebook.svg?react";
import IconSettings from "@/assets/icons/ic_settings.svg?react";
import type { MenuItem } from "../types";

export const mainMenuItems: MenuItem[] = [
  { id: "home", icon: IconHome, label: "홈", path: "/" },
];

export const subMenuItems: MenuItem[] = [
  {
    id: "decisions",
    icon: IconNotebook,
    label: "결정 사항",
    path: "/decisions",
  },
  { id: "meeting", icon: IconHeadphones, label: "음성 회의", path: "/meeting" },
  { id: "git", icon: IconGit, label: "GIT", path: "/git" },
];

export const footerMenuItems: MenuItem[] = [
  { id: "settings", icon: IconSettings, label: "설정", path: "/settings" },
  { id: "logout", icon: IconLogout, label: "로그아웃" },
];
