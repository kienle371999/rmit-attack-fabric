import { CronJob } from 'cron';
import { getGateway } from '../lib/gateway';
import fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { chaincodeName, channelName } from '../lib/constants';
import { LogDto } from '../lib/log-dto';

async function getLogs(): Promise<LogDto[]> {
  const logFileDir = path.resolve(
    __dirname,
    '..',
    '..',
    'snort-log',
    'log.csv',
  );

  const isLogDir = fs.existsSync(logFileDir);
  if (!isLogDir) {
    throw new Error('The log file has not generated by Snort');
  }

  const logs: LogDto[] = [];
  const headers = [
    'id',
    'timestamp',
    'message',
    'src',
    'srcPort',
    'dst',
    'dstPort',
  ];
  const logParse = fs
    .createReadStream(logFileDir)
    .pipe(parse({ delimiter: ',', columns: headers }));

  for await (const log of logParse) {
    const uLog = {
      ...log,
      timestamp: log.timestamp.trim(),
    } as LogDto;

    logs.push(uLog);
  }

  return logs;
}

async function createLogs(org: string): Promise<void> {
  const gateway = await getGateway(org);

  try {
    // Get a network instance representing the channel where the smart contract is deployed.
    const network = gateway.getNetwork(channelName);

    // Get the smart contract from the network.
    const contract = network.getContract(chaincodeName);

    const logs = await getLogs();
    if (logs.length === 0) return;

    await contract.submitTransaction(
      'createLogs',
      Buffer.from(JSON.stringify(logs)),
    );

    console.log('createLogs function is executed successfully');
  } catch (error) {
    console.error('Error in createLogs:', error);
  }
}

// The function gets network logs every 6 seconds and upload them to the blockchain ledger.
CronJob.from({
  cronTime: '*/10 * * * * *',
  onTick: () => {
    createLogs('org1');
  },
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh',
});
