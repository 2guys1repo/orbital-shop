import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { OrderStatus, ReportStatus } from "@prisma/client";
import { report } from "process";

// Returns a colored badge based on status
export default function StatusBadge({ orderStatus, reportStatus }: { orderStatus?: OrderStatus, reportStatus?: ReportStatus }) {
  let color = "";
  if (orderStatus) {
    switch (orderStatus) {
      case OrderStatus.PENDING:
        color = "cursor-pointer bg-yellow-500 text-white";
        break;
      case OrderStatus.SHIPPED:
        color = "cursor-pointer bg-green-500 text-white";
        break;
      case OrderStatus.REJECTED:
        color = "cursor-pointer bg-red-500 text-white";
        break;
    }
  } else if (reportStatus) {
    switch (reportStatus) {
      case ReportStatus.PENDING:
        color = "cursor-pointer bg-yellow-500 text-white";
        break;
      case ReportStatus.ACCEPTED:
        color = "cursor-pointer bg-green-500 text-white";
        break;
      case ReportStatus.REJECTED:
        color = "cursor-pointer bg-red-500 text-white";
        break;
    }
  }
  
  return <Badge className={color}>
    {reportStatus ? capitalizeFirstLetter(reportStatus)
                  : capitalizeFirstLetter(orderStatus)}
  </Badge>
}

