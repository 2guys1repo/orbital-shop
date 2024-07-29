import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { OrderStatus, ReportStatus } from "@prisma/client";

export default function StatusBadge({ orderStatus, reportStatus }: { orderStatus?: OrderStatus, reportStatus?: ReportStatus }) {
  let color = "";
  let statusText = "";

  if (orderStatus) {
    switch (orderStatus) {
      case OrderStatus.PENDING:
        color = "cursor-pointer bg-yellow-500 text-white";
        statusText = "Pending";
        break;
      case OrderStatus.SHIPPED:
        color = "cursor-pointer bg-green-500 text-white";
        statusText = "Shipped";
        break;
      case OrderStatus.REJECTED:
        color = "cursor-pointer bg-red-500 text-white";
        statusText = "Rejected";
        break;
      default:
        color = "cursor-pointer bg-gray-500 text-white";
        statusText = "Unknown";
        break;
    }
  } else if (reportStatus) {
    switch (reportStatus) {
      case ReportStatus.PENDING:
        color = "cursor-pointer bg-yellow-500 text-white";
        statusText = "Pending";
        break;
      case ReportStatus.ACCEPTED:
        color = "cursor-pointer bg-green-500 text-white";
        statusText = "Accepted";
        break;
      case ReportStatus.REJECTED:
        color = "cursor-pointer bg-red-500 text-white";
        statusText = "Rejected";
        break;
      default:
        color = "cursor-pointer bg-gray-500 text-white";
        statusText = "Unknown";
        break;
    }
  }

  return <Badge className={color}>{capitalizeFirstLetter(statusText)}</Badge>;
}
