import type { Participant } from "@/contexts/MeetingsContext";
import ParticipantTile from "./ParticipantTile";

interface ParticipantGridProps {
  participants: Participant[];
}

const ParticipantGrid = ({ participants }: ParticipantGridProps) => {
  const count = participants.length;
  const gridCols =
    count <= 2 ? "grid-cols-2" : count <= 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className={`grid w-full gap-5 ${gridCols}`}>
      {participants.map((p) => (
        <ParticipantTile key={p.id} name={p.name} isSelf={p.isSelf} />
      ))}
    </div>
  );
};

export default ParticipantGrid;
