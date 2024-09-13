import si from 'systeminformation';

export default async function log(SERVER_API: string, firstTime: boolean) {
  let timeInfo: null | si.Systeminformation.TimeData = null;
  let systemInfo: null | si.Systeminformation.SystemData = null;
  let cpuInfo: null | si.Systeminformation.CpuData = null;
  let memoryInfo: null | si.Systeminformation.MemData = null;
  let gpuInfo: null | si.Systeminformation.GraphicsControllerData[] = null;
  let osInfo: null | si.Systeminformation.OsData = null;
  let fsInfo: null | si.Systeminformation.FsSizeData[] = null;
  let fsStats: null | si.Systeminformation.FsStatsData = null;

  if (firstTime) {
    const [
      fetchedTimeInfo,
      fetchedSystemInfo,
      fetchedCpuInfo,
      fetchedMemoryInfo,
      fetchedGpuInfo,
      fetchedOsInfo,
      fetchedFsInfo,
      fetchedFsStats,
    ] = await Promise.all([
      si.time(),
      si.system(),
      si.cpu(),
      si.mem(),
      si.graphics(),
      si.osInfo(),
      si.fsSize(),
      si.fsStats(),
    ]);

    timeInfo = fetchedTimeInfo;
    systemInfo = fetchedSystemInfo;
    cpuInfo = fetchedCpuInfo;
    memoryInfo = fetchedMemoryInfo;
    gpuInfo = fetchedGpuInfo.controllers;
    osInfo = fetchedOsInfo;
    fsInfo = fetchedFsInfo;
    fsStats = fetchedFsStats;
  } else {
    const [
      fetchedTimeInfo,
      fetchedMemoryInfo,
      fetchedGpuInfo,
      fetchedFsInfo,
      fetchedFsStats,
    ] = await Promise.all([
      si.time(),
      si.mem(),
      si.graphics(),
      si.fsSize(),
      si.fsStats(),
    ]);

    timeInfo = fetchedTimeInfo;
    memoryInfo = fetchedMemoryInfo;
    gpuInfo = fetchedGpuInfo.controllers;
    fsInfo = fetchedFsInfo;
    fsStats = fetchedFsStats;
  }

  
  const filterKeys = (data: object, keysToKeep: string[]) => {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => keysToKeep.includes(key))
    );
  };

  const filteredTimeInfo = timeInfo ? filterKeys(timeInfo, ['current', 'timezone']) : null;
  const filteredSystemInfo = systemInfo ? filterKeys(systemInfo, ['model', 'version', 'uuid']) : null;
  const filteredCpuInfo = cpuInfo ? filterKeys(cpuInfo, ['manufacturer', 'brand', 'speed', 'cores', 'physicalCores', 'processors', 'performanceCores']) : null;
  const filteredMemoryInfo = memoryInfo ? filterKeys(memoryInfo, ['total', 'active', 'available']) : null;
  const filteredGpuInfo = gpuInfo ? gpuInfo.map(gpu => filterKeys(gpu, ['vendor', 'model', 'memoryTotal', 'memoryFree', 'temperatureGpu', 'powerDraw'])) : null;
  const filteredOsInfo = osInfo ? filterKeys(osInfo, ['platform', 'distro', 'arch']) : null;
  const filteredFsInfo = fsInfo ? fsInfo.map(fs => filterKeys(fs, ['fs', 'type', 'size', 'available', 'rw'])) : null;
  const filteredFsStats = fsStats ? filterKeys(fsStats, ['rx', 'wx']) : null;

  const data = {
    time: filteredTimeInfo,
    system: filteredSystemInfo,
    cpu: filteredCpuInfo,
    memory: filteredMemoryInfo,
    gpu: filteredGpuInfo,
    os: filteredOsInfo,
    fs: filteredFsInfo,
    fsStats: filteredFsStats,
  };

  try {
    
    console.log('Logging data to server...');
    
    const res = await fetch(SERVER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    const response = await res.json();
    
    console.log('Data logged to server:', response);
  } catch (error) {
    console.log("error",error)
  }
}