// @ts-ignore
import iptables from 'iptables';
import { getAllLogs } from './get-log';
import { RuleDto } from '../lib/rule-dto';

async function createRules(org: string) {
  try {
    const logs = await getAllLogs(org);

    if (logs.length === 0) {
      return 'The machine is not affected by any cyber attacks';
    }

    const rules: RuleDto[] = [];
    for (const log of logs) {
      const foundRule = rules.find(
        (rule) =>
          rule.srcAddress === log.srcAddress && rule.dstPort === log.dstPort,
      );

      if (foundRule) continue;

      const rule = {
        protocol: log.protocol.toLowerCase(),
        srcAddress: log.srcAddress,
        dstPort: log.dstPort,
      } as RuleDto;
      rules.push(rule);
    }

    console.log('Rules', rules);

    for (const rule of rules) {
      if (rule.dstPort) {
        iptables.drop({
          protocol: rule.protocol,
          src: rule.srcAddress,
          dport: Number(rule.dstPort),
        });
      } else {
        iptables.drop({
          protocol: rule.protocol,
          src: rule.srcAddress,
        });
      }
    }

    return 'Successfully create iptables rules dropping malicious packets';
  } catch (error) {
    throw new Error(`Error in createRule: ${error}`);
  }
}

export { createRules };
