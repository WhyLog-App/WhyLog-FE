import EmptyStateCard from "@/components/common/EmptyStateCard";

function HomePage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-8">
      <EmptyStateCard page="Home" />
    </div>
  );
}

export default HomePage;
