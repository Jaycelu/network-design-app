import { NextRequest } from 'next/server'
import { analyzePacketWithAI, PacketData } from '@/lib/packetAnalysisAI'
import { analyzePCAPWithPythonForAI } from '@/lib/pythonAnalyzer'
import fs from 'fs'

/**
 * AI数据包分析API
 * 接收抓包数据，调用AI模型进行分析
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== AI分析API收到请求（增强版） ===')
    console.log('请求时间:', new Date().toLocaleString())
    
    const body = await request.json()
    console.log('请求体大小:', JSON.stringify(body).length, '字符')
    console.log('请求数据预览:', JSON.stringify(body, null, 2).substring(0, 500) + '...')
    
    const { 
      packetData, 
      analysisType = 'general',
      sessionId 
    } = body

    // 验证输入数据
    if (!packetData) {
      return Response.json(
        { 
          success: false, 
          error: '缺少抓包数据' 
        },
        { status: 400 }
      )
    }

    // 验证数据格式
    if (!isValidPacketData(packetData)) {
      return Response.json(
        { 
          success: false, 
          error: '抓包数据格式不正确' 
        },
        { status: 400 }
      )
    }

    console.log('收到AI数据包分析请求:', {
      totalPackets: packetData.totalPackets,
      totalSize: packetData.totalSize,
      duration: packetData.duration,
      analysisType,
      sessionId,
      hasRealData: packetData.totalPackets > 0,
      protocolsCount: Object.keys(packetData.protocols).length,
      topTalkersCount: packetData.topTalkers.length,
      dataType: 'JSON', // 确认这是JSON数据
      hasCaptureInfo: !!packetData.captureInfo,
      hasConversations: !!packetData.conversations,
      isJSONFormat: true // 明确标识这是JSON格式
    })
    
    // 添加详细的数据结构检查
    console.log('详细数据结构检查:', {
      hasError: !!packetData.error,
      errorCode: packetData.error?.code,
      errorMessage: packetData.error?.message,
      captureInfoFileSize: packetData.captureInfo?.fileSize,
      captureInfoError: packetData.captureInfo?.error,
      captureInfoSuggestion: packetData.captureInfo?.suggestion,
      totalDataKeys: Object.keys(packetData),
      dataPreview: JSON.stringify(packetData, null, 2).substring(0, 500) + '...'
    })
    
    // 验证数据格式
    console.log('数据格式验证:', {
      isObject: typeof packetData === 'object',
      isArray: Array.isArray(packetData),
      hasTotalPackets: typeof packetData.totalPackets === 'number',
      hasProtocols: typeof packetData.protocols === 'object',
      dataSource: packetData.captureInfo?.interface || 'unknown'
    })

    // 检查是否有PCAP文件路径
    let analysisResult = '';
    if (packetData.captureInfo?.filePath && fs.existsSync(packetData.captureInfo.filePath)) {
      // 使用Python脚本直接分析PCAP文件
      console.log('使用Python脚本直接分析PCAP文件:', packetData.captureInfo.filePath);
      analysisResult = await analyzePCAPWithPythonForAI(packetData.captureInfo.filePath);
    } else {
      // 验证数据完整性 - 允许各种数据情况
      console.log('✅ 数据验证通过，开始调用AI大模型...')
      
      // 调用AI模型进行分析
      analysisResult = await analyzePacketWithAI(packetData, analysisType);
    }

    console.log('✅ AI大模型分析完成，返回结果长度:', analysisResult.length)

    return Response.json({
      success: true,
      data: {
        analysis: analysisResult,
        timestamp: new Date().toISOString(),
        analysisType,
        sessionId,
        resultLength: analysisResult.length
      }
    })

  } catch (error: any) {
    console.error('❌ AI数据包分析API错误:', error)
    console.error('错误详情:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return Response.json(
      { 
        success: false, 
        error: error.message || 'AI数据包分析失败' 
      },
      { status: 500 }
    )
  }
}

/**
 * 获取AI分析历史记录（可选功能）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return Response.json(
        { 
          success: false, 
          error: '缺少会话ID' 
        },
        { status: 400 }
      )
    }

    // 这里可以实现获取历史分析记录的功能
    // 暂时返回空记录
    return Response.json({
      success: true,
      data: {
        analyses: [],
        sessionId,
        message: '历史记录功能开发中'
      }
    })

  } catch (error: any) {
    console.error('获取AI分析历史记录错误:', error)
    
    return Response.json(
      { 
        success: false, 
        error: error.message || '获取历史记录失败' 
      },
      { status: 500 }
    )
  }
}

/**
 * 验证抓包数据格式
 */
function isValidPacketData(data: any): data is PacketData {
  // 检查必需字段
  if (typeof data.totalPackets !== 'number' || 
      typeof data.totalSize !== 'number' || 
      typeof data.duration !== 'number') {
    return false;
  }

  // 检查协议数据
  if (!data.protocols || typeof data.protocols !== 'object') {
    return false;
  }

  // 检查topTalkers
  if (!Array.isArray(data.topTalkers)) {
    return false;
  }

  // 检查suspiciousActivities（可选字段，但如果存在必须是数组）
  if (data.suspiciousActivities && !Array.isArray(data.suspiciousActivities)) {
    return false;
  }

  // 检查trafficPattern（可选字段，但如果存在必须是对象）
  if (data.trafficPattern && typeof data.trafficPattern !== 'object') {
    return false;
  }

  // 检查captureInfo
  if (!data.captureInfo || typeof data.captureInfo !== 'object') {
    return false;
  }

  // 检查可选字段 conversations（如果存在，必须是数组）
  if (data.conversations && !Array.isArray(data.conversations)) {
    return false;
  }

  // 检查可选字段 error（如果存在，必须是对象）
  if (data.error && typeof data.error !== 'object') {
    return false;
  }

  return true;
}