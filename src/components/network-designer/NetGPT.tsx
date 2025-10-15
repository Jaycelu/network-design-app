'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AIChat } from '@/components/stock/AIChat';

interface NetGPTProps {
  onBackToMain: () => void;
}

export function NetGPT({ onBackToMain }: NetGPTProps) {
  const handleAnalyze = (filters: any) => {
    // 处理分析请求
    console.log('处理分析请求:', filters);
  };

  const handleReset = () => {
    // 处理重置请求
    console.log('处理重置请求');
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToMain}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回主界面
          </Button>
          <h2 className="text-2xl font-bold">NetGPT</h2>
        </div>
        <p className="text-muted-foreground">描述您遇到的网络问题，NetGPT将为您提供专业的排错指导</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <AIChat onAnalyze={handleAnalyze} onReset={handleReset} />
      </div>
    </div>
  );
}