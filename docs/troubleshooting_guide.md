# 抓包功能故障排除指南

## 问题：抓包文件无法保存或下载

### 解决方案：

1. **检查文件路径一致性**
   - 确保前端传递完整路径给后端
   - 确保Python脚本正确处理路径

2. **验证服务器端口**
   ```bash
   netstat -an | findstr :3005
   ```
   如果端口未监听，使用以下命令启动服务器：
   ```bash
   npx tsx server.ts
   ```

3. **检查temp目录权限**
   - 确保应用有权限在temp目录创建和写入文件
   - 检查目录是否存在：`E:\学习\AI\AiOps\新建文件夹\network-design-app\temp`

4. **测试文件下载**
   ```bash
   curl -v "http://127.0.0.1:3005/api/packet-capture/download?file=filename.pcap"
   ```

5. **查看日志**
   - 检查控制台输出的调试信息
   - 查找包含"debug"、"error"或"file_saved"的JSON消息

6. **Npcap驱动问题**
   - 如果抓包失败，确保已安装Npcap驱动
   - 下载地址：https://npcap.com/#download