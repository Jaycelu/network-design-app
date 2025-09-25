param(
    [string]$InterfaceName = "Ethernet",
    [int]$Duration = 30,
    [string]$OutputFile = "capture.etl"
)

# 输出JSON格式的状态信息
Write-Host "{`"type`":`"status`",`"message`":`"Starting network trace on interface: $InterfaceName for $Duration seconds`"}"

try {
    # 开始网络跟踪
    $startResult = netsh trace start capture=yes tracefile="$OutputFile" provider=Microsoft-Windows-TCPIP level=4
    Write-Host "{`"type`":`"status`",`"message`":`"Netsh trace started`"}"
    
    # 等待指定的时间
    Start-Sleep -Seconds $Duration
    
    # 停止网络跟踪
    $stopResult = netsh trace stop
    Write-Host "{`"type`":`"status`",`"message`":`"Netsh trace stopped`"}"
    
    # 输出完成状态
    Write-Host "{`"type`":`"complete`",`"message`":`"Network trace completed`",`"outputFile`":`"$OutputFile`"}"
}
catch {
    # 输出错误信息
    Write-Host "{`"type`":`"error`",`"message`":`"$($_.Exception.Message)`"}"
}