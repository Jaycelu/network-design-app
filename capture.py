import sys
import json
import time
import os
import datetime
import re
from scapy.all import sniff, wrpcap, Packet
from scapy.layers.inet import IP, TCP, UDP, ICMP

# 全局变量存储捕获的数据包
captured_packets = []  # 存储实际的数据包对象
capture_active = False
packet_count = 0
total_size = 0
start_time = 0  # 修复：添加start_time全局变量
pcap_filename = ""
packet_list = []  # 存储实际的数据包对象

def packet_handler(packet):
    """处理捕获到的数据包"""
    global captured_packets, capture_active, packet_count, total_size, start_time, packet_list
    if not capture_active:
        return False  # 停止捕获
    
    # 增加计数器
    packet_count += 1
    total_size += len(packet)
    
    # 保存实际的数据包对象
    packet_list.append(packet)
    
    # 存储数据包信息用于统计
    packet_info = {
        "time": time.time(),
        "length": len(packet),
        "summary": packet.summary()
    }
    
    # 提取IP层信息
    if IP in packet:
        packet_info["src"] = packet[IP].src
        packet_info["dst"] = packet[IP].dst
        packet_info["proto"] = packet[IP].proto
    
    captured_packets.append(packet_info)
    
    # 每捕获10个包就输出一次统计信息
    if packet_count % 10 == 0:
        stats = {
            "type": "stats",
            "packet_count": packet_count,
            "total_size": total_size,
            "duration": time.time() - start_time
        }
        print(json.dumps(stats))
        sys.stdout.flush()
    
    return True

def save_packets_to_pcap():
    """保存捕获的数据包到PCAP文件"""
    global packet_list, pcap_filename
    if packet_list and pcap_filename:
        try:
            # 确保使用项目根目录的temp文件夹
            project_root = os.path.dirname(__file__) if __file__ else os.getcwd()
            temp_dir = os.path.join(project_root, 'temp')
            
            # 创建temp目录（如果不存在）
            if not os.path.exists(temp_dir):
                os.makedirs(temp_dir, exist_ok=True)
                print(json.dumps({"type": "debug", "message": f"创建temp目录: {temp_dir}"}))
                sys.stdout.flush()
            
            # 确定PCAP文件路径
            if os.path.isabs(pcap_filename):
                # 如果已经是完整路径，直接使用
                pcap_path = pcap_filename
            else:
                # 如果只是文件名，保存到temp目录
                pcap_path = os.path.join(temp_dir, pcap_filename)
            
            print(json.dumps({"type": "debug", "message": f"正在保存PCAP文件到: {pcap_path}, 数据包数量: {len(packet_list)}"}))
            sys.stdout.flush()
            
            # 保存实际的数据包对象到PCAP文件
            if packet_list:
                wrpcap(pcap_path, packet_list)
                file_size = os.path.getsize(pcap_path) if os.path.exists(pcap_path) else 0
                print(json.dumps({"type": "file_saved", "file_path": pcap_path, "packet_count": len(packet_list), "file_size": file_size}))
                sys.stdout.flush()
                return pcap_path
            else:
                print(json.dumps({"type": "warning", "message": "没有捕获到数据包"}))
                sys.stdout.flush()
                return None
        except Exception as e:
            print(json.dumps({"type": "error", "message": f"保存PCAP文件失败: {str(e)}"}))
            sys.stdout.flush()
            return None
    else:
        print(json.dumps({"type": "warning", "message": f"没有数据包需要保存, packet_list: {len(packet_list) if packet_list else 0}, pcap_filename: {pcap_filename}"}))
        sys.stdout.flush()
        return None

def start_capture(interface, duration=30, output_filename=None):
    """开始抓包"""
    global captured_packets, capture_active, packet_count, total_size, start_time, pcap_filename, packet_list
    captured_packets = []
    packet_list = []
    packet_count = 0
    total_size = 0
    capture_active = True
    start_time = time.time()
    
    # 确保使用项目根目录的temp文件夹
    project_root = os.path.dirname(__file__) if __file__ else os.getcwd()
    temp_dir = os.path.join(project_root, 'temp')
    
    # 创建temp目录（如果不存在）
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir, exist_ok=True)
        print(json.dumps({"type": "debug", "message": f"创建temp目录: {temp_dir}"}))
        sys.stdout.flush()
    
    # 生成PCAP文件名
    if output_filename:
        # 如果只是文件名，保存到temp目录；如果是完整路径，直接使用
        if os.path.isabs(output_filename):
            pcap_filename = output_filename
        else:
            pcap_filename = os.path.join(temp_dir, output_filename)
        
        print(json.dumps({"type": "debug", "message": f"使用输出文件名: {pcap_filename}"}))
        sys.stdout.flush()
    else:
        # 生成默认文件名并保存到temp目录
        pcap_filename = os.path.join(temp_dir, f"capture_{int(start_time)}.pcap")
    
    try:
        # 发送开始状态
        status = {
            "type": "status",
            "message": "开始抓包",
            "interface": interface,
            "pcap_file": pcap_filename
        }
        print(json.dumps(status))
        sys.stdout.flush()
        
        print(json.dumps({"type": "info", "message": f"正在接口 {interface} 上抓包，时长 {duration} 秒"}))
        sys.stdout.flush()
        
        # 检查是否支持抓包
        try:
            # 尝试导入必要的模块
            from scapy.all import sniff, conf
            
            # 检查是否配置了L2 socket
            if not conf.L2listen:
                print(json.dumps({
                    "type": "driver_error", 
                    "message": "Npcap驱动未安装或未正确配置",
                    "detail": "L2 socket未配置，请安装Npcap驱动",
                    "download_url": "https://npcap.com/#download"
                }))
                sys.stdout.flush()
                return False
            
            # 开始抓包，如果duration为0则不限制时间
            timeout = None if duration == 0 else duration
            sniff(iface=interface, prn=packet_handler, timeout=timeout, stop_filter=lambda x: not capture_active)
            
        except Exception as e:
            if "winpcap is not installed" in str(e).lower() or "libpcap" in str(e).lower():
                print(json.dumps({
                    "type": "driver_error", 
                    "message": "Npcap驱动未安装",
                    "detail": str(e),
                    "download_url": "https://npcap.com/#download",
                    "solution": "请下载并安装Npcap驱动程序"
                }))
                sys.stdout.flush()
                return False
            else:
                raise e
        
        # 保存捕获的数据包到PCAP文件
        print(json.dumps({"type": "debug", "message": "抓包完成前保存数据包"}))
        sys.stdout.flush()
        
        pcap_path = save_packets_to_pcap()
        
        # 发送完成状态
        stats = {
            "type": "complete",
            "packet_count": packet_count,
            "total_size": total_size,
            "duration": time.time() - start_time,
            "pcap_file": pcap_filename,
            "pcap_path": pcap_path
        }
        print(json.dumps(stats))
        sys.stdout.flush()
        
        print(json.dumps({"type": "success", "message": f"抓包完成！捕获了 {packet_count} 个数据包，总计 {(total_size/1024):.2f} KB"}))
        sys.stdout.flush()
        
        return True
    except Exception as e:
        import traceback
        error = {
            "type": "error",
            "message": str(e),
            "traceback": traceback.format_exc(),
            "packet_count": packet_count,
            "interface": interface,
            "duration": duration
        }
        print(json.dumps(error))
        sys.stdout.flush()
        return False

def stop_capture():
    """停止抓包"""
    global capture_active
    capture_active = False
    
    # 在停止抓包前保存数据包
    print(json.dumps({"type": "debug", "message": "停止抓包前保存数据包"}))
    sys.stdout.flush()
    
    # 保存捕获的数据包到PCAP文件
    pcap_path = save_packets_to_pcap()
    
    # 等待文件保存完成
    time.sleep(0.5)
    
    # 检查文件是否保存成功
    if pcap_path and os.path.exists(pcap_path):
        file_size = os.path.getsize(pcap_path)
        print(json.dumps({
            "type": "stop",
            "message": "正在停止抓包",
            "pcap_path": pcap_path,
            "file_size": file_size
        }))
    else:
        print(json.dumps({
            "type": "stop",
            "message": "正在停止抓包，但文件保存失败",
            "pcap_path": pcap_path
        }))
    sys.stdout.flush()

def get_active_interface():
    """获取活跃的网络接口（有IP地址的接口）"""
    try:
        from scapy.all import get_if_list
        from scapy.arch import get_if_addr
        
        interfaces = get_if_list()
        active_interfaces = []
        
        for iface in interfaces:
            try:
                # 跳过环回接口
                if 'loopback' in iface.lower() or 'lo' in iface.lower():
                    continue
                    
                # 获取接口IP地址
                ip_addr = get_if_addr(iface)
                
                # 检查是否有有效的IP地址（不是0.0.0.0或169.254.x.x）
                if ip_addr and ip_addr != '0.0.0.0' and not ip_addr.startswith('169.254.'):
                    active_interfaces.append({
                        "name": iface,
                        "ip_address": ip_addr
                    })
                    
            except Exception:
                continue
        
        # 优先选择有流量的接口
        if active_interfaces:
            # 简单测试哪个接口有流量
            for iface_info in active_interfaces:
                try:
                    test_packets = []
                    def test_handler(pkt):
                        test_packets.append(pkt)
                        return len(test_packets) < 3
                    
                    # 快速测试1秒
                    sniff(iface=iface_info["name"], timeout=1, prn=test_handler, count=3)
                    
                    if len(test_packets) > 0:
                        return iface_info["name"]
                        
                except Exception:
                    continue
            
            # 如果没有检测到流量，返回第一个有IP的接口
            return active_interfaces[0]["name"]
        
        return None
        
    except Exception as e:
        print(json.dumps({
            "type": "error", 
            "message": f"获取活跃接口失败: {str(e)}"
        }))
        return None

if __name__ == "__main__":
    print(json.dumps({
        "type": "info",
        "message": f"启动抓包脚本，参数: {sys.argv}"
    }))
    sys.stdout.flush()
    
    # 总是使用自动检测接口
    interface = get_active_interface()
    if not interface:
        error = {
            "type": "error",
            "message": "未找到活跃的网络接口，请手动指定接口名称"
        }
        print(json.dumps(error))
        sys.exit(1)
    print(json.dumps({"type": "info", "message": f"自动检测到活跃接口: {interface}"}))
    
    duration = int(sys.argv[2]) if len(sys.argv) > 2 else 30
    
    # 获取输出文件路径（如果有提供）
    if len(sys.argv) > 3:
        # 直接使用传入的文件名，但需要移除可能存在的引号
        pcap_filename = sys.argv[3].strip('"\'')
        print(json.dumps({"type": "debug", "message": f"使用传入的文件名: {pcap_filename}"}))
        sys.stdout.flush()
    else:
        # 生成默认文件名并保存到temp目录
        project_root = os.path.dirname(__file__) if __file__ else os.getcwd()
        temp_dir = os.path.join(project_root, 'temp')
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir, exist_ok=True)
        
        # 生成文件名：网络接口名称_抓包时间
        now = datetime.datetime.now()
        timestamp = f"{now.year}{str(now.month).zfill(2)}{str(now.day).zfill(2)}T{str(now.hour).zfill(2)}{str(now.minute).zfill(2)}{str(now.second).zfill(2)}"
        # 清理接口名称，移除特殊字符和空格
        clean_interface_name = re.sub(r'[^a-zA-Z0-9()]', '', interface)
        pcap_filename = f"{clean_interface_name}_{timestamp}.pcap"
    
    print(json.dumps({
        "type": "info",
        "message": f"接口: {interface}, 时长: {duration} 秒, 输出文件: {pcap_filename}"
    }))
    sys.stdout.flush()
    
    success = start_capture(interface, duration, pcap_filename)
    
    if success:
        print(json.dumps({"type": "success", "message": "抓包脚本执行完成"}))
        sys.stdout.flush()
    else:
        print(json.dumps({"type": "error", "message": "抓包脚本执行失败"}))
        sys.stdout.flush()
        sys.exit(1)