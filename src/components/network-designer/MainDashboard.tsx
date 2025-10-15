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

function ModuleCard({ title, icon, features, onClick, badge, moduleType }: ModuleCardProps & { moduleType?: 'ai' | 'device' | 'troubleshoot' | 'packet' }) {
  const getModuleStyles = () => {
    switch (moduleType) {
      case 'ai':
        return {
          bgColor: 'bg-[var(--ai-module-bg)]',
          borderColor: 'hover:border-[var(--ai-module-border)]',
          iconBg: 'bg-[var(--ai-module-bg)]',
          iconColor: 'text-[var(--ai-module-icon)]',
          dotColor: 'bg-[var(--ai-module-icon)]',
          buttonBg: 'bg-[var(--ai-module-icon)] hover:bg-[var(--ai-module-text)]',
          buttonText: 'text-[var(--button-text-primary)]',
          badgeBg: 'bg-[var(--ai-module-bg)] text-[var(--ai-module-text)] border border-[var(--ai-module-border)]'
        };
      case 'device':
        return {
          bgColor: 'bg-[var(--device-module-bg)]',
          borderColor: 'hover:border-[var(--device-module-border)]',
          iconBg: 'bg-[var(--device-module-bg)]',
          iconColor: 'text-[var(--device-module-icon)]',
          dotColor: 'bg-[var(--device-module-icon)]',
          buttonBg: 'bg-[var(--device-module-icon)] hover:bg-[var(--device-module-text)]',
          buttonText: 'text-[var(--button-text-primary)]',
          badgeBg: 'bg-[var(--device-module-bg)] text-[var(--device-module-text)] border border-[var(--device-module-border)]'
        };
      case 'troubleshoot':
        return {
          bgColor: 'bg-[var(--troubleshoot-module-bg)]',
          borderColor: 'hover:border-[var(--troubleshoot-module-border)]',
          iconBg: 'bg-[var(--troubleshoot-module-bg)]',
          iconColor: 'text-[var(--troubleshoot-module-icon)]',
          dotColor: 'bg-[var(--troubleshoot-module-icon)]',
          buttonBg: 'bg-[var(--troubleshoot-module-icon)] hover:bg-[var(--troubleshoot-module-text)]',
          buttonText: 'text-[var(--button-text-primary)]',
          badgeBg: 'bg-[var(--troubleshoot-module-bg)] text-[var(--troubleshoot-module-text)] border border-[var(--troubleshoot-module-border)]'
        };
      case 'packet':
        return {
          bgColor: 'bg-[var(--packet-module-bg)]',
          borderColor: 'hover:border-[var(--packet-module-border)]',
          iconBg: 'bg-[var(--packet-module-bg)]',
          iconColor: 'text-[var(--packet-module-icon)]',
          dotColor: 'bg-[var(--packet-module-icon)]',
          buttonBg: 'bg-[var(--packet-module-icon)] hover:bg-[var(--packet-module-text)]',
          buttonText: 'text-[var(--button-text-primary)]',
          badgeBg: 'bg-[var(--packet-module-bg)] text-[var(--packet-module-text)] border border-[var(--packet-module-border)]'
        };
      default:
        return {
          bgColor: 'bg-primary/5',
          borderColor: 'hover:border-primary/50',
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          dotColor: 'bg-primary',
          buttonBg: 'bg-primary hover:bg-primary/90',
          buttonText: 'text-primary-foreground',
          badgeBg: 'bg-secondary text-secondary-foreground'
        };
    }
  };

  const styles = getModuleStyles();

  return (
    <Card className={`h-full cursor-pointer hover:shadow-lg transition-all duration-300 ${styles.borderColor} hover:-translate-y-1`} onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${styles.iconBg} rounded-xl transition-colors duration-300`}>
              <div className={styles.iconColor}>
                {icon}
              </div>
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{title}</CardTitle>
              {badge && (
                <Badge className={`mt-1 ${styles.badgeBg} rounded-full px-2.5 py-0.5`}>
                  {badge}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground/90">主要功能：</h4>
          <div className="grid grid-cols-1 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`w-1.5 h-1.5 ${styles.dotColor} rounded-full transition-colors duration-300`}></div>
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <Button className={`w-full ${styles.buttonBg} ${styles.buttonText} shadow-sm hover:shadow-md transition-all duration-300 font-medium`}>
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
          {/* Project Management Module - AI Module */}
          <ModuleCard
            title="项目管理"
            description="AI驱动的网络项目设计与管理工具"
            icon={<Wand2 className="w-8 h-8" />}
            badge="AI智能"
            moduleType="ai"
            features={[
              "AI智能网络一键生成",
              "网络架构拓扑设计",
              "IP地址自动规划",
              "VLAN逻辑隔离设计"
            ]}
            onClick={() => onModuleSelect('project')}
          />

          {/* Device Management Module - Device Module */}
          <ModuleCard
            title="设备管理"
            description="网络设备配置与监控管理平台"
            icon={<Settings className="w-8 h-8" />}
            badge="专业工具"
            moduleType="device"
            features={[
              "设备配置自动生成",
              "批量配置下发",
              "设备状态实时监控",
              "配置版本管理"
            ]}
            onClick={() => onModuleSelect('device')}
          />

          {/* NetGPT Module - Troubleshoot Module */}
          <ModuleCard
            title="NetGPT"
            description="基于AI的网络故障诊断与解决方案"
            icon={<Activity className="w-8 h-8" />}
            badge="AI智能"
            moduleType="troubleshoot"
            features={[
              "智能问题分析诊断",
              "排错步骤指导",
              "解决方案推荐",
              "历史问题查询"
            ]}
            onClick={() => onModuleSelect('netgpt')}
          />

          {/* Packet Analysis Module - Packet Module */}
          <ModuleCard
            title="抓包分析"
            description="网络数据包捕获与AI智能分析工具"
            icon={<PackageSearch className="w-8 h-8" />}
            badge="网络诊断"
            moduleType="packet"
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