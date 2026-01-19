import React from 'react';
import { useWorker } from '../context/WorkerContext';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Wrench } from 'lucide-react';

const DevTools: React.FC = () => {
  const { tasks, updateTask, updateWorker, liveBalance, setLiveBalance } = useWorker();

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  const simulateFunding = (taskId: string) => {
    updateTask(taskId, { status: 'active' });
    alert(`💰 Simulated Payment Received! Task ${taskId} is now ACTIVE.`);
  };

  const resetAccount = () => {
    updateWorker({
      tasksCompleted: 0,
      totalEarned: 0,
      rank: 'D',
      multiplier: 0.8,
      currentStreak: 0
    });
    setLiveBalance(0);
    alert('Account reset to fresh state.');
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-2xl border-yellow-400 bg-yellow-50 dark:bg-slate-900 dark:border-yellow-600 z-50">
      <CardHeader className="py-3 px-4 bg-yellow-400/20 rounded-t-xl">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
          <Wrench className="h-4 w-4" />
          Hackathon Demo Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        
        {/* Section 1: Fund Tasks */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            PENDING TASKS ({pendingTasks.length})
          </p>
          {pendingTasks.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No pending tasks.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {pendingTasks.map(task => (
                <div key={task.id} className="flex justify-between items-center bg-white dark:bg-black/20 p-2 rounded border">
                  <span className="text-xs truncate max-w-[120px]">{task.title}</span>
                  <Button 
                    size="sm" 
                    className="h-6 text-xs bg-green-600 hover:bg-green-700"
                    onClick={() => simulateFunding(task.id)}
                  >
                    Simulate Fund
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Section 2: Reset */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={resetAccount}
        >
          Reset Worker Stats
        </Button>

      </CardContent>
    </Card>
  );
};

export default DevTools;