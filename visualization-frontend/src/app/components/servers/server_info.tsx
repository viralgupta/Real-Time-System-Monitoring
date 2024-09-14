import React from "react";

const ServerInfo = ({
  system,
  cpu,
  os,
}: {
  system: any;
  cpu: any;
  os: any;
}) => {
  const systemInfo = {
    system: system,
    cpu: cpu,
    os: os,
  };

  return (
    <div className="w-full h-1/2 bg-primary-foreground p-6 mb-5">
      <h2 className="text-2xl font-bold mb-4 text-foreground">System Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          title="System"
          icon={<Monitor />}
          items={[
            { label: "UUID", value: systemInfo.system.uuid },
            { label: "Version", value: systemInfo.system.version },
            { label: "Model", value: systemInfo.system.model },
          ]}
        />
        <InfoCard
          title="CPU"
          icon={<Cpu />}
          items={[
            { label: "Manufacturer", value: systemInfo.cpu.manufacturer },
            { label: "Brand", value: systemInfo.cpu.brand },
            { label: "Cores", value: systemInfo.cpu.cores },
            { label: "Physical Cores", value: systemInfo.cpu.physicalCores },
            {
              label: "Performance Cores",
              value: systemInfo.cpu.performanceCores,
            },
            { label: "Processors", value: systemInfo.cpu.processors },
          ]}
        />
        <InfoCard
          title="Operating System"
          icon={<HardDrive />}
          items={[
            { label: "Platform", value: systemInfo.os.platform },
            { label: "Distribution", value: systemInfo.os.distro },
            { label: "Architecture", value: systemInfo.os.arch },
          ]}
        />
      </div>
    </div>
  );
};

function InfoCard({ title, icon, items }) {
  return (
    <div className="bg-background p-4 rounded-lg">
      <div className="flex items-center mb-3 ">
        {icon}
        <h3 className="text-lg font-semibold text-foreground ml-2">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between">
            <span className="text-accent-foreground">{item.label}:</span>
            <span className="text-sm text-foreground w-1/2">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Monitor() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="6"
      height="6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-monitor w-6 h-6"
      data-id="5"
      data-darkreader-inline-stroke=""
    >
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  );
}

function Cpu() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-cpu w-6 h-6"
      data-id="7"
      data-darkreader-inline-stroke=""
    >
      <rect width="16" height="16" x="4" y="4" rx="2"></rect>
      <rect width="6" height="6" x="9" y="9" rx="1"></rect>
      <path d="M15 2v2"></path>
      <path d="M15 20v2"></path>
      <path d="M2 15h2"></path>
      <path d="M2 9h2"></path>
      <path d="M20 15h2"></path>
      <path d="M20 9h2"></path>
      <path d="M9 2v2"></path>
      <path d="M9 20v2"></path>
    </svg>
  );
}

function HardDrive() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-hard-drive w-6 h-6"
      data-id="9"
      data-darkreader-inline-stroke=""
    >
      <line x1="22" x2="2" y1="12" y2="12"></line>
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
      <line x1="6" x2="6.01" y1="16" y2="16"></line>
      <line x1="10" x2="10.01" y1="16" y2="16"></line>
    </svg>
  );
}

export default ServerInfo;
