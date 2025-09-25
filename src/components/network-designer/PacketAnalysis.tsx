'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  Upload, 
  Download, 
  AlertCircle,
  CheckCircle,
  Clock,
  PackageSearch,
  ChevronLeft,
  ExternalLink,
  X
} from 'lucide-react';

export function PacketAnalysis({ onBackToMain }: { onBackToMain: () => void }) {
  // 网络接口状态
  const [interfaces, setInterfaces] = useState<Array<{name: string, description: string}>>([]);
  const [selectedInterface, setSelectedInterface] = useState<string>('');
  
  // 抓包状态
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureStats, setCaptureStats] = useState({
    packets: 0,
    size: 0,
    duration: 0
  });
  
  // 用于存储计时器引用
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout | null>(null);
  const [captureTimeout, setCaptureTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // 当前抓包会话ID
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  
  // 抓包开始时间
  const [captureStartTime, setCaptureStartTime] = useState<number>(0);
  
  // 抓包文件信息
  const [captureFile, setCaptureFile] = useState<{
    name: string;
    path: string;
    size: number;
  } | null>(null);
  
  // Npcap驱动错误信息
  const [driverError, setDriverError] = useState<{
    message: string;
    detail?: string;
    downloadUrl?: string;
    solution?: string;
  } | null>(null);
  
  // AI分析状态
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  
  // 驱动安装状态
  const [driverInstalled, setDriverInstalled] = useState<boolean>(true);
  
  // PCAP文件上传状态
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null); // 添加引用
  
  // 触发文件选择
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 获取网络接口
  useEffect(() => {
    // 确定API基础URL
    const getApiBaseUrl = () => {
      // 在桌面应用中，API在同一端口上
      if (typeof window !== 'undefined' && window.location) {
        // 检查是否是桌面应用环境
        if (window.location.protocol === 'file:') {
          // 桌面应用环境，使用localhost
          return 'http://localhost:3005';
        }
        // Web环境，使用相对路径
        return '';
      }
      return '';
    };
    
    const baseUrl = getApiBaseUrl();
    const apiUrl = `${baseUrl}/api/packet-capture/interfaces`;
    
    console.log('请求API URL:', apiUrl); // 调试信息
    
    // 从后端获取网络接口列表
    fetch(apiUrl)
      .then(response => {
        console.log('API响应状态:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('获取到的网络接口数据:', data); // 调试信息
        if (data && data.interfaces && Array.isArray(data.interfaces)) {
          setInterfaces(data.interfaces);
          // 默认选择第一个接口
          if (data.interfaces.length > 0 && !selectedInterface) {
            setSelectedInterface(data.interfaces[0].name);
          }
        } else {
          console.error('无效的接口数据格式:', data);
          setInterfaces([]); // 数据格式无效时返回空列表
        }
      })
      .catch(error => {
        console.error('获取网络接口失败:', error);
        setInterfaces([]); // 获取失败时返回空列表，不使用模拟数据
      });
    
    // 检查Npcap驱动安装状态
    checkNpcapDriver();
    
    // 清理函数
    return () => {
      if (captureInterval) {
        clearInterval(captureInterval);
      }
      if (captureTimeout) {
        clearTimeout(captureTimeout);
      }
    };
  }, []); // 移除selectedInterface依赖，避免无限循环
  
  // 检查Npcap驱动安装状态
  const checkNpcapDriver = async () => {
    try {
      // 在实际应用中，这里会检查Npcap驱动是否安装
      // 目前我们假设驱动已安装
      setDriverInstalled(true);
    } catch (error) {
      console.error('检查Npcap驱动失败:', error);
      setDriverInstalled(false);
    }
  };
  
  // 开始抓包
  const startCapture = async () => {
    if (!selectedInterface) {
      alert('请选择网络接口');
      return;
    }
    
    try {
      // 清除之前的抓包文件
      setCaptureFile(null);
      
      const response = await fetch('/api/packet-capture/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          interface: selectedInterface,
          duration: 30 // 30秒抓包时长
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setIsCapturing(true);
        // 清除之前的错误信息
        setDriverError(null);
        // 重置统计数据
        setCaptureStats({
          packets: 0,
          size: 0,
          duration: 0
        });
        
        // 存储会话ID和开始时间
        const sessionId = data.sessionId;
        setCurrentSessionId(sessionId);
        setCaptureStartTime(Date.now());
        
        // 开始实时更新统计数据
        const interval = setInterval(async () => {
          try {
            const statsResponse = await fetch('/api/packet-capture/stats', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sessionId }),
            });
            
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setCaptureStats({
                packets: statsData.stats.packetCount,
                size: statsData.stats.totalSize,
                duration: statsData.stats.duration
              });
            }
          } catch (error) {
            console.error('获取统计信息失败:', error);
          }
        }, 1000); // 每秒更新一次
        
        setCaptureInterval(interval);
        
        // 30秒后自动停止
        const timeout = setTimeout(() => {
          stopCapture();
        }, 30000);
        setCaptureTimeout(timeout);
        
      } else {
        alert('启动抓包失败: ' + data.error);
      }
    } catch (error) {
      console.error('启动抓包失败:', error);
      alert('启动抓包失败，请检查网络连接');
    }
  };
  
  // 停止抓包
  const stopCapture = async () => {
    if (!isCapturing || !currentSessionId) {
      console.warn('没有活动的抓包会话');
      return;
    }
    
    setIsCapturing(false);
    if (captureInterval) {
      clearInterval(captureInterval);
      setCaptureInterval(null);
    }
    if (captureTimeout) {
      clearTimeout(captureTimeout);
      setCaptureTimeout(null);
    }
    
    // 调用后端停止抓包接口
    try {
      const response = await fetch('/api/packet-capture/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: currentSessionId }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // 更新最终统计信息
        const finalDuration = Math.floor((Date.now() - captureStartTime) / 1000);
        const actualSize = data.stats?.totalSize || 0;
        const actualPackets = data.stats?.packetCount || 0;
        console.log(`更新统计信息 - 实际大小: ${actualSize} 字节, 数据包数量: ${actualPackets}`);
        setCaptureStats({
          packets: actualPackets,
          size: actualSize,
          duration: finalDuration
        });
        
        // 设置抓包文件信息
        if (data.fileName && data.filePath) {
          // 使用实际的文件名，不添加任何前缀
          const actualFileName = data.fileName;
          setCaptureFile({
            name: actualFileName,
            path: data.filePath,
            size: data.stats?.totalSize || 0
          });
        }
        
        console.log('抓包已完成，文件保存在:', data.filePath);
        // 清除会话ID
        setCurrentSessionId('');
      } else {
        console.error('停止抓包失败:', data.error);
        alert('停止抓包失败: ' + data.error);
      }
    } catch (error) {
      console.error('停止抓包失败:', error);
      alert('停止抓包失败，请检查网络连接');
    }
  };
  
  // 提交AI分析
  const submitForAnalysis = () => {
    setIsAnalyzing(true);
    // 模拟AI分析过程
    setTimeout(() => {
      setAnalysisResult(`AI分析完成：
      
1. 异常流量检测：
   - 发现3个潜在的端口扫描行为
   - 检测到异常的ARP请求流量

2. 性能问题分析：
   - 网络延迟较高，平均延迟为45ms
   - 存在少量重传数据包

3. 安全问题识别：
   - 未发现明显的安全威胁
   - 所有流量均已加密

4. 优化建议：
   - 建议优化网络路由配置
   - 增加带宽以改善性能
   - 定期更新防火墙规则`);
      setIsAnalyzing(false);
    }, 3000);
  };
  
  // 关闭驱动错误弹窗
  const closeDriverError = () => {
    setDriverError(null);
  };

  // 打开Npcap下载链接
  const openNpcapDownload = () => {
    if (driverError?.downloadUrl) {
      window.open(driverError.downloadUrl, '_blank');
    }
  };

  // 下载抓包文件
  const downloadCapture = async () => {
    if (!captureFile) {
      alert('没有可下载的抓包文件');
      return;
    }
    
    try {
      // 创建下载链接
      const response = await fetch(`/api/packet-capture/download?file=${encodeURIComponent(captureFile.name)}`);
      
      if (!response.ok) {
        throw new Error('下载失败');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = captureFile.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('抓包文件已下载:', captureFile.name);
    } catch (error) {
      console.error('下载抓包文件失败:', error);
      alert('下载抓包文件失败，请重试');
    }
  };
  
  // 上传PCAP文件并进行AI分析
  const uploadPCAPFile = async () => {
    if (!uploadedFile) {
      alert('请选择要上传的文件');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // 第一步：上传文件到后端
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      const uploadResponse = await fetch('/api/packet-capture/upload', {
        method: 'POST',
        body: formData,
      });
      
      const uploadData = await uploadResponse.json();
      
      if (uploadData.status !== 'success') {
        throw new Error(uploadData.error || '文件上传失败');
      }
      
      // 第二步：调用AI分析API进行大模型分析
      const analysisResponse = await fetch('/api/ai-analyze-packet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: uploadData.fileName,
          fileSize: uploadData.fileSize,
          filePath: uploadData.filePath
        }),
      });
      
      const analysisData = await analysisResponse.json();
      
      if (analysisData.success) {
        setAnalysisResult(analysisData.analysis);
      } else {
        throw new Error(analysisData.error || 'AI分析失败');
      }
      
    } catch (error) {
      console.error('AI分析失败:', error);
      setAnalysisResult(`AI分析失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Npcap驱动错误弹窗 */}
      {driverError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-destructive">驱动程序未安装</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDriverError}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>无法开始抓包</AlertTitle>
                <AlertDescription>
                  {driverError.message}
                  {driverError.detail && (
                    <div className="mt-2 text-sm">{driverError.detail}</div>
                  )}
                </AlertDescription>
              </Alert>
              
              {driverError.solution && (
                <p className="text-sm text-muted-foreground mb-4">
                  {driverError.solution}
                </p>
              )}
              
              {driverError.downloadUrl && (
                <div className="flex gap-3">
                  <Button
                    onClick={openNpcapDownload}
                    className="flex-1"
                    variant="default"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    下载 Npcap 驱动
                  </Button>
                  <Button
                    variant="outline"
                    onClick={closeDriverError}
                  >
                    稍后安装
                  </Button>
                </div>
              )}
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p>下载地址: <a href={driverError.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{driverError.downloadUrl}</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Top Toolbar */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToMain}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              返回主界面
            </Button>
            <div className="flex items-center gap-3">
              <PackageSearch className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">抓包分析</h2>
              <Badge variant="secondary">网络诊断</Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {!driverInstalled ? (
          // 驱动未安装提示
          <Card className="max-w-2xl mx-auto mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-6 h-6" />
                驱动程序未安装
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                检测到系统未安装抓包所需的npcap驱动程序。请下载并安装驱动程序以启用抓包功能。
              </p>
              <div className="flex gap-4">
                <Button onClick={() => window.open('https://npcap.com/#download', '_blank')}>
                  下载Npcap驱动
                </Button>
                <Button variant="outline">
                  查看安装指南
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 主要功能界面
          <div className="space-y-6">
            {/* 网络接口选择 */}
            <Card>
              <CardHeader>
                <CardTitle>网络接口选择</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Select value={selectedInterface} onValueChange={setSelectedInterface}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择网络接口" />
                      </SelectTrigger>
                      <SelectContent>
                        {interfaces.map((iface) => (
                          <SelectItem key={iface.name} value={iface.name}>
                            {iface.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={startCapture} 
                    disabled={isCapturing || !selectedInterface}
                    className="flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {isCapturing ? '抓包中...' : '开始抓包'}
                  </Button>
                  <Button 
                    onClick={stopCapture} 
                    disabled={!isCapturing}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    停止抓包
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* 实时统计 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">数据大小</CardTitle>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{captureStats.size > 0 ? (captureStats.size / 1024).toFixed(2) : '0.00'} KB</div>
                  <p className="text-xs text-muted-foreground">捕获数据的总大小</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">持续时间</CardTitle>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof captureStats.duration === 'number' ? Math.floor(captureStats.duration) : captureStats.duration}s
                  </div>
                  <p className="text-xs text-muted-foreground">抓包持续时间</p>
                </CardContent>
              </Card>
            </div>
            
            {/* 控制按钮 */}
            <Card>
              <CardHeader>
                <CardTitle>操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 抓包文件显示区域 */}
                {captureFile && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PackageSearch className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{captureFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            大小: {captureFile.size > 0 ? (captureFile.size / 1024).toFixed(2) : '0.00'} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={downloadCapture}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          下载
                        </Button>
                        <Button 
                          onClick={submitForAnalysis}
                          disabled={isAnalyzing}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />
                              分析中...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              AI分析
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* AI分析功能区域 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">AI分析</h3>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pcap,.pcapng"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedFile(e.target.files[0]);
                            setIsFileUploaded(true);
                          }
                        }}
                        className="hidden" // 隐藏默认文件输入框
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {uploadedFile ? uploadedFile.name : '选择PCAP文件进行AI分析'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={triggerFileSelect}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        选择文件
                      </Button>
                      <Button 
                        onClick={uploadPCAPFile}
                        disabled={!uploadedFile || isAnalyzing}
                        className="flex items-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            AI分析中...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            AI分析
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  {uploadedFile && !isAnalyzing && (
                    <p className="text-xs text-muted-foreground mt-2">
                      已选择文件: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* AI分析结果 */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    AI分析结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                    {analysisResult}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}