import pyshark
import sys
import os

def analyze_pcap(file_path):
    """使用pyshark分析PCAP文件并生成报告"""
    try:
        # 检查文件是否存在
        if not os.path.exists(file_path):
            print(f"错误: 文件 {file_path} 不存在")
            return

        # 构建分析报告
        report = ""
        
        # 明确指定tshark路径
        tshark_path = r'D:\Wireshark\tshark.exe'
        
        # 检查tshark是否存在
        if not os.path.exists(tshark_path):
            print(f"错误: 未找到tshark程序 at {tshark_path}")
            return
        
        # 打开PCAP文件，明确指定tshark路径
        cap = pyshark.FileCapture(file_path, keep_packets=False, tshark_path=tshark_path)
        
        # 初始化统计变量
        packet_count = 0
        protocol_counts = {}
        ip_counts = {}
        conversations = {}
        total_bytes = 0
        
        # 分析数据包
        try:
            for packet in cap:
                packet_count += 1
                
                # 限制分析的数据包数量以避免处理时间过长
                if packet_count > 1000:
                    break
                
                # 获取数据包长度
                if hasattr(packet, 'length'):
                    total_bytes += int(packet.length)
                
                # 协议统计
                if hasattr(packet, 'layers'):
                    for layer in packet.layers:
                        protocol = layer.layer_name.upper()
                        if protocol not in protocol_counts:
                            protocol_counts[protocol] = 0
                        protocol_counts[protocol] += 1
                
                # IP地址统计
                if 'IP' in packet:
                    src_ip = packet.ip.src
                    dst_ip = packet.ip.dst
                    
                    # 源IP统计
                    if src_ip not in ip_counts:
                        ip_counts[src_ip] = {'packets': 0, 'bytes': 0}
                    ip_counts[src_ip]['packets'] += 1
                    if hasattr(packet, 'length'):
                        ip_counts[src_ip]['bytes'] += int(packet.length)
                    
                    # 目标IP统计
                    if dst_ip not in ip_counts:
                        ip_counts[dst_ip] = {'packets': 0, 'bytes': 0}
                    ip_counts[dst_ip]['packets'] += 1
                    if hasattr(packet, 'length'):
                        ip_counts[dst_ip]['bytes'] += int(packet.length)
                    
                    # 通信对话统计
                    conv_key = f"{src_ip} -> {dst_ip}"
                    if conv_key not in conversations:
                        conversations[conv_key] = {'packets': 0, 'bytes': 0}
                    conversations[conv_key]['packets'] += 1
                    if hasattr(packet, 'length'):
                        conversations[conv_key]['bytes'] += int(packet.length)
        except Exception as e:
            print(f"分析过程出错: {str(e)}")
        finally:
            # 关闭捕获
            cap.close()
        
        # 生成报告
        report += f"数据包总数: {packet_count}\n\n"
        
        if packet_count == 0:
            report += "警告: 未捕获到数据包，可能原因:\n"
            report += "- 抓包接口配置错误\n"
            report += "- 网络设备未活动\n"
            report += "- 抓包时无网络流量\n\n"
            print(report)
            return
        
        # 协议分布
        report += "协议分布:\n"
        sorted_protocols = sorted(protocol_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        for protocol, count in sorted_protocols:
            report += f"- {protocol}: {count}个数据包\n"
        report += "\n"
        
        # 主要通信IP
        report += "主要通信IP:\n"
        sorted_ips = sorted(ip_counts.items(), key=lambda x: x[1]['packets'], reverse=True)[:5]
        for ip, stats in sorted_ips:
            report += f"- {ip}: {stats['packets']}个包, {stats['bytes']}字节\n"
        report += "\n"
        
        # 主要通信对话
        report += "主要通信对话:\n"
        sorted_convs = sorted(conversations.items(), key=lambda x: x[1]['packets'], reverse=True)[:5]
        for conv, stats in sorted_convs:
            report += f"- {conv}: {stats['packets']}个包, {stats['bytes']}字节\n"
        report += "\n"
        
        # 平均数据包大小
        avg_packet_size = total_bytes / packet_count if packet_count > 0 else 0
        report += f"平均数据包大小: {avg_packet_size:.2f} 字节\n\n"
        
        print(report)
        
    except Exception as e:
        print(f"分析过程出错: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("请提供PCAP文件路径作为参数")
        sys.exit(1)
    
    file_path = sys.argv[1]
    analyze_pcap(file_path)