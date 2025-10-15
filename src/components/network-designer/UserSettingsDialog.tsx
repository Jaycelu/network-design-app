'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import authService from '@/lib/authService';

export function UserSettingsDialog({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pcapPath, setPcapPath] = useState('');
  const [backupPath, setBackupPath] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [isOpen, setIsOpen] = useState(false);

  // Check auth status and load paths on component mount
  useEffect(() => {
    setIsLoggedIn(authService.isAuthenticated());
    
    const savedPcapPath = localStorage.getItem('pcapPath');
    const savedBackupPath = localStorage.getItem('backupPath');
    if (savedPcapPath) setPcapPath(savedPcapPath);
    if (savedBackupPath) setBackupPath(savedBackupPath);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedTheme(theme);
    }
  }, [isOpen, theme]);

  const handleSelectFolder = async (pathType: 'pcap' | 'backup') => {
    const selectedPath = await window.electronAPI.openFolderDialog();
    if (selectedPath) {
      if (pathType === 'pcap') {
        setPcapPath(selectedPath);
        localStorage.setItem('pcapPath', selectedPath);
      } else {
        setBackupPath(selectedPath);
        localStorage.setItem('backupPath', selectedPath);
      }
    }
  };

  const handleSave = () => {
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
    // Here you would also save other settings
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
          <DialogDescription>
            管理您的账户、外观和应用设置。
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {isLoggedIn && <TabsTrigger value="account">个人账户</TabsTrigger>}
            <TabsTrigger value="appearance">外观设置</TabsTrigger>
            <TabsTrigger value="system">系统设置</TabsTrigger>
            <TabsTrigger value="about">关于</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          {isLoggedIn && (
            <TabsContent value="account">
              <div className="p-4">
                <h3 className="text-lg font-medium">账户信息</h3>
                <p className="text-sm text-muted-foreground">这里是账户设置的占位符。</p>
              </div>
            </TabsContent>
          )}

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="p-4">
              <h3 className="text-lg font-medium">主题模式</h3>
              <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">亮色</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">暗色</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">跟随系统</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-lg font-medium">文件存储路径</h3>
                <p className="text-sm text-muted-foreground">
                  设置抓包文件和项目配置的默认存储位置。
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pcap-path">抓包文件目录</Label>
                <div className="flex items-center space-x-2">
                  <Input id="pcap-path" value={pcapPath} readOnly placeholder="未设置路径" />
                  <Button variant="outline" onClick={() => handleSelectFolder('pcap')}>浏览...</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-path">项目备份目录</Label>
                <div className="flex items-center space-x-2">
                  <Input id="backup-path" value={backupPath} readOnly placeholder="未设置路径" />
                  <Button variant="outline" onClick={() => handleSelectFolder('backup')}>浏览...</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="p-4">
              <h3 className="text-lg font-medium">关于 Network Design App</h3>
              <p className="text-sm text-muted-foreground">版本 1.0.0</p>
            </div>
          </TabsContent>
        </Tabs>
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
