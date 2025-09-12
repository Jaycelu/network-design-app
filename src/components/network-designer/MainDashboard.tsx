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
    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
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
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <Button className="w-full mt-4">
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
          <h1 className="text-4xl font-bold mb-4">网络工程师一站式集成服务</h1>
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

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">服务企业</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">设计项目</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">系统可用性</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">技术支持</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}