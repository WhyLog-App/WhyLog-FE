import { useParams } from "react-router-dom";
import { parseRouteId } from "@/utils/parseRouteId";
import DecisionDetailPage from "./DecisionDetailPage";
import DecisionsPage from "./index";
import { getMockDecisionDetail } from "./mocks";

const DecisionsRoutePage = () => {
  const { decisionId: decisionIdParam, applicationId: applicationIdParam } =
    useParams<{ decisionId: string; applicationId: string }>();
  const decisionId = parseRouteId(decisionIdParam);
  const applicationId = parseRouteId(applicationIdParam);

  if (decisionId == null || applicationId == null) {
    return <DecisionsPage />;
  }

  // TODO: API 연동 시 useDecisionDetail(decisionId) +
  // useDecisionApplication(applicationId) 로 교체
  const vm = getMockDecisionDetail(decisionId, applicationId);

  return <DecisionDetailPage vm={vm} />;
};

export default DecisionsRoutePage;
