"use client";
import ServerInfo from '@/app/components/servers/server_info'
import ServerLogs from '@/app/components/servers/server_logs'
import React, { useEffect, useState } from 'react'

const Page = ({ params }: { params: { id: string } }) => {
  const [serverData, setServerData] = useState([]);
  const [system, setSystem] = useState({});
  const [cpu, setCpu] = useState({});
  const [os, setOs] = useState({});

  const getServerLogs = async () => {
    const response = await fetch(`http://localhost:5000/api/server/getServerLogs/${params.id}`)
    const data = await response.json()
    setSystem(data.data[0].system);
    setCpu(data.data[0].cpu);
    setOs(data.data[0].os);
    setServerData(data.data);
  }

  useEffect(() => {
    getServerLogs()
  }, [])
  
  return (
    <div>
      <ServerInfo system={system} cpu={cpu} os={os}/>
      <ServerLogs data={serverData} />
    </div>
  ) 
}

export default Page