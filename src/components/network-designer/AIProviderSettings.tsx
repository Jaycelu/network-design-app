'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// This should match the Prisma model structure
interface AIProvider {
  id: string;
  name: string;
  modelId: string;
  provider: string;
}

// Form state for adding/editing a provider
type AIProviderFormState = Omit<AIProvider, 'id'> & { apiKey: string; baseUrl?: string };

const initialFormState: AIProviderFormState = {
  name: '',
  modelId: '',
  provider: 'openai',
  apiKey: '',
  baseUrl: '',
};

export function AIProviderSettings() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [formState, setFormState] = useState<AIProviderFormState>(initialFormState);

  // Fetch providers on component mount
  useEffect(() => {
    fetch('/api/ai-providers')
      .then((res) => res.json())
      .then(setProviders);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: keyof AIProviderFormState | 'provider') => {
    if (typeof e === 'string') {
      setFormState(prev => ({ ...prev, [field]: e }));
    } else {
      setFormState(prev => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const resetDialog = () => {
    setEditingProvider(null);
    setFormState(initialFormState);
    setIsDialogOpen(false);
  };

  const handleSubmit = async () => {
    const url = editingProvider ? `/api/ai-providers/${editingProvider.id}` : '/api/ai-providers';
    const method = editingProvider ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });

    if (res.ok) {
      const updatedProviders = await fetch('/api/ai-providers').then(res => res.json());
      setProviders(updatedProviders);
      resetDialog();
    } else {
      // TODO: Handle error with a toast notification
      console.error('Failed to save provider');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      const res = await fetch(`/api/ai-providers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProviders(prev => prev.filter(p => p.id !== id));
      } else {
        console.error('Failed to delete provider');
      }
    }
  };

  const handleEdit = (provider: AIProvider) => {
    setEditingProvider(provider);
    setFormState({
      name: provider.name,
      modelId: provider.modelId,
      provider: provider.provider,
      apiKey: '', // API key is not sent back, user must re-enter to update
      baseUrl: '', // Base URL is also not sent back for now
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">AI 模型配置</h3>
          <p className="text-sm text-muted-foreground">添加和管理您自己的大语言模型 API Key。</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              添加模型
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProvider ? '编辑模型' : '添加新模型'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="name">名称</Label>
              <Input id="name" value={formState.name} onChange={(e) => handleFormChange(e, 'name')} placeholder="e.g., My GPT-4o" />
              
              <Label htmlFor="modelId">Model ID</Label>
              <Input id="modelId" value={formState.modelId} onChange={(e) => handleFormChange(e, 'modelId')} placeholder="e.g., gpt-4o" />

              <Label>提供商</Label>
              <Select value={formState.provider} onValueChange={(value) => handleFormChange(value, 'provider')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="aihubmix">AIHubMix</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" type="password" value={formState.apiKey} onChange={(e) => handleFormChange(e, 'apiKey')} />

              <Label htmlFor="baseUrl">Base URL (可选)</Label>
              <Input id="baseUrl" value={formState.baseUrl} onChange={(e) => handleFormChange(e, 'baseUrl')} placeholder="e.g., https://api.openai.com/v1" />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="ghost">取消</Button></DialogClose>
              <Button onClick={handleSubmit}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>Model ID</TableHead>
            <TableHead>提供商</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.modelId}</TableCell>
              <TableCell>{p.provider}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
