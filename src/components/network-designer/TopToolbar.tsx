'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
  Bot
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LoginDialog } from './LoginDialog';
import { RegisterDialog } from './RegisterDialog';
import authService from '@/lib/authService';
import { UserSettingsDialog } from './UserSettingsDialog';
import { AIModelSettingsDialog } from './AIModelSettingsDialog';

export function TopToolbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  // 检查用户登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      if (authService.isAuthenticated()) {
        setIsLoggedIn(true);
        setUser(authService.getCurrentUser());
      }
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUser(authService.getCurrentUser());
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    setUser(authService.getCurrentUser());
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleSwitchToRegister = () => {
    setShowLoginDialog(false);
    setShowRegisterDialog(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterDialog(false);
    setShowLoginDialog(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="h-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">JacyeLu-online</h1>
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">v1.0</Badge>
              </div>
              
              {/* Auth Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoginDialog(true)} 
                  className="flex items-center gap-2 border-border/60 hover:border-border/80 hover:bg-accent/50 text-[var(--button-text-secondary)] hover:text-foreground transition-all duration-200 font-medium px-4 py-2 rounded-lg shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>登录</span>
                </Button>
                <Button 
                  onClick={() => setShowRegisterDialog(true)} 
                  className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--button-text-primary)] transition-all duration-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>注册</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <LoginDialog
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />

        <RegisterDialog
          open={showRegisterDialog}
          onOpenChange={setShowRegisterDialog}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </>
    );
  }

  return (
    <>
      <div className="h-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">JacyeLu-online</h1>
              <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">v1.0</Badge>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent/60 rounded-full px-3 py-2 border border-transparent hover:border-border/60 transition-all duration-200">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <span className="hidden sm:inline font-medium text-[var(--button-text-secondary)] hover:text-foreground">{user?.username}</span>
                    <ChevronDown className="w-4 h-4 text-[var(--button-text-muted)]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-lg">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <UserSettingsDialog>
                    <DropdownMenuItem className="rounded-lg p-2 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>个人设置</span>
                    </DropdownMenuItem>
                  </UserSettingsDialog>
                  <AIModelSettingsDialog>
                    <DropdownMenuItem className="rounded-lg p-2 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                      <Bot className="mr-2 h-4 w-4" />
                      <span>AI模型设置</span>
                    </DropdownMenuItem>
                  </AIModelSettingsDialog>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem 
                    className="rounded-lg p-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50/50 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>注销</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}