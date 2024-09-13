import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

const OfflineTraining = () => {
  return (
    <div className="w-full  h-1/2 mb-2 overflow-x-scroll">
      <Table>
        <TableCaption>A list of previous trainings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">UUID</TableHead>
            <TableHead>Model type</TableHead>
            <TableHead>Total Time</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Learn More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* <TableRow >
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </div>
  );
};

export default OfflineTraining;
