# AI对话模块

这个模块包含了AI对话功能的所有必要组件，可以轻松移植到其他Electron应用中。

## 文件结构

```
ai-chat-module/
├── public/
│   └── icon.png                 # 应用图标
├── src/
│   ├── components/
│   │   ├── stock/
│   │   │   └── AIChat.tsx       # AI对话核心组件
│   │   └── ui/                  # UI组件库
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── scroll-area.tsx
│   └── lib/
│       └── aiModel.ts           # AI模型调用方法
├── ENVIRONMENT.md               # 环境变量配置说明
```

## 移植步骤

1. 将`ai-chat-module/src/components/stock`文件夹复制到你的项目对应位置
2. 将`ai-chat-module/src/components/ui`文件夹中的UI组件复制到你的项目对应位置
3. 将`ai-chat-module/src/lib`文件夹中的AI模型调用方法复制到你的项目对应位置
4. 将`ai-chat-module/public/icon.png`复制到你的项目的公共资源文件夹
5. 确保你的项目已安装以下依赖包：
   - react
   - react-dom
   - lucide-react
   - date-fns
   - next (如果使用Next.js)
   - axios
   - dotenv
6. 参考`ai-chat-module/ENVIRONMENT.md`配置必要的环境变量
7. 在你的项目中创建API端点`/api/chat`来处理AI对话请求
8. 在需要使用AI对话功能的页面中导入并使用`AIChat`组件：

```jsx
import { AIChat } from "@/components/stock/AIChat";

export default function YourPage() {
  const handleAnalyze = (filters) => {
    // 处理分析请求
  };

  const handleReset = () => {
    // 处理重置请求
  };

  return (
    <AIChat onAnalyze={handleAnalyze} onReset={handleReset} />
  );
}
```

## 注意事项

1. AIChat组件需要两个回调函数：`onAnalyze`和`onReset`，你需要根据你的应用需求实现这些函数
2. 组件使用localStorage来存储对话历史，确保你的应用环境支持localStorage
3. 组件调用`/api/chat`端点进行AI对话，你需要在你的后端实现相应的API
4. 图标文件路径在组件中硬编码为`/icon.png`，如果需要修改，请更新`AIChat.tsx`中的`src`属性
5. AI模型调用需要配置相应的环境变量，请参考`ENVIRONMENT.md`文件
6. 确保你的项目已安装`axios`和`dotenv`依赖包以支持AI模型调用