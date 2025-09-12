'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Settings, 
  Network, 
  Server, 
  Router, 
  Shield,
  Zap,
  Users,
  FileText,
  Activity
} from 'lucide-react';

interface ModuleSelectionProps {
  onModuleSelect: (module: 'project' | 'device') => void;
}

export function ModuleSelection({ onModuleSelect }: ModuleSelectionProps) {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            网络工程师一站式集成服务
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            选择您要使用的功能模块，开始您的网络设计之旅
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            v1.0 专业版
          </Badge>
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Project Management Module */}
          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500"
            onClick={() => onModuleSelect('project')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">
                项目管理
              </CardTitle>
              <p className="text-gray-600">
                AI智能网络设计与管理平台
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">AI智能网络一键生成</span>
                </div>
                <div className="flex items-center gap-3">
                  <Router className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">网络架构设计</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">IP地址管理</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">VLAN规划</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">文档自动生成</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>特色功能</span>
                  <Badge className="bg-blue-100 text-blue-800">AI驱动</Badge>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 智能需求分析与拓扑生成</li>
                  <li>• 完整的网络设计方案输出</li>
                  <li>• 多格式文档导出支持</li>
                  <li>• 项目历史管理与追踪</li>
                </ul>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                进入项目管理
              </Button>
            </CardContent>
          </Card>

          {/* Device Management Module */}
          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500"
            onClick={() => onModuleSelect('device')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-900">
                设备管理
              </CardTitle>
              <p className="text-gray-600">
                网络设备配置与监控管理平台
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-green-600" />
                  <span className="text-sm">设备列表管理</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-sm">配置自动生成</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm">配置批量下发</span>
                </div>
                <div className="flex items-center gap-3">
                  <Router className="w-5 h-5 text-green-600" />
                  <span className="text-sm">实时配置监控</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-sm">版本控制管理</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>特色功能</span>
                  <Badge className="bg-green-100 text-green-800">自动化</Badge>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 多厂商设备支持</li>
                  <li>• 批量配置操作</li>
                  <li>• 实时状态监控</li>
                  <li>• 配置版本回滚</li>
                </ul>
              </div>
              
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                进入设备管理
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>系统运行正常</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI服务就绪</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>数据已同步</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}