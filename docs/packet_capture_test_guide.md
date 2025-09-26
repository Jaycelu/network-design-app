# 抓包功能测试指南

## 1. 启动服务器
使用以下命令启动开发服务器：
```bash
npm run dev
```
或直接运行：
```bash
npx tsx server.ts
```

## 2. 验证服务器状态
服务器启动后应显示：
```
> Ready on http://127.0.0.1:3005
> Socket.IO server running at ws://127.0.0.1:3005/api/socketio
```

## 3. 检查端口监听
在Windows PowerShell中运行：
```powershell
Get-NetTCPConnection -LocalPort 3005 -State Listen
```
或在命令提示符中运行：
```cmd
netstat -an | findstr :3005
```

## 4. 测试抓包功能
通过前端界面或API调用开始抓包：
- POST请求到 `/api/packet-capture/start`
- 参数：`{"interface": "WLAN", "duration": 30}`

## 5. 验证文件保存
检查 `temp` 目录下是否生成了PCAP文件：
```bash
ls temp/
```

## 6. 测试文件下载
使用curl测试下载功能：
```bash
curl -v "http://localhost:3005/api/packet-capture/download?file=filename.pcap" --output test.pcap
```

## 7. 常见问题解决
1. **端口问题**：确保使用正确的端口（3005）
2. **文件不存在**：检查抓包是否成功完成
3. **权限问题**：确保应用有权限写入temp目录
4. **Npcap驱动**：如果抓包失败，检查是否安装了Npcap驱动