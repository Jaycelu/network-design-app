# AI模型配置说明

为了使AI对话功能正常工作，需要配置以下环境变量：

## 必需的环境变量

### AIHUBMIX配置（默认使用的AI服务）
- `AI_MODEL_PROVIDER` - AI模型提供商，设置为`AIHUBMIX`
- `AI_MODEL` - 要使用的具体AI模型，例如`gpt-4o-mini`、`grok-3`等
- `AIHUBMIX_API_KEY` - AIHUBMIX服务的API密钥

## 环境变量配置方法

1. 在你的项目根目录创建`.env.local`文件
2. 添加以下配置：

```env
# AI模型配置
AI_MODEL_PROVIDER=AIHUBMIX
AI_MODEL=gpt-4o-mini
AIHUBMIX_API_KEY=your_api_key_here
```

3. 将`your_api_key_here`替换为你的实际API密钥

## 注意事项

1. 请勿将包含API密钥的环境变量文件提交到版本控制系统
2. 在生产环境中，建议使用更安全的方式管理密钥，如系统环境变量或密钥管理服务
3. 如果不配置这些环境变量，AI功能将无法正常工作