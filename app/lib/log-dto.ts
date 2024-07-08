export interface LogDto {
  timestamp: string;
  message: string;
  sourceAddress: string;
  sourcePort: string;
  destinationAddress: string;
  destinationPort: string;
}

export interface LogResponseDto {
  total: number;
  logs: LogDto[];
}
