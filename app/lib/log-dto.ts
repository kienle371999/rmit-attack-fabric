export interface LogDto {
  timestamp: string;
  message: string;
  srcAddress: string;
  srcPort: string;
  dstAddress: string;
  dstPort: string;
}

export interface LogResponseDto {
  total: number;
  logs: LogDto[];
}
