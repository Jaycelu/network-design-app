'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function AIModelSettingsDialog({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const savedApiKey = localStorage.getItem('aihubmix_api_key') || '';
      const savedModel = localStorage.getItem('aihubmix_model') || 'gpt-4o';
      
      setApiKey(savedApiKey);
      setModel(savedModel);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('aihubmix_api_key', apiKey);
    localStorage.setItem('aihubmix_model', model);
    
    toast({
      title: '设置已保存',
      description: 'AI 模型设置已成功更新。',
    });
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>AI 模型设置</DialogTitle>
          <DialogDescription>
            配置 aihubmix 模型的连接参数。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="请输入您的 AIHUBMIX_API_KEY"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              模型名称
            </Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="col-span-3"
              placeholder="例如: gpt-4o"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
