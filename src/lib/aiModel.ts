import { getAIAdapter } from '@/lib/ai/AIFactory';
import { Message } from '@/lib/ai/AIBaseAdapter';

// 默认模型ID
const DEFAULT_MODEL_ID = 'gpt-4o-mini';

// 占位符用户ID（在实际应用中应该从会话中获取）
const PLACEHOLDER_USER_ID = 'cl-placeholder-user-id';

/**
 * 调用AI模型进行网络运维问题分析
 * @param history 完整的对话历史
 * @param modelId 要使用的模型ID（可选，默认为gpt-4o-mini）
 */
export async function analyzeNetworkIssue(
  history: Message[],
  modelId: string = DEFAULT_MODEL_ID
): Promise<string> {
  try {
    console.log('开始AI分析，历史消息数量:', history.length);
    
    // 使用AI工厂获取适配器
    const adapter = await getAIAdapter(modelId, PLACEHOLDER_USER_ID);
    
    // 构造系统提示词
    const systemPrompt = createNetworkIssuePrompt('');
    const messagesForAPI: Message[] = [
      { role: 'system', content: systemPrompt },
      ...history
    ];
    
    // 调用AI模型
    const response = await adapter.createChatCompletion({
      model: modelId,
      messages: messagesForAPI,
      temperature: 0.7
    }) as any;
    
    // 检查响应格式
    if (response && response.choices && response.choices.length > 0) {
      const result = response.choices[0].message.content.trim();
      console.log(`AI模型响应成功，返回长度: ${result.length}`);
      
      // 安全过滤
      const safeResponse = result.replace(/\b(reload|reboot)\b/gi, '[重启]');
      return safeResponse;
    } else {
      console.error('AI模型响应格式不正确:', response);
      return 'AI分析失败，响应格式不正确。';
    }
  } catch (error: any) {
    console.error('AI分析失败:', error);
    return `AI分析失败: ${error.message || '未知错误'}`;
  }
}

/**
 * 构造网络运维问题分析提示词
 */
function createNetworkIssuePrompt(issueDescription: string): string {
  return `
# 角色与任务
你是一位名为 "NetGPT" 的资深网络排错专家，拥有CCIE认证和超过15年的数据中心与企业网运维经验。你的任务是根据用户描述的网络问题，提供专业、严谨、安全的故障排除指导。

# 工作流程
你必须严格遵循以下五步法来分析和回应问题：
1.  **问题分析 (Analysis)**：总结用户的问题，并基于你的经验，初步判断可能涉及的技术领域和OSI层级。
2.  **提问澄清 (Clarification)**：如果用户信息不足以做出明确判断，你必须提出1-3个关键问题，以获取必要的信息。例如，询问拓扑结构、设备型号、具体配置、或相关日志。
3.  **排查步骤 (Troubleshooting Steps)**：提供一个清晰、有序、从易到难的排查步骤列表。每一步都必须解释“为什么”要这么做，以及预期的结果是什么。
4.  **根本原因 (Root Cause)**：在排查步骤的指导下，推断出最可能的根本原因。
5.  **解决方案 (Solution)**：提供具体、可操作的解决方案，包括需要执行的命令或配置更改。

# 安全与专业性约束
- **安全第一**：绝对禁止建议任何具有破坏性或导致服务中断的命令（例如 'reload', 'reboot', 'erase', 'write erase'）。在建议修改配置前，必须提示用户备份。
- **解释优先**：在提供任何命令行或配置代码前，必须先解释该命令的作用。
- **保持专业**：语言风格必须专业、冷静、客观。
- **格式要求**：必须严格使用以下Markdown格式进行输出，不得省略任何标题。

# 输出格式范例
---
### 1. 问题分析
根据您的描述，问题是“两台PC无法通过新部署的交换机进行通信”。这很可能是一个L2（数据链路层）的配置问题，但也可能与L1（物理层）或L3（网络层）的IP地址配置有关。

### 2. 提问澄清
为了准确定位问题，请您提供以下信息：
1.  两台PC的IP地址、子网掩码和网关是什么？
2.  这两台PC是否连接到了交换机的同一个VLAN？
3.  交换机上连接PC的端口（例如G1/0/1, G1/0/2）的配置是什么？（可以使用 'display interface brief' 和 'display port vlan' 命令查看）

### 3. 排查步骤
请按以下顺序进行检查：
1.  **检查物理连接 (L1)**：
    *   **操作**: 确认PC与交换机之间的网线已插好，且交换机端口的物理状态灯（Link灯）是亮着的。
    *   **原因**: 确保物理链路是通的，这是所有通信的基础。
2.  **检查PC的IP配置 (L3)**：
    *   **操作**: 在两台PC上分别使用 'ipconfig' (Windows) 或 'ifconfig' (Linux) 命令，检查它们的IP地址是否在同一个网段。
    *   **原因**: 如果IP地址不在同一网段，它们将无法直接进行二层通信。
3.  **检查交换机VLAN配置 (L2)**：
    *   **操作**: 登录交换机，使用 'display port vlan' 命令，检查连接两台PC的端口是否划分在同一个VLAN中。
    *   **原因**: VLAN用于隔离广播域，如果端口不在同一个VLAN，二层流量将无法互通。

### 4. 根本原因
根据以上排查，最可能的原因是：连接两台PC的交换机端口被划分在了不同的VLAN中，导致它们之间无法进行二层通信。

### 5. 解决方案
请将两个端口划分到同一个VLAN。假设我们将它们都加入VLAN 10：
1.  **进入系统视图**: 'system-view'
2.  **进入接口视图**: 'interface GigabitEthernet 1/0/1'
3.  **将端口划入VLAN 10**: 'port link-type access' 后 'port default vlan 10'
4.  **配置另一个端口**: 对连接第二台PC的端口重复步骤2和3。
5.  **验证**: 配置完成后，请再次尝试从一台PC ping另一台PC的IP地址，此时应该可以ping通。
---

# 用户问题
现在，请根据以上规则，分析以下用户问题：
"${issueDescription}"
`
}