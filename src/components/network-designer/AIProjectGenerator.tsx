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
  Monitor,
  Settings,
  Activity,
  GitBranch,
  Layers
} from 'lucide-react';

export function AIProjectGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArchitecture, setGeneratedArchitecture] = useState<any>(null);
  
  const [requirements, setRequirements] = useState({
    // 基本信息
    projectName: '',
    projectDescription: '',
    deviceType: '',
    deviceCount: '',
    bandwidth: '',
    redundancy: 'single',
    userCount: '',
    networkIsolation: 'logical',
    customNetworkIsolation: '',
    budget: 'medium',
    
    // 网络架构需求
    topologyType: 'star',
    scalability: 'medium',
    availability: 'high',
    performance: 'standard',
    
    // IP地址管理需求
    ipScheme: 'ipv4',
    subnetStrategy: 'variable',
    addressingMethod: 'mixed',
    routingProtocol: 'static',
    
    // VLAN规划需求
    vlanStrategy: 'functional',
    vlanCount: '',
    trunkProtocol: 'dot1q',
    securityLevel: 'medium',
    
    // 文档生成需求
    documentTypes: ['pdf', 'word'],
    includeTopology: true,
    includeInventory: true,
    includeIpPlan: true,
    includeVlanPlan: true,
    includeImplementation: true,
    includeBudget: true
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
          diagram: '拓扑图数据...',
          devices: [
            { type: '核心路由器', count: 2, role: '核心层', model: 'Cisco ISR 4000' },
            { type: '汇聚交换机', count: 3, role: '汇聚层', model: 'Cisco Catalyst 9300' },
            { type: '接入交换机', count: parseInt(requirements.deviceCount) || 10, role: '接入层', model: 'Cisco Catalyst 9200' },
            { type: '防火墙', count: 1, role: '安全层', model: 'Fortigate 600E' }
          ],
          redundancy: requirements.redundancy === 'dual' ? '双链路冗余' : '单链路',
          availability: requirements.availability === 'high' ? '99.9%' : '99.5%',
          scalability: requirements.scalability === 'high' ? '高可扩展' : '中等扩展'
        },
        
        // IP地址管理
        ipManagement: {
          scheme: requirements.ipScheme === 'ipv4' ? 'IPv4' : 'IPv6',
          network: '192.168.0.0/16',
          subnets: [
            { name: '管理网络', cidr: '192.168.1.0/24', purpose: '设备管理', range: '192.168.1.1-192.168.1.254' },
            { name: '用户网络', cidr: '192.168.10.0/24', purpose: '普通用户', range: '192.168.10.1-192.168.10.254' },
            { name: '服务器网络', cidr: '192.168.20.0/24', purpose: '服务器群', range: '192.168.20.1-192.168.20.254' },
            { name: '访客网络', cidr: '192.168.30.0/24', purpose: '访客接入', range: '192.168.30.1-192.168.30.254' }
          ],
          addressingStrategy: {
            static: '服务器、网络设备',
            dynamic: '用户终端、访客设备',
            reserved: '网络管理、VLAN间路由'
          },
          routing: {
            defaultGateway: '192.168.1.1',
            staticRoutes: ['指向特定网段的静态路由'],
            dynamicRouting: requirements.routingProtocol === 'ospf' ? 'OSPF' : '静态路由'
          }
        },
        
        // VLAN规划
        vlanPlanning: {
          strategy: requirements.vlanStrategy === 'functional' ? '功能划分' : '部门划分',
          vlans: [
            { id: 10, name: '管理VLAN', purpose: '设备管理', subnet: '192.168.1.0/24', ports: '24' },
            { id: 20, name: '用户VLAN', purpose: '普通用户', subnet: '192.168.10.0/24', ports: '100' },
            { id: 30, name: '服务器VLAN', purpose: '服务器群', subnet: '192.168.20.0/24', ports: '16' },
            { id: 40, name: '访客VLAN', purpose: '访客网络', subnet: '192.168.30.0/24', ports: '50' },
            { id: 50, name: '语音VLAN', purpose: 'VoIP电话', subnet: '192.168.40.0/24', ports: '30' }
          ],
          trunkConfig: {
            protocol: requirements.trunkProtocol === 'dot1q' ? '802.1Q' : 'ISL',
            allowedVlans: 'All',
            nativeVlan: 1
          },
          security: {
            portSecurity: 'MAC地址限制',
            stormControl: '启用',
            bpduGuard: '启用',
            dhcpSnooping: '启用'
          }
        },
        
        // 项目预算和周期
        projectSummary: {
          estimatedCost: requirements.budget === 'high' ? '¥80,000-120,000' : 
                         requirements.budget === 'medium' ? '¥50,000-80,000' : '¥30,000-50,000',
          implementationTime: requirements.scalability === 'high' ? '3-4周' : '2-3周',
          complexity: requirements.availability === 'high' ? '高' : '中等',
          maintenanceCost: '¥5,000-8,000/年'
        }
      });
      setIsGenerating(false);
    }, 4000);
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header with File Operations */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">AI智能网络一键生成</h2>
            <Badge variant="secondary">项目管理</Badge>
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
                      placeholder="例如：中型企业网络升级项目"
                    />
                  </div>

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
                    <label className="text-sm font-medium">设备数量</label>
                    <Input
                      value={requirements.deviceCount}
                      onChange={(e) => setRequirements(prev => ({ ...prev, deviceCount: e.target.value }))}
                      placeholder="例如：10"
                    />
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
                    <label className="text-sm font-medium">冗余要求</label>
                    <Select 
                      value={requirements.redundancy} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, redundancy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">单链路</SelectItem>
                        <SelectItem value="dual">双链路</SelectItem>
                        <SelectItem value="multi">多链路</SelectItem>
                      </SelectContent>
                    </Select>
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

            {/* Network Architecture Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  网络架构需求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="text-sm font-medium">可扩展性</label>
                    <Select 
                      value={requirements.scalability} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, scalability: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低扩展性</SelectItem>
                        <SelectItem value="medium">中等扩展</SelectItem>
                        <SelectItem value="high">高扩展性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">可用性要求</label>
                    <Select 
                      value={requirements.availability} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">标准可用性</SelectItem>
                        <SelectItem value="high">高可用性</SelectItem>
                        <SelectItem value="critical">关键业务</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IP Address Management Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  IP地址管理需求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">IP地址方案</label>
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
                    <label className="text-sm font-medium">子网策略</label>
                    <Select 
                      value={requirements.subnetStrategy} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, subnetStrategy: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">固定子网</SelectItem>
                        <SelectItem value="variable">可变子网</SelectItem>
                        <SelectItem value="vlsm">VLSM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">路由协议</label>
                    <Select 
                      value={requirements.routingProtocol} 
                      onValueChange={(value) => setRequirements(prev => ({ ...prev, routingProtocol: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">静态路由</SelectItem>
                        <SelectItem value="ospf">OSPF</SelectItem>
                        <SelectItem value="bgp">BGP</SelectItem>
                        <SelectItem value="rip">RIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VLAN Planning Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  VLAN规划需求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">VLAN策略</label>
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
                    <label className="text-sm font-medium">VLAN数量</label>
                    <Input
                      value={requirements.vlanCount}
                      onChange={(e) => setRequirements(prev => ({ ...prev, vlanCount: e.target.value }))}
                      placeholder="例如：5"
                    />
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
                        <SelectItem value="dot1q">802.1Q</SelectItem>
                        <SelectItem value="isl">ISL</SelectItem>
                      </SelectContent>
                    </Select>
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
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI正在生成网络架构...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
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
                  <FileText className="w-4 h-4" />
                  项目信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">基本信息</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>项目名称：</span>
                        <span>{generatedArchitecture.projectInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>设计日期：</span>
                        <span>{generatedArchitecture.projectInfo.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>设计师：</span>
                        <span>{generatedArchitecture.projectInfo.designer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">项目概要</h4>
                    <p className="text-sm text-muted-foreground">
                      {generatedArchitecture.projectInfo.description}
                    </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">拓扑结构</h4>
                    <div className="p-3 bg-muted rounded-lg">
                      <Badge variant="secondary">{generatedArchitecture.topology.type}</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>冗余方式：</span>
                        <span>{generatedArchitecture.topology.redundancy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>可用性：</span>
                        <span>{generatedArchitecture.topology.availability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>扩展性：</span>
                        <span>{generatedArchitecture.topology.scalability}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">设备配置</h4>
                    <div className="space-y-2">
                      {generatedArchitecture.topology.devices.map((device: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="text-sm font-medium">{device.type}</span>
                            <div className="text-xs text-muted-foreground">{device.model}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{device.role}</Badge>
                            <span className="text-sm text-muted-foreground">×{device.count}</span>
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
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">IP地址规划</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono mb-2">{generatedArchitecture.ipManagement.network}</p>
                    <div className="space-y-1">
                      {generatedArchitecture.ipManagement.subnets.map((subnet: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{subnet.name}</span>
                          <span className="font-mono">{subnet.cidr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">地址分配策略</h4>
                    <div className="p-2 bg-muted rounded text-xs">
                      <p>• 静态分配：{generatedArchitecture.ipManagement.addressingStrategy.static}</p>
                      <p>• 动态分配：{generatedArchitecture.ipManagement.addressingStrategy.dynamic}</p>
                      <p>• 保留地址：{generatedArchitecture.ipManagement.addressingStrategy.reserved}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">路由规划</h4>
                    <div className="p-2 bg-muted rounded text-xs">
                      <p>• 默认网关：{generatedArchitecture.ipManagement.routing.defaultGateway}</p>
                      <p>• 路由方式：{generatedArchitecture.ipManagement.routing.dynamicRouting}</p>
                      <p>• 静态路由：{generatedArchitecture.ipManagement.routing.staticRoutes}</p>
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
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">VLAN配置</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {generatedArchitecture.vlanPlanning.vlans.map((vlan: any, index: number) => (
                      <div key={index} className="p-2 border rounded text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">VLAN {vlan.id}</span>
                          <Badge variant="outline" className="text-xs">{vlan.name}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{vlan.purpose}</p>
                        <p className="text-xs font-mono mt-1">{vlan.subnet}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Trunk配置</h4>
                    <div className="p-2 bg-muted rounded text-xs">
                      <p>• 协议：{generatedArchitecture.vlanPlanning.trunkConfig.protocol}</p>
                      <p>• 允许VLAN：{generatedArchitecture.vlanPlanning.trunkConfig.allowedVlans}</p>
                      <p>• 本地VLAN：{generatedArchitecture.vlanPlanning.trunkConfig.nativeVlan}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">安全配置</h4>
                    <div className="p-2 bg-muted rounded text-xs">
                      <p>• 端口安全：{generatedArchitecture.vlanPlanning.security.portSecurity}</p>
                      <p>• 风暴控制：{generatedArchitecture.vlanPlanning.security.stormControl}</p>
                      <p>• BPDU防护：{generatedArchitecture.vlanPlanning.security.bpduGuard}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">项目总结</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">成本预算</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>预估成本：</span>
                        <span className="text-green-600">{generatedArchitecture.projectSummary.estimatedCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>维护成本：</span>
                        <span className="text-blue-600">{generatedArchitecture.projectSummary.maintenanceCost}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">实施计划</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>实施周期：</span>
                        <span className="text-blue-600">{generatedArchitecture.projectSummary.implementationTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>复杂度：</span>
                        <span>{generatedArchitecture.projectSummary.complexity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Monitor className="w-4 h-4 mr-2" />
                    应用到画布
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    导出完整方案
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