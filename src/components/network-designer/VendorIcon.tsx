'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VendorIconProps {
  vendor: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function VendorIcon({ vendor, size = 'md', showText = true }: VendorIconProps) {
  const getVendorConfig = () => {
    switch (vendor) {
      case '华为':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-900',
          shortName: 'HW',
          fullName: '华为'
        };
      case 'Cisco':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
          borderColor: 'border-blue-200 dark:border-blue-900',
          shortName: 'CS',
          fullName: 'Cisco'
        };
      case 'H3C':
        return {
          color: 'bg-orange-500',
          textColor: 'text-orange-500',
          bgColor: 'bg-orange-50 dark:bg-orange-950/20',
          borderColor: 'border-orange-200 dark:border-orange-900',
          shortName: 'H3',
          fullName: 'H3C'
        };
      case '锐捷':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-950/20',
          borderColor: 'border-green-200 dark:border-green-900',
          shortName: 'RJ',
          fullName: '锐捷'
        };
      case '中兴':
        return {
          color: 'bg-purple-500',
          textColor: 'text-purple-500',
          bgColor: 'bg-purple-50 dark:bg-purple-950/20',
          borderColor: 'border-purple-200 dark:border-purple-900',
          shortName: 'ZX',
          fullName: '中兴'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-950/20',
          borderColor: 'border-gray-200 dark:border-gray-900',
          shortName: 'OT',
          fullName: '其他'
        };
    }
  };

  const config = getVendorConfig();
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${config.color} 
          rounded-full 
          flex 
          items-center 
          justify-center 
          text-white 
          font-bold
          border-2 
          ${config.borderColor}
          shadow-sm
        `}
      >
        {config.shortName}
      </div>
      {showText && (
        <Badge 
          variant="outline" 
          className={`
            ${textSizeClasses[size]} 
            ${config.textColor} 
            ${config.bgColor} 
            ${config.borderColor}
            font-medium
            px-2
            py-0.5
          `}
        >
          {config.fullName}
        </Badge>
      )}
    </div>
  );
}