import GitList from "./components/GitList.tsx";
import { mockGitData } from "./mockData";

function GitPage() {
  return (
    <div className="flex w-full flex-col py-[60px]">
      <GitList
        repositoryName={mockGitData.repositoryName}
        stats={mockGitData.stats}
        commits={mockGitData.commits}
      />
    </div>
  );
}

export default GitPage;
