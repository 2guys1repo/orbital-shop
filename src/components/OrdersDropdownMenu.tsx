"use client"

import { useTransition } from "react"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/_actions/order";
import { OrderStatus, ReportStatus } from "@prisma/client";
import { updateReportStatus } from "@/app/_actions/report";

export function DropdownItem({ itemId, children, nextOrderStatus, nextReportStatus }: { itemId: number, children: React.ReactNode, nextOrderStatus?: OrderStatus, nextReportStatus?: ReportStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      className="cursor-pointer px-8"
      onClick={() => {
        startTransition(async () => {
          if (nextOrderStatus) {
            await updateOrderStatus(itemId, nextOrderStatus);
          } else if (nextReportStatus) {
            await updateReportStatus(itemId, nextReportStatus);
          }
          router.refresh()
        })
      }}>
      {children}
    </DropdownMenuItem>
  )
}

