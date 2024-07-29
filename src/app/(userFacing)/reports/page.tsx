import { getAuthenticatedUser } from "@/app/_actions/auth"
import { getReportsOfUser } from "@/app/_actions/report";
import InfoTable from "@/components/InfoTable";

// displays reports of a user
export default async function ReportsPage() {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Unable to see sales");
  const reports = await getReportsOfUser(user);
  return <>
    <InfoTable info = {reports} tableType = "reports" />
  </>
}