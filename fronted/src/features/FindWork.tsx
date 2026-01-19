import React, { useState, useRef } from "react";
import { useWorker } from "../context/WorkerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, Zap, TrendingUp, Send, Loader2, ImageIcon, X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";

const FindWork: React.FC = () => {
  const { worker, tasks, completeTask, isProcessing } = useWorker();
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [submissionData, setSubmissionData] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatKAS = (amount: number) => `${amount.toFixed(4)} KAS`;

  const availableTasks = tasks.filter(t => t.status === 'active' || t.status === 'pending');

  // Handle File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedTask || !submissionData.trim()) return;
    await completeTask(selectedTask.id, submissionData);
    setSelectedTask(null);
    setSubmissionData('');
    setImageBase64(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <Card className="bg-blue-600 text-white border-black overflow-hidden relative animate-wiggle-hover">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <CardContent className="pt-8 relative z-10">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black mb-2">Find Work</h2>
              <p className="text-blue-100 font-medium text-lg">
                Earn KAS instantly with your <span className="bg-black text-lime-400 px-2 py-1 rounded font-bold">{worker.multiplier}x</span> multiplier
              </p>
            </div>
            <div className="bg-white text-black p-4 rounded-lg border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              <p className="text-sm font-bold uppercase opacity-70">Your Rank</p>
              <p className="text-4xl font-black">{worker.rank}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Listings */}
      <div>
        <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
          Available Tasks 
          <span className="bg-black text-white px-2 py-1 rounded text-sm font-normal">{availableTasks.length}</span>
        </h3>
        
        {availableTasks.length === 0 ? (
          <Card className="bg-slate-100 border-2 border-dashed border-slate-300">
            <CardContent className="py-20 text-center">
              <span className="text-8xl">🔍</span>
              <h3 className="text-2xl font-bold mt-6 text-slate-800">No Tasks Available</h3>
              <p className="text-slate-500 font-medium mt-2">Check back soon or create a task!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTasks.map(task => {
              const baseReward = task.reward;
              const boostedReward = baseReward * worker.multiplier;

              return (
                <Card key={task.id} className="bg-white group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{task.title}</CardTitle>
                      <div className={`px-3 py-1 rounded-md text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
                        task.status === 'active' ? 'bg-lime-200 text-lime-900' : 'bg-yellow-200 text-yellow-900'
                      }`}>
                        {task.status === 'active' ? '✓ Funded' : '⏳ Pending'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Reward Breakdown */}
                    <div className="bg-green-50 border-2 border-black p-5 rounded-lg shadow-[3px_3px_0px_0px_#000]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">Base Reward</span>
                        <span className="text-xl font-black text-green-700">
                          {formatKAS(baseReward)}
                        </span>
                      </div>
                      
                      {worker.multiplier > 1 && (
                        <>
                          <div className="flex justify-between items-center mb-2 text-sm font-bold text-slate-600">
                            <span>Rank Bonus</span>
                            <span className="text-blue-600">
                              +{formatKAS(boostedReward - baseReward)}
                            </span>
                          </div>
                          <div className="pt-3 border-t-2 border-green-200 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="font-black text-lg">You'll Earn</span>
                              <span className="text-3xl font-black text-green-600">
                                {formatKAS(boostedReward)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      onClick={() => setSelectedTask(task)}
                      variant="neo"
                      className="w-full h-14 text-lg"
                      disabled={task.status !== 'active'}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Start Task
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[700px] border-2 border-black shadow-[8px_8px_0px_0px_#000]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex flex-col gap-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-bold uppercase text-slate-500 mb-2">Description</label>
                <textarea
                  value={submissionData}
                  onChange={(e) => setSubmissionData(e.target.value)}
                  placeholder="Describe your work in detail..."
                  className="neo-input w-full p-4 rounded-lg min-h-[120px] font-sans text-base"
                  disabled={isProcessing}
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-bold uppercase text-slate-500 mb-2">Proof Image (Required for AI Vision)</label>
                
                {imageBase64 ? (
                  <div className="relative group w-full h-64 border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
                    <img 
                      src={imageBase64} 
                      alt="Task Proof" 
                      className="w-full h-full object-cover" 
                    />
                    <Button
                      onClick={handleRemoveImage}
                      variant="outline"
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_#000]"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-64 border-4 border-dashed border-black rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group">
                    <div className="p-6 rounded-full bg-black text-[#a78bfa] mb-4 shadow-[4px_4px_0px_0px_#000] group-hover:-translate-y-1 transition-transform">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                    <p className="font-bold text-lg">Click to Upload Proof</p>
                    <p className="text-slate-500 text-sm mt-1">AI will verify this image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={fileInputRef}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-lime-100 border-2 border-black p-4 rounded-lg shadow-[3px_3px_0px_0px_#000]">
              <p className="text-sm font-bold uppercase text-slate-600">Potential Payout</p>
              <p className="text-3xl font-black text-green-700">
                {formatKAS((selectedTask?.reward || 0) * worker.multiplier)}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="neoOutline"
              onClick={() => {
                setSelectedTask(null);
                setSubmissionData('');
                setImageBase64(null);
              }}
              disabled={isProcessing}
              className="h-12 px-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!submissionData.trim() || !imageBase64 || isProcessing}
              variant="neo"
              className="h-14 px-8 text-lg font-black bg-[#a78bfa] hover:bg-[#7c3aed] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:-translate-y-1 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Submit Proof
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindWork;