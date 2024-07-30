export interface LogDto {
  timestamp: string;
  protocol: string;
  message: string;
  srcMacAddress: string;
  srcAddress: string;
  srcPort: string;
  dstAddress: string;
  dstPort: string;
}

export interface LogResponseDto {
  total: number;
  logs: LogDto[];
}
