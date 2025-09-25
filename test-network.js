const si = require('systeminformation');

async function testNetworkInterfaces() {
  try {
    console.log('正在获取网络接口信息...');
    const interfaces = await si.networkInterfaces();
    console.log('原始网络接口数据:');
    console.log(JSON.stringify(interfaces, null, 2));
    
    // 格式化数据
    const formattedInterfaces = interfaces
      .filter(iface => 
        iface.iface && 
        iface.iface.trim() !== '' && 
        !iface.iface.includes('锟') &&  // 过滤掉包含乱码字符的接口
        !iface.iface.includes('�') &&   // 过滤掉其他乱码字符
        !iface.iface.includes('锟斤拷') &&   // 过滤掉其他乱码字符
        iface.iface.length < 50 &&         // 过滤掉异常长的接口名称
        // 只保留启用的接口或者WLAN接口
        (iface.operstate === 'up' || iface.iface.includes('WLAN') || iface.iface.includes('Loopback'))
      )
      .map(iface => ({
        name: iface.iface,
        description: iface.ifaceName || iface.model || iface.manufacturer || 'Unknown Interface',
        addresses: iface.ip4 ? [{ address: iface.ip4, family: 'IPv4' }] : []
      }));
    
    console.log('\n格式化后的网络接口数据:');
    console.log(JSON.stringify(formattedInterfaces, null, 2));
  } catch (error) {
    console.error('获取网络接口信息失败:', error);
  }
}

testNetworkInterfaces();