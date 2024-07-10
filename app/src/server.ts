import express, { query } from 'express';
import { getAllLogs } from './get-log';
import { LogResponseDto, LogDto } from '../lib/log-dto';

const app = express();
const port = 8080;

app.get('/logs', async (req, res) => {
  const { organization, srcAddress, srcPort, dstAddress, dstPort, startTime, endTime } =
    req.query;

  try {
    const logs: LogDto[] = await getAllLogs(organization as string);
    const pQueries = [
      srcAddress && ((log: LogDto) => log.srcAddress === srcAddress),
      srcPort && ((log: LogDto) => log.srcPort === srcPort),
      dstAddress && ((log: LogDto) => log.dstAddress === dstAddress),
      dstPort && ((log: LogDto) => log.dstPort === dstPort),
      startTime &&
        ((log: LogDto) =>
          new Date(log.timestamp) >= new Date(startTime as string)),
      endTime &&
        ((log: LogDto) =>
          new Date(log.timestamp) <= new Date(endTime as string)),
    ].filter(Boolean) as ((log: LogDto) => boolean)[];

    const fLogs = logs.filter((log) => pQueries.every((pQuery) => pQuery(log)));
    const result = {
      total: fLogs.length,
      logs: fLogs,
    } as LogResponseDto;

    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send({
      error: error?.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
