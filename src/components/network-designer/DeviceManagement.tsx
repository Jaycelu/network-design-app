'use client';

import React, { useState, useEffect } from 'react';
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
  Settings,
  Server,
  Database,
  FileText,
  HardDrive,
  GripVertical,
  Search,
  Eye,
  Network
} from 'lucide-react';

import { useDebounce } from '@/hooks/use-debounce';
import { VendorIcon } from '@/components/network-designer/VendorIcon';
import { VendorSpecificManagement } from '@/components/network-designer/VendorSpecificManagement';

// 网络接口信息类型定义
type NetworkInterface = {
  name: string;
  address: string;
  netmask: string;
  mac: string;
  family: string;
  internal: boolean;
  description?: string;
  speed?: number;
  status?: string;
};

// Dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 设备组类型定义
type DeviceGroup = {
  id: string;
  name: string;
  description: string;
  order?: number; // 用于排序
};

// 厂商特定属性
type VendorSpecificProperties = {
  // 华为设备特有属性
  huawei?: {
    modelSeries?: string; // 型号系列
    firmwareVersion?: string; // 固件版本
    snmpCommunity?: string; // SNMP团体名
  };
  // Cisco设备特有属性
  cisco?: {
    iosVersion?: string; // IOS版本
    licenseType?: string; // 许可类型
    snmpCommunity?: string; // SNMP团体名
  };
  // H3C设备特有属性
  h3c?: {
    softwareVersion?: string; // 软件版本
    deviceType?: string; // 设备类型
    snmpCommunity?: string; // SNMP团体名
  };
  // 锐捷设备特有属性
  ruijie?: {
    softwareVersion?: string; // 软件版本
    productFamily?: string; // 产品系列
    snmpCommunity?: string; // SNMP团体名
  };
  // 中兴设备特有属性
  zte?: {
    softwareVersion?: string; // 软件版本
    hardwareVersion?: string; // 硬件版本
    snmpCommunity?: string; // SNMP团体名
  };
};

// 清理网卡名称中的乱码字符
const cleanInterfaceName = (name: string): string => {
  if (!name) return name;
  
  // 移除常见的乱码字符和控制字符
  // 匹配非打印字符、特殊符号等
  let cleanedName = name.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  // 移除常见的乱码前缀/后缀
  cleanedName = cleanedName.replace(/^[\s\uFEFF\u200B\u200C\u200D\u2060]+|[\s\uFEFF\u200B\u200C\u200D\u2060]+$/g, '');
  
  // 移除重复的特殊字符
  cleanedName = cleanedName.replace(/[\u2013\u2014\u2015]{2,}/g, '-');
  
  // 移除替换字符(�)和其他乱码字符
  cleanedName = cleanedName.replace(/�+/g, '');
  
  // 移除无法识别的Unicode字符
  cleanedName = cleanedName.replace(/[^\x20-\x7E\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFa-zA-Z0-9_\-\.]/g, '');
  
  // 清理多余的空格
  cleanedName = cleanedName.replace(/\s+/g, ' ').trim();
  
  // 限制长度以避免显示问题
  if (cleanedName.length > 50) {
    cleanedName = cleanedName.substring(0, 47) + '...';
  }
  
  // 如果清理后为空或只包含空白字符，尝试从描述中提取有用信息
  if (!cleanedName || cleanedName.trim() === '') {
    return name.trim();
  }
  
  return cleanedName;
};

// 设备类型定义
type Device = {
  id: string;
  name: string;
  ip: string;
  groupId: string;
  description: string;
  vendor: '华为' | 'Cisco' | 'H3C' | '锐捷' | '中兴' | '其他';
  order?: number; // 用于排序
  vendorSpecific?: VendorSpecificProperties; // 厂商特定属性
};

// 子模块类型定义
type SubModule = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

// 可拖拽的设备行组件
function SortableDeviceRow({ 
  device, 
  groupName, 
  onEdit, 
  onDelete,
  onViewDetails
}: { 
  device: Device; 
  groupName: string; 
  onEdit: (device: Device) => void; 
  onDelete: (id: string) => void; 
  onViewDetails: (device: Device) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: device.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 0,
    position: isDragging ? 'relative' as const : 'static',
  } as React.CSSProperties;
  
  return (
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className="hover:bg-muted/30"
    >
      <TableCell className="cursor-grab active:cursor-grabbing w-12">
        <div 
          {...attributes} 
          {...listeners}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-medium text-foreground">{device.name}</TableCell>
      <TableCell className="text-foreground/80">{device.ip}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground">
          {groupName}
        </Badge>
      </TableCell>
      <TableCell>
        <VendorIcon vendor={device.vendor} size="sm" showText={false} />
      </TableCell>
      <TableCell className="text-foreground/80">{device.description}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-muted/50"
            onClick={() => onViewDetails(device)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-muted/50"
            onClick={() => onEdit(device)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-muted/50 hover:text-destructive"
            onClick={() => onDelete(device.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// 可拖拽的设备组行组件
function SortableGroupRow({ 
  group, 
  deviceCount, 
  onEdit, 
  onDelete 
}: { 
  group: DeviceGroup; 
  deviceCount: number; 
  onEdit: (group: DeviceGroup) => void; 
  onDelete: (id: string) => void; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: group.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 0,
    position: isDragging ? 'relative' as const : 'static',
  } as React.CSSProperties;
  
  return (
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className="hover:bg-muted/30"
    >
      <TableCell className="cursor-grab active:cursor-grabbing w-12">
        <div 
          {...attributes} 
          {...listeners}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-medium text-foreground">{group.name}</TableCell>
      <TableCell className="text-foreground/80">{group.description}</TableCell>
      <TableCell className="text-foreground/80">{deviceCount}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-muted/50"
            onClick={() => onEdit(group)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-muted/50 hover:text-destructive"
            onClick={() => onDelete(group.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function DeviceManagement({ onBackToMain }: { onBackToMain: () => void }) {
  // 设备组状态
  const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([
    { id: 'group-1', name: '核心网络', description: '核心交换机和路由器', order: 1 },
    { id: 'group-2', name: '接入网络', description: '接入层交换机', order: 2 },
    { id: 'group-3', name: '安全设备', description: '防火墙和安全设备', order: 3 },
  ]);
  
  // 网络接口状态
  const [networkInterfaces, setNetworkInterfaces] = useState<NetworkInterface[]>([]);
  const [loadingNetworkInterfaces, setLoadingNetworkInterfaces] = useState(false);
  const [allNetworkInterfaces, setAllNetworkInterfaces] = useState<NetworkInterface[]>([]);
  
  // 编辑设备组状态
  const [editingGroup, setEditingGroup] = useState<DeviceGroup | null>(null);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);
  
  // 设备状态
  const [devices, setDevices] = useState<Device[]>([
    { 
      id: 'dev-1', 
      name: '核心交换机01', 
      ip: '192.168.1.1', 
      groupId: 'group-1', 
      description: '核心网络主交换机', 
      vendor: '华为', 
      order: 1,
      vendorSpecific: {
        huawei: {
          modelSeries: 'S5720',
          firmwareVersion: 'V200R019C00SPC500',
          snmpCommunity: 'public'
        }
      }
    },
    { 
      id: 'dev-2', 
      name: '边界路由器01', 
      ip: '192.168.1.2', 
      groupId: 'group-1', 
      description: '网络边界路由器', 
      vendor: 'Cisco', 
      order: 2,
      vendorSpecific: {
        cisco: {
          iosVersion: '15.2(4)M11',
          licenseType: 'IPBase',
          snmpCommunity: 'public'
        }
      }
    },
    { 
      id: 'dev-3', 
      name: '接入交换机01', 
      ip: '192.168.10.1', 
      groupId: 'group-2', 
      description: '办公区域接入交换机', 
      vendor: '华为', 
      order: 3,
      vendorSpecific: {
        huawei: {
          modelSeries: 'S5735-L',
          firmwareVersion: 'V200R022C00SPC500',
          snmpCommunity: 'public'
        }
      }
    },
    { 
      id: 'dev-4', 
      name: '防火墙01', 
      ip: '192.168.1.3', 
      groupId: 'group-3', 
      description: '网络安全防火墙', 
      vendor: 'H3C', 
      order: 4,
      vendorSpecific: {
        h3c: {
          softwareVersion: 'H3C Comware Software, Version 7.1.070, Release 2612P06',
          deviceType: 'F1000-AK160',
          snmpCommunity: 'public'
        }
      }
    },
  ]);
  
  // Dnd-kit 传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // 拖拽状态
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // 子模块状态
  const [subModules, setSubModules] = useState<SubModule[]>([
    { id: 'group-management', name: '组管理', icon: <Server className="w-4 h-4" /> },
    { id: 'device-list', name: '设备列表', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'backup-management', name: '备份管理', icon: <Database className="w-4 h-4" /> },
    { id: 'config-management', name: '配置管理', icon: <FileText className="w-4 h-4" /> },
  ]);
  
  // 当前选中的子模块
  const [activeSubModule, setActiveSubModule] = useState('device-list');
  
  // 筛选状态
  const [filter, setFilter] = useState({
    name: '',
    groupId: '',
  });
  
  // 获取网络接口信息
  useEffect(() => {
    const fetchNetworkInterfaces = async () => {
      // 只在网卡信息模块被选中时获取数据
      if (activeSubModule === 'network-interfaces') {
        setLoadingNetworkInterfaces(true);
        try {
          // 检查是否在 Electron 环境中
          if (typeof window !== 'undefined' && (window as any).require) {
            const { ipcRenderer } = (window as any).require('electron');
            const interfaces = await ipcRenderer.invoke('get-network-interfaces');
            setNetworkInterfaces(interfaces);
            setAllNetworkInterfaces(interfaces);
          } else {
            // 开发环境使用 API 获取网络接口信息
            try {
              const response = await fetch('/api/packet-capture/interfaces');
              const data = await response.json();
              if (data && data.interfaces) {
                // 转换服务器返回的数据格式为前端所需格式
                const convertedInterfaces = data.interfaces.map((iface: any) => ({
                  name: iface.name,
                  description: iface.description,
                  address: iface.addresses && iface.addresses.length > 0 ? iface.addresses[0].address : '',
                  netmask: '',
                  mac: '',
                  family: iface.addresses && iface.addresses.length > 0 ? iface.addresses[0].family : '',
                  internal: false,
                  status: 'up'
                }));
                setNetworkInterfaces(convertedInterfaces);
                setAllNetworkInterfaces(convertedInterfaces);
              } else {
                // 出错时使用默认数据
                const defaultInterfaces = [
                  {
                    name: 'WLAN',
                    description: '无线局域网接口',
                    address: '192.168.1.100',
                    netmask: '255.255.255.0',
                    mac: '00:11:22:33:44:55',
                    family: 'IPv4',
                    internal: false,
                    status: 'up'
                  },
                  {
                    name: '以太网',
                    description: '以太网接口',
                    address: '10.0.0.5',
                    netmask: '255.255.255.0',
                    mac: 'AA:BB:CC:DD:EE:FF',
                    family: 'IPv4',
                    internal: false,
                    status: 'up'
                  },
                  {
                    name: 'Loopback',
                    description: '回环接口',
                    address: '127.0.0.1',
                    netmask: '255.0.0.0',
                    mac: '00:00:00:00:00:00',
                    family: 'IPv4',
                    internal: true,
                    status: 'up'
                  }
                ];
                setNetworkInterfaces(defaultInterfaces);
                setAllNetworkInterfaces(defaultInterfaces);
              }
            } catch (apiError) {
              console.error('通过API获取网络接口信息失败:', apiError);
              // 出错时使用默认数据
              const defaultInterfaces = [
                {
                  name: 'WLAN',
                  description: '无线局域网接口',
                  address: '192.168.1.100',
                  netmask: '255.255.255.0',
                  mac: '00:11:22:33:44:55',
                  family: 'IPv4',
                  internal: false,
                  status: 'up'
                },
                {
                  name: '以太网',
                  description: '以太网接口',
                  address: '10.0.0.5',
                  netmask: '255.255.255.0',
                  mac: 'AA:BB:CC:DD:EE:FF',
                  family: 'IPv4',
                  internal: false,
                  status: 'up'
                }
              ];
              setNetworkInterfaces(defaultInterfaces);
              setAllNetworkInterfaces(defaultInterfaces);
            }
          }
        } catch (error) {
          console.error('获取网络接口信息失败:', error);
          // 出错时使用默认数据
          const defaultInterfaces = [
            {
              name: 'WLAN',
              description: '无线局域网接口',
              address: '192.168.1.100',
              netmask: '255.255.255.0',
              mac: '00:11:22:33:44:55',
              family: 'IPv4',
              internal: false,
              status: 'up'
            }
          ];
          setNetworkInterfaces(defaultInterfaces);
          setAllNetworkInterfaces(defaultInterfaces);
        } finally {
          setLoadingNetworkInterfaces(false);
        }
      }
    };

    fetchNetworkInterfaces();
  }, [activeSubModule]);
  
  // 组管理筛选状态
  const [groupFilter, setGroupFilter] = useState('');
  
  // 设备搜索防抖
  const debouncedDeviceSearch = useDebounce(filter.name, 300);
  
  // 设备组搜索防抖
  const debouncedGroupSearch = useDebounce(groupFilter, 300);
  
  // 添加设备表单状态
  const [newDevice, setNewDevice] = useState({
    name: '',
    ip: '',
    groupId: '',
    description: '',
    vendor: '华为' as '华为' | 'Cisco' | 'H3C' | '锐捷' | '中兴' | '其他',
    vendorSpecific: {
      huawei: { modelSeries: '', firmwareVersion: '', snmpCommunity: '' },
      cisco: { iosVersion: '', licenseType: '', snmpCommunity: '' },
      h3c: { softwareVersion: '', deviceType: '', snmpCommunity: '' },
      ruijie: { softwareVersion: '', productFamily: '', snmpCommunity: '' },
      zte: { softwareVersion: '', hardwareVersion: '', snmpCommunity: '' },
    },
  });
  
  // 编辑设备状态
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [viewingDevice, setViewingDevice] = useState<Device | null>(null);
  
  // 厂商特定属性表单状态
  const [vendorSpecificForm, setVendorSpecificForm] = useState({
    huawei: { modelSeries: '', firmwareVersion: '', snmpCommunity: '' },
    cisco: { iosVersion: '', licenseType: '', snmpCommunity: '' },
    h3c: { softwareVersion: '', deviceType: '', snmpCommunity: '' },
    ruijie: { softwareVersion: '', productFamily: '', snmpCommunity: '' },
    zte: { softwareVersion: '', hardwareVersion: '', snmpCommunity: '' },
  });
  
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
  
  // 过滤并排序设备
  const filteredAndSortedDevices = devices
    .filter(device => {
      const matchesGroup = filter.groupId === '' || device.groupId === filter.groupId;
      
      // 多字段搜索：设备名、IP地址、描述、厂商
      const searchTerm = debouncedDeviceSearch.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        device.name.toLowerCase().includes(searchTerm) ||
        device.ip.toLowerCase().includes(searchTerm) ||
        device.description.toLowerCase().includes(searchTerm) ||
        device.vendor.toLowerCase().includes(searchTerm);
      
      return matchesGroup && matchesSearch;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // 过滤并排序设备组
  const filteredAndSortedGroups = deviceGroups
    .filter(group => {
      return debouncedGroupSearch === '' || group.name.toLowerCase().includes(debouncedGroupSearch.toLowerCase());
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // 处理设备拖拽开始
  const handleDeviceDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  // 处理设备拖拽结束
  const handleDeviceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setDevices(prev => {
        const oldIndex = prev.findIndex(d => d.id === active.id);
        const newIndex = prev.findIndex(d => d.id === over.id);
        
        // 重新计算order值
        const reordered = arrayMove(prev, oldIndex, newIndex);
        return reordered.map((device, index) => ({
          ...device,
          order: index + 1
        }));
      });
    }
    
    setActiveId(null);
  };
  
  // 处理设备组拖拽结束
  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setDeviceGroups(prev => {
        const oldIndex = prev.findIndex(g => g.id === active.id);
        const newIndex = prev.findIndex(g => g.id === over.id);
        
        // 重新计算order值
        const reordered = arrayMove(prev, oldIndex, newIndex);
        return reordered.map((group, index) => ({
          ...group,
          order: index + 1
        }));
      });
    }
  };
  
  // 处理添加设备
  const handleAddDevice = () => {
    if (newDevice.name && newDevice.ip && newDevice.groupId) {
      const device: Device = {
        id: `dev-${Date.now()}`,
        name: newDevice.name,
        ip: newDevice.ip,
        groupId: newDevice.groupId,
        description: newDevice.description,
        vendor: newDevice.vendor,
        vendorSpecific: newDevice.vendorSpecific,
      };
      setDevices(prev => [...prev, device]);
      setNewDevice({ 
        name: '', 
        ip: '', 
        groupId: '', 
        description: '',
        vendor: '华为',
        vendorSpecific: {
          huawei: { modelSeries: '', firmwareVersion: '', snmpCommunity: '' },
          cisco: { iosVersion: '', licenseType: '', snmpCommunity: '' },
          h3c: { softwareVersion: '', deviceType: '', snmpCommunity: '' },
          ruijie: { softwareVersion: '', productFamily: '', snmpCommunity: '' },
          zte: { softwareVersion: '', hardwareVersion: '', snmpCommunity: '' },
        },
      });
      setIsAddDialogOpen(false);
    }
  };
  
  // 处理编辑设备
  const handleEditDevice = () => {
    if (editingDevice && editingDevice.name && editingDevice.ip && editingDevice.groupId) {
      // 构建厂商特定属性
      const vendorSpecific: VendorSpecificProperties = {};
      
      switch (editingDevice.vendor) {
        case '华为':
          vendorSpecific.huawei = vendorSpecificForm.huawei;
          break;
        case 'Cisco':
          vendorSpecific.cisco = vendorSpecificForm.cisco;
          break;
        case 'H3C':
          vendorSpecific.h3c = vendorSpecificForm.h3c;
          break;
        case '锐捷':
          vendorSpecific.ruijie = vendorSpecificForm.ruijie;
          break;
        case '中兴':
          vendorSpecific.zte = vendorSpecificForm.zte;
          break;
      }
      
      setDevices(prev => 
        prev.map(device => 
          device.id === editingDevice.id ? {
            ...editingDevice,
            vendorSpecific
          } : device
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
    // 初始化厂商特定属性表单
    setVendorSpecificForm({
      huawei: { 
        modelSeries: device.vendorSpecific?.huawei?.modelSeries || '', 
        firmwareVersion: device.vendorSpecific?.huawei?.firmwareVersion || '', 
        snmpCommunity: device.vendorSpecific?.huawei?.snmpCommunity || '' 
      },
      cisco: { 
        iosVersion: device.vendorSpecific?.cisco?.iosVersion || '', 
        licenseType: device.vendorSpecific?.cisco?.licenseType || '', 
        snmpCommunity: device.vendorSpecific?.cisco?.snmpCommunity || '' 
      },
      h3c: { 
        softwareVersion: device.vendorSpecific?.h3c?.softwareVersion || '', 
        deviceType: device.vendorSpecific?.h3c?.deviceType || '', 
        snmpCommunity: device.vendorSpecific?.h3c?.snmpCommunity || '' 
      },
      ruijie: { 
        softwareVersion: device.vendorSpecific?.ruijie?.softwareVersion || '', 
        productFamily: device.vendorSpecific?.ruijie?.productFamily || '', 
        snmpCommunity: device.vendorSpecific?.ruijie?.snmpCommunity || '' 
      },
      zte: { 
        softwareVersion: device.vendorSpecific?.zte?.softwareVersion || '', 
        hardwareVersion: device.vendorSpecific?.zte?.hardwareVersion || '', 
        snmpCommunity: device.vendorSpecific?.zte?.snmpCommunity || '' 
      },
    });
    setIsEditDialogOpen(true);
  };
  
  // 打开查看详情对话框
  const openViewDetailsDialog = (device: Device) => {
    setViewingDevice(device);
    setIsViewDetailsDialogOpen(true);
  };
  
  // 打开编辑组对话框
  const openEditGroupDialog = (group: DeviceGroup) => {
    setEditingGroup(group);
    setIsEditGroupDialogOpen(true);
  };
  
  // 处理编辑组
  const handleEditGroup = () => {
    if (editingGroup && editingGroup.name) {
      setDeviceGroups(prev => 
        prev.map(group => 
          group.id === editingGroup.id ? editingGroup : group
        )
      );
      setEditingGroup(null);
      setIsEditGroupDialogOpen(false);
    }
  };
  
  // 处理删除组
  const handleDeleteGroup = (id: string) => {
    setDeviceGroups(prev => prev.filter(group => group.id !== id));
    // 同时将设备中引用该组的groupId设为空
    setDevices(prev => 
      prev.map(device => 
        device.groupId === id ? {...device, groupId: ''} : device
      )
    );
  };
  
  // 渲染右侧内容区域
  const renderContent = () => {
    switch (activeSubModule) {
      case 'group-management':
        // 过滤设备组
        const filteredGroups = deviceGroups.filter(group => {
          return groupFilter === '' || group.name.toLowerCase().includes(groupFilter.toLowerCase());
        });
        
        return (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">设备组管理</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  导入
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
                <Button>添加设备组</Button>
              </div>
            </div>
            
            {/* Filter Section */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="按组名搜索"
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
            
            {/* Group Table with Drag and Drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleGroupDragEnd}
            >
              <div className="flex-1 overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-12 text-foreground"></TableHead>
                      <TableHead className="text-foreground">组名</TableHead>
                      <TableHead className="text-foreground">描述</TableHead>
                      <TableHead className="text-foreground">设备数量</TableHead>
                      <TableHead className="text-right text-foreground">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <SortableContext 
                    items={filteredAndSortedGroups.map(g => g.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <TableBody>
                      {filteredAndSortedGroups.map(group => (
                        <SortableGroupRow 
                          key={group.id} 
                          group={group}
                          deviceCount={devices.filter(d => d.groupId === group.id).length}
                          onEdit={openEditGroupDialog}
                          onDelete={handleDeleteGroup}
                        />
                      ))}
                    </TableBody>
                  </SortableContext>
                </Table>
              </div>
            </DndContext>
          </div>
        );
      case 'device-list':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">设备列表</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  导入
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
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
                          className="bg-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">IP地址 *</label>
                        <Input
                          value={newDevice.ip}
                          onChange={(e) => setNewDevice(prev => ({ ...prev, ip: e.target.value }))}
                          placeholder="请输入IP地址"
                          className="bg-background border-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">设备组 *</label>
                        <Select 
                          value={newDevice.groupId} 
                          onValueChange={(value) => setNewDevice(prev => ({ ...prev, groupId: value }))}
                        >
                          <SelectTrigger className="bg-background border-input">
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
                <label className="text-sm font-medium">厂商 *</label>
                <Select 
                  value={newDevice.vendor} 
                  onValueChange={(value) => setNewDevice(prev => ({ ...prev, vendor: value as '华为' | 'Cisco' | 'H3C' | '锐捷' | '中兴' | '其他' }))}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="请选择厂商" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="华为">华为</SelectItem>
                    <SelectItem value="Cisco">Cisco</SelectItem>
                    <SelectItem value="H3C">H3C</SelectItem>
                    <SelectItem value="锐捷">锐捷</SelectItem>
                    <SelectItem value="中兴">中兴</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                      <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input
                  value={newDevice.description}
                  onChange={(e) => setNewDevice(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入设备描述（可选）"
                  className="bg-background border-input"
                />
              </div>
              
              {/* Vendor Specific Properties */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">厂商特定属性</h4>
                
                {/* Huawei Specific */}
                {newDevice.vendor === '华为' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">华为设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">型号系列</label>
                        <Input
                          value={newDevice.vendorSpecific.huawei?.modelSeries || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              huawei: { ...prev.vendorSpecific.huawei, modelSeries: e.target.value }
                            }
                          }))}
                          placeholder="例如: S5720"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">固件版本</label>
                        <Input
                          value={newDevice.vendorSpecific.huawei?.firmwareVersion || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              huawei: { ...prev.vendorSpecific.huawei, firmwareVersion: e.target.value }
                            }
                          }))}
                          placeholder="例如: V200R019C00SPC500"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={newDevice.vendorSpecific.huawei?.snmpCommunity || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              huawei: { ...prev.vendorSpecific.huawei, snmpCommunity: e.target.value }
                            }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cisco Specific */}
                {newDevice.vendor === 'Cisco' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Cisco设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">IOS版本</label>
                        <Input
                          value={newDevice.vendorSpecific.cisco?.iosVersion || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              cisco: { ...prev.vendorSpecific.cisco, iosVersion: e.target.value }
                            }
                          }))}
                          placeholder="例如: 15.2(4)M11"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">许可类型</label>
                        <Input
                          value={newDevice.vendorSpecific.cisco?.licenseType || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              cisco: { ...prev.vendorSpecific.cisco, licenseType: e.target.value }
                            }
                          }))}
                          placeholder="例如: IPBase"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={newDevice.vendorSpecific.cisco?.snmpCommunity || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              cisco: { ...prev.vendorSpecific.cisco, snmpCommunity: e.target.value }
                            }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* H3C Specific */}
                {newDevice.vendor === 'H3C' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">H3C设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <Input
                          value={newDevice.vendorSpecific.h3c?.softwareVersion || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              h3c: { ...prev.vendorSpecific.h3c, softwareVersion: e.target.value }
                            }
                          }))}
                          placeholder="例如: H3C Comware Software, Version 7.1.070, Release 2612P06"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">设备类型</label>
                        <Input
                          value={newDevice.vendorSpecific.h3c?.deviceType || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              h3c: { ...prev.vendorSpecific.h3c, deviceType: e.target.value }
                            }
                          }))}
                          placeholder="例如: LS-5500-28P-EI"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={newDevice.vendorSpecific.h3c?.snmpCommunity || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              h3c: { ...prev.vendorSpecific.h3c, snmpCommunity: e.target.value }
                            }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ruijie Specific */}
                {newDevice.vendor === '锐捷' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">锐捷设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <Input
                          value={newDevice.vendorSpecific.ruijie?.softwareVersion || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              ruijie: { ...prev.vendorSpecific.ruijie, softwareVersion: e.target.value }
                            }
                          }))}
                          placeholder="例如: RGOS 11.4(5)B2"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">产品系列</label>
                        <Input
                          value={newDevice.vendorSpecific.ruijie?.productFamily || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              ruijie: { ...prev.vendorSpecific.ruijie, productFamily: e.target.value }
                            }
                          }))}
                          placeholder="例如: S5750E"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={newDevice.vendorSpecific.ruijie?.snmpCommunity || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              ruijie: { ...prev.vendorSpecific.ruijie, snmpCommunity: e.target.value }
                            }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* ZTE Specific */}
                {newDevice.vendor === '中兴' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">中兴设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <Input
                          value={newDevice.vendorSpecific.zte?.softwareVersion || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              zte: { ...prev.vendorSpecific.zte, softwareVersion: e.target.value }
                            }
                          }))}
                          placeholder="例如: V8.00.10P01.D034S"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">硬件版本</label>
                        <Input
                          value={newDevice.vendorSpecific.zte?.hardwareVersion || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              zte: { ...prev.vendorSpecific.zte, hardwareVersion: e.target.value }
                            }
                          }))}
                          placeholder="例如: 1.00"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={newDevice.vendorSpecific.zte?.snmpCommunity || ''}
                          onChange={(e) => setNewDevice(prev => ({
                            ...prev,
                            vendorSpecific: {
                              ...prev.vendorSpecific,
                              zte: { ...prev.vendorSpecific.zte, snmpCommunity: e.target.value }
                            }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
              </div>
            </div>
            
            {/* Filter Section */}
            <div className="mb-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="搜索设备（名称、IP、描述、厂商）"
                  value={filter.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="pl-10 bg-background border-input"
                />
              </div>
              <div className="w-48">
                <Select 
                  value={filter.groupId} 
                  onValueChange={(value) => handleFilterChange('groupId', value)}
                >
                  <SelectTrigger className="bg-background border-input">
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
            
            {/* Device Table with Drag and Drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDeviceDragStart}
              onDragEnd={handleDeviceDragEnd}
            >
              <div className="h-full overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-12 text-foreground"></TableHead>
                      <TableHead className="text-foreground">设备名称</TableHead>
                      <TableHead className="text-foreground">IP地址</TableHead>
                      <TableHead className="text-foreground">设备组</TableHead>
                      <TableHead className="text-foreground">厂商</TableHead>
                      <TableHead className="text-foreground">描述</TableHead>
                      <TableHead className="text-right text-foreground">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <SortableContext 
                    items={filteredAndSortedDevices.map(d => d.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <TableBody>
                      {filteredAndSortedDevices.map((device) => (
                        <SortableDeviceRow 
                          key={device.id} 
                          device={device}
                          groupName={getGroupName(device.groupId)}
                          onEdit={openEditDialog}
                          onDelete={handleDeleteDevice}
                          onViewDetails={openViewDetailsDialog}
                        />
                      ))}
                    </TableBody>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <div className="bg-primary/10 border border-primary/30 rounded-md p-2">
                        {devices.find(d => d.id === activeId)?.name || 
                         deviceGroups.find(g => g.id === activeId)?.name}
                      </div>
                    ) : null}
                  </DragOverlay>
                </Table>
              </div>
            </DndContext>
          </>
        );
      case 'config-management':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">配置管理</h3>
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
            <p className="text-muted-foreground">配置管理功能正在开发中...</p>
          </div>
        );
      default:
        return null;
    }
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
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Submodule Navigation */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full p-4">
              <Card className="h-full flex flex-col bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">设备管理</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-1">
                    {subModules.map(module => (
                      <Button
                        key={module.id}
                        variant={activeSubModule === module.id ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-2 ${
                          activeSubModule === module.id 
                            ? "bg-secondary text-secondary-foreground" 
                            : "text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setActiveSubModule(module.id)}
                      >
                        {module.icon}
                        {module.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Content Area */}
          <ResizablePanel defaultSize={80} minSize={75}>
            <div className="h-full p-4">
              <Card className="h-full overflow-auto bg-card border-border">
                <CardContent className="p-6 h-full">
                  {renderContent()}
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
                  className="bg-background border-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IP地址 *</label>
                <Input
                  value={editingDevice.ip}
                  onChange={(e) => setEditingDevice(prev => prev ? {...prev, ip: e.target.value} : null)}
                  placeholder="请输入IP地址"
                  className="bg-background border-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">设备组 *</label>
                <Select 
                  value={editingDevice.groupId} 
                  onValueChange={(value) => setEditingDevice(prev => prev ? {...prev, groupId: value} : null)}
                >
                  <SelectTrigger className="bg-background border-input">
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
                <label className="text-sm font-medium">厂商 *</label>
                <Select 
                  value={editingDevice.vendor} 
                  onValueChange={(value) => setEditingDevice(prev => prev ? {...prev, vendor: value as '华为' | 'Cisco' | 'H3C' | '锐捷' | '中兴' | '其他'} : null)}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="请选择厂商" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="华为">华为</SelectItem>
                    <SelectItem value="Cisco">Cisco</SelectItem>
                    <SelectItem value="H3C">H3C</SelectItem>
                    <SelectItem value="锐捷">锐捷</SelectItem>
                    <SelectItem value="中兴">中兴</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input
                  value={editingDevice.description}
                  onChange={(e) => setEditingDevice(prev => prev ? {...prev, description: e.target.value} : null)}
                  placeholder="请输入设备描述（可选）"
                  className="bg-background border-input"
                />
              </div>
              
              {/* Vendor Specific Properties */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">厂商特定属性</h4>
                
                {/* Huawei Specific */}
                {editingDevice.vendor === '华为' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">华为设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">型号系列</label>
                        <Input
                          value={vendorSpecificForm.huawei.modelSeries}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            huawei: { ...prev.huawei, modelSeries: e.target.value }
                          }))}
                          placeholder="例如: S5720"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">固件版本</label>
                        <Input
                          value={vendorSpecificForm.huawei.firmwareVersion}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            huawei: { ...prev.huawei, firmwareVersion: e.target.value }
                          }))}
                          placeholder="例如: V200R019C00SPC500"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={vendorSpecificForm.huawei.snmpCommunity}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            huawei: { ...prev.huawei, snmpCommunity: e.target.value }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cisco Specific */}
                {editingDevice.vendor === 'Cisco' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Cisco设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">IOS版本</label>
                        <Input
                          value={vendorSpecificForm.cisco.iosVersion}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            cisco: { ...prev.cisco, iosVersion: e.target.value }
                          }))}
                          placeholder="例如: 15.2(4)M11"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">许可类型</label>
                        <Input
                          value={vendorSpecificForm.cisco.licenseType}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            cisco: { ...prev.cisco, licenseType: e.target.value }
                          }))}
                          placeholder="例如: IPBase"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={vendorSpecificForm.cisco.snmpCommunity}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            cisco: { ...prev.cisco, snmpCommunity: e.target.value }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* H3C Specific */}
                {editingDevice.vendor === 'H3C' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">H3C设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <Input
                          value={vendorSpecificForm.h3c.softwareVersion}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            h3c: { ...prev.h3c, softwareVersion: e.target.value }
                          }))}
                          placeholder="例如: H3C Comware Software, Version 7.1.070, Release 2612P06"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">设备类型</label>
                        <Input
                          value={vendorSpecificForm.h3c.deviceType}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            h3c: { ...prev.h3c, deviceType: e.target.value }
                          }))}
                          placeholder="例如: LS-5500-28P-EI"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={vendorSpecificForm.h3c.snmpCommunity}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            h3c: { ...prev.h3c, snmpCommunity: e.target.value }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ruijie Specific */}
                {editingDevice.vendor === '锐捷' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">锐捷设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <Input
                          value={vendorSpecificForm.ruijie.softwareVersion}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            ruijie: { ...prev.ruijie, softwareVersion: e.target.value }
                          }))}
                          placeholder="例如: RGOS 11.4(5)B2"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">产品系列</label>
                        <Input
                          value={vendorSpecificForm.ruijie.productFamily}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            ruijie: { ...prev.ruijie, productFamily: e.target.value }
                          }))}
                          placeholder="例如: S5750E"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={vendorSpecificForm.ruijie.snmpCommunity}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            ruijie: { ...prev.ruijie, snmpCommunity: e.target.value }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* ZTE Specific */}
                {editingDevice.vendor === '中兴' && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">中兴设备属性</div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <Input
                          value={vendorSpecificForm.zte.softwareVersion}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            zte: { ...prev.zte, softwareVersion: e.target.value }
                          }))}
                          placeholder="例如: V8.00.10P01.D034S"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">硬件版本</label>
                        <Input
                          value={vendorSpecificForm.zte.hardwareVersion}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            zte: { ...prev.zte, hardwareVersion: e.target.value }
                          }))}
                          placeholder="例如: 1.00"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <Input
                          value={vendorSpecificForm.zte.snmpCommunity}
                          onChange={(e) => setVendorSpecificForm(prev => ({
                            ...prev,
                            zte: { ...prev.zte, snmpCommunity: e.target.value }
                          }))}
                          placeholder="例如: public"
                          className="bg-background border-input text-xs h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
      
      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑设备组</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">组名 *</label>
                <Input
                  value={editingGroup.name}
                  onChange={(e) => setEditingGroup(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="请输入组名"
                  className="bg-background border-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input
                  value={editingGroup.description}
                  onChange={(e) => setEditingGroup(prev => prev ? {...prev, description: e.target.value} : null)}
                  placeholder="请输入描述（可选）"
                  className="bg-background border-input"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditGroupDialogOpen(false)}
                >
                  取消
                </Button>
                <Button onClick={handleEditGroup}>
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Device Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>设备详情</span>
              {viewingDevice && <VendorIcon vendor={viewingDevice.vendor} size="sm" />}
            </DialogTitle>
          </DialogHeader>
          {viewingDevice && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">设备名称</label>
                  <div className="p-2 bg-muted rounded-md">{viewingDevice.name}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">IP地址</label>
                  <div className="p-2 bg-muted rounded-md">{viewingDevice.ip}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">设备组</label>
                  <div className="p-2 bg-muted rounded-md">{getGroupName(viewingDevice.groupId)}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">厂商</label>
                  <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                    <VendorIcon vendor={viewingDevice.vendor} size="sm" />
                    {viewingDevice.vendor}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">描述</label>
                  <div className="p-2 bg-muted rounded-md">{viewingDevice.description || '无'}</div>
                </div>
              </div>
              
              {/* Vendor Specific Properties */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">厂商特定属性</h4>
                
                {/* Huawei Specific */}
                {viewingDevice.vendor === '华为' && viewingDevice.vendorSpecific?.huawei && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">华为设备属性</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">型号系列</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.huawei.modelSeries || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">固件版本</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.huawei.firmwareVersion || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.huawei.snmpCommunity || '未设置'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cisco Specific */}
                {viewingDevice.vendor === 'Cisco' && viewingDevice.vendorSpecific?.cisco && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Cisco设备属性</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">IOS版本</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.cisco.iosVersion || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">许可类型</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.cisco.licenseType || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.cisco.snmpCommunity || '未设置'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* H3C Specific */}
                {viewingDevice.vendor === 'H3C' && viewingDevice.vendorSpecific?.h3c && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">H3C设备属性</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.h3c.softwareVersion || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">设备类型</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.h3c.deviceType || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.h3c.snmpCommunity || '未设置'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ruijie Specific */}
                {viewingDevice.vendor === '锐捷' && viewingDevice.vendorSpecific?.ruijie && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">锐捷设备属性</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.ruijie.softwareVersion || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">产品系列</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.ruijie.productFamily || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.ruijie.snmpCommunity || '未设置'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* ZTE Specific */}
                {viewingDevice.vendor === '中兴' && viewingDevice.vendorSpecific?.zte && (
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300">中兴设备属性</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">软件版本</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.zte.softwareVersion || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">硬件版本</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.zte.hardwareVersion || '未设置'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">SNMP团体名</label>
                        <div className="p-2 bg-background border rounded-md text-sm">
                          {viewingDevice.vendorSpecific.zte.snmpCommunity || '未设置'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Other Vendor */}
                {!viewingDevice.vendorSpecific && (
                  <div className="text-center py-4 text-muted-foreground">
                    该厂商暂无特定属性
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDetailsDialogOpen(false)}>
                  关闭
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}