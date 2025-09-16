'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  ChevronLeft,
  Settings
} from 'lucide-react';

// 设备组类型定义
type DeviceGroup = {
  id: string;
  name: string;
  description: string;
};

// 设备类型定义
type Device = {
  id: string;
  name: string;
  ip: string;
  groupId: string;
  description: string;
};

export function DeviceManagement({ onBackToMain }: { onBackToMain: () => void }) {
  // 设备组状态
  const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([
    { id: 'group-1', name: '核心网络', description: '核心交换机和路由器' },
    { id: 'group-2', name: '接入网络', description: '接入层交换机' },
    { id: 'group-3', name: '安全设备', description: '防火墙和安全设备' },
  ]);
  
  // 设备状态
  const [devices, setDevices] = useState<Device[]>([
    { id: 'dev-1', name: '核心交换机01', ip: '192.168.1.1', groupId: 'group-1', description: '核心网络主交换机' },
    { id: 'dev-2', name: '边界路由器01', ip: '192.168.1.2', groupId: 'group-1', description: '网络边界路由器' },
    { id: 'dev-3', name: '接入交换机01', ip: '192.168.10.1', groupId: 'group-2', description: '办公区域接入交换机' },
    { id: 'dev-4', name: '防火墙01', ip: '192.168.1.3', groupId: 'group-3', description: '网络安全防火墙' },
  ]);
  
  // 筛选状态
  const [filter, setFilter] = useState({
    name: '',
    groupId: '',
  });
  
  // 添加设备表单状态
  const [newDevice, setNewDevice] = useState({
    name: '',
    ip: '',
    groupId: '',
    description: '',
  });
  
  // 编辑设备状态
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // 获取设备组名称
  const getGroupName = (groupId: string) => {
    const group = deviceGroups.find(g => g.id === groupId);
    return group ? group.name : '未分组';
  };
  
  // 处理筛选
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'groupId' && value === 'all') {
      setFilter(prev => ({ ...prev, [key]: '' }));
    } else {
      setFilter(prev => ({ ...prev, [key]: value }));
    }
  };
  
  // 过滤设备
  const filteredDevices = devices.filter(device => {
    return (
      (filter.name === '' || device.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (filter.groupId === '' || device.groupId === filter.groupId)
    );
  });
  
  // 处理添加设备
  const handleAddDevice = () => {
    if (newDevice.name && newDevice.ip && newDevice.groupId) {
      const device: Device = {
        id: `dev-${Date.now()}`,
        ...newDevice
      };
      setDevices(prev => [...prev, device]);
      setNewDevice({ name: '', ip: '', groupId: '', description: '' });
      setIsAddDialogOpen(false);
    }
  };
  
  // 处理编辑设备
  const handleEditDevice = () => {
    if (editingDevice && editingDevice.name && editingDevice.ip && editingDevice.groupId) {
      setDevices(prev => 
        prev.map(device => 
          device.id === editingDevice.id ? editingDevice : device
        )
      );
      setEditingDevice(null);
      setIsEditDialogOpen(false);
    }
  };
  
  // 处理删除设备
  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(device => device.id !== id));
  };
  
  // 打开编辑对话框
  const openEditDialog = (device: Device) => {
    setEditingDevice(device);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
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
              <Settings className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">设备管理</h2>
              <Badge variant="secondary">专业工具</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              导入
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Device List */}
          <ResizablePanel defaultSize={70} minSize={60}>
            <div className="h-full p-4">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>设备列表</span>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          添加设备
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>添加设备</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">设备名称 *</label>
                            <Input
                              value={newDevice.name}
                              onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="请输入设备名称"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">IP地址 *</label>
                            <Input
                              value={newDevice.ip}
                              onChange={(e) => setNewDevice(prev => ({ ...prev, ip: e.target.value }))}
                              placeholder="请输入IP地址"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">设备组 *</label>
                            <Select 
                              value={newDevice.groupId} 
                              onValueChange={(value) => setNewDevice(prev => ({ ...prev, groupId: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="请选择设备组" />
                              </SelectTrigger>
                              <SelectContent>
                                {deviceGroups.map(group => (
                                  <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">描述</label>
                            <Input
                              value={newDevice.description}
                              onChange={(e) => setNewDevice(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="请输入设备描述（可选）"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setIsAddDialogOpen(false)}
                            >
                              取消
                            </Button>
                            <Button onClick={handleAddDevice}>
                              添加
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  {/* Filter Section */}
                  <div className="mb-4 flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="按设备名称搜索"
                        value={filter.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                      />
                    </div>
                    <div className="w-48">
                      <Select 
                        value={filter.groupId} 
                        onValueChange={(value) => handleFilterChange('groupId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="所有设备组" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">所有设备组</SelectItem>
                          {deviceGroups.map(group => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Device Table */}
                  <div className="h-full overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>设备名称</TableHead>
                          <TableHead>IP地址</TableHead>
                          <TableHead>设备组</TableHead>
                          <TableHead>描述</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDevices.map((device) => (
                          <TableRow key={device.id}>
                            <TableCell className="font-medium">{device.name}</TableCell>
                            <TableCell>{device.ip}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {getGroupName(device.groupId)}
                              </Badge>
                            </TableCell>
                            <TableCell>{device.description}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openEditDialog(device)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteDevice(device.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Group Management */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={35}>
            <div className="h-full p-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>设备组管理</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceGroups.map(group => (
                      <div key={group.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {group.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          设备数量: {devices.filter(d => d.groupId === group.id).length}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      管理设备组
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑设备</DialogTitle>
          </DialogHeader>
          {editingDevice && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">设备名称 *</label>
                <Input
                  value={editingDevice.name}
                  onChange={(e) => setEditingDevice(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="请输入设备名称"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IP地址 *</label>
                <Input
                  value={editingDevice.ip}
                  onChange={(e) => setEditingDevice(prev => prev ? {...prev, ip: e.target.value} : null)}
                  placeholder="请输入IP地址"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">设备组 *</label>
                <Select 
                  value={editingDevice.groupId} 
                  onValueChange={(value) => setEditingDevice(prev => prev ? {...prev, groupId: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择设备组" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input
                  value={editingDevice.description}
                  onChange={(e) => setEditingDevice(prev => prev ? {...prev, description: e.target.value} : null)}
                  placeholder="请输入设备描述（可选）"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  取消
                </Button>
                <Button onClick={handleEditDevice}>
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}