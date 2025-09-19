'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import authService, { AuthResponse } from '@/lib/authService';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess, onSwitchToRegister }: LoginDialogProps) {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result: AuthResponse = await authService.login(loginIdentifier, password);
      
      if (result.success) {
        toast({
          title: '登录成功',
          description: `欢迎回来，${result.user?.username}!`,
        });
        onLoginSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: '登录失败',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '登录错误',
        description: '登录过程中发生错误，请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>用户登录</DialogTitle>
          <DialogDescription>
            使用您的账号信息登录系统
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loginIdentifier">用户名/邮箱/手机号</Label>
            <Input
              id="loginIdentifier"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="请输入用户名、邮箱或手机号"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={onSwitchToRegister}
            >
              还没有账号？立即注册
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}