'use client';

import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ConversationHistory } from './ConversationHistory';
import { AIArchitectureGenerator } from './AIArchitectureGenerator';
import { PropertiesPanel } from './PropertiesPanel';
import { ProjectTopToolbar } from './ProjectTopToolbar';
import { Button } from '@/components/ui/button';

interface ProjectManagementProps {
  onBack: () => void;
}

export function ProjectManagement({ onBack }: ProjectManagementProps) {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleNewConversation = () => {
    setActiveConversation(null);
    setShowAIGenerator(true);
  };

  const handleConversationSelect = (id: string) => {
    setActiveConversation(id);
    setShowAIGenerator(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Module Header */}
      <ProjectTopToolbar onBack={onBack} />
      
      {/* Main Content Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar - Conversation History */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ConversationHistory
            activeConversation={activeConversation}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Central Canvas */}
        <ResizablePanel defaultSize={60} minSize={40}>
          {showAIGenerator ? (
            <AIArchitectureGenerator />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">历史项目</h3>
                <p className="text-muted-foreground">正在加载项目内容...</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleNewConversation}
                >
                  创建新项目
                </Button>
              </div>
            </div>
          )}
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Properties Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <PropertiesPanel 
            selectedNode={selectedNode}
            activeModule={'project'}
            activeSubModule={showAIGenerator ? 'ai-architecture' : ''}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}