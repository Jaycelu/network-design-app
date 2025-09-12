'use client';

import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { DeviceTopToolbar } from './DeviceTopToolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Server, Activity, Shield, Clock, GitBranch, Plus, Search, Filter } from 'lucide-react';

interface DeviceManagementProps {
  onBack: () => void;
}

export function DeviceManagement({ onBack }: DeviceManagementProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // Mock device data
  const devices = [
    {
      id: '1',
      name: '核心路由器-01',
      type: 'router',
      ip: '192.168.1.1',
      status: 'online',
      vendor: 'Cisco',
      model: 'ISR 4321',
      lastSync: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: '汇聚交换机-01',
      type: 'switch',
      ip: '192.168.1.2',
      status: 'online',
      vendor: 'Huawei',
      model: 'S5720-28X-SI',
      lastSync: '2024-01-15 14:25'
    },
    {
      id: '3',
      name: '接入交换机-01',
      type: 'switch',
      ip: '192.168.1.10',
      status: 'warning',
      vendor: 'H3C',
      model: 'S5120-28P-SI',
      lastSync: '2024-01-15 13:45'
    },
    {
      id: '4',
      name: '防火墙-01',
      type: 'firewall',
      ip: '192.168.1.254',
      status: 'online',
      vendor: 'Fortinet',
      model: 'FortiGate 60E',
      lastSync: '2024-01-15 14:28'
    },
    {
      id: '5',
      name: '接入交换机-02',
      type: 'switch',
      ip: '192.168.1.11',
      status: 'offline',
      vendor: 'Cisco',
      model: 'Catalyst 2960-X',
      lastSync: '2024-01-15 10:15'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">在线</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">警告</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">离线</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Module Header */}
      <DeviceTopToolbar onBack={onBack} />
      
      {/* Main Content Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Device List Panel */}
        <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
          <div className="h-full flex flex-col">
            {/* Device List Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  设备列表
                </h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  添加设备
                </Button>
              </div>
              
              {/* Search and Filter */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索设备名称、IP地址..."
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="online">在线</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                    <SelectItem value="offline">离线</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="router">路由器</SelectItem>
                    <SelectItem value="switch">交换机</SelectItem>
                    <SelectItem value="firewall">防火墙</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Device Table */}
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" />
                    </TableHead>
                    <TableHead>设备名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>IP地址</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>厂商</TableHead>
                    <TableHead>最后同步</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedDevices.includes(device.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDevices([...selectedDevices, device.id]);
                            } else {
                              setSelectedDevices(selectedDevices.filter(id => id !== device.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {device.type === 'router' ? '路由器' : 
                           device.type === 'switch' ? '交换机' : '防火墙'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{device.ip}</TableCell>
                      <TableCell>{getStatusBadge(device.status)}</TableCell>
                      <TableCell>{device.vendor}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {device.lastSync}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Device List Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  共 {devices.length} 台设备，已选择 {selectedDevices.length} 台
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={selectedDevices.length === 0}>
                    批量操作
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Device Details Panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full overflow-y-auto">
            <Tabs defaultValue="config" className="h-full">
              <div className="p-4 border-b">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="config">配置生成</TabsTrigger>
                  <TabsTrigger value="deploy">配置下发</TabsTrigger>
                  <TabsTrigger value="monitor">配置监控</TabsTrigger>
                  <TabsTrigger value="version">版本管理</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="config" className="p-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      配置生成
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">设备类型</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="选择设备类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cisco">Cisco IOS</SelectItem>
                            <SelectItem value="huawei">Huawei VRP</SelectItem>
                            <SelectItem value="h3c">H3C Comware</SelectItem>
                            <SelectItem value="fortinet">Fortinet FortiOS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">配置模板</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="选择模板" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">基础配置</SelectItem>
                            <SelectItem value="security">安全配置</SelectItem>
                            <SelectItem value="routing">路由配置</SelectItem>
                            <SelectItem value="vlan">VLAN配置</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">配置预览</label>
                      <div className="p-3 bg-muted rounded-md font-mono text-xs">
                        <pre>{`! 基础配置模板
hostname Router
enable secret cisco
ip domain-name example.com
!
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
line vty 0 4
 password cisco
 login
!`}</pre>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      生成配置脚本
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="deploy" className="p-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      配置下发
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">目标设备</label>
                      <div className="space-y-2">
                        {devices.filter(d => selectedDevices.includes(d.id)).map(device => (
                          <div key={device.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{device.name}</span>
                              <Badge variant="outline">{device.ip}</Badge>
                            </div>
                            {getStatusBadge(device.status)}
                          </div>
                        ))}
                        {selectedDevices.length === 0 && (
                          <p className="text-sm text-muted-foreground">请先选择要下发的设备</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">下发方式</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择下发方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ssh">SSH</SelectItem>
                          <SelectItem value="telnet">Telnet</SelectItem>
                          <SelectItem value="snmp">SNMP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={selectedDevices.length === 0}
                    >
                      批量下发配置
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="monitor" className="p-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      配置监控
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">3</div>
                        <div className="text-sm text-muted-foreground">正常设备</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">1</div>
                        <div className="text-sm text-muted-foreground">警告设备</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">1</div>
                        <div className="text-sm text-muted-foreground">异常设备</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">实时监控状态</h4>
                      <div className="space-y-2">
                        {devices.map(device => (
                          <div key={device.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{device.name}</span>
                              <span className="text-sm text-muted-foreground">{device.ip}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(device.status)}
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{device.lastSync}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="version" className="p-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      版本管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">配置版本历史</h4>
                      <div className="space-y-2">
                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">v1.2.0</span>
                            <Badge variant="outline">当前版本</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            添加防火墙规则和优化路由配置
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>2024-01-15 14:30</span>
                            <span>涉及设备: 2台</span>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">v1.1.0</span>
                            <Button variant="outline" size="sm">回滚</Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            更新VLAN配置和端口安全设置
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>2024-01-14 10:15</span>
                            <span>涉及设备: 3台</span>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">v1.0.0</span>
                            <Button variant="outline" size="sm">回滚</Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            初始配置部署
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>2024-01-10 09:00</span>
                            <span>涉及设备: 5台</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        创建备份
                      </Button>
                      <Button variant="outline" className="flex-1">
                        比较版本
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
