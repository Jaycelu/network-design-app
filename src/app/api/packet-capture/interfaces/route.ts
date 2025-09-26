import { NextRequest } from 'next/server';
const si = require('systeminformation');

export async function GET(request: NextRequest) {
  try {
    // 使用systeminformation获取真实的网络接口信息
    const networkInterfaces = await si.networkInterfaces();
    console.log('原始网络接口数据:', JSON.stringify(networkInterfaces, null, 2));
    
    // 显示所有网卡，除了环回口 - 显示全部网络接口（包含乱码接口）
    const formattedInterfaces = networkInterfaces
      .filter((iface: any) => 
        iface.iface && 
        iface.iface.trim() !== '' && 
        !iface.iface.toLowerCase().includes('loopback') &&
        !iface.iface.toLowerCase().includes('lo') &&
        !iface.ifaceName?.toLowerCase().includes('loopback') // 排除环回口
      )
      .map((iface: any) => ({
        name: iface.iface,
        description: iface.ifaceName || iface.model || iface.manufacturer || iface.iface, // 使用真实的网卡描述，包括乱码接口的ifaceName
        addresses: iface.ip4 ? [{ address: iface.ip4, family: 'IPv4' }] : [],
        mac: iface.mac || '',
        family: 'IPv4',
        internal: false,
        operstate: iface.operstate, // 添加接口状态
        type: iface.type // 添加接口类型
      }));
    
    console.log('格式化后的接口数据:', JSON.stringify(formattedInterfaces, null, 2));
    
    return Response.json({
      success: true,
      interfaces: formattedInterfaces
    });
    
  } catch (error: any) {
    console.error('获取网络接口失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || '获取网络接口列表失败' 
      }, 
      { status: 500 }
    );
  }
}