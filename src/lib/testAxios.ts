import axios from 'axios';

// 测试axios配置
const testAxiosConfig = async () => {
  const apiClient = axios.create({
    baseURL: 'http://152.136.160.91:9528',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Axios默认配置:', apiClient.defaults);

  try {
    // 测试POST请求
    const response = await apiClient.post('/api/register', {
      username: 'testuser',
      phone: '13800138000',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    console.log('响应数据:', response.data);
  } catch (error: any) {
    console.error('请求错误:', error.message);
    if (error.response) {
      console.error('响应数据:', error.response.data);
      console.error('响应状态:', error.response.status);
    }
  }
};

// 运行测试
testAxiosConfig();