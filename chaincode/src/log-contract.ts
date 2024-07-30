import { Context, Contract } from 'fabric-contract-api';
import { Iterators } from 'fabric-shim';

export interface ILogContract {
  timestamp: string;
  protocol: string;
  message: string;
  srcMacAddress: string;
  srcAddress: string;
  srcPort: string;
  dstAddress: string;
  dstPort: string;
}

export class LogContract extends Contract {
  public async isIncludedLog(ctx: Context, id: string): Promise<boolean> {
    const log = await ctx.stub.getState(id);
    return log && log.length > 0;
  }

  public async createLogs(ctx: Context, byteLogs: Uint8Array): Promise<void> {
    const logs = JSON.parse(byteLogs.toString()) as ILogContract[];

    for (const log of logs) {
      const isIncludedLog = await this.isIncludedLog(ctx, log.timestamp);
      if (isIncludedLog) {
        console.error('This logId is found on the ledger');
        continue;
      }

      await ctx.stub.putState(log.timestamp, Buffer.from(JSON.stringify(log)));
    }

    console.log('Including logs on the ledger is complete');
  }

  public async handleRawLogs(
    rawLogs: Iterators.StateQueryIterator,
  ): Promise<string> {
    const logs: ILogContract[] = [];

    let result = await rawLogs.next();
    while (!result.done) {
      try {
        const strLog = Buffer.from(result.value.value.toString()).toString();
        const log = JSON.parse(strLog) as ILogContract;
        logs.push(log);
      } catch (error) {
        throw new Error('Can not extract the log');
      }

      result = await rawLogs.next();
    }
    return JSON.stringify(logs);
  }

  public async getAllLogs(ctx: Context): Promise<string> {
    const rawLogs = await ctx.stub.getStateByRange('', '');
    const res = await this.handleRawLogs(rawLogs);
    return res;
  }
}
