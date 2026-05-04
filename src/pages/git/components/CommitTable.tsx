import IconCalendar from "@/assets/icons/communication/ic_calendar.svg?react";
import IconCircleUser from "@/assets/icons/user/ic_circle_user.svg?react";
import { Icon } from "@/components/common/Icon";

interface CommitTableItem {
  id: string;
  hash: string;
  message: string;
  decisionText: string;
  decisionType: "success" | "warning" | "neutral";
  authorName: string;
  dateText: string;
  changesAdded: number;
  changesRemoved: number;
}

interface CommitTableProps {
  commits: CommitTableItem[];
}

const decisionDotClassName = {
  success: "bg-(--color-green-500)",
  warning: "bg-(--color-yellow-500)",
  neutral: "bg-(--color-gray-400)",
} as const;

const CommitTable = ({ commits }: CommitTableProps) => {
  return (
    <table className="w-full table-fixed border-collapse">
      <colgroup>
        <col className="w-[120px]" />
        <col className="w-[280px]" />
        <col className="w-[240px]" />
        <col className="w-[160px]" />
        <col className="w-[200px]" />
        <col className="w-[120px]" />
      </colgroup>
      <thead>
        <tr className="h-11 border-b border-(--color-light-700)">
          <th className="px-2 text-left align-middle">
            <span className="typo-caption1 font-normal uppercase tracking-[0.02em] text-(--color-text-secondary)">
              COMMIT
            </span>
          </th>
          <th className="px-2 text-left align-middle">
            <span className="typo-caption1 font-normal uppercase tracking-[0.02em] text-(--color-text-secondary)">
              MESSAGE
            </span>
          </th>
          <th className="px-2 text-left align-middle">
            <span className="typo-caption1 font-normal uppercase tracking-[0.02em] text-(--color-text-secondary)">
              연결된 Decision
            </span>
          </th>
          <th className="px-2 text-left align-middle">
            <span className="typo-caption1 font-normal uppercase tracking-[0.02em] text-(--color-text-secondary)">
              AUTHOR
            </span>
          </th>
          <th className="px-2 text-left align-middle">
            <span className="typo-caption1 font-normal uppercase tracking-[0.02em] text-(--color-text-secondary)">
              DATE
            </span>
          </th>
          <th className="px-2 text-right align-middle">
            <span className="typo-caption1 font-normal uppercase tracking-[0.02em] text-(--color-text-secondary)">
              CHANGES
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {commits.map((commit) => (
          <tr
            key={commit.id}
            className="h-11 border-b border-(--color-light-700) bg-(--color-white)"
          >
            <td className="px-2 py-0 align-middle">
              <span className="inline-flex items-center rounded-md bg-(--color-purple-50) px-2 py-1 text-[12px] font-medium tracking-[0.01em] text-(--color-purple-700)">
                {commit.hash}
              </span>
            </td>
            <td className="px-2 py-0 align-middle">
              <span className="typo-body5 font-semibold text-(--color-text-primary)">
                {commit.message}
              </span>
            </td>
            <td className="px-2 py-0 align-middle">
              <div className="flex items-center gap-2">
                {commit.decisionType === "neutral" ? (
                  <span className="typo-body5 text-[rgba(0,0,0,0.3)]">-</span>
                ) : (
                  <>
                    <span
                      className={`inline-flex h-2 w-2 shrink-0 rounded-full ${decisionDotClassName[commit.decisionType]}`}
                    />
                    <span className="typo-body5 text-(--color-text-secondary)">
                      {commit.decisionText}
                    </span>
                  </>
                )}
              </div>
            </td>
            <td className="px-2 py-0 align-middle">
              <div className="flex items-center gap-2">
                <Icon
                  icon={IconCircleUser}
                  size={14}
                  className="text-(--color-dark-100)"
                />
                <span className="typo-body5 text-(--color-text-secondary)">
                  {commit.authorName}
                </span>
              </div>
            </td>
            <td className="px-2 py-0 align-middle">
              <div className="flex items-center gap-2 text-(--color-text-tertiary)">
                <Icon icon={IconCalendar} size={14} className="text-current" />
                <span className="typo-body5 text-(--color-text-tertiary)">
                  {commit.dateText}
                </span>
              </div>
            </td>
            <td className="px-2 py-0 align-middle text-right">
              <span className="typo-body5 font-bold">
                <span className="text-[#05a660]">+{commit.changesAdded}</span>
                <span className="text-(--color-text-secondary) mx-1">-</span>
                <span className="text-[#e53535]">{commit.changesRemoved}</span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommitTable;
