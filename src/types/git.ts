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

export interface RepositoryCommitConnectedApplication {
  application_id: number;
  name: string;
}

export interface RepositoryCommitItem {
  commit_id: number;
  hash: string;
  message: string;
  author_name: string;
  date_time: string;
  added_lines: number;
  deleted_lines: number;
  connected_application: RepositoryCommitConnectedApplication | null;
}

export interface RepositoryCommitListResult {
  commit_dtolist: RepositoryCommitItem[];
  commit_list_size: number;
  is_first: boolean;
  has_next: boolean;
  next_cursor_id: number | null;
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

export interface RepositorySyncResult {
  repository_id: number;
}

export interface RepositoryItem {
  repository_id: number;
  name: string;
  url?: string;
  last_sync_date_time?: string;
}

export interface CheckGitHubTokenStatusResult {
  is_registered: boolean;
}
