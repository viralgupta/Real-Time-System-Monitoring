// @ts-nocheck
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

const LiveServer = () => {
  const [activeServers, setActiveServers] = useState([])

  const fetchActiveServers = async () => {
    const response = await fetch("http://localhost:5000/api/server/getActiveServers")
    const data = await response.json()
    setActiveServers(data.data)
  }

  useEffect(() => {
    fetchActiveServers()
  }, [])
  

  return (
    <div className="w-full h-1/2 mb-2 overflow-x-scroll">
      <Table>
        <TableCaption>A list of active servers.</TableCaption>
        <TableHeader>
        <TableRow>
            <TableHead className="w-[300px]">UUID</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Learn More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeServers.map((server) => {
            return (
              <TableRow key={server.uuid}>
                <TableCell>{server.uuid}</TableCell>
                <TableCell>{server.model}</TableCell>
                <TableCell>{server.version}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/servers/${server.uuid}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LiveServer;
