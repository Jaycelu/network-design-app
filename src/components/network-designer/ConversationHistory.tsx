'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Clock, 
  Network,
  FolderOpen,
  Trash2,
  Star
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  date: string;
  type: 'ai-generation' | 'topology' | 'ip-management' | 'vlan' | 'documentation';
  isStarred?: boolean;
}

interface ConversationHistoryProps {
  activeConversation: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
}

export function ConversationHistory({ activeConversation, onConversationSelect, onNewConversation }: ConversationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ai-generation' | 'topology' | 'ip-management' | 'vlan' | 'documentation'>('all');

  const conversations: Conversation[] = [
    {
      id: '1',
      title: '企业网络架构设计 - 100用户规模',
      date: '2024-01-15 14:30',
      type: 'ai-generation',
      isStarred: true
    },
    {
      id: '2',
      title: '数据中心网络规划',
      date: '2024-01-14 10:15',
      type: 'ai-generation'
    },
    {
      id: '3',
      title: '校园网VLAN规划',
      date: '2024-01-13 16:45',
      type: 'vlan'
    },
    {
      id: '4',
      title: '分支机构IP地址管理',
      date: '2024-01-12 09:20',
      type: 'ip-management'
    },
    {
      id: '5',
      title: '网络拓扑图绘制',
      date: '2024-01-11 13:00',
      type: 'topology'
    },
    {
      id: '6',
      title: '网络设计方案文档',
      date: '2024-01-10 11:30',
      type: 'documentation'
    }
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || conv.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: Conversation['type']) => {
    switch (type) {
      case 'ai-generation':
        return <Network className="w-4 h-4" />;
      case 'topology':
        return <Network className="w-4 h-4" />;
      case 'ip-management':
        return <FolderOpen className="w-4 h-4" />;
      case 'vlan':
        return <FolderOpen className="w-4 h-4" />;
      case 'documentation':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: Conversation['type']) => {
    switch (type) {
      case 'ai-generation':
        return 'AI生成';
      case 'topology':
        return '网络架构';
      case 'ip-management':
        return 'IP管理';
      case 'vlan':
        return 'VLAN规划';
      case 'documentation':
        return '文档生成';
      default:
        return '其他';
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建项目
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索历史项目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: '全部' },
            { value: 'ai-generation', label: 'AI生成' },
            { value: 'topology', label: '网络架构' },
            { value: 'ip-management', label: 'IP管理' },
            { value: 'vlan', label: 'VLAN规划' },
            { value: 'documentation', label: '文档生成' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value as any)}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                filterType === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">没有找到相关项目</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                  activeConversation === conversation.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(conversation.type)}
                      <span className="text-xs text-muted-foreground">
                        {getTypeName(conversation.type)}
                      </span>
                      {conversation.isStarred && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <h4 className="text-sm font-medium truncate">
                      {conversation.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {conversation.date}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Status */}
      <div className="p-4 border-t text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>共 {conversations.length} 个项目</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}