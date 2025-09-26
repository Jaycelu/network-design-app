import sys
import json
import time
import os
import datetime
import re
import signal
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

def signal_handler(sig, frame):
    """信号处理函数 - 强制保存文件版本"""
    global pcap_filename, packet_list, capture_active, packet_count, total_size
    
    print(json.dumps({
        "type": "info", 
        "message": f"【信号处理】接收到信号 {sig}，准备强制保存文件"
    }))
    sys.stdout.flush()
    
    # 立即停止抓包
    capture_active = False
    
    # 强制确保pcap_filename已设置
    if not pcap_filename:
        project_root = os.path.dirname(os.path.abspath(__file__))
        temp_dir = os.path.join(project_root, 'temp')
        
        # 强制创建temp目录
        try:
            if not os.path.exists(temp_dir):
                os.makedirs(temp_dir, exist_ok=True)
                print(json.dumps({
                    "type": "info", 
                    "message": f"【信号处理】创建temp目录: {temp_dir}"
                }))
        except Exception as e:
            print(json.dumps({
                "type": "error", 
                "message": f"【信号处理】创建目录失败: {str(e)}"
            }))
            temp_dir = project_root  # 回退到项目根目录
        
        # 生成强制文件名
        timestamp = datetime.datetime.now().strftime("%Y%m%dT%H%M%S")
        pcap_filename = os.path.join(temp_dir, f"FORCE_CAPTURE_{timestamp}.pcap")
        print(json.dumps({
            "type": "info", 
            "message": f"【信号处理】生成强制文件名: {pcap_filename}"
        }))
        sys.stdout.flush()
    
    # 强制保存文件 - 无论有没有数据包都要创建文件
    print(json.dumps({
        "type": "info", 
        "message": f"【信号处理】开始强制保存，数据包数量: {len(packet_list) if packet_list else 0}"
    }))
    sys.stdout.flush()
    
    # 如果packet_list为空，创建一个空列表但强制保存
    if not packet_list:
        packet_list = []
        print(json.dumps({
            "type": "warning", 
            "message": "【信号处理】数据包列表为空，将创建空PCAP文件"
        }))
    
    # 调用保存函数
    pcap_path = save_packets_to_pcap()
    
    # 如果保存函数返回None，强制创建空文件
    if not pcap_path:
        print(json.dumps({
            "type": "error", 
            "message": "【信号处理】保存函数返回None，尝试强制创建文件"
        }))
        sys.stdout.flush()
        
        try:
            # 强制创建空PCAP文件
            with open(pcap_filename, 'wb') as f:
                # 写入PCAP文件头（空PCAP文件）
                f.write(b'\xd4\xc3\xb2\xa1\x02\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff\x00\x00\x01\x00\x00\x00')
            
            pcap_path = pcap_filename
            print(json.dumps({
                "type": "file_saved",
                "file_path": pcap_path,
                "file_size": 24,  # PCAP文件头大小
                "packet_count": 0,
                "message": "【信号处理】强制创建空PCAP文件成功"
            }))
        except Exception as force_error:
            print(json.dumps({
                "type": "error",
                "message": f"【信号处理】强制创建文件也失败: {str(force_error)}"
            }))
            sys.stdout.flush()
            sys.exit(1)
    
    # 确保文件确实存在
    if pcap_path:
        wait_time = 0
        max_wait = 100  # 最多等待10秒
        
        print(json.dumps({
            "type": "info", 
            "message": f"【信号处理】等待文件确认: {pcap_path}"
        }))
        sys.stdout.flush()
        
        while wait_time < max_wait:
            if os.path.exists(pcap_path):
                try:
                    file_size = os.path.getsize(pcap_path)
                    print(json.dumps({
                        "type": "file_saved",
                        "file_path": pcap_path,
                        "file_size": file_size,
                        "packet_count": len(packet_list) if packet_list else 0,
                        "message": "【信号处理】文件保存成功"
                    }))
                    sys.stdout.flush()
                    
                    # 确保文件完全写入
                    time.sleep(0.5)
                    break
                except Exception as e:
                    print(json.dumps({
                        "type": "warning",
                        "message": f"【信号处理】检查文件大小时出错: {str(e)}"
                    }))
            else:
                print(json.dumps({
                    "type": "debug",
                    "message": f"【信号处理】文件还不存在，等待中... ({wait_time * 0.1}s)"
                }))
            
            time.sleep(0.1)
            wait_time += 1
        
        if wait_time >= max_wait:
            print(json.dumps({
                "type": "error",
                "message": f"【信号处理】等待文件超时: {pcap_path}"
            }))
    
    print(json.dumps({
        "type": "info", 
        "message": "【信号处理】文件处理完成，准备退出"
    }))
    sys.stdout.flush()
    
    # 给Node.js端时间接收最后的消息
    time.sleep(0.5)
    sys.exit(0)

# 注册信号处理函数
signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

def packet_handler(packet):
    """处理捕获到的数据包 - 实时写入版本"""
    global captured_packets, capture_active, packet_count, total_size, start_time, packet_list, pcap_filename
    if not capture_active:
        return False  # 停止捕获
    
    # 增加计数器
    packet_count += 1
    total_size += len(packet)
    
    # 保存实际的数据包对象到内存列表
    packet_list.append(packet)
    
    # 🔥 实时写入到PCAP文件（每50个包写入一次，平衡性能和数据安全）
    if packet_count % 50 == 0 and pcap_filename:
        try:
            # 使用scapy的wrpcap追加模式写入
            from scapy.all import wrpcap
            
            # 获取最近50个包进行写入
            recent_packets = packet_list[-50:] if len(packet_list) >= 50 else packet_list
            
            if packet_count == 50:  # 第一次写入，覆盖空文件
                wrpcap(pcap_filename, recent_packets)
                print(json.dumps({
                    "type": "file_updated",
                    "file_path": pcap_filename,
                    "packet_count": packet_count,
                    "file_size": os.path.getsize(pcap_filename) if os.path.exists(pcap_filename) else 0,
                    "message": "【实时写入】首次写入PCAP文件"
                }))
            else:  # 后续写入，追加模式
                # 读取现有文件，添加新包，重新写入
                if os.path.exists(pcap_filename):
                    from scapy.all import rdpcap
                    try:
                        existing_packets = rdpcap(pcap_filename)
                        all_packets = list(existing_packets) + recent_packets
                        wrpcap(pcap_filename, all_packets)
                        
                        print(json.dumps({
                            "type": "file_updated",
                            "file_path": pcap_filename,
                            "packet_count": packet_count,
                            "file_size": os.path.getsize(pcap_filename),
                            "message": "【实时写入】追加写入PCAP文件"
                        }))
                    except Exception as e:
                        # 如果读取失败，直接覆盖写入最近的包
                        wrpcap(pcap_filename, recent_packets)
                        print(json.dumps({
                            "type": "warning",
                            "file_path": pcap_filename,
                            "packet_count": packet_count,
                            "message": f"【实时写入】读取现有文件失败，覆盖写入: {str(e)}"
                        }))
                else:
                    wrpcap(pcap_filename, recent_packets)
                    print(json.dumps({
                        "type": "file_updated",
                        "file_path": pcap_filename,
                        "packet_count": packet_count,
                        "message": "【实时写入】文件不存在，重新创建"
                    }))
        except Exception as e:
            print(json.dumps({
                "type": "error",
                "message": f"【实时写入】写入PCAP文件失败: {str(e)}"
            }))
    
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
    """保存捕获的数据包到PCAP文件 - 增强版本"""
    global packet_list, pcap_filename
    
    # 调试信息
    print(json.dumps({
        "type": "debug", 
        "message": f"save_packets_to_pcap被调用: packet_list长度={len(packet_list) if packet_list else 0}, pcap_filename={pcap_filename}"
    }))
    sys.stdout.flush()
    
    if not packet_list:
        print(json.dumps({"type": "warning", "message": "没有捕获到数据包，无法保存"}))
        sys.stdout.flush()
        return None
        
    if not pcap_filename:
        print(json.dumps({"type": "error", "message": "没有指定输出文件名"}))
        sys.stdout.flush()
        return None
    
    try:
        # 确保使用项目根目录的temp文件夹
        project_root = os.path.dirname(__file__) if __file__ else os.getcwd()
        temp_dir = os.path.join(project_root, 'temp')
        
        # 创建temp目录（如果不存在）
        if not os.path.exists(temp_dir):
            try:
                os.makedirs(temp_dir, exist_ok=True)
                print(json.dumps({"type": "debug", "message": f"创建temp目录: {temp_dir}"}))
            except Exception as e:
                print(json.dumps({"type": "error", "message": f"创建temp目录失败: {str(e)}"}))
                # 尝试使用当前目录
                temp_dir = project_root
        
        # 确定PCAP文件路径
        if os.path.isabs(pcap_filename):
            # 如果已经是完整路径，直接使用
            pcap_path = pcap_filename
        else:
            # 如果只是文件名，保存到temp目录
            pcap_path = os.path.join(temp_dir, pcap_filename)
        
        # 确保目标目录存在
        pcap_dir = os.path.dirname(pcap_path)
        if not os.path.exists(pcap_dir):
            try:
                os.makedirs(pcap_dir, exist_ok=True)
                print(json.dumps({"type": "debug", "message": f"创建目录: {pcap_dir}"}))
            except Exception as e:
                print(json.dumps({"type": "error", "message": f"创建目录失败: {str(e)}"}))
                return None
        
        print(json.dumps({
            "type": "debug", 
            "message": f"准备保存PCAP文件: 路径={pcap_path}, 数据包数量={len(packet_list)}"
        }))
        sys.stdout.flush()
        
        # 方法1: 尝试使用scapy保存
        try:
            print(json.dumps({"type": "debug", "message": "尝试使用scapy保存PCAP文件"}))
            sys.stdout.flush()
            
            # 确保数据包列表不为空且包含有效数据包
            valid_packets = [pkt for pkt in packet_list if pkt is not None]
            if not valid_packets:
                print(json.dumps({"type": "error", "message": "没有有效的数据包可以保存"}))
                return None
            
            wrpcap(pcap_path, valid_packets)
            
            # 验证文件是否成功创建
            if os.path.exists(pcap_path) and os.path.getsize(pcap_path) > 0:
                file_size = os.path.getsize(pcap_path)
                print(json.dumps({
                    "type": "file_saved", 
                    "file_path": pcap_path, 
                    "packet_count": len(valid_packets), 
                    "file_size": file_size,
                    "method": "scapy"
                }))
                return pcap_path
            else:
                print(json.dumps({"type": "warning", "message": "scapy保存失败，文件不存在或大小为0"}))
        except Exception as scapy_error:
            print(json.dumps({"type": "warning", "message": f"scapy保存失败: {str(scapy_error)}，尝试替代方法"}))
        
        # 方法2: 使用替代方案保存为文本格式，然后转换为PCAP
        try:
            print(json.dumps({"type": "debug", "message": "尝试替代保存方法"}))
            sys.stdout.flush()
            
            # 首先保存为文本格式作为备份
            txt_path = pcap_path.replace('.pcap', '_backup.txt')
            with open(txt_path, 'w', encoding='utf-8') as f:
                f.write(f"Packet Capture Data\n")
                f.write(f"Capture Time: {datetime.datetime.now()}\n")
                f.write(f"Total Packets: {len(packet_list)}\n")
                f.write(f"Total Size: {total_size} bytes\n")
                f.write("="*50 + "\n\n")
                
                for i, packet in enumerate(packet_list):
                    if packet is not None:
                        try:
                            f.write(f"Packet {i+1}:\n")
                            f.write(f"  Time: {packet.time if hasattr(packet, 'time') else 'N/A'}\n")
                            f.write(f"  Length: {len(packet)} bytes\n")
                            f.write(f"  Summary: {packet.summary()}\n")
                            if IP in packet:
                                f.write(f"  IP Src: {packet[IP].src}\n")
                                f.write(f"  IP Dst: {packet[IP].dst}\n")
                                f.write(f"  Protocol: {packet[IP].proto}\n")
                            f.write("-"*30 + "\n")
                        except Exception as e:
                            f.write(f"  Error writing packet {i+1}: {str(e)}\n")
            
            # 尝试使用pcapy或dpkt保存为PCAP格式
            try:
                # 尝试导入pcapy
                import pcapy
                print(json.dumps({"type": "debug", "message": "尝试使用pcapy保存"}))
                
                # 创建pcapy写入器
                writer = pcapy.open_dead(pcapy.DLT_EN10MB, 65535)
                dumper = writer.dump_open(pcap_path)
                
                # 写入数据包
                saved_count = 0
                for packet in packet_list:
                    if packet is not None:
                        try:
                            # 将scapy数据包转换为字节串
                            packet_bytes = bytes(packet)
                            dumper.dump(packet_bytes)
                            saved_count += 1
                        except Exception as e:
                            print(json.dumps({"type": "warning", "message": f"保存单个数据包失败: {str(e)}"}))
                
                dumper.close()
                
                if saved_count > 0 and os.path.exists(pcap_path) and os.path.getsize(pcap_path) > 0:
                    file_size = os.path.getsize(pcap_path)
                    print(json.dumps({
                        "type": "file_saved", 
                        "file_path": pcap_path, 
                        "packet_count": saved_count, 
                        "file_size": file_size,
                        "method": "pcapy",
                        "backup_file": txt_path
                    }))
                    return pcap_path
                else:
                    print(json.dumps({"type": "warning", "message": "pcapy保存失败"}))
                    
            except ImportError:
                print(json.dumps({"type": "debug", "message": "pcapy不可用"}))
            except Exception as pcapy_error:
                print(json.dumps({"type": "warning", "message": f"pcapy保存失败: {str(pcapy_error)}"}))
            
            # 如果所有PCAP方法都失败，至少返回文本备份文件
            if os.path.exists(txt_path) and os.path.getsize(txt_path) > 0:
                txt_size = os.path.getsize(txt_path)
                print(json.dumps({
                    "type": "file_saved", 
                    "file_path": txt_path, 
                    "packet_count": len(packet_list), 
                    "file_size": txt_size,
                    "method": "text_backup",
                    "message": "PCAP格式保存失败，已保存为文本格式"
                }))
                return txt_path
            
        except Exception as backup_error:
            print(json.dumps({"type": "error", "message": f"替代保存方法也失败: {str(backup_error)}"}))
            return None
            
    except Exception as e:
        print(json.dumps({"type": "error", "message": f"保存文件时发生严重错误: {str(e)}"}))
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
    
    # 设置stdin非阻塞模式，以便监听停止命令
    try:
        import threading
        
        def stdin_listener():
            """监听stdin输入的停止命令"""
            global capture_active
            while capture_active:
                try:
                    # 非阻塞读取stdin
                    import select
                    if select.select([sys.stdin], [], [], 0.1)[0]:
                        line = sys.stdin.readline().strip()
                        if line.upper() == 'STOP':
                            print(json.dumps({
                                "type": "info",
                                "message": "【stdin监听】接收到停止命令，正在停止抓包"
                            }))
                            capture_active = False
                            # 调用停止抓包函数
                            stop_capture()
                            break
                except Exception as e:
                    # 忽略stdin读取错误
                    pass
                time.sleep(0.1)
        
        # 启动stdin监听线程
        stdin_thread = threading.Thread(target=stdin_listener, daemon=True)
        stdin_thread.start()
        print(json.dumps({
            "type": "debug",
            "message": "【抓包】已启动stdin监听线程"
        }))
    except Exception as e:
        print(json.dumps({
            "type": "warning",
            "message": f"【抓包】无法启动stdin监听: {str(e)}"
        }))
    
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
        # 如果提供了完整路径，直接使用
        if os.path.isabs(output_filename):
            pcap_filename = output_filename
        else:
            # 如果只是文件名，确保保存到temp目录
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
            
            # 抓包结束后保存文件
            print(json.dumps({"type": "debug", "message": "抓包结束，正在保存文件"}))
            sys.stdout.flush()
            save_packets_to_pcap()
            
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
    global capture_active, packet_list, pcap_filename, packet_count, total_size
    
    print(json.dumps({
        "type": "debug", 
        "message": f"正在停止抓包: 当前状态 capture_active={capture_active}, packet_list长度={len(packet_list) if packet_list else 0}, 总计数={packet_count}"
    }))
    sys.stdout.flush()
    
    # 停止抓包
    capture_active = False
    
    # 给抓包循环一点时间完成当前处理
    time.sleep(0.5)
    
    # 保存捕获的数据包到PCAP文件
    print(json.dumps({
        "type": "debug", 
        "message": f"调用save_packets_to_pcap进行保存: pcap_filename={pcap_filename}"
    }))
    sys.stdout.flush()
    
    pcap_path = save_packets_to_pcap()
    
    # 等待文件保存完成，确保文件写入磁盘
    if pcap_path:
        wait_time = 0
        file_saved = False
        print(json.dumps({
            "type": "debug", 
            "message": f"开始等待文件确认: pcap_path={pcap_path}"
        }))
        sys.stdout.flush()
        
        while wait_time < 100:  # 最多等待10秒，给Node.js更多时间检查
            if os.path.exists(pcap_path):
                try:
                    file_size = os.path.getsize(pcap_path)
                    if file_size > 0:
                        print(json.dumps({
                            "type": "file_saved",  # 改为 file_saved 让Node.js能识别
                            "file_path": pcap_path,
                            "file_size": file_size,
                            "packet_count": len(packet_list) if packet_list else 0,
                            "message": "抓包已停止，文件已保存"
                        }))
                        file_saved = True
                        break
                except Exception as e:
                    print(json.dumps({
                        "type": "debug", 
                        "message": f"检查文件时出错: {str(e)}"
                    }))
            else:
                print(json.dumps({
                    "type": "debug", 
                    "message": f"文件还不存在: {pcap_path} (等待 {wait_time * 0.1} 秒)"
                }))
            time.sleep(0.1)
            wait_time += 1
        
        if not file_saved:
            print(json.dumps({
                "type": "warning",
                "message": "文件保存可能不完整",
                "pcap_path": pcap_path,
                "packet_count": len(packet_list) if packet_list else 0
            }))
    else:
        print(json.dumps({
            "type": "error",
            "message": "文件保存失败 - save_packets_to_pcap返回None",
            "pcap_filename": pcap_filename
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
        clean_interface_name = re.sub(r'[^a-zA-Z0-9()]', '', interface) if interface else 'auto'
        pcap_filename = f"{clean_interface_name}_{timestamp}.pcap"
    
    print(json.dumps({
        "type": "info",
        "message": f"接口: {interface}, 时长: {duration} 秒, 输出文件: {pcap_filename}"
    }))
    sys.stdout.flush()
    
    # 🔥 立即创建空PCAP文件，确保文件存在
    try:
        # 确保目录存在
        pcap_dir = os.path.dirname(pcap_filename)
        if not os.path.exists(pcap_dir):
            os.makedirs(pcap_dir, exist_ok=True)
        
        # 立即创建空PCAP文件
        with open(pcap_filename, 'wb') as f:
            # PCAP文件头
            f.write(b'\xd4\xc3\xb2\xa1\x02\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff\x00\x00\x01\x00\x00\x00')
        
        print(json.dumps({
            "type": "file_saved",
            "file_path": pcap_filename,
            "file_size": 24,
            "packet_count": 0,
            "message": "【初始化】已预创建空PCAP文件"
        }))
    except Exception as e:
        print(json.dumps({
            "type": "error",
            "message": f"【初始化】预创建文件失败: {str(e)}"
        }))
    
    # 🔥 重要：确保packet_list引用的是同一个文件路径
    # 设置全局变量，让save_packets_to_pcap知道要更新这个文件
    
    success = start_capture(interface, duration, pcap_filename)
    
    if success:
        print(json.dumps({"type": "success", "message": "抓包脚本执行完成"}))
        sys.stdout.flush()
    else:
        print(json.dumps({"type": "error", "message": "抓包脚本执行失败"}))
        sys.stdout.flush()
        sys.exit(1)

def stop_capture():
    """停止抓包 - 最终数据写入版本"""
    global capture_active, packet_list, pcap_filename, packet_count, total_size
    
    print(json.dumps({
        "type": "info", 
        "message": f"【停止抓包】开始执行，当前状态: capture_active={capture_active}, packet_list长度={len(packet_list) if packet_list else 0}, 总计数={packet_count}"
    }))
    sys.stdout.flush()
    
    # 停止抓包
    capture_active = False
    
    # 给抓包循环一点时间完成当前处理
    time.sleep(0.5)
    
    # 🔥 最终数据写入 - 确保所有数据包都写入文件
    if packet_list and pcap_filename:
        print(json.dumps({
            "type": "info", 
            "message": f"【停止抓包】开始最终数据写入: {len(packet_list)} 个数据包"
        }))
        sys.stdout.flush()
        
        try:
            from scapy.all import wrpcap
            
            # 获取所有剩余的数据包（不满10个的包）
            remaining_packets = packet_list
            
            if os.path.exists(pcap_filename):
                # 读取现有文件，添加所有剩余数据包
                try:
                    from scapy.all import rdpcap
                    existing_packets = rdpcap(pcap_filename)
                    all_packets = list(existing_packets) + remaining_packets
                    wrpcap(pcap_filename, all_packets)
                    
                    file_size = os.path.getsize(pcap_filename)
                    print(json.dumps({
                        "type": "file_saved",
                        "file_path": pcap_filename,
                        "file_size": file_size,
                        "packet_count": len(all_packets),
                        "message": "【停止抓包】最终数据写入成功（追加模式）"
                    }))
                except Exception as e:
                    # 如果读取失败，直接覆盖写入所有数据包
                    wrpcap(pcap_filename, remaining_packets)
                    file_size = os.path.getsize(pcap_filename)
                    print(json.dumps({
                        "type": "file_saved",
                        "file_path": pcap_filename,
                        "file_size": file_size,
                        "packet_count": len(remaining_packets),
                        "message": "【停止抓包】最终数据写入成功（覆盖模式）"
                    }))
            else:
                # 文件不存在，直接写入所有数据包
                wrpcap(pcap_filename, remaining_packets)
                file_size = os.path.getsize(pcap_filename)
                print(json.dumps({
                    "type": "file_saved",
                    "file_path": pcap_filename,
                    "file_size": file_size,
                    "packet_count": len(remaining_packets),
                    "message": "【停止抓包】最终数据写入成功（新建模式）"
                }))
        except Exception as e:
            print(json.dumps({
                "type": "error",
                "message": f"【停止抓包】最终数据写入失败: {str(e)}"
            }))
    else:
        print(json.dumps({
            "type": "warning",
            "message": f"【停止抓包】没有数据需要最终写入: packet_list={len(packet_list) if packet_list else 0}, pcap_filename={pcap_filename}"
        }))
    
    print(json.dumps({
        "type": "info", 
        "message": "【停止抓包】执行完成"
    }))
    sys.stdout.flush()