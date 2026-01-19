import { RpcClient } from "@kluster/kaspa-wasm-web";

export interface PaymentDetection {
  txId: string;
  amount: number;
  toAddress: string;
  fromAddress: string;
  timestamp: number;
}

export class PaymentMonitor {
  private rpcClient: RpcClient;
  private monitoredAddresses: Map<string, (payment: PaymentDetection) => void>;
  private isMonitoring: boolean;

  constructor(rpcClient: RpcClient) {
    this.rpcClient = rpcClient;
    this.monitoredAddresses = new Map();
    this.isMonitoring = false;
  }

  /**
   * Start monitoring for payments to specific addresses
   */
  async startMonitoring() {
    if (this.isMonitoring) return;
    
    try {
      // Subscribe to new blocks
      await this.rpcClient.subscribeBlockAdded();
      
      this.rpcClient.addEventListener('block-added', this.handleBlockAdded.bind(this));
      
      this.isMonitoring = true;
      console.log('✅ Payment monitoring started');
      
    } catch (error) {
      console.error('❌ Failed to start payment monitoring:', error);
      throw error;
    }
  }

  /**
   * Stop monitoring
   */
  async stopMonitoring() {
    if (!this.isMonitoring) return;
    
    try {
      this.rpcClient.removeEventListener('block-added', this.handleBlockAdded.bind(this));
      this.isMonitoring = false;
      console.log('⏹️ Payment monitoring stopped');
    } catch (error) {
      console.error('Error stopping monitoring:', error);
    }
  }

  /**
   * Watch for payments to a specific address
   */
  watchAddress(address: string, callback: (payment: PaymentDetection) => void) {
    this.monitoredAddresses.set(address, callback);
    console.log(`👀 Watching address: ${address.substring(0, 20)}...`);
  }

  /**
   * Stop watching an address
   */
  unwatchAddress(address: string) {
    this.monitoredAddresses.delete(address);
    console.log(`🚫 Stopped watching: ${address.substring(0, 20)}...`);
  }

  /**
   * Handle new block events
   */
  private handleBlockAdded(event: any) {
    const block = event.data?.block;
    if (!block?.transactions) return;

    // Check each transaction in the block
    for (const tx of block.transactions) {
      if (!tx.outputs) continue;

      // Check each output
      for (const output of tx.outputs) {
        const toAddress = output.verboseData?.scriptPublicKeyAddress;
        
        // If this address is being monitored
        if (toAddress && this.monitoredAddresses.has(toAddress)) {
          const callback = this.monitoredAddresses.get(toAddress)!;
          
          // Convert sompi to KAS (1 KAS = 100,000,000 sompi)
          const amount = parseFloat(output.value) / 100000000;
          
          const payment: PaymentDetection = {
            txId: tx.verboseData?.transactionId || 'unknown',
            amount,
            toAddress,
            fromAddress: this.extractSenderAddress(tx),
            timestamp: Date.now()
          };

          console.log('💰 Payment detected!', payment);
          callback(payment);
        }
      }
    }
  }

  /**
   * Extract sender address from transaction (best effort)
   */
  private extractSenderAddress(tx: any): string {
    // In UTXO model, there's no single "from" address
    // We'll return the first input's address if available
    if (tx.inputs && tx.inputs.length > 0) {
      const firstInput = tx.inputs[0];
      return firstInput.previous_outpoint_address || 'Unknown sender';
    }
    return 'Unknown sender';
  }

  /**
   * Check balance of an address
   */
  async checkBalance(address: string): Promise<number> {
    try {
      const result = await this.rpcClient.getBalancesByAddresses({
        addresses: [address]
      });

      if (result.entries && result.entries.length > 0) {
        const balance = result.entries[0].balance || 0n;
        // Convert sompi to KAS
        return Number(balance) / 100000000;
      }

      return 0;
    } catch (error) {
      console.error('Error checking balance:', error);
      return 0;
    }
  }
}

/**
 * Generate a unique payment address for a task
 * In production, this should use HD wallet derivation
 */
export function generateTaskPaymentAddress(taskId: string): string {
  // This is a placeholder - in production you'd derive from HD wallet
  // For demo, we'll create a deterministic but unique-looking address
  
  const hash = taskId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const addressPart = Math.abs(hash).toString(36).padStart(58, '0').substring(0, 58);
  
  return `kaspa:qq${addressPart}`;
}

/**
 * Validate Kaspa address format
 */
export function isValidKaspaAddress(address: string): boolean {
  return /^kaspa:[a-z0-9]{61,63}$/.test(address);
}

/**
 * Format KAS amount for display
 */
export function formatKAS(amount: number): string {
  return `${amount.toFixed(8)} KAS`;
}

/**
 * Convert KAS to sompi (smallest unit)
 */
export function kasToSompi(kas: number): bigint {
  return BigInt(Math.floor(kas * 100000000));
}

/**
 * Convert sompi to KAS
 */
export function sompiToKas(sompi: bigint): number {
  return Number(sompi) / 100000000;
}