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

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterDialog({ open, onOpenChange, onRegisterSuccess, onSwitchToLogin }: RegisterDialogProps) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result: AuthResponse = await authService.register(
        username,
        phone,
        email,
        password,
        confirmPassword
      );

      if (result.success) {
        toast({
          title: '注册成功',
          description: `欢迎加入，${result.user?.username}！您已获得1000个免费Token`,
        });
        onRegisterSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: '注册失败',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '注册错误',
        description: '注册过程中发生错误，请稍后重试',
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
          <DialogTitle>用户注册</DialogTitle>
          <DialogDescription>
            创建新账号以使用系统功能
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">手机号</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
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
              placeholder="请输入密码（至少6位）"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              className="px-0"
              onClick={onSwitchToLogin}
            >
              已有账号？立即登录
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}