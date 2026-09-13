import { Plane, Calendar } from "lucide-react";

import { Table, TableBody, TableCell, TableRow } from "@components/ui/Table";
import { formatISODate } from "@utils/dateUtils";

export default function SearchPlan({ plans = [], onClick = () => {} }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.08]">
            {plans.map((data) => (
              <TableRow key={data.id} onClick={() => onClick(data.id)}>
                <TableCell className="px-5 py-4 text-start transition-colors hover:cursor-pointer hover:bg-gray-50 sm:px-6 dark:hover:bg-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="w-full">
                      <span className="block text-lg font-bold text-gray-800 sm:text-base dark:text-white/90">
                        {data.planName}
                      </span>

                      <div className="mt-2 flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center md:justify-between dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <span>
                            {data.toCity}, {data.toCountry}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <span>
                            {formatISODate(data.startDate)}-
                            {formatISODate(data.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
