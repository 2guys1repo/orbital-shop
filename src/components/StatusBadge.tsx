import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { OrderStatus } from "@prisma/client";

// Returns a colored badge based on status
export default function StatusBadge({ status }: { status: OrderStatus }) {
  let color = "";
  switch (status) {
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
  return <Badge className={color}>
    {capitalizeFirstLetter(status)}
  </Badge>
}

