"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { io } from "socket.io-client";


const Page = ({ params }: { params: { id: string } }) => {
  const [epochData, setEpochData] = React.useState([]);
  const [logData, setLogData] = React.useState(null);
  const [totalTime, setTotalTime] = React.useState(0)
  const [indexedData, setIndexedData] = useState(null)

  let socket = null;

  const getLogData = async () => {
    const response = await fetch(
      `http://localhost:5000/api/training/getTrainingLog/${params.id}`
    );
    const data = await response.json();
    const epochData = data.data.epoch.map((item, index) => ({
      epoch: index + 1,
      accuracy: item.data.accuracy,
      val_accuracy: item.data.val_accuracy,
      loss: item.data.loss,
      val_loss: item.data.val_loss,
      training_time: item.total_time,
    }));
    setEpochData(epochData);
    setLogData(data.data);
    setTotalTime(data.data.total_time_taken);
  };

  const getServerLogData = async () => {
    const response = await fetch(
      `http://localhost:5000/api/server/getServerLogsFromTrainUUID/${params.id}`
    );
    const data = await response.json();
    if(data.data && data.data.Logs){
      setIndexedData(data.data.Logs);
    }
  };

  const registerSocket = async () => {
    socket = io("ws://localhost:5000", {
      reconnectionDelayMax: 10000,
    });

    socket.emit("setup")

    socket.on("connected", () => {
      socket.emit("join room", params.id)
    })

    socket.on("refresh", () => {
      console.log("Refreshing Train Log data")
      getLogData();
    })

    socket.on("system_data", (data) => {
      console.log("Received new train data")
      const response = JSON.parse(data);
      
      setIndexedData(id => {
        console.log("Setting new data", id)
        if(id === null){
          return [response]
        } else {
          return [...id, response]
        }
      });
    })
  }

  React.useEffect(() => {
    getLogData();
    getServerLogData();
    registerSocket()

    return () => {
      socket.disconnect()
    }

  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy over Epochs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={epochData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#8884d8"
                  name="Training"
                />
                <Line
                  type="monotone"
                  dataKey="val_accuracy"
                  stroke="#82ca9d"
                  name="Validation"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loss over Epochs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={epochData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="#8884d8"
                  name="Training"
                />
                <Line
                  type="monotone"
                  dataKey="val_loss"
                  stroke="#82ca9d"
                  name="Validation"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Time per Epoch</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={epochData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="training_time" fill="#8884d8" name="Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center text-3xl">
            <CardTitle>Final Accuracy Distribution</CardTitle>
          </CardHeader>
          {totalTime && logData && <CardContent className="text-center pt-6">
            <p className="font-semibold">Total Training Time: {totalTime} ms</p>
            <p className="font-semibold">
              Final Accuracy: {logData.stats.accuracy.toFixed(4)}
            </p>
            <p className="font-semibold">
              Final Validation Accuracy: {logData.stats.val_accuracy.toFixed(4)}
            </p>
          </CardContent>}
        </Card>
      </div>
      <div className="w-full h-full p-4 bg-background border rounded-md">
      <h1 className="text-2xl font-bold mb-4">System Metrics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-background p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Memory Usage Over Time</h2>
          <div className="h-64">
            <MemoryUsageChart data={indexedData} />
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">GPU Temperature Over Time</h2>
          <div className="h-64">
            <GPUTemperatureChart data={indexedData} />
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg shadow md:grid-cols-2">
          <h2 className="text-xl font-semibold mb-2">File System Usage Over Time</h2>
          <div className="h-64">
            <FileSystemUsageChart data={indexedData} />
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg shadow md:grid-cols-2">
          <h2 className="text-xl font-semibold mb-2">File System Usage Over Time</h2>
          <div className="h-64">
            <FSStatsChart data={indexedData} />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};


const formatBytes = (bytes: number) => {
  const gigabytes = bytes / (1024 * 1024 * 1024);
  return `${gigabytes.toFixed(2)} GB`;
};

const formatTime = (index: number) => {
  const minutes = index * 5; // Assuming 5-minute intervals between data points
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const formatMBps = (bytes: number) => {
  const mbps = bytes / (1024 * 1024);
  return `${mbps.toFixed(2)} MB/s`;
};

const MemoryUsageChart = ({ data }: { data: typeof data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="index" tickFormatter={formatTime} />
      <YAxis tickFormatter={formatBytes} />
      <Tooltip 
        formatter={(value) => formatBytes(value as number)}
        labelFormatter={(label) => formatTime(label as number)}
      />
      <Legend />
      <Line type="monotone" dataKey="memory.active" name="Active Memory" stroke="#8884d8" />
      <Line type="monotone" dataKey="memory.available" name="Available Memory" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

const GPUTemperatureChart = ({ data }: { data: typeof data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="index" tickFormatter={formatTime} />
      <YAxis />
      <Tooltip 
        labelFormatter={(label) => formatTime(label as number)}
      />
      <Legend />
      <Line type="monotone" dataKey="gpu[1].temperatureGpu" name="GPU Temperature" stroke="#ff7300" />
    </LineChart>
  </ResponsiveContainer>
);

const FileSystemUsageChart = ({ data }: { data: typeof data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="index" tickFormatter={formatTime} />
      <YAxis tickFormatter={formatBytes} />
      <Tooltip 
        formatter={(value) => formatBytes(value as number)}
        labelFormatter={(label) => formatTime(label as number)}
      />
      <Legend />
      <Line type="monotone" dataKey="fs[0].available" name="C: Available" stroke="#8884d8" />
      <Line type="monotone" dataKey="fs[1].available" name="D: Available" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

const FSStatsChart = ({ data }: { data: typeof data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="index" tickFormatter={formatTime} />
      <YAxis tickFormatter={formatMBps} />
      <Tooltip 
        formatter={(value) => formatMBps(value as number)}
        labelFormatter={(label) => formatTime(label as number)}
      />
      <Legend />
      <Line type="monotone" dataKey="fsStats.rx" name="Read Rate" stroke="#8884d8" />
      <Line type="monotone" dataKey="fsStats.wx" name="Write Rate" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);



export default Page;
