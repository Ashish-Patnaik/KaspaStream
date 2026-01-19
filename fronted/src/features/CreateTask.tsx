import React, { useState } from "react";
import { useWorker, Task } from "../context/WorkerContext";
import { parseTaskWithAI } from "../services/aiService";
import { generateTaskPaymentAddress } from "../services/paymentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, CheckCircle, Copy, AlertCircle } from "lucide-react";

const CreateTask: React.FC = () => {
  const { addTask } = useWorker();
  const [naturalInput, setNaturalInput] = useState('');
  const [isParsingAI, setIsParsingAI] = useState(false);
  const [parsedTask, setParsedTask] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAIParse = async () => {
    if (!naturalInput.trim()) {
      setError('Please enter a task description');
      return;
    }
    setError(null);
    setIsParsingAI(true);
    try {
      const parsed = await parseTaskWithAI(naturalInput);
      setParsedTask({
        ...parsed,
        id: `task_${Date.now()}`,
        createdAt: Date.now(),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to parse task.');
      console.error(err);
    } finally {
      setIsParsingAI(false);
    }
  };

  const createTask = () => {
    if (!parsedTask) return;
    const paymentAddress = generateTaskPaymentAddress(parsedTask.id);
    const newTask: Task = {
      id: parsedTask.id,
      title: parsedTask.title,
      description: parsedTask.description,
      reward: parsedTask.reward,
      paymentAddress,
      status: 'pending',
      createdAt: parsedTask.createdAt,
      estimatedTime: parsedTask.estimatedTime,
      requirements: parsedTask.requirements,
      clientAddress: 'You',
    };
    addTask(newTask);
    setParsedTask(null);
    setNaturalInput('');
    setError(null);
  };

  const copyAddress = () => {
    if (parsedTask?.id) {
      navigator.clipboard.writeText(generateTaskPaymentAddress(parsedTask.id));
      alert('Address copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">Create Task</h1>
        <p className="text-lg text-slate-500 font-medium">Use AI to generate your task requirements.</p>
      </div>

      {/* API Key Warning */}
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div className="bg-yellow-100 border-2 border-black p-4 rounded-lg shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-yellow-900">Using Mock AI Data</p>
              <p className="text-sm text-yellow-800 mt-1">
                Set <code className="bg-yellow-200 px-1 rounded font-mono">VITE_GEMINI_API_KEY</code> to enable real AI.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Creation Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Describe Your Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <textarea
            value={naturalInput}
            onChange={(e) => {
              setNaturalInput(e.target.value);
              setError(null);
            }}
            placeholder="Need 50 people to test my website's signup flow, paying 0.8 KAS each"
            className="neo-input w-full p-6 rounded-lg min-h-[150px] text-lg"
            disabled={isParsingAI}
          />
          
          <Button
            onClick={handleAIParse}
            disabled={isParsingAI || !naturalInput.trim()}
            className="w-full h-14 text-lg font-black"
            variant="neo"
          >
            {isParsingAI ? (
              <>
                <Sparkles className="h-5 w-5 mr-3 animate-spin" />
                AI Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Parse with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Parsed Task Preview */}
      {parsedTask && (
        <Card className="bg-purple-50 border-2 border-black shadow-[6px_6px_0px_0px_#000]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black text-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Task Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded">
                <p className="text-xs font-bold uppercase text-slate-500">Title</p>
                <p className="text-xl font-black mt-1">{parsedTask.title}</p>
              </div>
              <div className="bg-green-200 p-4 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded">
                <p className="text-xs font-bold uppercase text-green-900">Reward</p>
                <p className="text-3xl font-black text-green-800 mt-1">
                  {parsedTask.reward.toFixed(4)} KAS
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 border-2 border-black rounded">
              <p className="text-sm font-bold uppercase text-slate-500 mb-2">Description</p>
              <p className="text-base leading-relaxed">{parsedTask.description}</p>
            </div>

            <div className="bg-slate-100 p-4 border-2 border-black rounded">
              <p className="text-sm font-bold uppercase text-slate-500 mb-2">Payment Address</p>
              <div className="flex items-center gap-3">
                <input
                  value={generateTaskPaymentAddress(parsedTask.id)}
                  readOnly
                  className="neo-input flex-1 px-4 py-3 font-mono text-sm bg-white"
                />
                <Button
                  onClick={copyAddress}
                  variant="neoSecondary"
                  size="icon"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                onClick={createTask}
                className="flex-1 h-14 text-lg font-black"
                variant="neo"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Create Task
              </Button>
              <Button
                onClick={() => {
                  setParsedTask(null);
                  setError(null);
                }}
                variant="neoOutline"
                className="h-14 px-8 font-bold"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateTask;