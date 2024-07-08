import { getGateway } from '../lib/gateway';
import { chaincodeName, channelName } from '../lib/constants';
import { LogDto } from '../lib/log-dto';

function reorderLogKeys(log: any): LogDto {
  const keys = [
    'timestamp',
    'message',
    'src',
    'srcPort',
    'dst',
    'dstPort',
  ];
  const newLog = keys.reduce((res, key) => {
    res[key] = log[key];
    return res;
  }, {} as any);

  return newLog as LogDto;
}

async function getAllLogs(org: string): Promise<LogDto[]> {
  const gateway = await getGateway(org);

  try {
    // Get a network instance representing the channel where the smart contract is deployed.
    const network = gateway.getNetwork(channelName);

    // Get the smart contract from the network.
    const contract = network.getContract(chaincodeName);

    const resLogBytes = await contract.evaluateTransaction('getAllLogs');

    const textDecoder = new TextDecoder();
    const decodedLogs = textDecoder.decode(resLogBytes);
    const logs = JSON.parse(decodedLogs) as LogDto[];
    const nLogs = logs.map((log) => reorderLogKeys(log));
    return nLogs;
  } catch (error) {
    throw new Error(`Error in getAllLogs: ${error}`);
  }
}

export { getAllLogs };
