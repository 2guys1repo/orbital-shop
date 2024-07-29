import { getAuthenticatedUser } from "@/app/_actions/auth";
import { getReportDetailsById } from "@/app/_actions/report";
import ReportDetails from "@/components/ReportDetails";

export default async function Report({ params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Server failed to authenticate user");
  const reportId = parseInt(params.id);
  const reportDetails = await getReportDetailsById(reportId);
  return <>
    <ReportDetails reportDetails={reportDetails} />
  </>
}