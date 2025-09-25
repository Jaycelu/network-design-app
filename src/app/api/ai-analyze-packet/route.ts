import { NextRequest } from 'next/server';
import { analyzeNetworkIssue } from '@/lib/aiModel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileSize, filePath } = body;
    
    if (!fileName) {
      return Response.json(
        { 
          success: false, 
          error: '文件名不能为空' 
        }, 
        { status: 400 }
      );
    }
    
    // 构建分析提示
    const analysisPrompt = `请分析以下PCAP文件的网络流量数据：

文件信息：
- 文件名: ${fileName}
- 文件大小: ${(fileSize / 1024).toFixed(2)} KB

请提供以下方面的专业分析：
1. 异常流量检测
2. 性能问题分析  
3. 安全问题识别
4. 网络行为分析
5. 优化建议

请确保分析结果专业、详细且具有实际指导意义。`;
    
    // 调用AI大模型进行分析
    const aiAnalysis = await analyzeNetworkIssue(analysisPrompt);
    
    return Response.json({
      success: true,
      analysis: aiAnalysis
    });
    
  } catch (error: any) {
    console.error('AI分析抓包文件失败:', error);
    return Response.json(
      { 
        success: false, 
        error: error.message || 'AI分析失败' 
      }, 
      { status: 500 }
    );
  }
}