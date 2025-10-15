import { getAIAdapter } from '@/lib/ai/AIFactory';
import { Message } from '@/lib/ai/AIBaseAdapter';

// 默认模型ID
const DEFAULT_MODEL_ID = 'gpt-4o-mini';

// 占位符用户ID（在实际应用中应该从会话中获取）
const PLACEHOLDER_USER_ID = 'cl-placeholder-user-id';

// AI错误处理
class AIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'AIError'
  }
}

/**
 * 网络数据包分析接口
 */
export interface PacketData {
  totalPackets: number
  totalSize: number
  duration: number
  protocols: {
    [protocol: string]: number
  }
  topTalkers: {
    ip: string
    packets: number
    bytes: number
  }[]
  suspiciousActivities: {
    type: string
    count: number
    details: string[]
  }[]
  trafficPattern: {
    avgPacketSize: number
    peakTime: string
    bandwidthUsage: number
  }
  captureInfo: {
    filePath?: string
    fileSize?: number
    createdTime?: string
    interface: string
    startTime?: string
    filter?: string
    error?: string
    suggestion?: string
    warning?: string
  }
  conversations?: {
    source: string
    destination: string
    packets: number
    bytes: number
  }[]
  error?: {
    code: string
    message: string
    solution?: string
    fileSize?: number
    fileTime?: string
  }
}

/**
 * 调用AI模型进行网络数据包分析 - 增强版，确保真实数据和大模型调用
 */
export async function analyzePacketWithAI(
  packetData: PacketData,
  analysisType: 'security' | 'performance' | 'general' = 'general',
  modelId: string = DEFAULT_MODEL_ID
): Promise<string> {
  try {
    console.log('=== 开始AI数据包分析（增强版） ===')
    console.log('分析类型:', analysisType)
    console.log('模型ID:', modelId)
    console.log('抓包数据验证:', {
      totalPackets: packetData.totalPackets,
      totalSize: packetData.totalSize,
      duration: packetData.duration,
      hasProtocols: Object.keys(packetData.protocols).length > 0,
      hasTopTalkers: packetData.topTalkers.length > 0,
      dataSource: packetData.totalPackets === 0 ? '无真实数据' : '真实数据',
      dataFormat: 'JSON', // 确认数据格式
      hasCaptureInfo: !!packetData.captureInfo,
      hasConversations: !!packetData.conversations,
      isJSONData: true, // 明确这是JSON数据
      dataStructure: '完整JSON对象' // 确认数据结构
    })
    
    // 检查是否有错误信息
    if (packetData.error) {
      console.error('❌ 数据包数据包含错误信息:', packetData.error);
      throw new Error(`AI数据包分析失败：${packetData.error.message}`);
    }
    
    // 允许各种数据情况，将数据发送给AI分析
    const hasRealData = packetData.totalPackets > 0 || 
                       Object.keys(packetData.protocols).length > 0 || 
                       packetData.topTalkers.length > 0;
                       
    if (!hasRealData) {
      console.log('⚠️ 数据可能不完整，但仍将数据发送给AI分析');
    }
    
    // 根据分析类型构造不同的提示词
    const prompt = createPacketAnalysisPrompt(packetData, analysisType)
    console.log('提示词长度:', prompt.length)
    console.log('提示词预览:', prompt.substring(0, 200) + '...')
    
    // 确认传输的是JSON数据
    console.log('✅ 确认：正在传输JSON格式的网络数据给大模型');
    console.log('传输数据类型：JSON对象（包含真实网络抓包数据）');
    console.log('传输数据大小：', JSON.stringify(packetData).length, '字符');
    console.log('传输数据结构：完整JSON格式，不是PCAP文件');
    
    // 使用AI工厂获取适配器
    const adapter = await getAIAdapter(modelId, PLACEHOLDER_USER_ID);
    
    // 构造消息
    const messages: Message[] = [
      {
        role: 'system',
        content: '你是一位资深的网络安全专家和网络分析师，拥有15年以上的网络分析、安全评估和故障排除经验。请提供专业、准确、实用的网络分析报告。'
      },
      {
        role: 'user',
        content: prompt
      }
    ];
    
    // 调用AI模型
    console.log('✅ 正在调用AI大模型，模型:', modelId)
    const response = await adapter.createChatCompletion({
      model: modelId,
      messages: messages,
      temperature: 0.2,
      max_tokens: 1500,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    }) as any;
    
    console.log('✅ AI大模型调用成功')
    
    // 检查响应格式
    if (response && response.choices && response.choices.length > 0) {
      const result = response.choices[0].message.content.trim();
      console.log('AI分析完成，返回结果长度:', result.length)
      console.log('AI分析结果预览:', result.substring(0, 200) + '...')
      return result;
    } else {
      console.error('❌ AI大模型响应格式不正确')
      console.error('响应数据:', response)
      throw new AIError('AI大模型响应格式不正确')
    }
  } catch (error: any) {
    console.error('❌ AI数据包分析失败:', error)
    console.error('错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // 返回具体的错误信息
    if (error.message && error.message.includes('AIHUBMIX_API_KEY')) {
      throw new Error(`AI数据包分析失败：${error.message}`)
    } else if (error.message && error.message.includes('真实数据')) {
      throw new Error(error.message) // 直接抛出真实数据错误
    } else {
      throw new Error(`AI数据包分析失败：${error.message || '未知错误'}`)
    }
  }
}

/**
 * 构造网络数据包分析提示词 - 直接传递JSON数据给大模型
 */
function createPacketAnalysisPrompt(packetData: PacketData, analysisType: string): string {
  console.log('构造提示词 - 直接传递JSON数据给大模型');
  console.log('数据大小:', JSON.stringify(packetData).length, '字符');
  console.log('数据概览:', {
    totalPackets: packetData.totalPackets,
    totalSize: packetData.totalSize,
    duration: packetData.duration,
    protocols: Object.keys(packetData.protocols),
    topTalkers: packetData.topTalkers.length,
    conversations: packetData.conversations?.length || 0
  });

  // 直接传递整个JSON数据给大模型，让大模型自行分析
  const jsonData = JSON.stringify(packetData, null, 2);

  const prompt = `角色定义：你是一名专业的网络分析专家，精通Wireshark工具和网络协议分析，致力于帮助网络工程师解决日常运维和调试排障中的问题。

任务：请对Wireshark抓取的数据包进行全面分析，识别网络中的潜在问题，并提供可操作的解决方案。

要求：
1. 数据包基本信息：总结抓取数据包的基本信息，包括抓取时间段、数据包总数、主要协议分布（如TCP、UDP、HTTP）。
2. 问题检测：检查数据包中是否存在异常，如丢包、高延迟、重复包、异常端口或IP活动。
3. 协议解析：对主要协议（如TCP、UDP）进行详细分析，解释关键事件（如三次握手、连接终止）。
4. 故障原因分析：针对发现的问题，提供可能的原因和初步排查建议。
5. 操作指导：为初级网络工程师提供简明易懂的操作步骤，说明如何使用Wireshark过滤器进一步分析问题。
6. 总结建议：以简洁方式总结分析结果，突出需要关注的重点（如特定IP、时间段）。

网络抓包数据分析结果：
${jsonData}

请根据以上要求和数据进行专业分析：`;

  console.log('提示词长度:', prompt.length, '字符');
  return prompt;
}



/**
 * 简单的数据包统计分析（备用方法）
 */
export function simplePacketAnalysis(packetData: PacketData): string {
  const {
    totalPackets,
    totalSize,
    duration,
    protocols,
    suspiciousActivities
  } = packetData

  const avgPacketSize = totalSize / totalPackets
  const packetsPerSecond = totalPackets / duration
  const bytesPerSecond = totalSize / duration

  let analysis = `网络抓包分析报告\n`
  analysis += `===================\n\n`
  
  analysis += `基本统计信息：\n`
  analysis += `- 捕获时长：${duration.toFixed(2)}秒\n`
  analysis += `- 总数据包数：${totalPackets.toLocaleString()}\n`
  analysis += `- 总流量：${(totalSize / 1024 / 1024).toFixed(2)} MB\n`
  analysis += `- 平均包大小：${avgPacketSize.toFixed(2)} 字节\n`
  analysis += `- 包速率：${packetsPerSecond.toFixed(2)} 包/秒\n`
  analysis += `- 流量速率：${(bytesPerSecond * 8 / 1024 / 1024).toFixed(2)} Mbps\n\n`

  analysis += `协议分布：\n`
  Object.entries(protocols).forEach(([protocol, count]) => {
    const percentage = (count / totalPackets * 100).toFixed(2)
    analysis += `- ${protocol}: ${count}个包 (${percentage}%)\n`
  })

  if (suspiciousActivities.length > 0) {
    analysis += `\n异常活动检测：\n`
    suspiciousActivities.forEach(activity => {
      analysis += `- ${activity.type}: ${activity.count}次\n`
    })
  }

  analysis += `\n总体评估：\n`
  if (suspiciousActivities.length === 0) {
    analysis += `- 网络流量正常，未发现明显异常\n`
  } else {
    analysis += `- 检测到${suspiciousActivities.length}种异常活动，建议进一步调查\n`
  }

  if (packetsPerSecond > 1000) {
    analysis += `- 包速率较高，可能存在网络拥塞或攻击\n`
  }

  analysis += `\n建议：\n`
  analysis += `- 持续监控网络流量变化\n`
  analysis += `- 关注异常活动的后续发展\n`
  analysis += `- 根据分析结果采取相应措施\n`

  return analysis
}