// 测试抓包功能修复
const axios = require('axios');

const API_BASE = 'http://127.0.0.1:3005/api/packet-capture';

async function testCapture() {
  try {
    console.log('🧪 开始测试抓包功能...');
    
    // 1. 开始抓包
    console.log('📡 开始抓包...');
    const startResponse = await axios.post(`${API_BASE}/start`, {
      interface: 'auto_detect',
      duration: 10
    });
    
    console.log('开始抓包响应:', startResponse.data);
    const sessionId = startResponse.data.sessionId;
    
    if (!sessionId) {
      console.error('❌ 未获取到会话ID');
      return;
    }
    
    // 2. 等待抓包进行
    console.log('⏳ 等待抓包进行...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 3. 获取统计信息
    console.log('📊 获取抓包统计...');
    try {
      const statsResponse = await axios.get(`${API_BASE}/stats`);
      console.log('统计信息:', statsResponse.data);
    } catch (error) {
      console.log('统计信息获取失败:', error.message);
    }
    
    // 4. 停止抓包
    console.log('🛑 停止抓包...');
    const stopResponse = await axios.post(`${API_BASE}/stop`, {
      sessionId: sessionId
    });
    
    console.log('停止抓包响应:', stopResponse.data);
    
    // 5. 验证文件是否存在
    if (stopResponse.data.success && stopResponse.data.filePath) {
      const fs = require('fs');
      const path = stopResponse.data.filePath;
      
      console.log(`🔍 检查文件是否存在: ${path}`);
      
      // 等待一下确保文件写入完成
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (fs.existsSync(path)) {
        const stats = fs.statSync(path);
        console.log(`✅ 文件存在! 大小: ${stats.size} 字节`);
        
        if (stats.size > 0) {
          console.log('🎉 抓包文件保存成功!');
        } else {
          console.log('⚠️  文件存在但大小为0');
        }
      } else {
        console.log('❌ 文件不存在');
      }
    }
    
  } catch (error) {
    console.error('测试失败:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

// 运行测试
testCapture();