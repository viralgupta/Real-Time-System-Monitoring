import LiveServer from "./components/servers/live_server";
import LiveTraining from "./components/training/LiveTraining";

export default function Home() {
  return (
   <div className="h-full">
      <LiveServer/>
      <LiveTraining/>
   </div>
  );
}
