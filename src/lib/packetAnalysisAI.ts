import axios from 'axios'
import { config } from 'dotenv'
import path from 'path'

// 在模块加载时主动加载环境变量
if (!process.env.AIHUBMIX_API_KEY) {
  console.log('=== 正在加载环境变量 ===')
  const envPath = path.resolve(process.cwd(), '.env.local')
  console.log('环境变量文件路径:', envPath)
  const result = config({ path: envPath })
  console.log('环境变量加载结果:', result.parsed ? '成功' : '失败')
}

// 添加详细的调试日志
console.log('=== AI Packet Analysis 环境变量加载调试 ===')
console.log('process.cwd():', process.cwd())
console.log('AI_MODEL_PROVIDER:', process.env.AI_MODEL_PROVIDER)
console.log('NEXT_PUBLIC_AI_MODEL_PROVIDER:', process.env.NEXT_PUBLIC_AI_MODEL_PROVIDER)
console.log('AI_MODEL:', process.env.AI_MODEL)
console.log('NEXT_PUBLIC_AI_MODEL:', process.env.NEXT_PUBLIC_AI_MODEL)
console.log('AIHUBMIX_API_KEY 长度:', process.env.AIHUBMIX_API_KEY ? process.env.AIHUBMIX_API_KEY.length : 0)
console.log('NEXT_PUBLIC_AIHUBMIX_API_KEY 长度:', process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY ? process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY.length : 0)

// AI模型配置 - 增强版，确保大模型调用可见性
const getAIConfig = () => {
  // 强制从环境变量获取，必须有真实配置
  const provider = process.env.AI_MODEL_PROVIDER || process.env.NEXT_PUBLIC_AI_MODEL_PROVIDER || 'AIHUBMIX'
  const model = process.env.AI_MODEL || process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4o-mini'
  const apiKey = process.env.AIHUBMIX_API_KEY || process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY || ''
  
  console.log('=== AI Packet Analysis 环境变量检查 ===')
  console.log('AI_MODEL_PROVIDER:', provider)
  console.log('AI_MODEL:', model)
  console.log('AIHUBMIX_API_KEY:', apiKey ? '已设置' : '未设置')
  console.log('AIHUBMIX_API_KEY长度:', apiKey ? apiKey.length : 0)
  console.log('所有环境变量状态:', {
    AI_MODEL_PROVIDER: process.env.AI_MODEL_PROVIDER || '未设置',
    NEXT_PUBLIC_AI_MODEL_PROVIDER: process.env.NEXT_PUBLIC_AI_MODEL_PROVIDER || '未设置',
    AI_MODEL: process.env.AI_MODEL || '未设置',
    NEXT_PUBLIC_AI_MODEL: process.env.NEXT_PUBLIC_AI_MODEL || '未设置',
    AIHUBMIX_API_KEY: process.env.AIHUBMIX_API_KEY ? '已设置' : '未设置',
    NEXT_PUBLIC_AIHUBMIX_API_KEY: process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY ? '已设置' : '未设置'
  })
  
  return { provider, model, apiKey }
}

const AI_CONFIG = getAIConfig()
const AI_MODEL_PROVIDER = AI_CONFIG.provider
const AI_MODEL = AI_CONFIG.model
const AIHUBMIX_API_KEY = AI_CONFIG.apiKey

// AIHUBMIX API配置
const AIHUBMIX_API_BASE = 'https://aihubmix.com/v1'

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
    interface: string
    startTime: string
    filter?: string
  }
}

/**
 * 调用AI模型进行网络数据包分析 - 增强版，确保真实数据和大模型调用
 */
export async function analyzePacketWithAI(
  packetData: PacketData,
  analysisType: 'security' | 'performance' | 'general' = 'general'
): Promise<string> {
  try {
    console.log('=== 开始AI数据包分析（增强版） ===')
    console.log('分析类型:', analysisType)
    console.log('API密钥配置状态:', AIHUBMIX_API_KEY ? '已配置' : '未配置')
    console.log('API密钥长度:', AIHUBMIX_API_KEY ? AIHUBMIX_API_KEY.length : 0)
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
    
    // 关键验证：必须有真实数据才能进行AI分析
    if (packetData.totalPackets === 0) {
      console.error('❌ 没有真实抓包数据，无法进行AI分析');
      throw new Error('AI数据包分析失败：没有获取到真实的网络数据。必须基于真实抓包数据进行AI分析，不能使用模拟数据。')
    }
    
    if (packetData.totalSize === 0) {
      console.error('❌ 抓包数据大小为0，无法进行AI分析');
      throw new Error('AI数据包分析失败：抓包数据大小为0，数据不完整。')
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
    
    // 验证AI配置
    if (!AIHUBMIX_API_KEY) {
      console.error('❌ AIHUBMIX_API_KEY 未配置');
      throw new Error('AIHUBMIX_API_KEY 未配置，无法调用AI大模型')
    }
    
    // 调用AI模型
    console.log('✅ 正在调用AI大模型，模型:', AI_MODEL)
    console.log('API地址:', AIHUBMIX_API_BASE)
    const response = await callAIModel(prompt)
    
    console.log('✅ AI大模型调用成功')
    console.log('AI分析完成，返回结果长度:', response.length)
    console.log('AI分析结果预览:', response.substring(0, 200) + '...')
    return response
  } catch (error) {
    console.error('❌ AI数据包分析失败:', error)
    console.error('错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    if (error.response) {
      console.error('API响应错误:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      })
    }
    
    // 返回具体的错误信息
    if (error.message && error.message.includes('AIHUBMIX_API_KEY')) {
      throw new Error(`AI数据包分析失败：${error.message}`)
    } else if (error.message && error.message.includes('真实数据')) {
      throw new Error(error.message) // 直接抛出真实数据错误
    } else if (error.response && error.response.status === 401) {
      throw new Error('AI数据包分析失败：API密钥无效或未授权')
    } else if (error.response && error.response.status === 429) {
      throw new Error('AI数据包分析失败：API调用频率超限，请稍后再试')
    } else if (error.response && error.response.status >= 500) {
      throw new Error('AI数据包分析失败：AI服务暂时不可用，请稍后再试')
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

  const prompt = `你是一位资深的网络工程师和网络故障排查专家，拥有15年以上的网络运维、故障诊断和性能优化经验。

请根据以下JSON格式的网络抓包数据，为网络工程师提供专业、准确、实用的网络分析报告。

=== 网络抓包数据（JSON格式） ===
${jsonData}

=== 分析任务 ===
请基于以上真实网络数据，提供以下方面的专业分析：

1. 【网络状态总结】
   - 整体网络流量特征总结
   - 协议分布和通信模式分析
   - 网络健康状况评估

2. 【主要发现】
   - 关键异常和安全威胁识别
   - 性能瓶颈和问题定位
   - 重要趋势和模式发现

3. 【技术分析】
   - 深度协议分析和技术细节
   - 流量特征和数据包行为分析
   - 风险评估和影响分析

4. 【建议措施】
   - 立即处理措施（高优先级）
   - 优化建议（中长期）
   - 监控和预防建议

=== 要求 ===
- 必须基于提供的真实数据进行专业分析
- 每个结论都要有具体数据支撑
- 提供可操作的技术建议
- 语言简洁专业，适合工程师阅读
- 总字数控制在800-1200字
- 严禁使用任何模拟或假设数据

请开始专业网络分析：`;

  console.log('提示词长度:', prompt.length, '字符');
  return prompt;
}
  
  return prompt;
}

/**
 * 调用AI模型 - 超级增强版，确保大模型调用可见性
 */
async function callAIModel(prompt: string): Promise<string> {
  // 严格检查API密钥
  if (!AIHUBMIX_API_KEY) {
    console.error('❌ AIHUBMIX_API_KEY 未配置，无法调用AI大模型');
    throw new Error('AIHUBMIX_API_KEY 未配置，无法调用AI大模型')
  }

  try {
    console.log('=== 开始调用AI大模型（详细日志） ===')
    console.log('使用模型:', AI_MODEL)
    console.log('API地址:', AIHUBMIX_API_BASE + '/chat/completions')
    console.log('API密钥状态:', '已配置，长度:' + AIHUBMIX_API_KEY.length)
    
    const requestData = {
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: '你是一位资深的网络安全专家和网络分析师，拥有15年以上的网络分析、安全评估和故障排除经验。请提供专业、准确、实用的网络分析报告。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    }
    
    console.log('请求数据预览:', JSON.stringify(requestData, null, 2).substring(0, 500) + '...')
    console.log('完整请求大小:', JSON.stringify(requestData).length, '字符')
    
    console.log('正在发送请求到AI大模型...')
    const startTime = Date.now()
    
    const response = await axios.post(
      `${AIHUBMIX_API_BASE}/chat/completions`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${AIHUBMIX_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒超时
      }
    )
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    console.log(`✅ AI大模型响应成功！响应时间: ${responseTime}ms`)
    console.log('响应状态码:', response.status)
    console.log('响应状态文本:', response.statusText)
    console.log('响应头信息:', {
      'content-type': response.headers['content-type'],
      'x-aihubmix-request-id': response.headers['x-aihubmix-request-id'],
      'date': response.headers['date']
    })
    
    // 详细记录响应数据
    console.log('完整响应数据结构:')
    console.log('- 响应ID:', response.data.id)
    console.log('- 模型:', response.data.model)
    console.log('- 创建时间:', new Date(response.data.created * 1000).toLocaleString())
    console.log('- 选择数量:', response.data.choices.length)
    console.log('- Token使用情况:', response.data.usage)
    
    // 检查响应格式
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const result = response.data.choices[0].message.content.trim()
      console.log('✅ AI大模型返回结果成功！')
      console.log('返回结果长度:', result.length, '字符')
      console.log('使用的Token数:', response.data.usage)
      console.log('结果预览:', result.substring(0, 200) + '...')
      return result
    } else {
      console.error('❌ AI大模型响应格式不正确')
      console.error('响应数据:', response.data)
      throw new AIError('AI大模型响应格式不正确')
    }
  } catch (error: any) {
    console.error('=== AI大模型调用失败（详细日志） ===')
    console.error('失败时间:', new Date().toLocaleString())
    console.error('使用模型:', AI_MODEL)
    console.error('API地址:', AIHUBMIX_API_BASE)
    
    if (error.response) {
      console.error('响应状态:', error.response.status, error.response.statusText)
      console.error('响应头:', error.response.headers)
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2))
      
      const errorMessage = error.response.data?.error?.message || error.response.data || error.message
      console.error('错误消息:', errorMessage)
      
      throw new AIError(
        `AI大模型调用失败: ${error.response.status} - ${errorMessage}`,
        error.response.status
      )
    } else if (error.request) {
      console.error('请求已发送但没有收到响应')
      console.error('请求详情:', error.message)
      console.error('这可能表明网络问题或AI服务不可用')
      throw new AIError(`AI大模型调用失败: 无响应 - ${error.message}`)
    } else {
      console.error('请求配置错误:', error.message)
      console.error('错误堆栈:', error.stack)
      throw new AIError(`AI大模型调用失败: 配置错误 - ${error.message}`)
    }
  }
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