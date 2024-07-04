import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { isAdmin } from "@/app/_actions/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownItem } from "@/components/OrdersDropdownMenu"
import StatusBadge from "@/components/StatusBadge"
import { FaPencilAlt } from "react-icons/fa";
import { redirect } from "next/navigation"
import { ReportStatus } from "@prisma/client"
import { getAllReports } from "@/app/_actions/report"

// TODO: make reused code cleaner?


// Admin view of all reports
export default async function Reports() {
  const admin = isAdmin();
  if (!admin) redirect("/");
  const reports = await getAllReports();
  if (!reports) throw new Error("Unknown error occured while getting reports");
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader>
          <CardTitle>Report Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>
                    #{report.id}
                  </TableCell>
                  <TableCell>{report.orderId}</TableCell>
                  <TableCell>{report.userId}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    <ReportStatusDropdown status={report.reportStatus} reportId={report.id} />
                  </TableCell>
                  <TableCell>{report.reportDate}</TableCell>
                  <TableCell>
                    <PencilDropdown reportId={report.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Dropdown menu on report status
function ReportStatusDropdown({ status, reportId }: { status: ReportStatus, reportId: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <StatusBadge reportStatus={status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownItem nextReportStatus={ReportStatus.PENDING} itemId={reportId}>
          Pending
        </DropdownItem>
        <DropdownItem nextReportStatus={ReportStatus.ACCEPTED} itemId={reportId} >
          Accepted
        </DropdownItem>
        <DropdownItem nextReportStatus={ReportStatus.REJECTED} itemId={reportId} >
          Rejected
        </DropdownItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Dropdown menu on pencil icon
function PencilDropdown({ reportId }: { reportId: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <FaPencilAlt size={16} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownItem nextReportStatus={ReportStatus.PENDING} itemId={reportId}>
          Mark Pending
        </DropdownItem>
        <DropdownItem nextReportStatus={ReportStatus.ACCEPTED} itemId={reportId} >
          Mark Accepted
        </DropdownItem>
        <DropdownItem nextReportStatus={ReportStatus.REJECTED} itemId={reportId} >
          Mark Rejected
        </DropdownItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}