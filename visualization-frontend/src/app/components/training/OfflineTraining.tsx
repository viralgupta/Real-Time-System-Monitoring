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

const OfflineTraining = () => {
  const [offlineTrainingLogs, setOfflineTrainingLogs] = useState([]);

  const getPendingTrainingLogs = async () => {
    const response = await fetch(
      "http://localhost:5000/api/training/getOfflineTrainingLogs"
    );
    const data = await response.json();
    setOfflineTrainingLogs(data.data);
  };

  useEffect(() => {
    getPendingTrainingLogs();
  }, []);

  return (
    <div className="w-full  h-1/2 mb-2 overflow-x-scroll">
      <Table>
        <TableCaption>A list of offline trainings.</TableCaption>
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
          {offlineTrainingLogs.map((log) => (
            <TableRow key={log.uuid}>
              <TableCell>{log.uuid}</TableCell>
              <TableCell>{log.model_type}</TableCell>
              <TableCell>{log.model_name}</TableCell>
              <TableCell className="text-right">{log.status}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/training/offline/${log.uuid}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Logs
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OfflineTraining;
