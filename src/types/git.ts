export type DecisionType = "success" | "warning" | "neutral";

export interface GitHubTokenRequest {
  access_token: string;
}

export interface GitHubTokenResult {
  access_token: string;
}

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

export interface AddRepositoryRequest {
  name: string;
  url: string;
}

export interface AddRepositoryResult {
  repository_id: number;
  name: string;
  url: string;
}

export interface RepositoryItem {
  repository_id: number;
  name: string;
  url: string;
}

export interface CheckGitHubTokenStatusResult {
  is_registered: boolean;
}
