'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Network, Settings, FileText, Layers, GitBranch, Activity, FolderOpen, Wand2 } from 'lucide-react';

interface SidebarProps {
  activeModule: 'project' | 'device';
  onModuleChange: (module: 'project' | 'device') => void;
  onSubModuleChange: (subModule: string) => void;
}

export function Sidebar({ activeModule, onModuleChange, onSubModuleChange }: SidebarProps) {
  const projectModules = [
    { id: 'ai-architecture', name: 'AI生成架构', icon: Wand2 },
    { id: 'topology', name: '网络架构', icon: Network },
    { id: 'ip-management', name: 'IP地址管理', icon: Layers },
    { id: 'vlan', name: 'VLAN规划', icon: GitBranch },
    { id: 'documentation', name: '文档生成', icon: FileText },
  ];

  const deviceModules = [
    { id: 'device-list', name: '设备列表', icon: FolderOpen },
    { id: 'config-gen', name: '配置生成', icon: Settings },
    { id: 'config-deploy', name: '配置下发', icon: Activity },
    { id: 'config-monitor', name: '配置监控', icon: Activity },
    { id: 'config-version', name: '版本管理', icon: GitBranch },
  ];

  return (
    <div className="h-full flex flex-col bg-muted/10">
      {/* Module Selection */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => onModuleChange('project')}
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeModule === 'project'
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            项目管理
          </button>
          <button
            onClick={() => onModuleChange('device')}
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeModule === 'device'
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            设备管理
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {(activeModule === 'project' ? projectModules : deviceModules).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSubModuleChange(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status */}
      <div className="p-4 border-t text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>状态: 就绪</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}