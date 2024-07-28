import { getAuthenticatedUser } from "@/app/_actions/auth";
import ReportForm from "@/components/ReportForm";

export default async function ReportOrder({ params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Server failed to authenticate user");
   const orderId = parseInt(params.id);
  return <>
    <ReportForm orderId = {orderId} userId = {user.id}/>
  </>
}