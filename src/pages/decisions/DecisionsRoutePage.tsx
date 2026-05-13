import { useParams } from "react-router-dom";
import type { DecisionDetailViewModel } from "@/types/decision";
import { parseRouteId } from "@/utils/parseRouteId";
import DecisionDetailPage from "./DecisionDetailPage";
import { useApplicationDetail } from "./hooks/useApplicationDetail";
import { useConnectedCommits } from "./hooks/useConnectedCommits";
import { useRecommendedCommits } from "./hooks/useRecommendedCommits";
import DecisionsPage from "./index";
import { MOCK_DECISION_DETAIL_VIEW_MODEL } from "./mocks";

const DecisionsRoutePage = () => {
  const { decisionId: decisionIdParam, applicationId: applicationIdParam } =
    useParams<{ decisionId: string; applicationId: string }>();
  const decisionId = parseRouteId(decisionIdParam);
  const applicationId = parseRouteId(applicationIdParam);

  const detailQuery = useApplicationDetail(applicationId);
  const recommendedQuery = useRecommendedCommits(applicationId);
  const connectedQuery = useConnectedCommits(applicationId);

  if (decisionId == null || applicationId == null) {
    return <DecisionsPage />;
  }

  const isLoading =
    detailQuery.isLoading ||
    recommendedQuery.isLoading ||
    connectedQuery.isLoading;
  const error =
    detailQuery.error ?? recommendedQuery.error ?? connectedQuery.error;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-10 typo-body5 text-(--color-text-secondary)">
        불러오는 중...
      </div>
    );
  }

  if (error || !detailQuery.data) {
    return (
      <div className="flex h-full items-center justify-center p-10 typo-body5 text-(--color-text-secondary)">
        적용사항을 불러오지 못했습니다.
      </div>
    );
  }

  // TODO: api 연동
  const vm: DecisionDetailViewModel = {
    detail: detailQuery.data,
    application: MOCK_DECISION_DETAIL_VIEW_MODEL.application,
    meta: MOCK_DECISION_DETAIL_VIEW_MODEL.meta,
    confidence: MOCK_DECISION_DETAIL_VIEW_MODEL.confidence,
    applied_commits: MOCK_DECISION_DETAIL_VIEW_MODEL.applied_commits,
    recommended_commits: recommendedQuery.data ?? [],
    linked_commits: connectedQuery.data?.commits ?? [],
    footer_stats: MOCK_DECISION_DETAIL_VIEW_MODEL.footer_stats,
  };

  return <DecisionDetailPage vm={vm} />;
};

export default DecisionsRoutePage;
