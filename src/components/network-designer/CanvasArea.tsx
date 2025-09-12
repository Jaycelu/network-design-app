'use client';

import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from '@/lib/utils';
import { Network, Server, Router, Shield, Wifi } from 'lucide-react';
import { AIArchitectureGenerator } from './AIArchitectureGenerator';

interface CanvasAreaProps {
  activeModule: 'project' | 'device';
  activeSubModule: string;
  onNodeSelect: (node: any) => void;
}

// Custom Node Component
const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'router':
        return <Router className="w-6 h-6" />;
      case 'switch':
        return <Network className="w-6 h-6" />;
      case 'server':
        return <Server className="w-6 h-6" />;
      case 'firewall':
        return <Shield className="w-6 h-6" />;
      case 'wireless':
        return <Wifi className="w-6 h-6" />;
      default:
        return <Network className="w-6 h-6" />;
    }
  };

  return (
    <div
      className={cn(
        "px-4 py-2 shadow-lg rounded-lg border-2 bg-white min-w-[120px] text-center",
        selected ? "border-blue-500" : "border-gray-200"
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className={cn(
          "p-2 rounded-full",
          data.status === 'online' ? "text-green-600" : "text-red-600"
        )}>
          {getIcon()}
        </div>
        <div className="text-sm font-medium">{data.label}</div>
        <div className="text-xs text-gray-500">{data.ip}</div>
      </div>
    </div>
  );
};

// Node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export function CanvasArea({ activeModule, activeSubModule, onNodeSelect }: CanvasAreaProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      type: 'custom',
      position: { x: 250, y: 50 },
      data: { 
        label: '核心路由器', 
        type: 'router', 
        ip: '192.168.1.1',
        status: 'online'
      },
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 100, y: 150 },
      data: { 
        label: '接入交换机', 
        type: 'switch', 
        ip: '192.168.1.2',
        status: 'online'
      },
    },
    {
      id: '3',
      type: 'custom',
      position: { x: 400, y: 150 },
      data: { 
        label: '防火墙', 
        type: 'firewall', 
        ip: '192.168.1.3',
        status: 'online'
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
      },
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
      },
    },
  ]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    onNodeSelect(node);
  }, [onNodeSelect]);

  const addNode = (type: string, label: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      position: { 
        x: Math.random() * 400 + 50, 
        y: Math.random() * 300 + 50 
      },
      data: { 
        label, 
        type, 
        ip: `192.168.1.${nodes.length + 10}`,
        status: 'online'
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Show AI Architecture Generator for AI sub-module
  if (activeModule === 'project' && activeSubModule === 'ai-architecture') {
    return <AIArchitectureGenerator />;
  }

  // Show placeholder for other project sub-modules
  if (activeModule === 'project' && activeSubModule !== 'topology') {
    const getSubModuleTitle = () => {
      switch (activeSubModule) {
        case 'ip-management':
          return 'IP地址管理';
        case 'vlan':
          return 'VLAN规划';
        case 'documentation':
          return '文档生成';
        default:
          return '功能开发中';
      }
    };

    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{getSubModuleTitle()}</h3>
          <p className="text-muted-foreground">该功能正在开发中，敬请期待</p>
        </div>
      </div>
    );
  }

  // Show device management placeholder
  if (activeModule === 'device') {
    const getDeviceSubModuleTitle = () => {
      switch (activeSubModule) {
        case 'device-list':
          return '设备列表';
        case 'config-gen':
          return '配置生成';
        case 'config-deploy':
          return '配置下发';
        case 'config-monitor':
          return '配置监控';
        case 'config-version':
          return '版本管理';
        default:
          return '设备管理';
      }
    };

    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{getDeviceSubModuleTitle()}</h3>
          <p className="text-muted-foreground">请从右侧属性面板进行操作</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => addNode('router', '新路由器')}
          className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50"
        >
          添加路由器
        </button>
        <button
          onClick={() => addNode('switch', '新交换机')}
          className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50"
        >
          添加交换机
        </button>
        <button
          onClick={() => addNode('firewall', '新防火墙')}
          className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50"
        >
          添加防火墙
        </button>
        <button
          onClick={() => addNode('server', '新服务器')}
          className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50"
        >
          添加服务器
        </button>
      </div>

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          撤销
        </button>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          重做
        </button>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          放大
        </button>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          缩小
        </button>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          适应画布
        </button>
      </div>

      {/* File Operations for Canvas */}
      <div className="absolute top-16 right-4 z-10 flex gap-2">
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          导入
        </button>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          保存
        </button>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm hover:bg-gray-50 flex items-center gap-1">
          导出
        </button>
      </div>

      {/* React Flow Diagram */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background as string;
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background as string;
            return '#fff';
          }}
          nodeBorderRadius={2}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span>节点数: {nodes.length}</span>
          <span>连接数: {edges.length}</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            网络状态: 正常
          </span>
        </div>
        <div className="text-muted-foreground">
          拖拽节点移动位置 | 点击连接线编辑属性 | 右键显示更多选项
        </div>
      </div>
    </div>
  );
}