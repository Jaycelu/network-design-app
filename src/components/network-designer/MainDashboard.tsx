'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Settings, 
  FolderOpen, 
  Wand2,
  Users,
  Zap,
  Shield,
  FileText,
  Activity,
  GitBranch,
  Monitor
} from 'lucide-react';

interface MainDashboardProps {
  onModuleSelect: (module: 'project' | 'device') => void;
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
    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary/50" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              {icon}
            </div>
            <div className="text-center flex-1">
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="mt-2">
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
        
        <Button className="w-full mt-4 hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Management Module */}
          <ModuleCard
            title="项目管理"
            icon={<Wand2 className="w-8 h-8 text-primary" />}
            badge="AI智能"
            features={[
              "AI智能网络一键生成",
              "网络架构拓扑设计",
              "IP地址自动规划",
              "VLAN逻辑隔离设计",
              "项目文档自动生成",
              "成本预算分析"
            ]}
            onClick={() => onModuleSelect('project')}
          />

          {/* Device Management Module */}
          <ModuleCard
            title="设备管理"
            icon={<Settings className="w-8 h-8 text-primary" />}
            badge="专业工具"
            features={[
              "设备配置自动生成",
              "批量配置下发",
              "设备状态实时监控",
              "配置版本管理",
              "故障诊断与告警",
              "性能数据分析"
            ]}
            onClick={() => onModuleSelect('device')}
          />
        </div>
      </div>
    </div>
  );
}