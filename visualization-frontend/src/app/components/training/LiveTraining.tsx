"use client";
import React, { useEffect, useState } from "react";
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

const LiveTraining = () => {
  const [liveTrainingLogs, setLiveTrainingLogs] = useState([]);

  const getPendingTrainingLogs = async () => {
    const response = await fetch(
      "http://localhost:5000/api/training/getPendingTrainingLogs"
    );
    const data = await response.json();
    setLiveTrainingLogs(data.data);
  };

  useEffect(() => {
    getPendingTrainingLogs();
  }, []);

  return (
    <div className="w-full  h-1/2 mb-2 overflow-x-scroll">
      <Table>
        <TableCaption>A list of live trainings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">UUID</TableHead>
            <TableHead>Model type</TableHead>
            <TableHead>Model Name</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Learn More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {liveTrainingLogs.map((log) => (
            <TableRow key={log.uuid}>
              <TableCell>{log.uuid}</TableCell>
              <TableCell>{log.model_type}</TableCell>
              <TableCell>{log.model_name}</TableCell>
              <TableCell className="text-right">{log.status}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/training/live/${log.uuid}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Live Trail
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LiveTraining;
