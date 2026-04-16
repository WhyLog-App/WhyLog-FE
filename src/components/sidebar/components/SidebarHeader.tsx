import { useEffect, useRef, useState } from "react";
import IconChevronDown from "@/assets/icons/arrow/ic_chevron_down.svg?react";
import IconAddPlus from "@/assets/icons/edit/ic_add_plus.svg?react";
import IconMenuBurger from "@/assets/icons/menu/ic_menu_burger.svg?react";
import { Icon } from "@/components/common/Icon";
import { TeamImage } from "@/components/common/TeamImage";
import CreateTeamModal from "@/components/panel/CreateTeamModal";
import { useCreateTeam } from "@/pages/home/hooks/useCreateTeam";
import type { Team } from "@/types/team";
import { useTeams } from "../hooks/useTeams";
import { TeamListDropdown } from "./TeamListDropdown";

interface SidebarHeaderProps {
  isOpen: boolean;
}

export const SidebarHeader = ({ isOpen }: SidebarHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: teams = [] } = useTeams();

  const { createTeam, isPending } = useCreateTeam({
    onSuccess: (result) => {
      setCurrentTeam({
        team_id: result.team_id,
        name: result.name,
        team_image: result.image_url ?? null,
      });
      setIsModalOpen(false);
    },
  });

  useEffect(() => {
    if (teams.length > 0 && !currentTeam) {
      setCurrentTeam(teams[0]);
    }
  }, [teams, currentTeam]);

  useEffect(() => {
    if (!isOpen) {
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTeam = (team: Team) => {
    setCurrentTeam(team);
    setIsDropdownOpen(false);
  };

  const handleCreateTeam = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleModalCreate = (teamName: string, photo: File | null) => {
    createTeam(teamName, photo ?? undefined);
  };

  const hasTeams = teams.length > 0;

  return (
    <>
      <div className="relative flex items-center gap-1" ref={dropdownRef}>
        <div className="flex size-12 shrink-0 items-center justify-center">
          <Icon icon={IconMenuBurger} size={20} className="h-3.5" />
        </div>
        {isOpen && (
          <>
            {hasTeams ? (
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`group flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors ${
                  isDropdownOpen ? "bg-action-active" : "hover:bg-action-hover"
                }`}
              >
                <TeamImage
                  src={currentTeam?.team_image}
                  alt={`${currentTeam?.name ?? "팀"} 이미지`}
                  size={18}
                />
                <span className="typo-subtitle5 max-w-24 truncate text-black">
                  {currentTeam?.name ?? "팀 명"}
                </span>
                <Icon
                  icon={IconChevronDown}
                  size={14}
                  className={`opacity-0 transition-all duration-200 group-hover:opacity-100 ${
                    isDropdownOpen ? "rotate-180 opacity-100!" : ""
                  }`}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-text-secondary transition-colors hover:bg-action-hover"
              >
                <Icon icon={IconAddPlus} size={16} className="shrink-0" />
                <span className="typo-subtitle5 whitespace-nowrap">
                  새 팀 만들기
                </span>
              </button>
            )}
            {isDropdownOpen && hasTeams && (
              <TeamListDropdown
                teams={teams}
                currentTeamId={currentTeam?.team_id ?? null}
                onSelectTeam={handleSelectTeam}
                onCreateTeam={handleCreateTeam}
              />
            )}
          </>
        )}
      </div>
      {isModalOpen && (
        <CreateTeamModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleModalCreate}
          isPending={isPending}
        />
      )}
    </>
  );
};
