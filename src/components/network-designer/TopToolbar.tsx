'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  CreditCard, 
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus
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
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>登录</span>
                </Button>
                <Button 
                  onClick={() => setShowRegisterDialog(true)} 
                  className="flex items-center gap-2"
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
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent rounded-full px-3 py-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline font-medium">{user?.username}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-lg">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="secondary" className="w-fit mt-1">
                        免费版 (Token: {user?.token_balance})
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem className="rounded-lg p-2 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>个人设置</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg p-2 cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>账单</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem 
                    className="rounded-lg p-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
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