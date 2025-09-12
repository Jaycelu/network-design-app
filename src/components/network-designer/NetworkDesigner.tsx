'use client';

import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { TopToolbar } from './TopToolbar';
import { MainDashboard } from './MainDashboard';
import { AIIntegratedGenerator } from './AIIntegratedGenerator';
import { PropertiesPanel } from './PropertiesPanel';
import { CanvasArea } from './CanvasArea';

type ViewMode = 'main' | 'project' | 'device' | 'ai-generator' | 'topology';

export function NetworkDesigner() {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleModuleSelect = (module: 'project' | 'device') => {
    if (module === 'project') {
      setViewMode('ai-generator');
    } else {
      setViewMode('device');
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'main':
        return <MainDashboard onModuleSelect={handleModuleSelect} />;
      
      case 'ai-generator':
        return <AIIntegratedGenerator onBackToMain={() => setViewMode('main')} />;
      
      case 'topology':
        return <CanvasArea 
          activeModule="project"
          activeSubModule="topology"
          onNodeSelect={setSelectedNode}
        />;
      
      case 'device':
        return (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">设备管理模块</h3>
              <p className="text-muted-foreground">设备管理功能正在开发中...</p>
              <button 
                onClick={() => setViewMode('main')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                返回主页
              </button>
            </div>
          </div>
        );
      
      default:
        return <MainDashboard onModuleSelect={handleModuleSelect} />;
    }
  };

  // Show different layouts based on view mode
  if (viewMode === 'main') {
    return (
      <div className="h-full flex flex-col">
        <TopToolbar />
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <TopToolbar />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Main Content Area - Full width for project views */}
        <ResizablePanel defaultSize={80} minSize={60}>
          {renderContent()}
        </ResizablePanel>
        
        {viewMode === 'topology' && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <PropertiesPanel 
                selectedNode={selectedNode}
                activeModule="project"
                activeSubModule="topology"
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}