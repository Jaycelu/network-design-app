import sys
import struct
import os
import time

def read_pcap_header(f):
    """读取PCAP文件头"""
    magic = f.read(4)
    if magic != b'\xd4\xc3\xb2\xa1':  # little endian
        if magic == b'\xa1\xb2\xc3\xd4':  # big endian
            raise Exception("Big endian PCAP files not supported")
        else:
            raise Exception("Not a valid PCAP file")
    
    # 读取版本号、时区、时间戳精度等
    version_major = struct.unpack('<H', f.read(2))[0]
    version_minor = struct.unpack('<H', f.read(2))[0]
    thiszone = struct.unpack('<l', f.read(4))[0]
    sigfigs = struct.unpack('<L', f.read(4))[0]
    snaplen = struct.unpack('<L', f.read(4))[0]
    network = struct.unpack('<L', f.read(4))[0]
    
    return {
        'version_major': version_major,
        'version_minor': version_minor,
        'snaplen': snaplen,
        'network': network
    }

def read_packet_header(f):
    """读取数据包头"""
    try:
        ts_sec = struct.unpack('<L', f.read(4))[0]
        ts_usec = struct.unpack('<L', f.read(4))[0]
        incl_len = struct.unpack('<L', f.read(4))[0]
        orig_len = struct.unpack('<L', f.read(4))[0]
        
        return {
            'ts_sec': ts_sec,
            'ts_usec': ts_usec,
            'incl_len': incl_len,
            'orig_len': orig_len
        }
    except:
        return None

def parse_ethernet_header(data):
    """解析以太网帧头"""
    if len(data) < 14:
        return None
    
    # 目标MAC地址(6字节) + 源MAC地址(6字节) + 类型(2字节)
    dst_mac = data[0:6]
    src_mac = data[6:12]
    eth_type = struct.unpack('>H', data[12:14])[0]
    
    return {
        'dst_mac': dst_mac.hex(),
        'src_mac': src_mac.hex(),
        'type': eth_type
    }

def parse_ip_header(data):
    """解析IP头"""
    if len(data) < 20:
        return None
    
    # 版本和头部长度
    ver_ihl = data[0]
    version = ver_ihl >> 4
    ihl = ver_ihl & 0x0F
    
    if ihl < 5:
        return None
    
    header_len = ihl * 4
    
    if len(data) < header_len:
        return None
    
    # 服务类型、总长度、标识、标志位、片偏移
    tos = data[1]
    total_length = struct.unpack('>H', data[2:4])[0]
    identification = struct.unpack('>H', data[4:6])[0]
    flags_fragment = struct.unpack('>H', data[6:8])[0]
    
    # TTL、协议、校验和
    ttl = data[8]
    protocol = data[9]
    checksum = struct.unpack('>H', data[10:12])[0]
    
    # 源IP和目标IP
    src_ip = '.'.join(str(b) for b in data[12:16])
    dst_ip = '.'.join(str(b) for b in data[16:20])
    
    protocol_names = {
        1: 'ICMP',
        6: 'TCP',
        17: 'UDP'
    }
    
    return {
        'version': version,
        'header_length': header_len,
        'tos': tos,
        'total_length': total_length,
        'ttl': ttl,
        'protocol': protocol_names.get(protocol, f'Unknown({protocol})'),
        'src_ip': src_ip,
        'dst_ip': dst_ip
    }

def analyze_pcap_basic(file_path):
    """基本的PCAP文件分析（不依赖Wireshark）"""
    try:
        # 检查文件是否存在
        if not os.path.exists(file_path):
            print(f"错误: 文件 {file_path} 不存在")
            return

        # 构建分析报告
        report = ""
        
        # 添加文件基本信息
        stats = os.stat(file_path)
        report += f"数据包总数: 0\n\n"
        report += "协议分布:\n"
        report += "- 无协议信息\n\n"
        report += "主要通信IP:\n"
        report += "- 无IP通信信息\n\n"
        report += "主要通信对话:\n"
        report += "- 无通信对话信息\n\n"
        report += f"平均数据包大小: 0.00 字节\n\n"
        
        # 尝试解析PCAP文件
        try:
            with open(file_path, 'rb') as f:
                # 读取PCAP文件头
                header = read_pcap_header(f)
                
                packet_count = 0
                total_bytes = 0
                protocol_counts = {}
                ip_counts = {}
                conversations = {}
                
                # 读取数据包
                while True:
                    packet_header = read_packet_header(f)
                    if packet_header is None:
                        break
                    
                    packet_count += 1
                    packet_size = packet_header['incl_len']
                    total_bytes += packet_size
                    
                    # 读取数据包数据
                    packet_data = f.read(packet_header['incl_len'])
                    
                    # 解析以太网帧
                    eth_header = parse_ethernet_header(packet_data)
                    if eth_header:
                        # 解析IP头（如果是以太网类型为IPv4）
                        if eth_header['type'] == 0x0800:  # IPv4
                            ip_header = parse_ip_header(packet_data[14:])  # 以太网头占14字节
                            if ip_header:
                                # 协议统计
                                protocol = ip_header['protocol']
                                if protocol not in protocol_counts:
                                    protocol_counts[protocol] = 0
                                protocol_counts[protocol] += 1
                                
                                # IP地址统计
                                src_ip = ip_header['src_ip']
                                dst_ip = ip_header['dst_ip']
                                
                                if src_ip not in ip_counts:
                                    ip_counts[src_ip] = {'packets': 0, 'bytes': 0}
                                ip_counts[src_ip]['packets'] += 1
                                ip_counts[src_ip]['bytes'] += packet_size
                                
                                if dst_ip not in ip_counts:
                                    ip_counts[dst_ip] = {'packets': 0, 'bytes': 0}
                                ip_counts[dst_ip]['packets'] += 1
                                ip_counts[dst_ip]['bytes'] += packet_size
                                
                                # 通信对话统计
                                conv_key = f"{src_ip} -> {dst_ip}"
                                if conv_key not in conversations:
                                    conversations[conv_key] = {'packets': 0, 'bytes': 0}
                                conversations[conv_key]['packets'] += 1
                                conversations[conv_key]['bytes'] += packet_size
                    
                    # 限制处理的数据包数量以避免处理时间过长
                    if packet_count >= 1000:
                        break
                
                # 更新报告
                if packet_count > 0:
                    report = f"数据包总数: {packet_count}\n\n"
                    
                    # 协议分布
                    if protocol_counts:
                        report += "协议分布:\n"
                        sorted_protocols = sorted(protocol_counts.items(), key=lambda x: x[1], reverse=True)[:10]
                        for protocol, count in sorted_protocols:
                            report += f"- {protocol}: {count}个数据包\n"
                    else:
                        report += "协议分布:\n- 无协议信息\n"
                    report += "\n"
                    
                    # 主要通信IP
                    if ip_counts:
                        report += "主要通信IP:\n"
                        sorted_ips = sorted(ip_counts.items(), key=lambda x: x[1]['packets'], reverse=True)[:5]
                        for ip, stats in sorted_ips:
                            report += f"- {ip}: {stats['packets']}个包, {stats['bytes']}字节\n"
                    else:
                        report += "主要通信IP:\n- 无IP通信信息\n"
                    report += "\n"
                    
                    # 主要通信对话
                    if conversations:
                        report += "主要通信对话:\n"
                        sorted_convs = sorted(conversations.items(), key=lambda x: x[1]['packets'], reverse=True)[:5]
                        for conv, stats in sorted_convs:
                            report += f"- {conv}: {stats['packets']}个包, {stats['bytes']}字节\n"
                    else:
                        report += "主要通信对话:\n- 无通信对话信息\n"
                    report += "\n"
                    
                    # 平均数据包大小
                    avg_packet_size = total_bytes / packet_count if packet_count > 0 else 0
                    report += f"平均数据包大小: {avg_packet_size:.2f} 字节\n\n"
                
        except Exception as e:
            report = f"数据包总数: 0\n\n"
            report += "协议分布:\n- 无协议信息\n\n"
            report += "主要通信IP:\n- 无IP通信信息\n\n"
            report += "主要通信对话:\n- 无通信对话信息\n\n"
            report += f"平均数据包大小: 0.00 字节\n\n"
            report += f"解析过程出错: {str(e)}\n\n"
        
        print(report)
        
    except Exception as e:
        print(f"分析过程出错: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("请提供PCAP文件路径作为参数")
        sys.exit(1)
    
    file_path = sys.argv[1]
    analyze_pcap_basic(file_path)