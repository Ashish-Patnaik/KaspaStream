import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRpc } from "./RpcContext";
import { PaymentMonitor, PaymentDetection } from "../services/paymentService";
import { verifyTaskWithAI } from "../services/aiService";

export interface Worker {
  address: string;
  tasksCompleted: number;
  totalEarned: number;
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  multiplier: number;
  currentStreak: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  paymentAddress: string;
  status: 'pending' | 'active' | 'in_progress' | 'completed' | 'verified';
  createdAt: number;
  clientAddress?: string;
  workerAddress?: string;
  submissionData?: string;
  verificationScore?: number;
  verificationFeedback?: string;
  estimatedTime?: string;
  requirements?: string[];
}

export interface PaymentNotification {
  txId: string;
  amount: number;
  fromAddress: string;
  timestamp: number;
  message: string;
}

interface WorkerContextType {
  worker: Worker;
  updateWorker: (updates: Partial<Worker>) => void;
  liveBalance: number;
  setLiveBalance: (balance: number) => void;
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string, submissionData: string, imageBase64?: string | null) => Promise<void>;
  paymentNotification: PaymentNotification | null;
  clearPaymentNotification: () => void;
  isProcessing: boolean;
}

const WorkerContext = createContext<WorkerContextType | null>(null);

export const WorkerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { rpc, isConnected } = useRpc();
  const [paymentMonitor, setPaymentMonitor] = useState<PaymentMonitor | null>(null);
  
  const [worker, setWorker] = useState<Worker>({
    address: '',
    tasksCompleted: 0,
    totalEarned: 0,
    rank: 'D',
    multiplier: 0.8,
    currentStreak: 0,
  });

  const [liveBalance, setLiveBalance] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [paymentNotification, setPaymentNotification] = useState<PaymentNotification | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Initialize payment monitoring when RPC connects
  useEffect(() => {
    if (isConnected && rpc && !paymentMonitor) {
      const monitor = new PaymentMonitor(rpc);
      monitor.startMonitoring().then(() => {
        setPaymentMonitor(monitor);
        console.log('✅ Payment monitoring initialized');
      }).catch(error => {
        console.error('❌ Failed to initialize payment monitoring:', error);
      });
    }

    return () => {
      if (paymentMonitor) {
        paymentMonitor.stopMonitoring();
      }
    };
  }, [isConnected, rpc]);

  // 2. Poll for Telegram Tasks (Bridge Server)
  useEffect(() => {
    const fetchTelegramTasks = async () => {
      try {
        const res = await fetch('http://localhost:3001/tasks');
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setTasks(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newTasks = data.filter((t: any) => !existingIds.has(t.id));
            
            if (newTasks.length > 0) {
              console.log("📨 Received tasks from Telegram:", newTasks.length);
              setPaymentNotification({
                txId: 'system',
                amount: 0,
                fromAddress: 'Telegram Bot',
                timestamp: Date.now(),
                message: `${newTasks.length} new tasks arrived via Telegram!`
              });
              setTimeout(() => setPaymentNotification(null), 3000);
              
              return [...newTasks, ...prev];
            }
            return prev;
          });
        }
      } catch (error) {
        // Silently fail if bridge server isn't running
      }
    };

    const interval = setInterval(fetchTelegramTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3. Watch for payments on pending tasks
  useEffect(() => {
    if (!paymentMonitor) return;

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    
    pendingTasks.forEach(task => {
      paymentMonitor.watchAddress(task.paymentAddress, (payment: PaymentDetection) => {
        handlePaymentDetected(task.id, payment);
      });
    });

    return () => {
      pendingTasks.forEach(task => {
        paymentMonitor.unwatchAddress(task.paymentAddress);
      });
    };
  }, [tasks, paymentMonitor]);

  const updateWorker = (updates: Partial<Worker>) => {
    setWorker(prev => ({ ...prev, ...updates }));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const getWorkerRank = (tasksCompleted: number): Worker['rank'] => {
    if (tasksCompleted >= 2000) return 'S';
    if (tasksCompleted >= 500) return 'A';
    if (tasksCompleted >= 100) return 'B';
    if (tasksCompleted >= 50) return 'C';
    return 'D';
  };

  const getRankMultiplier = (rank: Worker['rank']): number => {
    const multipliers = { D: 0.8, C: 1.0, B: 1.2, A: 1.5, S: 2.0 };
    return multipliers[rank];
  };

  const handlePaymentDetected = (taskId: string, payment: PaymentDetection) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'pending') return;

    console.log('💰 Payment detected for task:', taskId, payment);

    updateTask(taskId, {
      status: 'active',
      clientAddress: payment.fromAddress
    });

    setPaymentNotification({
      txId: payment.txId,
      amount: payment.amount,
      fromAddress: payment.fromAddress,
      timestamp: payment.timestamp,
      message: `Task funded with ${payment.amount.toFixed(4)} KAS!`
    });

    setTimeout(() => {
      setPaymentNotification(null);
    }, 5000);
  };

  const completeTask = async (taskId: string, submissionData: string, imageBase64?: string | null) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'active') return;

    setIsProcessing(true);

    try {
      updateTask(taskId, { status: 'in_progress', submissionData });
      console.log('🤖 Verifying submission with AI...');
      
      // Pass the image to the AI Service
      const verification = await verifyTaskWithAI(task.description, submissionData, imageBase64);

      if (verification.approved) {
        const baseReward = task.reward;
        const finalReward = baseReward * worker.multiplier;
        
        const newCompleted = worker.tasksCompleted + 1;
        const newRank = getWorkerRank(newCompleted);
        const newMultiplier = getRankMultiplier(newRank);

        setWorker(prev => ({
          ...prev,
          tasksCompleted: newCompleted,
          totalEarned: prev.totalEarned + finalReward,
          rank: newRank,
          multiplier: newMultiplier,
          currentStreak: prev.currentStreak + 1,
        }));

        setLiveBalance(prev => prev + finalReward);
        
        // Notify Bridge Server (Telegram)
        if (taskId.startsWith('tg_')) {
          try {
            await fetch(`http://localhost:3001/complete/${taskId}`, { method: 'POST' });
          } catch (e) {
            console.warn("Could not contact bridge server", e);
          }
        }

        updateTask(taskId, {
          status: 'completed',
          verificationScore: verification.score,
          verificationFeedback: verification.feedback
        });

        setPaymentNotification({
          txId: `payout_${taskId}`,
          amount: finalReward,
          fromAddress: 'KaspaStream Platform',
          timestamp: Date.now(),
          message: `Earned ${finalReward.toFixed(4)} KAS!`
        });

        setTimeout(() => {
          setPaymentNotification(null);
        }, 5000);

      } else {
        updateTask(taskId, { status: 'active' });
        alert(`Verification Failed (${verification.score.toFixed(1)}%):\n${verification.feedback}`);
      }

    } catch (error) {
      console.error('Error:', error);
      updateTask(taskId, { status: 'active' });
      alert('Error completing task. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearPaymentNotification = () => {
    setPaymentNotification(null);
  };

  return (
    <WorkerContext.Provider
      value={{
        worker,
        updateWorker,
        liveBalance,
        setLiveBalance,
        tasks,
        addTask,
        updateTask,
        completeTask,
        paymentNotification,
        clearPaymentNotification,
        isProcessing,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = (): WorkerContextType => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error("useWorker must be used within a WorkerProvider");
  }
  return context;
};