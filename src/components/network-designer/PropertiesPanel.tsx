'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Network, 
  FileText, 
  Save, 
  Download,
  Monitor,
  Activity,
  Clock
} from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: any;
  activeModule: 'project' | 'device';
  activeSubModule: string;
}

export function PropertiesPanel({ selectedNode, activeModule, activeSubModule }: PropertiesPanelProps) {
  const [deviceConfig, setDeviceConfig] = useState({
    hostname: '',
    ipAddress: '',
    subnetMask: '255.255.255.0',
    gateway: '',
    vlan: 1,
    description: '',
  });

  // Show placeholder for AI Architecture Generator
  if (activeModule === 'project' && activeSubModule === 'topology') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              网络架构
            </h3>
            
            {/* File Operations */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                导入
              </Button>
              <Button variant="outline" size="sm">
                保存
              </Button>
              <Button variant="outline" size="sm">
                导出
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedNode ? (
            <>
              {/* Node Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">设备信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>设备名称</Label>
                    <Input 
                      value={selectedNode.data?.label || ''}
                      onChange={(e) => {
                        // Update node label
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>设备类型</Label>
                    <Select value={selectedNode.data?.type || ''}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="router">路由器</SelectItem>
                        <SelectItem value="switch">交换机</SelectItem>
                        <SelectItem value="firewall">防火墙</SelectItem>
                        <SelectItem value="server">服务器</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>设备状态</Label>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedNode.data?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm ${selectedNode.data?.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedNode.data?.status === 'online' ? '在线' : '离线'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    网络配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>IP地址</Label>
                    <Input 
                      value={selectedNode.data?.ip || ''}
                      onChange={(e) => {
                        // Update IP address
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>子网掩码</Label>
                      <Input value="255.255.255.0" />
                    </div>
                    <div className="space-y-2">
                      <Label>VLAN ID</Label>
                      <Input type="number" value="1" min={1} max={4094} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>网关</Label>
                    <Input placeholder="192.168.1.1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>描述</Label>
                    <Input 
                      placeholder="设备描述信息"
                      value={deviceConfig.description}
                      onChange={(e) => setDeviceConfig(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">高级配置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>设备型号</Label>
                    <Input placeholder="Cisco ISR 4000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>固件版本</Label>
                    <Input placeholder="15.2(4)M11" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>序列号</Label>
                    <Input placeholder="FCW12345678" />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    保存配置
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Monitor className="w-4 h-4 mr-2" />
                    查看状态
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    性能监控
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>请选择一个设备</p>
                <p className="text-sm">查看和编辑属性</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show placeholder for AI Architecture Generator
  if (activeModule === 'project' && activeSubModule === 'ai-architecture') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            AI生成架构
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>请在左侧输入需求</p>
            <p className="text-sm">AI将为您生成网络架构方案</p>
          </div>
        </div>
      </div>
    );
  }

  // Show placeholder for other project sub-modules
  if (activeModule === 'project' && activeSubModule !== 'topology') {
    const getSubModuleTitle = () => {
      switch (activeSubModule) {
        case 'ip-management':
          return 'IP地址管理';
        case 'vlan':
          return 'VLAN规划';
        case 'documentation':
          return '文档生成';
        default:
          return '属性设置';
      }
    };

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {getSubModuleTitle()}
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>该功能正在开发中</p>
            <p className="text-sm">敬请期待</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeModule === 'device') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              设备管理
            </h3>
            
            {/* File Operations */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                导入
              </Button>
              <Button variant="outline" size="sm">
                保存
              </Button>
              <Button variant="outline" size="sm">
                导出
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">配置生成</TabsTrigger>
              <TabsTrigger value="monitor">配置监控</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">设备选择</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择设备类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cisco">Cisco IOS</SelectItem>
                      <SelectItem value="juniper">Juniper JunOS</SelectItem>
                      <SelectItem value="huawei">Huawei VRP</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    生成配置脚本
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">批量操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>目标设备</Label>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">192.168.1.1</span>
                        <Badge variant="outline">在线</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">192.168.1.2</span>
                        <Badge variant="outline">在线</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    批量下发配置
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="monitor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    实时监控
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">设备状态</span>
                      <Badge className="bg-green-100 text-green-800">正常</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">配置同步</span>
                      <Badge className="bg-blue-100 text-blue-800">已同步</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">最后检查</span>
                      <span className="text-xs text-muted-foreground">2分钟前</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    版本历史
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="p-2 border rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span>v1.2.0</span>
                        <span className="text-muted-foreground">2024-01-15</span>
                      </div>
                      <p className="text-muted-foreground">添加防火墙规则</p>
                    </div>
                    <div className="p-2 border rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span>v1.1.0</span>
                        <span className="text-muted-foreground">2024-01-10</span>
                      </div>
                      <p className="text-muted-foreground">更新VLAN配置</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    查看全部版本
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          属性面板
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {selectedNode ? (
          <div className="p-4 space-y-4">
            {/* Node Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">设备信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>设备名称</Label>
                  <Input 
                    value={selectedNode.data?.label || ''}
                    onChange={(e) => {
                      // Update node label
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>设备类型</Label>
                  <Select value={selectedNode.data?.type || ''}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="router">路由器</SelectItem>
                      <SelectItem value="switch">交换机</SelectItem>
                      <SelectItem value="firewall">防火墙</SelectItem>
                      <SelectItem value="server">服务器</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>设备状态</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedNode.data?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm ${selectedNode.data?.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedNode.data?.status === 'online' ? '在线' : '离线'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  网络配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>IP地址</Label>
                  <Input 
                    value={selectedNode.data?.ip || ''}
                    onChange={(e) => {
                      // Update IP address
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>子网掩码</Label>
                    <Input value="255.255.255.0" />
                  </div>
                  <div className="space-y-2">
                    <Label>VLAN ID</Label>
                    <Input type="number" value="1" min={1} max={4094} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>网关</Label>
                  <Input placeholder="192.168.1.1" />
                </div>
                
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Input 
                    placeholder="设备描述信息"
                    value={deviceConfig.description}
                    onChange={(e) => setDeviceConfig(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">高级配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>设备型号</Label>
                  <Input placeholder="Cisco ISR 4000" />
                </div>
                
                <div className="space-y-2">
                  <Label>固件版本</Label>
                  <Input placeholder="15.2(4)M11" />
                </div>
                
                <div className="space-y-2">
                  <Label>序列号</Label>
                  <Input placeholder="FCW12345678" />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  保存配置
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Monitor className="w-4 h-4 mr-2" />
                  查看状态
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  性能监控
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>请选择一个设备</p>
              <p className="text-sm">查看和编辑属性</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}