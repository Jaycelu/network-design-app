'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Zap, History, Trash2, Clock } from "lucide-react"
import Image from 'next/image'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface AIChatProps {
  onAnalyze?: (filters: any) => void
  onReset?: () => void
  isLoading?: boolean
}

export function AIChat({ onAnalyze, onReset, isLoading = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是您的AI网络运维助手，可以帮助您解决网络运维问题。请描述您遇到的网络问题，比如设备故障、网络连接问题等。',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const sessionId = 'default-session' // 在实际应用中应该使用真实的会话ID

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages.length])

  // 初始化历史对话
  useEffect(() => {
    const savedConversations = localStorage.getItem('ai-conversations')
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })))
      } catch (e) {
        console.error('解析历史对话失败:', e)
      }
    }
  }, [])

  // 保存对话到localStorage
  useEffect(() => {
    if (messages.length > 1) {
      const conversationTitle = messages[1]?.content?.substring(0, 20) || '新对话'
      const newConversation: Conversation = {
        id: currentConversationId || Date.now().toString(),
        title: conversationTitle,
        messages,
        createdAt: new Date()
      }

      const updatedConversations = currentConversationId
        ? conversations.map(conv => conv.id === currentConversationId ? newConversation : conv)
        : [newConversation, ...conversations.filter(conv => conv.id !== newConversation.id)]

      // 只有当对话确实发生变化时才更新状态
      const isConversationChanged = JSON.stringify(conversations) !== JSON.stringify(updatedConversations);
      if (isConversationChanged) {
        setConversations(updatedConversations)
        setCurrentConversationId(newConversation.id)

        // 保存到localStorage
        try {
          localStorage.setItem('ai-conversations', JSON.stringify(updatedConversations))
        } catch (e) {
          console.error('保存对话失败:', e)
        }
      }
    }
  }, [messages.length, currentConversationId]) // 简化依赖项

  const handleSend = async () => {
    if (!input.trim() || isSending) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsSending(true)

    try {
      // 调用聊天API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId,
        }),
      })

      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      // 添加AI回复
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanContent(data.data.message),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error: any) {
      console.error('发送消息失败:', error)
      
      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，我暂时无法回复您的消息：${error.message || '未知错误'}，请稍后重试。`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: '您好！我是您的AI网络运维助手，可以帮助您解决网络运维问题。请描述您遇到的网络问题，比如设备故障、网络连接问题等。',
        timestamp: new Date()
      }
    ])
    setCurrentConversationId(null)
    setShowHistory(false)
  }

  const handleLoadConversation = (conversation: Conversation) => {
    setMessages(conversation.messages)
    setCurrentConversationId(conversation.id)
    setShowHistory(false)
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedConversations = conversations.filter(conv => conv.id !== id)
    setConversations(updatedConversations)
    
    // 更新localStorage
    try {
      localStorage.setItem('ai-conversations', JSON.stringify(updatedConversations))
    } catch (e) {
      console.error('删除对话失败:', e)
    }
    
    // 如果删除的是当前对话，创建新对话
    if (currentConversationId === id) {
      handleNewConversation()
    }
  }

  // 内容清理函数，移除Markdown符号和其他不需要的字符
  const cleanContent = (content: string): string => {
    // 移除Markdown标题符号 (#)
    let cleaned = content.replace(/^#+\s*/gm, '');
    
    // 移除粗体符号 (**)
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // 移除斜体符号 (* 或 _)
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    cleaned = cleaned.replace(/_(.*?)_/g, '$1');
    
    // 移除代码块符号 (```)
    cleaned = cleaned.replace(/```.*?\n/g, '');
    cleaned = cleaned.replace(/```/g, '');
    
    // 移除行内代码符号 (`)
    cleaned = cleaned.replace(/`(.*?)`/g, '$1');
    
    // 移除链接符号 ([text](url))
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // 移除多余的空白行
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // 去除首尾空白字符
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const formatTime = (date: Date) => {
    return format(date, 'MM-dd HH:mm', { locale: zhCN })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image 
            src="/icon.png" 
            alt="JL AI" 
            width={24} 
            height={24} 
            className="rounded"
          />
          <h3 className="text-xl font-semibold">AI网络运维助手</h3>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <History className="h-4 w-4" />
            历史
          </Button>
          <Button
            onClick={handleNewConversation}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Zap className="h-4 w-4" />
            新对话
          </Button>
        </div>
      </div>

      {/* 历史对话面板 */}
      {showHistory && (
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              历史对话
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[200px]">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>暂无历史对话</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer border ${
                        currentConversationId === conversation.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => handleLoadConversation(conversation)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {conversation.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(conversation.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {conversation.messages.length} 条消息
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* 聊天窗口 */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 p-0 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-4 w-full" ref={scrollAreaRef}>
            <div className="space-y-4 min-h-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div className="flex flex-col max-w-[80%]">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      {message.role === 'user' ? '您' : 'AI助手'}
                      <Clock className="h-3 w-3" />
                      {formatTime(message.timestamp)}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* 输入区域 */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="描述您遇到的网络问题，例如：交换机无法连接互联网..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isSending}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="flex items-center gap-2"
              >
                {isSending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                发送
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}