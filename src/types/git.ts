export type DecisionType = "success" | "warning" | "neutral";

export interface GitRepositoryStats {
  commits: number;
  connected: number;
  disconnected: number;
}

export interface GitCommitItem {
  id: string;
  hash: string;
  message: string;
  decisionText: string;
  decisionType: DecisionType;
  authorName: string;
  dateText: string;
  changesAdded: number;
  changesRemoved: number;
}

export interface GitPageData {
  repositoryName: string;
  stats: GitRepositoryStats;
  commits: GitCommitItem[];
}
