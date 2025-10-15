# Network Engineer Integrated Service Platform

A comprehensive network operations platform designed specifically for network engineers, integrating core functions such as network design, device management, troubleshooting, and traffic analysis. Powered by AI technology to enhance productivity and efficiency.

## ✨ Core Features

### 🧠 AI-Powered Network Generator
- **One-Click Architecture Generation**: Automatically generate professional network architecture solutions based on business requirements using AI technology
- **Smart Topology Design**: Support various network topology structures including star, mesh, and tree configurations
- **Automated IP Planning**: Intelligent IP address allocation with automatic subnet and VLAN planning
- **Device Recommendations**: Recommend optimal network devices based on budget and performance requirements
- **Configuration Auto-Generation**: Generate network device configurations following best practices

### 🔧 Device Management Center
- **Multi-Vendor Support**: Compatible with mainstream vendors including Cisco, Huawei, H3C, and more
- **Bulk Configuration Management**: Batch device configuration deployment, backup, and version control
- **Real-Time Monitoring**: Live device status monitoring with performance metrics visualization
- **Configuration Templates**: Built-in common configuration templates with custom template support
- **Automation Scripts**: Integrated Python script execution for operations automation

### 🤖 NetGPT - AI Network Troubleshooting Assistant
- **Intelligent Fault Diagnosis**: Describe network issues and receive AI-powered analysis and troubleshooting guidance
- **Problem Pattern Recognition**: Identify common network issue patterns based on historical data
- **Solution Recommendations**: Provide step-by-step problem resolution procedures
- **Knowledge Base Integration**: Access network troubleshooting knowledge base for quick solutions
- **History Management**: Save troubleshooting history and build problem resolution archives

### 💬 AI Intelligent Chat
- **Smart Conversation Assistant**: AI-powered intelligent dialogue system
- **Network Knowledge Q&A**: Answer network-related technical questions
- **Real-Time Interaction**: Support real-time conversation and context understanding
- **Multi-Turn Dialogue**: Support complex multi-turn conversation scenarios
- **Knowledge Base Integration**: Integrated network engineering knowledge base

### 📊 Packet Capture & Analysis
- **Real-Time Traffic Capture**: Support multi-interface simultaneous packet capture with real-time network traffic monitoring
- **Intelligent Traffic Analysis**: AI-powered analysis of network traffic patterns to identify anomalous behavior
- **Performance Diagnostics**: Analyze network performance issues and identify bottlenecks
- **Security Detection**: Identify potential security threats and abnormal traffic patterns
- **Visual Reports**: Generate intuitive traffic analysis reports and charts
- **PCAP File Management**: Support PCAP file upload, download, and analysis
- **Multi-Interface Support**: Auto-detect all network interfaces including wireless and wired

## 🚀 Quick Start

**Environment Requirements**
- Node.js (v18 or newer)
- npm / pnpm / yarn
- Python (for packet analysis scripts)

**Installation & Running**
1.  Clone the project to your local machine.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure the database (Prisma):
    ```bash
    # Configure your database connection in prisma/schema.prisma
    # Push the database schema
    npx prisma db push
    ```
4.  Start the web development server:
    ```bash
    npm run dev
    ```
5.  Start the desktop application in development mode:
    ```bash
    npm run desktop:dev
    ```
The application will be available at `http://localhost:3005`.

## 🧭 Module Guide

1. **Project Management Module**: Quick network architecture generation
2. **Device Management Module**: Manage and monitor network devices
3. **AI Troubleshooting Module**: Intelligent network problem diagnosis
4. **Packet Analysis Module**: Deep network traffic analysis
5. **AI Chat Module**: Intelligent conversation and knowledge Q&A
6. **WebSocket Demo**: Real-time communication functionality showcase

## 🔧 Technical Architecture

### Frontend Technologies
- **Next.js 15**: Modern React framework with App Router support
- **TypeScript**: Type-safe JavaScript superset
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library based on Radix UI
- **React Flow**: For building network topology diagrams
- **Zustand**: Lightweight state management library

### Backend Technologies
- **Node.js (Custom Server)**: Using a custom Next.js server with `server.ts`
- **Socket.IO**: Real-time bidirectional communication
- **Prisma**: Modern database ORM
- **Python + Scapy**: For backend network packet capture and analysis

### AI Integration
- **z-ai-web-dev-sdk**: Integrates AI chat and analysis capabilities
- **Network Analysis AI**: AI-driven network problem diagnosis
- **Architecture Generation AI**: Intelligent network architecture design

### Desktop Application
- **Electron**: Build cross-platform desktop apps with web technologies

### Data Storage
- **PCAP File Management**: Storage for network capture files
- **User Data Cache**: Local storage for user authentication information
- **Project Data**: Storage for network design solutions

## 🎯 Use Cases

### Network Design Phase
- New network architecture design
- Network upgrade and migration planning
- Business requirement analysis and architecture planning
- Device selection and budget evaluation

### Daily Operations Management
- Centralized network device management
- Bulk configuration deployment and updates
- Device performance monitoring and alerting
- Automated operational task execution

### Troubleshooting & Problem Resolution
- Network connectivity issue diagnosis
- Performance problem root cause analysis
- Security incident investigation
- Complex network problem localization

### Network Traffic Analysis
- Network performance optimization
- Abnormal traffic detection
- Network security monitoring
- Business traffic analysis

## 🌟 Key Advantages

### High Intelligence Level
- AI-driven network design and problem diagnosis
- Intelligent recommendation of optimal solutions
- High automation level reducing manual operations

### User-Friendly Interface
- Modern web interface with intuitive operations
- Modular design with clear functionality
- Wizard-based workflow, beginner-friendly

### Comprehensive Integration
- Covers all aspects of a network engineer's daily work
- One-stop solution for network operations needs
- Eliminates tool switching, improves efficiency

### Professional Grade
- Designed based on network engineering best practices
- Supports mainstream vendor devices and protocols
- Suitable for various scales of network environments

---

> This platform aims to be the trusted assistant for network engineers, making network engineering work more efficient, professional, and intelligent through AI technology and automation tools.