# 设备管理模块设计规划

## 1. 概述

本文档为设备管理模块制定了详细的设计规划，旨在通过优化UI直观性、交互流畅性、业务兼容性、Python脚本集成和批量操作效率，提升用户体验和运维效率。设计将遵循Material-UI组件库风格，采用蓝色#007BFF作为主色调，并使用扁平化图标。

## 2. 设计目标

### 2.1 UI直观性优化
- 实现响应式布局，确保在不同设备上都有良好的显示效果
- 支持暗黑模式，减少用户眼部疲劳
- 采用清晰的视觉层次和一致的设计语言

### 2.2 交互流畅性优化
- 实现拖拽排序功能，方便用户自定义设备或组的排列顺序
- 实现实时搜索功能，提升查找效率
- 提供流畅的动画和过渡效果

### 2.3 业务兼容性优化
- 扩展对多厂商设备的支持，包括Cisco、华为、H3C等
- 提供统一的设备管理接口，屏蔽厂商差异
- 支持设备厂商特定的配置和管理功能

### 2.4 Python脚本集成
- 集成Python脚本功能，实现设备配置备份和下发
- 提供可视化的脚本执行界面
- 支持脚本执行结果的实时反馈

### 2.5 批量操作效率优化
- 实现设备批量操作功能，提升运维效率
- 支持批量配置、批量备份等操作
- 提供批量操作进度和结果反馈

## 3. 详细设计方案

### 3.1 UI直观性优化

#### 3.1.1 响应式布局
- 使用CSS Grid和Flexbox实现灵活的布局
- 针对不同屏幕尺寸（手机、平板、桌面）设计适配方案
- 采用可折叠的侧边栏，在小屏幕设备上节省空间

#### 3.1.2 暗黑模式支持
- 使用CSS变量定义主题色，方便切换明暗主题
- 为所有组件设计暗黑模式下的配色方案
- 提供主题切换开关，保存用户偏好设置

### 3.2 交互流畅性优化

#### 3.2.1 拖拽排序
- 使用`@dnd-kit`库实现拖拽功能
- 支持设备列表和设备组列表的拖拽排序
- 提供视觉反馈，如拖拽阴影、放置指示器等

#### 3.2.2 实时搜索
- 在设备列表和设备组列表中添加搜索框
- 实现防抖机制，避免频繁触发搜索
- 支持多字段搜索（设备名、IP地址、描述等）

### 3.3 业务兼容性优化

#### 3.3.1 多厂商设备支持
- 扩展设备类型定义，增加厂商特定属性
- 为不同厂商设计专门的管理界面和操作流程
- 提供厂商设备图标库，增强视觉识别

#### 3.3.2 厂商设备图标设计
- Cisco设备：使用路由器和交换机的标准图标，以蓝色和灰色为主色调
- 华为设备：使用具有华为特色的图标设计，以红色和黑色为主色调
- H3C设备：使用H3C品牌色（橙色和蓝色）设计的图标

### 3.4 Python脚本集成

#### 3.4.1 脚本功能设计
- 在设备管理模块中添加"脚本执行"子模块
- 提供脚本选择、参数配置界面
- 实现脚本执行状态的实时展示

#### 3.4.2 脚本执行反馈
- 展示脚本执行日志
- 提供执行成功/失败的状态提示
- 支持中断正在执行的脚本

#### 3.4.3 配置备份脚本示例
使用Netmiko库实现Cisco设备配置备份的示例脚本：
```python
from netmiko import ConnectHandler
import datetime

# 设备信息
device = {
    'device_type': 'cisco_ios',
    'ip': '10.0.0.1',
    'username': 'admin',
    'password': 'password123',
}

# 连接设备
net_connect = ConnectHandler(**device)

# 备份运行配置
output = net_connect.send_command('show running-config')

# 保存配置到文件
timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
filename = f"{device['ip']}_{timestamp}.txt"
with open(filename, 'w') as file:
    file.write(output)

# 断开连接
net_connect.disconnect()
```

#### 3.4.4 配置下发脚本示例
使用Paramiko库实现配置下发的示例脚本：
```python
import paramiko

# SSH连接参数
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(hostname='10.0.0.1', username='admin', password='password123', port=22)

# 下发配置命令
commands = [
    'configure terminal',
    'interface GigabitEthernet0/1',
    'description Configured by Python script',
    'end',
    'write memory'
]

for command in commands:
    stdin, stdout, stderr = ssh.exec_command(command)
    print(stdout.read().decode())

# 断开连接
ssh.close()
```

### 3.5 批量操作效率优化

#### 3.5.1 批量操作功能
- 在设备列表中添加复选框，支持多选设备
- 提供批量操作菜单，包括批量配置、批量备份等
- 实现批量操作进度条，展示操作进度

#### 3.5.2 操作结果反馈
- 提供批量操作结果汇总报告
- 支持查看每台设备的操作详情
- 提供失败重试机制

#### 3.5.3 批量操作设计要点
- 支持跨设备组的批量操作
- 提供操作预览功能，让用户确认将要执行的操作
- 实现操作队列管理，支持暂停、恢复和取消批量操作
- 为长时间运行的批量操作提供后台执行能力

## 4. 组件设计

### 4.1 主要组件

#### 4.1.1 DeviceManagement
- 主容器组件，管理视图模式和路由
- 包含子模块导航和内容区域

#### 4.1.2 DeviceList
- 设备列表展示组件
- 包含搜索、过滤、排序功能

#### 4.1.3 DeviceGroupList
- 设备组列表展示组件
- 支持拖拽排序和实时搜索

#### 4.1.4 ScriptExecutor
- Python脚本执行组件
- 提供脚本选择、参数配置和执行反馈

#### 4.1.5 BatchOperationPanel
- 批量操作面板组件
- 提供批量操作选项和进度反馈

### 4.2 UI组件
- 使用shadcn/ui组件库，确保一致性和可维护性
- 自定义主题色为蓝色#007BFF
- 使用Lucide React图标库，保持扁平化风格

## 5. 数据结构设计

### 5.1 设备组 (DeviceGroup)
- id: string - 唯一标识符
- name: string - 组名
- description: string - 描述
- order: number - 排序序号（用于拖拽排序）

### 5.2 设备 (Device)
- id: string - 唯一标识符
- name: string - 设备名称
- ip: string - IP地址
- groupId: string - 所属组ID
- description: string - 描述
- vendor: string - 厂商（Cisco/Huawei/H3C等）
- order: number - 排序序号（用于拖拽排序）

### 5.3 批量操作 (BatchOperation)
- id: string - 唯一标识符
- name: string - 操作名称
- type: string - 操作类型（配置下发、配置备份等）
- status: string - 状态（待执行、执行中、已完成、已取消）
- progress: number - 进度百分比
- devices: string[] - 涉及的设备ID列表
- createdAt: Date - 创建时间
- completedAt: Date - 完成时间

## 6. API接口设计

### 6.1 设备管理接口
- GET /api/devices - 获取设备列表
- POST /api/devices - 添加设备
- PUT /api/devices/:id - 更新设备
- DELETE /api/devices/:id - 删除设备

### 6.2 设备组管理接口
- GET /api/device-groups - 获取设备组列表
- POST /api/device-groups - 添加设备组
- PUT /api/device-groups/:id - 更新设备组
- DELETE /api/device-groups/:id - 删除设备组

### 6.3 脚本执行接口
- POST /api/scripts/execute - 执行Python脚本
- GET /api/scripts/status/:id - 获取脚本执行状态

### 6.4 批量操作接口
- POST /api/batch-operations - 发起批量操作
- GET /api/batch-operations/:id - 获取批量操作状态
- PUT /api/batch-operations/:id/cancel - 取消批量操作

## 7. 安全设计

- 对所有API接口进行身份验证和授权检查
- 对用户输入进行验证和过滤，防止XSS攻击
- 使用HTTPS协议传输敏感数据
- 对Python脚本执行进行沙箱隔离，防止恶意代码执行