import React from "react";
import { useWorker } from "../context/WorkerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TrendingUp, CheckCircle, Award, Zap } from "lucide-react";

const Analytics: React.FC = () => {
  const { worker, tasks, liveBalance } = useWorker();
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const averageQuality = completedTasks.length > 0
    ? completedTasks.reduce((sum, t) => sum + (t.verificationScore || 0), 0) / completedTasks.length
    : 0;

  const stats = [
    { label: 'Tasks', value: tasks.length, icon: CheckCircle, color: 'bg-blue-200 text-blue-900' },
    { label: 'Completed', value: completedTasks.length, icon: Award, color: 'bg-pink-200 text-pink-900' },
    { label: 'Rate', value: `${tasks.length > 0 ? ((completedTasks.length / tasks.length) * 100).toFixed(0) : 0}%`, icon: TrendingUp, color: 'bg-orange-200 text-orange-900' },
    { label: 'Quality', value: `${averageQuality.toFixed(1)}%`, icon: Zap, color: 'bg-purple-200 text-purple-900' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black text-slate-900 text-shadow">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all">
            <CardContent className="pt-6 pb-4">
              <div className={`p-3 rounded-lg border-2 border-black inline-flex items-center justify-center mb-4 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold uppercase text-slate-500 mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#ccfbf1] border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader>
            <CardTitle className="text-slate-900">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-black text-slate-900 mb-6">{liveBalance.toFixed(4)} KAS</p>
            <div className="bg-white p-4 rounded-lg border-2 border-black">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>All Time</span>
                <span className="text-green-600">+{worker.totalEarned.toFixed(4)} KAS</span>
              </div>
              <div className="w-full bg-black h-3 rounded-full overflow-hidden">
                <div className="bg-[#bef264] h-full" style={{ width: '75%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader>
            <CardTitle>Ranking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['D', 'C', 'B', 'A', 'S'].map((rank) => {
              const isActive = worker.rank === rank;
              return (
                <div key={rank} className={`flex items-center justify-between p-3 rounded-xl border-2 ${isActive ? 'bg-black text-white border-black' : 'bg-slate-100 border-slate-200'}`}>
                  <span className={`font-bold ${isActive ? 'text-[#bef264]' : 'text-slate-500'}`}>Rank {rank}</span>
                  {isActive && <span className="text-xs bg-[#bef264] text-black px-2 py-1 rounded font-bold">CURRENT</span>}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;