import axios from 'axios'
import { config } from 'dotenv'
import path from 'path'

// 加载环境变量
config({ path: path.resolve(process.cwd(), '.env.local') })

// AI模型配置
const AI_MODEL_PROVIDER = process.env.AI_MODEL_PROVIDER || process.env.NEXT_PUBLIC_AI_MODEL_PROVIDER || 'AIHUBMIX'
const AI_MODEL = process.env.AI_MODEL || process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4o-mini' // 默认使用gpt-4o-mini作为后备
const AIHUBMIX_API_KEY = process.env.AIHUBMIX_API_KEY || process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY || ''

console.log('AI环境变量检查:')
console.log('NEXT_PUBLIC_AI_MODEL_PROVIDER:', process.env.NEXT_PUBLIC_AI_MODEL_PROVIDER)
console.log('AI_MODEL_PROVIDER:', process.env.AI_MODEL_PROVIDER)
console.log('NEXT_PUBLIC_AI_MODEL:', process.env.NEXT_PUBLIC_AI_MODEL)
console.log('AI_MODEL:', process.env.AI_MODEL)
console.log('NEXT_PUBLIC_AIHUBMIX_API_KEY:', process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY)
console.log('AIHUBMIX_API_KEY:', process.env.AIHUBMIX_API_KEY)
console.log('最终使用的AIHUBMIX_API_KEY:', AIHUBMIX_API_KEY)

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
 * 调用AI模型进行网络运维问题分析
 */
export async function analyzeNetworkIssue(
  issueDescription: string
): Promise<string> {
  try {
    console.log('开始AI分析...')
    // 构造网络运维问题分析提示词
    const prompt = createNetworkIssuePrompt(issueDescription)
    
    // 调用AI模型
    const response = await callAIModel(prompt)
    
    return response
  } catch (error) {
    console.error('AI分析失败:', error)
    // 返回默认分析而不是抛出错误
    return 'AI分析暂时不可用，请稍后再试。'
  }
}

/**
 * 构造网络运维问题分析提示词
 */
function createNetworkIssuePrompt(issueDescription: string): string {
  return `你是一位专业的网络运维工程师，请根据以下用户描述的网络问题，提供专业的排错指导和解决方案。

用户问题描述：
${issueDescription}

请基于以上问题描述，提供以下内容的专业分析和建议：

1. 问题诊断：
   - 可能的问题原因分析
   - 涉及的网络层次(物理层、数据链路层、网络层、传输层、应用层)

2. 排错步骤：
   - 详细的排错流程
   - 需要检查的设备和配置项
   - 常用的排错命令和工具

3. 解决方案：
   - 具体的解决步骤
   - 配置修改建议
   - 预防措施

4. 注意事项：
   - 操作过程中的风险提示
   - 需要备份的配置项
   - 验证解决效果的方法

要求：
- 分析专业、深入、具体
- 提供可操作的解决方案
- 语言简洁明了，避免模棱两可的表述
- 总字数控制在800字以内

请开始分析：`
}

/**
 * 调用AI模型
 */
async function callAIModel(prompt: string): Promise<string> {
  // 检查API密钥
  if (!AIHUBMIX_API_KEY) {
    console.warn('警告: AIHUBMIX_API_KEY 未配置，将返回默认分析')
    return 'AI分析暂时不可用，因为API密钥未配置。'
  }

  try {
    console.log(`准备调用AI模型: ${AI_MODEL}`)
    console.log(`API密钥状态: ${AIHUBMIX_API_KEY ? '已配置' : '未配置'}`)
    
    // 首先尝试使用配置的模型
    try {
      const response = await axios.post(
        `${AIHUBMIX_API_BASE}/chat/completions`,
        {
          model: AI_MODEL,
          messages: [
            {
              role: 'system',
              content: '你是一位专业的网络运维工程师，拥有丰富的网络故障排查和解决经验。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${AIHUBMIX_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log(`AI模型响应状态: ${response.status}`)
      
      // 检查响应格式
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const result = response.data.choices[0].message.content.trim()
        console.log(`AI模型响应成功，返回长度: ${result.length}`)
        return result
      } else {
        console.error('AI模型响应格式不正确:', response.data)
        throw new AIError('AI模型响应格式不正确')
      }
    } catch (primaryError: any) {
      // 如果主模型调用失败，记录错误并尝试使用后备模型
      console.error(`主模型 ${AI_MODEL} 调用失败:`, primaryError.message)
      
      // 如果配置的模型不是gpt-4o-mini，则尝试使用作为后备
      if (AI_MODEL !== 'gpt-4o-mini') {
        console.log('尝试使用后备模型 gpt-4o-mini')
        const fallbackResponse = await axios.post(
          `${AIHUBMIX_API_BASE}/chat/completions`,
          {
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: '你是一位专业的网络运维工程师，拥有丰富的网络故障排查和解决经验。'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          },
          {
            headers: {
              'Authorization': `Bearer ${AIHUBMIX_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        )
        
        if (fallbackResponse.data && fallbackResponse.data.choices && fallbackResponse.data.choices.length > 0) {
          const result = fallbackResponse.data.choices[0].message.content.trim()
          console.log(`后备模型响应成功，返回长度: ${result.length}`)
          return result
        }
      }
      
      // 如果所有模型都失败，重新抛出错误
      throw primaryError
    }
  } catch (error: any) {
    console.error('=== AI模型调用详细错误信息 ===')
    console.error('AI模型:', AI_MODEL)
    console.error('API地址:', AIHUBMIX_API_BASE)
    
    if (error.response) {
      console.error(`AI模型调用失败: ${error.response.status}`)
      console.error('响应头:', error.response.headers)
      console.error('响应数据:', error.response.data)
      
      const errorMessage = error.response.data?.error?.message || error.response.data || error.message
      console.error(`错误消息: ${errorMessage}`)
      
      throw new AIError(
        `AI模型调用失败: ${error.response.status} - ${errorMessage}`,
        error.response.status
      )
    } else if (error.request) {
      console.error('无响应 received')
      console.error('请求详情:', error.request)
      console.error(`错误消息: ${error.message}`)
      throw new AIError(`AI模型调用失败: 无响应 - ${error.message}`)
    } else {
      console.error(`请求配置错误: ${error.message}`)
      console.error('错误堆栈:', error.stack)
      throw new AIError(`AI模型调用失败: 请求配置错误 - ${error.message}`)
    }
  }
}