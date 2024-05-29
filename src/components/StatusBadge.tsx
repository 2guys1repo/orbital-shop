import { Badge } from "./ui/badge";

// Returns a colored badge based on status
export default function StatusBadge({ status }: { status: string }) {
  let color = "";
  switch (status) {
    case "pending":
      color = "cursor-pointer bg-yellow-500 text-white";
      break;
    case "shipped":
      color = "cursor-pointer bg-green-500 text-white";
      break;
    case "rejected":
      color = "cursor-pointer bg-red-500 text-white";
      break;
  }
  return <Badge className={color}>
    {capitalize(status)}
  </Badge>
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}