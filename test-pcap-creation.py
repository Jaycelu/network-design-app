# Test Python script to verify PCAP file creation
import os
import json
import time
from scapy.all import wrpcap, Ether, IP, TCP

# Create test packets
test_packets = []
for i in range(5):
    packet = Ether() / IP(dst=f"192.168.1.{i}") / TCP(dport=80)
    test_packets.append(packet)

# Test file saving to temp directory
project_root = os.path.dirname(os.path.abspath(__file__))
temp_dir = os.path.join(project_root, 'temp')

print(f"Project root: {project_root}")
print(f"Temp directory: {temp_dir}")

# Create temp directory if it doesn't exist
if not os.path.exists(temp_dir):
    os.makedirs(temp_dir, exist_ok=True)
    print(f"Created temp directory: {temp_dir}")

# Generate test filename
test_filename = f"test_capture_{int(time.time())}.pcap"
test_filepath = os.path.join(temp_dir, test_filename)

print(f"Test filename: {test_filename}")
print(f"Test filepath: {test_filepath}")

# Save test packets
try:
    wrpcap(test_filepath, test_packets)
    file_size = os.path.getsize(test_filepath)
    print(f"Successfully saved test PCAP file: {test_filepath}")
    print(f"File size: {file_size} bytes")
    print(f"Number of packets: {len(test_packets)}")
    
    # Verify file exists
    if os.path.exists(test_filepath):
        print("✓ File exists and can be accessed")
    else:
        print("✗ File does not exist")
        
except Exception as e:
    print(f"Error saving test file: {e}")

# List all PCAP files in temp directory
print(f"\nListing PCAP files in {temp_dir}:")
if os.path.exists(temp_dir):
    pcap_files = [f for f in os.listdir(temp_dir) if f.endswith('.pcap')]
    for file in pcap_files:
        file_path = os.path.join(temp_dir, file)
        size = os.path.getsize(file_path)
        print(f"  {file} - {size} bytes")