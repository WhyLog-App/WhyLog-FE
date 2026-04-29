import EmptyStateCard from "@/components/common/EmptyStateCard";

function MeetingPage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-8">
      <EmptyStateCard page="Meetings" />
    </div>
  );
}

export default MeetingPage;
