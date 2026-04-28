type DecisionStatus = "active" | "warning" | "default";

interface DecisionItemRowProps {
  id: string;
  label: string;
  status: DecisionStatus;
  isActive: boolean;
  onClick: (id: string) => void;
}

const getBulletColor = (status: DecisionStatus) => {
  if (status === "warning") return "bg-(--color-yellow-700)";
  return "bg-(--color-green-500)";
};

const DecisionItemRow = ({
  id,
  label,
  status,
  isActive,
  onClick,
}: DecisionItemRowProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`flex h-8 w-full cursor-pointer items-center gap-3 px-4 text-left ${
        isActive
          ? "bg-(--color-action-active)"
          : "bg-(--color-bg-surface) hover:bg-(--color-action-hover)"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${getBulletColor(status)}`} />
      <span
        className={`typo-button-sm ${
          isActive
            ? "text-(--color-text-brand)"
            : "text-(--color-text-secondary)"
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default DecisionItemRow;
