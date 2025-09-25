import axios from 'axios'
import { config } from 'dotenv'
import path from 'path'

// 加载环境变量
config({ path: path.resolve(__dirname, '../../.env.local') })

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
 * 调用AI模型进行专业股票分析
 */
export async function analyzeStockWithAI(
  stockData: any,
  analysisResult: any
): Promise<string> {
  try {
    console.log('开始AI分析...')
    // 构造专业的股票分析提示词
    const prompt = createProfessionalAnalysisPrompt(stockData, analysisResult)
    
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
 * 构造专业的股票分析提示词
 */
function createProfessionalAnalysisPrompt(stockData: any, analysisResult: any): string {
  // 为所有可能为undefined的数值提供默认值
  const price = stockData.price || 0
  const changePercent = stockData.changePercent || 0
  const volume = stockData.volume || 0
  const amount = stockData.amount || 0
  const rsi = stockData.rsi || 0
  const macd = stockData.macd || 0
  const macdSignal = stockData.macdSignal || 0
  const macdHistogram = stockData.macdHistogram || 0
  const volumeRatio = stockData.volumeRatio || 0
  const volatility = stockData.volatility || 0
  const mainInflow = stockData.mainInflow || 0
  const mainOutflow = stockData.mainOutflow || 0
  const mainNetInflow = stockData.mainNetInflow || 0
  const mainCost = stockData.mainCost || 0
  const pe = stockData.pe || 0
  const pb = stockData.pb || 0
  const roe = stockData.roe || 0
  const grossMargin = stockData.grossMargin || 0
  const netMargin = stockData.netMargin || 0
  const debtRatio = stockData.debtRatio || 0

  return `你是一位专业的股票投资分析师，请根据以下股票数据和初步分析结果，提供专业、深入的分析和投资建议。

股票基本信息：
- 股票代码：${stockData.symbol || 'N/A'}
- 股票名称：${stockData.name || 'N/A'}
- 当前价格：${price.toFixed(2)}元
- 涨跌幅：${changePercent.toFixed(2)}%
- 成交量：${(volume / 10000).toFixed(2)}万股
- 成交额：${(amount / 100000000).toFixed(2)}亿元

技术分析指标：
- RSI(14)：${rsi.toFixed(2)}
- MACD：${macd.toFixed(3)}
- MACD信号线：${macdSignal.toFixed(3)}
- MACD柱状图：${macdHistogram.toFixed(3)}
- 量比：${volumeRatio.toFixed(2)}
- 波动率：${volatility.toFixed(2)}%

资金流向：
- 主力流入：${mainInflow.toFixed(0)}万元
- 主力流出：${mainOutflow.toFixed(0)}万元
- 主力净流入：${mainNetInflow.toFixed(0)}万元
- 主力成本：${mainCost.toFixed(2)}元

基本面指标：
- 市盈率(PE)：${pe > 0 ? pe.toFixed(2) : 'N/A'}
- 市净率(PB)：${pb > 0 ? pb.toFixed(2) : 'N/A'}
- 净资产收益率(ROE)：${roe > 0 ? roe.toFixed(2) : 'N/A'}%
- 毛利率：${grossMargin > 0 ? grossMargin.toFixed(2) : 'N/A'}%
- 净利率：${netMargin > 0 ? netMargin.toFixed(2) : 'N/A'}%
- 资产负债率：${debtRatio > 0 ? debtRatio.toFixed(2) : 'N/A'}%

初步分析结果：
- 综合评分：${analysisResult.score || 0}/100
- 上涨概率：${analysisResult.probability || 0}%
- 投资信号：${getSignalDescription(analysisResult.signal)}
- 风险等级：${getRiskDescription(analysisResult.riskLevel)}
- 持有期：${getTimeFrameDescription(analysisResult.timeFrame)}
- 分析理由：${analysisResult.reasoning || 'N/A'}

请基于以上数据，提供以下内容的专业分析：

1. 技术面分析：
   - 价格走势分析
   - 技术指标解读
   - 关键支撑位和阻力位预测

2. 资金面分析：
   - 主力资金动向解读
   - 成交量分析
   - 市场情绪判断

3. 基本面分析：
   - 公司估值水平评估
   - 盈利能力分析
   - 财务健康状况评估

4. 综合投资建议：
   - 买入/卖出/持有建议
   - 目标价位设定
   - 止损位建议
   - 适合的投资策略

要求：
- 分析专业、深入、具体
- 用数据支撑观点
- 提供可操作的投资建议
- 语言简洁明了，避免模棱两可的表述
- 总字数控制在500字以内

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
              content: '你是一位专业的股票投资分析师，拥有丰富的投资经验和深厚的金融知识。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800
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
                content: '你是一位专业的股票投资分析师，拥有丰富的投资经验和深厚的金融知识。'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 800
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

/**
 * 获取信号描述
 */
function getSignalDescription(signal: string): string {
  switch (signal) {
    case 'strong_buy': return '强烈买入'
    case 'buy': return '买入'
    case 'hold': return '持有'
    case 'sell': return '卖出'
    case 'strong_sell': return '强烈卖出'
    default: return '观望'
  }
}

/**
 * 获取风险等级描述
 */
function getRiskDescription(risk: string): string {
  switch (risk) {
    case 'low': return '低风险'
    case 'medium': return '中风险'
    case 'high': return '高风险'
    default: return '未知'
  }
}

/**
 * 获取时间框架描述
 */
function getTimeFrameDescription(timeFrame: string): string {
  switch (timeFrame) {
    case 'short_term': return '短期(1-2周)'
    case 'medium_term': return '中期(1-3个月)'
    case 'long_term': return '长期(3个月以上)'
    default: return '未知'
  }
}