import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaArrowLeft } from "react-icons/fa"

type ReportDetails = {
  id: number,
  orderId: number,
  reportDate: string,
  reason: string,
  description: string,
  status: string,
  imagePath: string,
}

// TODO: add delete report button
export default function ReportDetails({ reportDetails }: { reportDetails: ReportDetails }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 md:px-10 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Report Details</h1>
            <div className="flex items-center space-x-2">
              <ReportIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 font-medium">Report #{reportDetails.id}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Order #{reportDetails.orderId} reported</h2>
              <div className="text-gray-500 dark:text-gray-400">
                <p>{reportDetails.reason}</p> 
                <p>{reportDetails.description}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Report Date</h2>
              <div className="text-gray-500 dark:text-gray-400">{reportDetails.reportDate}</div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Report Status</h2>
              {/* TODO price in cents */}
              <div className="text-gray-500 dark:text-gray-400 font-medium">{reportDetails.status}</div>
            </div>
          </div>
          <Link href="/reports">
            <BackArrowIconWithTooltip />
          </Link>
        </div>
      </div>
    </main>
  )
}

// Back arrow icon wrapped with tooltip
function BackArrowIconWithTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <FaArrowLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Back to your reports
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// SVG ASSETS
const ReportIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2zm0 8h2v2h-2z"/>
  </svg>
);