'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Network, 
  Settings, 
  Wrench, 
  Download, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { VendorIcon } from '@/components/network-designer/VendorIcon';

interface VendorSpecificManagementProps {
  vendor: string;
  deviceId: string;
  deviceName: string;
  onAction: (action: string, params: any) => void;
}

export function VendorSpecificManagement({ vendor, deviceId, deviceName, onAction }: VendorSpecificManagementProps) {
  const renderHuaweiManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              配置管理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置备份</h4>
                <p className="text-sm text-muted-foreground">备份当前设备配置</p>
              </div>
              <Button size="sm" onClick={() => onAction('backupConfig', { vendor, deviceId })}>
                <Download className="w-4 h-4 mr-2" />
                备份
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置恢复</h4>
                <p className="text-sm text-muted-foreground">从备份恢复配置</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('restoreConfig', { vendor, deviceId })}>
                <Upload className="w-4 h-4 mr-2" />
                恢复
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              系统维护
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统重启</h4>
                <p className="text-sm text-muted-foreground">重启设备系统</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onAction('reboot', { vendor, deviceId })}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重启
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">固件升级</h4>
                <p className="text-sm text-muted-foreground">升级设备固件版本</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('upgradeFirmware', { vendor, deviceId })}>
                <Upload className="w-4 h-4 mr-2" />
                升级
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            网络诊断
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => onAction('pingTest', { vendor, deviceId, target: '' })}>
              Ping测试
            </Button>
            <Button variant="outline" onClick={() => onAction('traceroute', { vendor, deviceId, target: '' })}>
              Traceroute
            </Button>
            <Button variant="outline" onClick={() => onAction('interfaceStatus', { vendor, deviceId })}>
              接口状态
            </Button>
          </div>
          <div className="space-y-2">
            <Label>诊断目标</Label>
            <Input placeholder="输入IP地址或域名" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCiscoManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              配置管理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">运行配置</h4>
                <p className="text-sm text-muted-foreground">查看和保存运行配置</p>
              </div>
              <Button size="sm" onClick={() => onAction('showRunningConfig', { vendor, deviceId })}>
                <Play className="w-4 h-4 mr-2" />
                查看
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">启动配置</h4>
                <p className="text-sm text-muted-foreground">查看和保存启动配置</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('showStartupConfig', { vendor, deviceId })}>
                <Play className="w-4 h-4 mr-2" />
                查看
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置写入</h4>
                <p className="text-sm text-muted-foreground">将运行配置保存到NVRAM</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onAction('writeMemory', { vendor, deviceId })}>
                <Download className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              系统维护
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统重启</h4>
                <p className="text-sm text-muted-foreground">重启设备系统</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onAction('reload', { vendor, deviceId })}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重启
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">许可证管理</h4>
                <p className="text-sm text-muted-foreground">查看和管理设备许可证</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('licenseManagement', { vendor, deviceId })}>
                <Settings className="w-4 h-4 mr-2" />
                管理
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            网络诊断
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button onClick={() => onAction('ping', { vendor, deviceId, target: '' })}>
              Ping
            </Button>
            <Button variant="outline" onClick={() => onAction('traceroute', { vendor, deviceId, target: '' })}>
              Traceroute
            </Button>
            <Button variant="outline" onClick={() => onAction('showInterfaces', { vendor, deviceId })}>
              接口状态
            </Button>
            <Button variant="outline" onClick={() => onAction('showArp', { vendor, deviceId })}>
              ARP表
            </Button>
          </div>
          <div className="space-y-2">
            <Label>诊断目标</Label>
            <Input placeholder="输入IP地址或域名" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderH3CManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              配置管理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置保存</h4>
                <p className="text-sm text-muted-foreground">保存当前配置</p>
              </div>
              <Button size="sm" onClick={() => onAction('saveConfig', { vendor, deviceId })}>
                <Download className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置备份</h4>
                <p className="text-sm text-muted-foreground">备份设备配置</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('backupConfig', { vendor, deviceId })}>
                <Upload className="w-4 h-4 mr-2" />
                备份
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              系统维护
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统重启</h4>
                <p className="text-sm text-muted-foreground">重启设备系统</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onAction('reboot', { vendor, deviceId })}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重启
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统信息</h4>
                <p className="text-sm text-muted-foreground">查看系统详细信息</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('systemInfo', { vendor, deviceId })}>
                <Settings className="w-4 h-4 mr-2" />
                查看
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            网络诊断
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => onAction('ping', { vendor, deviceId, target: '' })}>
              Ping测试
            </Button>
            <Button variant="outline" onClick={() => onAction('tracert', { vendor, deviceId, target: '' })}>
              Tracert
            </Button>
            <Button variant="outline" onClick={() => onAction('displayInterface', { vendor, deviceId })}>
              接口状态
            </Button>
          </div>
          <div className="space-y-2">
            <Label>诊断目标</Label>
            <Input placeholder="输入IP地址或域名" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRuijieManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              配置管理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置保存</h4>
                <p className="text-sm text-muted-foreground">保存当前配置</p>
              </div>
              <Button size="sm" onClick={() => onAction('writeMemory', { vendor, deviceId })}>
                <Download className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置查看</h4>
                <p className="text-sm text-muted-foreground">查看运行配置</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('showRunningConfig', { vendor, deviceId })}>
                <Play className="w-4 h-4 mr-2" />
                查看
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              系统维护
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统重启</h4>
                <p className="text-sm text-muted-foreground">重启设备系统</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onAction('reload', { vendor, deviceId })}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重启
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">版本信息</h4>
                <p className="text-sm text-muted-foreground">查看设备版本信息</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('showVersion', { vendor, deviceId })}>
                <Settings className="w-4 h-4 mr-2" />
                查看
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            网络诊断
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => onAction('ping', { vendor, deviceId, target: '' })}>
              Ping测试
            </Button>
            <Button variant="outline" onClick={() => onAction('traceroute', { vendor, deviceId, target: '' })}>
              Traceroute
            </Button>
            <Button variant="outline" onClick={() => onAction('showInterface', { vendor, deviceId })}>
              接口状态
            </Button>
          </div>
          <div className="space-y-2">
            <Label>诊断目标</Label>
            <Input placeholder="输入IP地址或域名" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderZTEManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              配置管理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置保存</h4>
                <p className="text-sm text-muted-foreground">保存当前配置</p>
              </div>
              <Button size="sm" onClick={() => onAction('saveConfig', { vendor, deviceId })}>
                <Download className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">配置查看</h4>
                <p className="text-sm text-muted-foreground">查看运行配置</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('showRunningConfig', { vendor, deviceId })}>
                <Play className="w-4 h-4 mr-2" />
                查看
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              系统维护
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统重启</h4>
                <p className="text-sm text-muted-foreground">重启设备系统</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onAction('reboot', { vendor, deviceId })}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重启
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">系统信息</h4>
                <p className="text-sm text-muted-foreground">查看系统详细信息</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAction('showSystemInfo', { vendor, deviceId })}>
                <Settings className="w-4 h-4 mr-2" />
                查看
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            网络诊断
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => onAction('ping', { vendor, deviceId, target: '' })}>
              Ping测试
            </Button>
            <Button variant="outline" onClick={() => onAction('traceroute', { vendor, deviceId, target: '' })}>
              Traceroute
            </Button>
            <Button variant="outline" onClick={() => onAction('showInterface', { vendor, deviceId })}>
              接口状态
            </Button>
          </div>
          <div className="space-y-2">
            <Label>诊断目标</Label>
            <Input placeholder="输入IP地址或域名" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDefaultManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            厂商特定功能
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            当前厂商 "{vendor}" 的特定管理功能正在开发中。
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const getManagementInterface = () => {
    switch (vendor) {
      case '华为':
        return renderHuaweiManagement();
      case 'Cisco':
        return renderCiscoManagement();
      case 'H3C':
        return renderH3CManagement();
      case '锐捷':
        return renderRuijieManagement();
      case '中兴':
        return renderZTEManagement();
      default:
        return renderDefaultManagement();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VendorIcon vendor={vendor} size="md" />
          <div>
            <h2 className="text-xl font-bold">{deviceName}</h2>
            <p className="text-sm text-muted-foreground">设备ID: {deviceId}</p>
          </div>
        </div>
        <Badge variant="secondary">{vendor} 设备管理</Badge>
      </div>
      
      {getManagementInterface()}
    </div>
  );
}