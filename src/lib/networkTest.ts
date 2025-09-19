// 网络连接测试工具
export const testServerConnection = async () => {
  const serverUrl = 'http://152.136.160.91:9528';
  
  try {
    console.log('正在测试服务器连接...');
    console.log(`服务器地址: ${serverUrl}`);
    
    // 测试基本连接
    const response = await fetch(serverUrl, {
      method: 'GET',
      mode: 'no-cors' // 使用no-cors模式来测试连接
      // 注意：fetch API 不支持 timeout 选项
    });
    
    console.log('连接测试结果:', response);
    return true;
  } catch (error: any) {
    console.error('连接测试失败:', error);
    return false;
  }
};

// 检查服务器API端点
export const checkApiEndpoint = async () => {
  const apiUrl = 'http://152.136.160.91:9528/api';
  
  try {
    console.log('正在测试API端点...');
    console.log(`API地址: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      mode: 'no-cors'
      // 注意：fetch API 不支持 timeout 选项
    });
    
    console.log('API测试结果:', response);
    return true;
  } catch (error: any) {
    console.error('API测试失败:', error);
    return false;
  }
};