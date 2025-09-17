'use client';

import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { TopToolbar } from './TopToolbar';
import { MainDashboard } from './MainDashboard';
import { AIIntegratedGenerator } from './AIIntegratedGenerator';
import { PropertiesPanel } from './PropertiesPanel';
import { CanvasArea } from './CanvasArea';
import { DeviceManagement } from './DeviceManagement';

type ViewMode = 'main' | 'project' | 'device' | 'ai-generator' | 'topology' | 'monitor' | 'report';

export function NetworkDesigner() {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleModuleSelect = (module: 'project' | 'device' | 'monitor' | 'report') => {
    switch (module) {
      case 'project':
        setViewMode('ai-generator');
        break;
      case 'device':
        setViewMode('device');
        break;
      case 'monitor':
        // TODO: Implement monitoring module
        setViewMode('main');
        break;
      case 'report':
        // TODO: Implement reporting module
        setViewMode('main');
        break;
      default:
        setViewMode('main');
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
        return <DeviceManagement onBackToMain={() => setViewMode('main')} />;
      
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