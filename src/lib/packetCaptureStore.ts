// 全局存储活跃的抓包会话
import { ChildProcess } from 'child_process';

export interface CaptureSession {
  process: ChildProcess;
  interface: string;
  startTime: number;
  outputFile: string;
  stats: {
    packets: number;
    totalSize: number;
    duration: number;
  };
  driverError?: {
    message: string;
    detail: string;
    downloadUrl: string;
    solution: string;
  };
}

// 使用全局变量来在模块间共享状态
const globalStore = global as any;

if (!globalStore.activeCaptures) {
  globalStore.activeCaptures = new Map<string, CaptureSession>();
}

export const activeCaptures = globalStore.activeCaptures;