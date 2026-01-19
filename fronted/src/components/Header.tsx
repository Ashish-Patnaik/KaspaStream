import React from "react";
import { useRpc } from "../context/RpcContext";
import { useWorker } from "../context/WorkerContext";
import { Button } from "@/components/ui/Button";
import { Zap, Wifi, WifiOff, X, Wallet } from "lucide-react";

const Header: React.FC = () => {
  const { isConnected, isConnecting, connect, disconnect } = useRpc();
  const { worker, liveBalance, paymentNotification, clearPaymentNotification } = useWorker();
  const formatKAS = (amount: number) => `${amount.toFixed(4)} KAS`;

  return (
    <>
      {paymentNotification && (
        <div className="fixed top-24 right-6 neo-box bg-lime-400 border-black p-6 rounded-2xl z-[100] max-w-sm animate-bounce-in">
          <div className="flex items-start gap-4">
            <div className="bg-black text-lime-400 p-2 rounded-full border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="h-6 w-6" fill="currentColor" />
            </div>
            <div className="flex-1">
              <p className="font-black text-xl text-black">Payment Received!</p>
              <p className="text-black font-mono text-2xl my-1 font-bold">{formatKAS(paymentNotification.amount)}</p>
              <p className="text-sm font-bold text-slate-800">{paymentNotification.message}</p>
            </div>
            <button onClick={clearPaymentNotification} className="text-black hover:bg-white hover:rounded-full p-1 transition"><X className="h-6 w-6" /></button>
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-between">
        {isConnected ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Balance</span>
              <span className="text-3xl font-black text-lime-600 tracking-tight">{formatKAS(liveBalance)}</span>
            </div>
            <div className="h-10 w-[2px] bg-black hidden md:block" />
            <div className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(163,230,53,1)]">
              <span className="text-xs font-bold uppercase opacity-80">Rank</span>
              <span className="text-lg font-black text-lime-400">{worker.rank}</span>
            </div>
          </div>
        ) : (
          <div className="font-bold text-slate-500 text-sm">Connect wallet to start earning</div>
        )}

        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${
            isConnected ? 'bg-green-200 border-black text-black' : 'bg-red-200 border-black text-black'
          }`}>
            {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isConnected ? 'Mainnet' : 'Offline'}
          </div>

          <Button 
            onClick={isConnected ? disconnect : connect} 
            disabled={isConnecting}
            variant={isConnected ? "neoOutline" : "neo"}
            className="flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;