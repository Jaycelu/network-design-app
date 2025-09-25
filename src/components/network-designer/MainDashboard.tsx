'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Settings, 
  Wand2,
  FileText,
  Activity,
  PackageSearch
} from 'lucide-react';

interface MainDashboardProps {
  onModuleSelect: (module: 'project' | 'device' | 'ai-troubleshooting' | 'report') => void;
}

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  onClick: () => void;
  badge?: string;
}

function ModuleCard({ title, icon, features, onClick, badge }: ModuleCardProps) {
  return (
    <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:-translate-y-1" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="mt-1">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">主要功能：</h4>
          <div className="grid grid-cols-1 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <Button className="w-full hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300">
          进入模块
        </Button>
      </CardContent>
    </Card>
  );
}

export function MainDashboard({ onModuleSelect }: MainDashboardProps) {
  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-2xl px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-foreground">网络工程师一站式集成服务</h1>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Project Management Module */}
          <ModuleCard
            title="项目管理"
            description="AI驱动的网络项目设计与管理工具"
            icon={<Wand2 className="w-8 h-8 text-primary" />}
            badge="AI智能"
            features={[
              "AI智能网络一键生成",
              "网络架构拓扑设计",
              "IP地址自动规划",
              "VLAN逻辑隔离设计"
            ]}
            onClick={() => onModuleSelect('project')}
          />

          {/* Device Management Module */}
          <ModuleCard
            title="设备管理"
            description="网络设备配置与监控管理平台"
            icon={<Settings className="w-8 h-8 text-primary" />}
            badge="专业工具"
            features={[
              "设备配置自动生成",
              "批量配置下发",
              "设备状态实时监控",
              "配置版本管理"
            ]}
            onClick={() => onModuleSelect('device')}
          />

          {/* AI Troubleshooting Module */}
          <ModuleCard
            title="AI排错"
            description="基于AI的网络故障诊断与解决方案"
            icon={<Activity className="w-8 h-8 text-primary" />}
            badge="AI智能"
            features={[
              "智能问题分析诊断",
              "排错步骤指导",
              "解决方案推荐",
              "历史问题查询"
            ]}
            onClick={() => onModuleSelect('ai-troubleshooting')}
          />

          {/* Packet Analysis Module */}
          <ModuleCard
            title="抓包分析"
            description="网络数据包捕获与AI智能分析工具"
            icon={<PackageSearch className="w-8 h-8 text-primary" />}
            badge="网络诊断"
            features={[
              "实时数据包捕获",
              "流量模式分析",
              "异常检测识别",
              "AI智能诊断"
            ]}
            onClick={() => onModuleSelect('report')}
          />
        </div>
      </div>
    </div>
  );
}