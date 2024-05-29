"use client"

import { useTransition } from "react"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/_actions/order";

export function DropdownItem({ nextStatus, orderId, children }: { nextStatus: string, orderId: number, children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      className="cursor-pointer px-8"
      onClick={() => {
        startTransition(async () => {
          await updateOrderStatus(orderId, nextStatus)
          router.refresh()
        })
      }}>
      {children}
    </DropdownMenuItem>
  )
}