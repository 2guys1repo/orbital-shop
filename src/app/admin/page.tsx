import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FaChevronDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import AdminDropdownContent from "@/components/AdminDropdownContent";
import { isAdmin } from "../_actions/auth";
import { getAllUsers } from "../_actions/user";
import { UserRole } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils";
import NavBar from "@/components/NavBar";

export default async function AdminPage() {
  if (!(await isAdmin())) return <div className="text-destructive text-xl text-center pt-8">Unauthorized</div>
  const users = await getAllUsers();
  return <>
    <NavBar />
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <Table >
        <TableCaption>A list of our users.</TableCaption>
        <TableHeader>
          <TableRow className="font-semibold bg-gray-100 " >
            <TableHead className="font-semibold w-[100px] text-gray-700">ID</TableHead>
            <TableHead className="font-semibold text-gray-700">Username</TableHead>
            <TableHead className="font-semibold text-gray-700">Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Email</TableHead>
            <TableHead className="font-semibold  text-gray-700 px-8">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(user => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.kindeId}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell >
                <AdminDropdownMenu role={user.role as UserRole} userId={user.kindeId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </>
}

function AdminDropdownMenu({ role, userId }: { role: UserRole, userId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {capitalizeFirstLetter(role)}
          <FaChevronDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <AdminDropdownContent curRole={role} userId={userId} />
    </DropdownMenu>
  )
}