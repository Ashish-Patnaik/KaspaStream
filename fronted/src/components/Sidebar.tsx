import React from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Briefcase, BarChart3, Zap } from "lucide-react";

interface SidebarProps {
  onSelectFeature: (feature: string) => void;
}

const features = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard, color: 'bg-[#bef264]' },
  { id: "CreateTask", label: "Create Task", icon: PlusCircle, color: 'bg-[#f472b6]' },
  { id: "FindWork", label: "Find Work", icon: Briefcase, color: 'bg-[#22d3ee]' },
  { id: "Analytics", label: "Analytics", icon: BarChart3, color: 'bg-[#a78bfa]' },
];

const Sidebar: React.FC<SidebarProps> = ({ onSelectFeature }) => {
  const [selected, setSelected] = React.useState("Dashboard");

  const handleSelect = (featureId: string) => {
    setSelected(featureId);
    onSelectFeature(featureId);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-24 items-center px-6 border-b-4 border-black bg-[#bef264]">
        <a href="/" className="flex items-center gap-2 font-black text-3xl tracking-tighter uppercase text-shadow">
          <div className="bg-black text-[#bef264] p-2 rounded-lg border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="h-7 w-7" fill="currentColor" />
          </div>
          <span>Kaspa<span className="text-white drop-shadow-md">Stream</span></span>
        </a>
      </div>

      <div className="flex-1 py-8 px-4 space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = selected === feature.id;
          return (
            <button
              key={feature.id}
              onClick={() => handleSelect(feature.id)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold transition-all border-2 relative overflow-hidden group animate-wiggle-hover",
                isActive 
                  ? "bg-black text-white border-black translate-x-1 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]" 
                  : `bg-white text-slate-600 border-black hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#000]`
              )}
            >
              <div className={cn("p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-colors", 
                isActive ? "bg-[#bef264] text-black" : feature.color)}>
                <Icon className="h-6 w-6" />
              </div>
              {feature.label}
            </button>
          );
        })}
      </div>

      <div className="p-6 bg-[#e0f2fe] border-t-4 border-black">
        <div className="neo-box bg-white rounded-xl p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">System Status</span>
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-black shadow-sm"></span>
            </span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-lg font-black text-slate-900">Kaspa DAG</p>
            <span className="text-green-600 font-bold bg-green-200 px-2 rounded border border-black">Synced</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-black text-slate-900">TPS</p>
            <span className="text-blue-600 font-bold bg-blue-200 px-2 rounded border border-black">302</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;