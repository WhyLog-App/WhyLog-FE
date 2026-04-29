import IconCircleUser from "@/assets/icons/user/ic_circle_user.svg?react";
import { Icon } from "@/components/common/Icon";

interface CompletedMeetingHeaderProps {
  name: string;
  startText: string;
  durationText: string;
  memberCount: number;
  members: { name: string; profile_image: string | null }[];
}

const EditPenIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const CompletedMeetingHeader = ({
  name,
  startText,
  durationText,
  memberCount,
  members,
}: CompletedMeetingHeaderProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="typo-h5 text-(--color-text-primary)">{name}</h1>
          <span className="typo-caption text-(--color-text-tertiary)">
            {startText} {durationText} {memberCount}명
          </span>
        </div>
        <button
          type="button"
          className="cursor-pointer text-(--color-text-tertiary) hover:text-(--color-text-secondary)"
          aria-label="회의 정보 수정"
        >
          <EditPenIcon />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="typo-subtitle5 text-(--color-text-secondary)">
          대화 기록
        </span>
        <div className="flex items-center gap-2">
          {members.map((m, idx) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: mock list of members
              key={idx}
              className="flex items-center gap-1 rounded-full bg-(--color-bg-subtle) px-2 py-1"
            >
              <Icon
                icon={IconCircleUser}
                size={20}
                className="text-(--color-dark-100)"
              />
              <span className="typo-caption text-(--color-text-secondary)">
                {m.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedMeetingHeader;
