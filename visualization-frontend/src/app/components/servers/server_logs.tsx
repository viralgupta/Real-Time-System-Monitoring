"use client";
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
import Link from "next/link";

const ServerLogs = ({ data }: { data: any }) => {

  return (
    <div className="w-full h-1/2">
      <Table>
        <TableCaption>A list of training logs linked with this server.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">ID</TableHead>
            <TableHead>Log Iterations</TableHead>
            <TableHead className="text-right">Learn More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.map((d) => {
            return (
              <TableRow key={d._id} className="py-2">
                <TableCell>{d._id}</TableCell>
                <TableCell>{d.Logs.length}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/training/live/${d.train_uuid}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                  >
                    View Training Logs
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServerLogs;
