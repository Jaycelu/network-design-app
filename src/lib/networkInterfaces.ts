// 网络接口信息获取工具
import os from 'os';

// 获取网络接口信息
export const getNetworkInterfaces = () => {
  try {
    const interfaces = os.networkInterfaces();
    const result: any[] = [];
    
    for (const [name, networkInfos] of Object.entries(interfaces)) {
      if (networkInfos) {
        for (const networkInfo of networkInfos) {
          // 只处理 IPv4 地址并且不是内部地址
          if (networkInfo.family === 'IPv4' && !networkInfo.internal) {
            result.push({
              name,
              address: networkInfo.address,
              netmask: networkInfo.netmask,
              mac: networkInfo.mac,
              family: networkInfo.family,
              internal: networkInfo.internal,
            });
          }
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('获取网络接口信息失败:', error);
    return [];
  }
};

// 在浏览器环境中返回空数组的替代实现
export const getNetworkInterfacesBrowser = () => {
  return [];
};