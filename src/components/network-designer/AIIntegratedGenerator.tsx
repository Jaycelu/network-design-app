'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  Sparkles, 
  Network, 
  Users, 
  Zap, 
  Shield,
  Loader2,
  Save,
  Download,
  Upload,
  FileText,
  Server,
  GitBranch,
  Layers,
  Monitor,
  ArrowLeft
} from 'lucide-react';

interface AIIntegratedGeneratorProps {
  onBackToMain: () => void;
}

export function AIIntegratedGenerator({ onBackToMain }: AIIntegratedGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArchitecture, setGeneratedArchitecture] = useState<any>(null);
  
  const [requirements, setRequirements] = useState({
    // 基本信息
    projectName: '',
    projectDescription: '',
    
    // 网络需求
    deviceType: '',
    deviceCount: '',
    bandwidth: '',
    redundancy: 'single',
    userCount: '',
    networkIsolation: 'logical',
    customNetworkIsolation: '',
    
    // 网络架构配置
    topologyType: 'star',
    networkLayers: 'three-tier',
    
    // IP地址管理配置
    ipScheme: 'ipv4',
    addressAllocation: 'dynamic',
    subnetStrategy: 'variable',
    
    // VLAN规划配置
    vlanStrategy: 'functional',
    trunkProtocol: '802.1q',
    
    // 安全配置
    securityRequirements: 'basic',
    firewallType: 'next-gen',
    intrusionDetection: false,
    
    // 文档生成配置
    documentFormat: 'pdf',
    includeTopology: true,
    includeInventory: true,
    includeIPPlan: true,
    includeVLANConfig: true,
    includeImplementation: true,
    includeBudget: true,
    includeSecurity: true
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      setGeneratedArchitecture({
        // 基本信息
        projectInfo: {
          name: requirements.projectName || '企业网络架构设计',
          description: requirements.projectDescription || '基于AI生成的企业级网络架构方案',
          date: new Date().toLocaleDateString(),
          designer: 'AI智能生成'
        },
        
        // 网络架构
        topology: {
          type: requirements.topologyType === 'star' ? '星型拓扑' : '网状拓扑',
          layers: requirements.networkLayers === 'three-tier' ? '三层架构' : '两层架构',
          devices: [
            { type: '核心路由器', count: 2, role: '核心层', model: 'Cisco ISR 4000' },
            { type: '汇聚交换机', count: 3, role: '汇聚层', model: 'Cisco Catalyst 9300' },
            { type: '接入交换机', count: parseInt(requirements.deviceCount) || 10, role: '接入层', model: 'Cisco Catalyst 9200' },
            { type: '防火墙', count: 1, role: '安全层', model: requirements.firewallType === 'next-gen' ? 'Fortigate 600E' : 'Cisco ASA 5500' }
          ]
        },
        
        // IP地址管理
        ipManagement: {
          scheme: requirements.ipScheme === 'ipv4' ? 'IPv4' : 'IPv6',
          network: '192.168.0.0/16',
          subnets: [
            { name: '管理网络', cidr: '192.168.1.0/24', purpose: '设备管理', gateway: '192.168.1.1' },
            { name: '用户网络', cidr: '192.168.10.0/24', purpose: '普通用户', gateway: '192.168.10.1' },
            { name: '服务器网络', cidr: '192.168.20.0/24', purpose: '服务器群', gateway: '192.168.20.1' },
            { name: '访客网络', cidr: '192.168.30.0/24', purpose: '访客接入', gateway: '192.168.30.1' },
            { name: '安全网络', cidr: '192.168.40.0/24', purpose: '安全设备', gateway: '192.168.40.1' }
          ],
          allocationStrategy: requirements.addressAllocation === 'dynamic' ? '动态分配为主' : '静态分配为主',
          dhcpConfig: {
            poolStart: '192.168.10.100',
            poolEnd: '192.168.10.200',
            leaseTime: '86400',
            dnsServers: ['8.8.8.8', '8.8.4.4']
          }
        },
        
        // VLAN规划
        vlanPlanning: {
          strategy: requirements.vlanStrategy === 'functional' ? '功能划分' : '部门划分',
          vlans: [
            { id: 10, name: '管理VLAN', purpose: '设备管理', network: '192.168.1.0/24', ports: 24 },
            { id: 20, name: '用户VLAN', purpose: '普通用户', network: '192.168.10.0/24', ports: 100 },
            { id: 30, name: '服务器VLAN', purpose: '服务器群', network: '192.168.20.0/24', ports: 48 },
            { id: 40, name: '访客VLAN', purpose: '访客接入', network: '192.168.30.0/24', ports: 50 },
            { id: 50, name: '语音VLAN', purpose: 'VoIP电话', network: '192.168.40.0/24', ports: 30 },
            { id: 60, name: '安全VLAN', purpose: '安全设备', network: '192.168.50.0/24', ports: 20 }
          ],
          trunkConfig: {
            protocol: requirements.trunkProtocol,
            allowedVlans: '10-60',
            nativeVlan: 1
          },
          securityConfig: {
            portSecurity: 'enabled',
            stormControl: 'enabled',
            bpduguard: 'enabled',
            dhcpSnooping: 'enabled'
          }
        },
        
        // 安全配置
        security: {
          requirements: requirements.securityRequirements,
          firewall: {
            type: requirements.firewallType,
            model: requirements.firewallType === 'next-gen' ? 'Fortigate 600E' : 'Cisco ASA 5500',
            features: requirements.firewallType === 'next-gen' ? [
              '应用控制',
              '入侵防护',
              '病毒防护',
              'Web过滤'
            ] : [
              '包过滤',
              '状态检测',
              'VPN支持'
            ]
          },
          ids: requirements.intrusionDetection ? {
            enabled: true,
            type: '网络入侵检测',
            model: 'Snort',
            deployment: '旁路部署'
          } : {
            enabled: false
          },
          accessControl: {
            strategy: '基于角色的访问控制',
            authentication: '802.1X',
            authorization: 'TACACS+'
          }
        },
        
        // 项目估算
        estimation: {
          cost: requirements.securityRequirements === 'enterprise' ? '¥120,000-180,000' : 
                 requirements.securityRequirements === 'enhanced' ? '¥100,000-150,000' : '¥80,000-120,000',
          timeline: '3-4周',
          complexity: requirements.securityRequirements === 'enterprise' ? '高' : 
                      requirements.securityRequirements === 'enhanced' ? '中高' : '中等',
          riskLevel: requirements.securityRequirements === 'enterprise' ? '低' : 
                     requirements.securityRequirements === 'enhanced' ? '中低' : '低'
        }
      });
      setIsGenerating(false);
    }, 4000);
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header with File Operations */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToMain}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回主界面
              </Button>
              <div className="flex items-center gap-3">
                <Wand2 className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold">AI智能网络一键生成</h2>
                <Badge variant="secondary">集成版</Badge>
              </div>
            </div>
            
            {/* File Operations */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                导入需求
              </Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                保存方案
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出方案
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!generatedArchitecture ? (
          <>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">项目名称</label>
                    <Input
                      value={requirements.projectName}
                      onChange={(e) => setRequirements(prev => ({ ...prev, projectName: e.target.value }))}
                      placeholder="例如：企业网络架构设计"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">项目描述</label>
                    <Input
                      value={requirements.projectDescription}
                      onChange={(e) => setRequirements(prev => ({ ...prev, projectDescription: e.target.value }))}
                      placeholder="简要描述项目需求"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  网络需求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">主要设备类型</label>
                    <Select 
                      value={requirements.deviceType} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, deviceType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择设备类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="router">路由器为主</SelectItem>
                        <SelectItem value="switch">交换机为主</SelectItem>
                        <SelectItem value="firewall">防火墙为主</SelectItem>
                        <SelectItem value="mixed">混合设备</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">冗余要求</label>
                    <Select 
                      value={requirements.redundancy} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, redundancy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">单链路（基础）</SelectItem>
                        <SelectItem value="dual">双链路（推荐）</SelectItem>
                        <SelectItem value="multi">多链路（高可用）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      用户数量
                    </label>
                    <Input
                      value={requirements.userCount}
                      onChange={(e) => setRequirements(prev => ({ ...prev, userCount: e.target.value }))}
                      placeholder="例如：100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      带宽需求
                    </label>
                    <Input
                      value={requirements.bandwidth}
                      onChange={(e) => setRequirements(prev => ({ ...prev, bandwidth: e.target.value }))}
                      placeholder="例如：1000Mbps"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">设备数量</label>
                    <Input
                      value={requirements.deviceCount}
                      onChange={(e) => setRequirements(prev => ({ ...prev, deviceCount: e.target.value }))}
                      placeholder="例如：10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      网络隔离
                    </label>
                    <Select 
                      value={requirements.networkIsolation} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, networkIsolation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logical">内外网逻辑隔离</SelectItem>
                        <SelectItem value="physical">内外网物理隔离</SelectItem>
                        <SelectItem value="external">纯外网</SelectItem>
                        <SelectItem value="internal">纯内网</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                    {requirements.networkIsolation === 'other' && (
                      <Input
                        value={requirements.customNetworkIsolation}
                        onChange={(e) => setRequirements(prev => ({ ...prev, customNetworkIsolation: e.target.value }))}
                        placeholder="请输入自定义网络隔离方式"
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Architecture Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  网络架构配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">拓扑类型</label>
                    <Select 
                      value={requirements.topologyType} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, topologyType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="star">星型拓扑</SelectItem>
                        <SelectItem value="mesh">网状拓扑</SelectItem>
                        <SelectItem value="tree">树型拓扑</SelectItem>
                        <SelectItem value="ring">环形拓扑</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">网络层次</label>
                    <Select 
                      value={requirements.networkLayers} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, networkLayers: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="two-tier">两层架构</SelectItem>
                        <SelectItem value="three-tier">三层架构</SelectItem>
                        <SelectItem value="collapsed-core">折叠核心</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IP Address Management Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  IP地址管理配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">地址方案</label>
                    <Select 
                      value={requirements.ipScheme} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, ipScheme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ipv4">IPv4</SelectItem>
                        <SelectItem value="ipv6">IPv6</SelectItem>
                        <SelectItem value="dual">双栈</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">分配方式</label>
                    <Select 
                      value={requirements.addressAllocation} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, addressAllocation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dynamic">动态分配为主</SelectItem>
                        <SelectItem value="static">静态分配为主</SelectItem>
                        <SelectItem value="mixed">混合分配</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">子网策略</label>
                    <Select 
                      value={requirements.subnetStrategy} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, subnetStrategy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">固定大小</SelectItem>
                        <SelectItem value="variable">可变大小</SelectItem>
                        <SelectItem value="vlsm">VLSM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VLAN Planning Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  VLAN规划配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">划分策略</label>
                    <Select 
                      value={requirements.vlanStrategy} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, vlanStrategy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="functional">功能划分</SelectItem>
                        <SelectItem value="department">部门划分</SelectItem>
                        <SelectItem value="location">位置划分</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trunk协议</label>
                    <Select 
                      value={requirements.trunkProtocol} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, trunkProtocol: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="802.1q">802.1Q</SelectItem>
                        <SelectItem value="isl">ISL</SelectItem>
                        <SelectItem value="dot1q">Dot1q</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  安全配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">安全要求</label>
                    <Select 
                      value={requirements.securityRequirements} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, securityRequirements: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">基础安全</SelectItem>
                        <SelectItem value="enhanced">增强安全</SelectItem>
                        <SelectItem value="enterprise">企业级安全</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">防火墙类型</label>
                    <Select 
                      value={requirements.firewallType} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, firewallType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="next-gen">下一代防火墙</SelectItem>
                        <SelectItem value="traditional">传统防火墙</SelectItem>
                        <SelectItem value="cloud">云防火墙</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 flex items-end">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={requirements.intrusionDetection}
                        onChange={(e) => setRequirements(prev => ({ 
                          ...prev, 
                          intrusionDetection: e.target.checked 
                        }))}
                        className="rounded"
                      />
                      入侵检测系统
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Generation Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  文档生成配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">文档格式</label>
                    <Select 
                      value={requirements.documentFormat} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, documentFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="word">Word</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">包含内容</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'includeTopology', label: '网络拓扑图' },
                      { key: 'includeInventory', label: '设备清单' },
                      { key: 'includeIPPlan', label: 'IP地址规划' },
                      { key: 'includeVLANConfig', label: 'VLAN配置' },
                      { key: 'includeImplementation', label: '实施计划' },
                      { key: 'includeBudget', label: '预算分析' },
                      { key: 'includeSecurity', label: '安全配置' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={requirements[item.key as keyof typeof requirements] as boolean}
                          onChange={(e) => setRequirements(prev => ({ 
                            ...prev, 
                            [item.key]: e.target.checked 
                          }))}
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !requirements.deviceType}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-3"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI正在生成完整网络方案...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      AI智能网络一键生成
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Generated Results */
          <div className="space-y-6">
            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  项目信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">基本信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">项目名称：</span>
                        <span>{generatedArchitecture.projectInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">设计日期：</span>
                        <span>{generatedArchitecture.projectInfo.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">设计师：</span>
                        <span>{generatedArchitecture.projectInfo.designer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">项目概要</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">预估成本：</span>
                        <span className="text-green-600 font-medium">{generatedArchitecture.estimation.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">实施周期：</span>
                        <span className="text-blue-600 font-medium">{generatedArchitecture.estimation.timeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">复杂度：</span>
                        <span>{generatedArchitecture.estimation.complexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">风险等级：</span>
                        <span>{generatedArchitecture.estimation.riskLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  网络架构
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">拓扑设计</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">拓扑类型：</span>
                        <Badge variant="secondary">{generatedArchitecture.topology.type}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">网络层次：</span>
                        <Badge variant="secondary">{generatedArchitecture.topology.layers}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">设备配置</h4>
                    <div className="space-y-2">
                      {generatedArchitecture.topology.devices.map((device: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{device.type}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{device.role}</Badge>
                            <span className="text-muted-foreground">×{device.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IP Address Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  IP地址管理
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">地址规划</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-mono mb-2">{generatedArchitecture.ipManagement.network}</p>
                        <div className="space-y-1">
                          {generatedArchitecture.ipManagement.subnets.map((subnet: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{subnet.name}</span>
                              <span className="font-mono">{subnet.cidr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">分配策略</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">地址方案：</span>
                        <span>{generatedArchitecture.ipManagement.scheme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">分配策略：</span>
                        <span>{generatedArchitecture.ipManagement.allocationStrategy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DHCP范围：</span>
                        <span className="font-mono">{generatedArchitecture.ipManagement.dhcpConfig.poolStart} - {generatedArchitecture.ipManagement.dhcpConfig.poolEnd}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VLAN Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  VLAN规划
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">VLAN配置</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {generatedArchitecture.vlanPlanning.vlans.map((vlan: any, index: number) => (
                        <div key={index} className="p-2 border rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">VLAN {vlan.id}</span>
                            <Badge variant="outline" className="text-xs">{vlan.name}</Badge>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>{vlan.purpose}</span>
                            <span>{vlan.ports} 端口</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Trunk与安全</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trunk协议：</span>
                        <span>{generatedArchitecture.vlanPlanning.trunkConfig.protocol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">允许VLAN：</span>
                        <span>{generatedArchitecture.vlanPlanning.trunkConfig.allowedVlans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">端口安全：</span>
                        <span>{generatedArchitecture.vlanPlanning.securityConfig.portSecurity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">风暴控制：</span>
                        <span>{generatedArchitecture.vlanPlanning.securityConfig.stormControl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Configuration */}
            {requirements.includeSecurity && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    安全配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">安全要求</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">安全级别：</span>
                          <Badge variant={
                            generatedArchitecture.security.requirements === 'enterprise' ? 'default' :
                            generatedArchitecture.security.requirements === 'enhanced' ? 'secondary' : 'outline'
                          }>
                            {generatedArchitecture.security.requirements === 'enterprise' ? '企业级安全' :
                             generatedArchitecture.security.requirements === 'enhanced' ? '增强安全' : '基础安全'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">防火墙类型：</span>
                          <span>{generatedArchitecture.security.firewall.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">防火墙型号：</span>
                          <span>{generatedArchitecture.security.firewall.model}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">安全功能</h4>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <span className="text-sm font-medium">防火墙功能：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedArchitecture.security.firewall.features.map((feature: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-medium">入侵检测：</span>
                          {generatedArchitecture.security.ids.enabled ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs">已启用</Badge>
                              <span className="text-xs text-muted-foreground">
                                {generatedArchitecture.security.ids.type}
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">未启用</Badge>
                          )}
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-muted-foreground">访问控制：</span>
                          <span>{generatedArchitecture.security.accessControl.strategy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Monitor className="w-4 h-4 mr-2" />
                    应用到画布
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    导出完整方案
                  </Button>
                  <Button variant="outline" onClick={() => setGeneratedArchitecture(null)}>
                    重新生成
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}