import CommitTableRow from "./CommitTableRow";

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
  onRowClick?: (commit: CommitTableItem) => void;
}

const CommitTable = ({ commits, onRowClick }: CommitTableProps) => {
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
          <CommitTableRow
            key={commit.id}
            commit={commit}
            onRowClick={onRowClick}
          />
        ))}
      </tbody>
    </table>
  );
};

export type { CommitTableItem };
export default CommitTable;
