"use client"
import { updateUserRole } from "@/app/_actions/auth";
import { DropdownMenuCheckboxItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AdminDropdownContent({ curRole, userId }: { curRole: UserRole, userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  function handleRoleChange(nextRole: UserRole, check: boolean) {
    if (!check) return; // already checked
    startTransition(async () => {
      await updateUserRole(userId, curRole, nextRole);
      router.refresh();
    })
  }
  return (
    <DropdownMenuContent>
      <DropdownMenuCheckboxItem
        checked={curRole == UserRole.BASIC}
        onCheckedChange={(check) => handleRoleChange(UserRole.BASIC, check)}
      >
        Basic
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={curRole == UserRole.MIDDLEMAN}
        onCheckedChange={(check) => handleRoleChange(UserRole.MIDDLEMAN, check)}
      >
        Middleman
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={curRole == UserRole.ADMIN}
        onCheckedChange={(check) => handleRoleChange(UserRole.ADMIN, check)}
      >
        Admin
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  )
};