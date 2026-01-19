import React from "react";
import { useWorker } from "../context/WorkerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Zap, TrendingUp, Award, Coins } from "lucide-react";
interface DashboardProps {
  onSelectFeature?: (feature: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectFeature }) => {
  const { worker, liveBalance, tasks, completeTask } = useWorker();

  const formatKAS = (amount: number) => `${amount.toFixed(4)} KAS`;

  const activeTasks = tasks.filter(t => t.status === 'active');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const handleFindWorkClick = () => {
    if (onSelectFeature) {
      onSelectFeature("FindWork");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-lg text-slate-500 font-medium">Welcome back, Worker.</p>
        </div>
        <Button variant="neo" size="lg" className="hidden md:flex" onClick={handleFindWorkClick}>
          <Zap className="h-5 w-5 mr-2" />
          Find Work
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Balance Card */}
        <Card className="bg-lime-400 border-black relative overflow-hidden animate-wiggle-hover">
          <div className="absolute -right-4 -top-4 h-32 w-32 bg-black rounded-full opacity-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black text-lg">
              <Zap className="h-6 w-6" />
              Live Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-black text-slate-900">{formatKAS(liveBalance)}</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="bg-black text-white px-3 py-1 rounded-md text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
                Streak: {worker.currentStreak}x
              </div>
              <div className="bg-white text-black px-3 py-1 rounded-md text-xs font-bold uppercase border-2 border-black">
                {worker.multiplier}x Mult
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm font-bold mb-2 text-slate-800">
                <span>Progress to Rank A</span>
                <span>{Math.min(100, (worker.tasksCompleted / 500) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-black rounded-full h-4 border-2 border-white">
                <div 
                  className="bg-white h-3 rounded-full m-0.5 transition-all duration-500"
                  style={{ width: `${Math.min(100, (worker.tasksCompleted / 500) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rank Card */}
        <Card className="bg-white animate-wiggle-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-6 w-6" />
              Worker Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-6xl font-black text-blue-600">{worker.rank}</p>
                <p className="text-md font-bold text-slate-500 mt-1">
                  {worker.tasksCompleted} tasks
                </p>
              </div>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2 border-black shadow-[4px_4px_0px_0px_#000] ${
                worker.rank === 'S' ? 'bg-yellow-300 text-yellow-800' :
                worker.rank === 'A' ? 'bg-purple-300 text-purple-800' :
                worker.rank === 'B' ? 'bg-blue-300 text-blue-800' :
                'bg-slate-200 text-slate-800'
              }`}>
                {worker.rank === 'S' ? '👑' :
                 worker.rank === 'A' ? '⭐' :
                 worker.rank === 'B' ? '🔥' : '💪'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Earned Card */}
        <Card className="bg-violet-500 text-white border-black animate-wiggle-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Coins className="h-6 w-6" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-black">
              {formatKAS(worker.totalEarned)}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                <p className="text-xs font-bold uppercase opacity-80">Active</p>
                <p className="text-2xl font-bold">{activeTasks.length}</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                <p className="text-xs font-bold uppercase opacity-80">Done</p>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Active Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {activeTasks.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
              <span className="text-7xl">📋</span>
              <h3 className="text-2xl font-bold mt-6 text-slate-800">No Active Tasks</h3>
              <p className="text-slate-500 font-medium mt-2">
                Check the "Find Work" tab to start earning!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTasks.map(task => (
                <div
                  key={task.id}
                  className="neo-box bg-white p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                      <p className="text-sm text-slate-500">
                        {task.description.substring(0, 80)}...
                      </p>
                    </div>
                    <div className="bg-lime-200 text-lime-800 border-2 border-black px-3 py-1 rounded text-xs font-bold shadow-[2px_2px_0px_0px_#000]">
                      Active
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-black">
                    <div>
                      <p className="text-3xl font-black text-green-600">
                        {formatKAS(task.reward * worker.multiplier)}
                      </p>
                      <p className="text-xs font-bold text-slate-500 uppercase">
                        Base: {formatKAS(task.reward)} × {worker.multiplier}x
                      </p>
                    </div>
                    <Button
                      onClick={() => completeTask(task.id, "")}
                      size="lg"
                      variant="neo"
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;