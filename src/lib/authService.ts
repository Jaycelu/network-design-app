import axios, { AxiosInstance } from 'axios';

// 服务器配置
const API_BASE_URL = 'http://152.136.160.91:9528';

// 用户数据类型
export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  token_balance: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

// 认证服务类
class AuthService {
  private apiClient: AxiosInstance;
  private currentUser: User | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    // 创建 Axios 实例
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000, // 缩短超时时间，让用户更快得到反馈
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加响应拦截器处理错误
    this.apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // 更详细地处理错误
        if (error.response) {
          // 服务器响应了错误状态码
          console.error('服务器错误:', error.response.status, error.response.data);
        } else if (error.request) {
          // 请求已发出但没有收到响应
          console.error('网络错误: 没有收到响应', error.request);
        } else {
          // 其他错误
          console.error('请求错误:', error.message);
        }
        
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );

    // 初始化时尝试从本地存储加载用户信息
    this.loadCachedUser();
    
    // 检查服务器连接
    this.checkServerConnection();
  }

  // 检查服务器连接状态
  private async checkServerConnection() {
    try {
      // 发送一个简单的请求来测试连接
      // 使用OPTIONS方法检查API端点是否存在，而不是访问根路径
      await this.apiClient.options('/api/register');
    } catch (error: any) {
      console.warn('服务器连接检查:', error.message);
    }
  }

  // 用户注册
  async register(
    username: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    try {
      // 本地验证
      if (password !== confirmPassword) {
        return {
          success: false,
          message: '两次输入的密码不一致',
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: '密码长度至少为6位',
        };
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return {
          success: false,
          message: '手机号格式不正确',
        };
      }

      // 发送注册请求
      console.log('正在发送注册请求到:', `${API_BASE_URL}/api/register`);
      const response = await this.apiClient.post('/api/register', {
        username,
        phone,
        email,
        password,
        confirmPassword,
      });

      const data = response.data;
      console.log('注册响应:', data);

      if (data.success) {
        // 注册成功，自动登录
        this.currentUser = data.user;
        this.setTokenExpiry();
        this.saveUserToCache();
      }

      return data;
    } catch (error: any) {
      console.error('注册错误:', error);
      
      // 提供更详细的错误信息
      if (error.response) {
        // 服务器返回了错误响应
        console.error('服务器响应错误:', error.response.status, error.response.data);
        return {
          success: false,
          message: error.response.data?.message || `注册失败: ${error.response.status} ${error.response.statusText}`,
        };
      } else if (error.request) {
        // 请求已发出但没有收到响应 (网络错误)
        console.error('注册网络错误详情:', error.request);
        console.error('错误代码:', (error as any).code);
        console.error('错误信息:', error.message);
        
        // 根据错误代码提供更具体的错误信息
        const errorCode = (error as any).code;
        if (errorCode === 'ECONNABORTED') {
          return {
            success: false,
            message: '请求超时，请检查网络连接或稍后重试',
          };
        } else if (errorCode === 'ENOTFOUND') {
          return {
            success: false,
            message: '无法找到服务器，请检查网络连接',
          };
        } else {
          return {
            success: false,
            message: '无法连接到服务器，请检查网络连接或稍后重试',
          };
        }
      } else {
        // 其他错误
        console.error('其他注册错误:', error.message);
        return {
          success: false,
          message: `注册过程中发生错误: ${error.message}`,
        };
      }
    }
  }

  // 用户登录
  async login(loginIdentifier: string, password: string): Promise<AuthResponse> {
    try {
      // 发送登录请求
      console.log('正在发送登录请求到:', `${API_BASE_URL}/api/login`);
      const response = await this.apiClient.post('/api/login', {
        username: loginIdentifier,
        password,
      });

      const data = response.data;
      console.log('登录响应:', data);

      if (data.success) {
        // 登录成功，保存用户信息
        this.currentUser = data.user;
        this.setTokenExpiry();
        this.saveUserToCache();
      }

      return data;
    } catch (error: any) {
      console.error('登录错误:', error);
      
      // 提供更详细的错误信息
      if (error.response) {
        // 服务器返回了错误响应
        console.error('服务器响应错误:', error.response.status, error.response.data);
        return {
          success: false,
          message: error.response.data?.message || `登录失败: ${error.response.status} ${error.response.statusText}`,
        };
      } else if (error.request) {
        // 请求已发出但没有收到响应 (网络错误)
        console.error('登录网络错误详情:', error.request);
        console.error('错误代码:', (error as any).code);
        console.error('错误信息:', error.message);
        
        // 根据错误代码提供更具体的错误信息
        const errorCode = (error as any).code;
        if (errorCode === 'ECONNABORTED') {
          return {
            success: false,
            message: '请求超时，请检查网络连接或稍后重试',
          };
        } else if (errorCode === 'ENOTFOUND') {
          return {
            success: false,
            message: '无法找到服务器，请检查网络连接',
          };
        } else {
          return {
            success: false,
            message: '无法连接到服务器，请检查网络连接或稍后重试',
          };
        }
      } else {
        // 其他错误
        console.error('其他登录错误:', error.message);
        return {
          success: false,
          message: `登录过程中发生错误: ${error.message}`,
        };
      }
    }
  }

  // 用户登出
  logout(): void {
    this.currentUser = null;
    this.tokenExpiry = null;
    // 清除本地缓存
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_expiry');
    }
  }

  // 检查用户是否已认证
  isAuthenticated(): boolean {
    if (!this.currentUser) {
      return false;
    }

    if (this.tokenExpiry && new Date() > this.tokenExpiry) {
      this.logout();
      return false;
    }

    return true;
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    return this.isAuthenticated() ? this.currentUser : null;
  }

  // 设置 token 过期时间（7天）
  private setTokenExpiry(): void {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    this.tokenExpiry = expiryDate;
  }

  // 保存用户信息到本地存储
  private saveUserToCache(): void {
    if (typeof window !== 'undefined' && this.currentUser && this.tokenExpiry) {
      try {
        localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
        localStorage.setItem('auth_expiry', this.tokenExpiry.toISOString());
      } catch (error) {
        console.error('保存用户信息到本地存储失败:', error);
      }
    }
  }

  // 从本地存储加载用户信息
  private loadCachedUser(): void {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('auth_user');
        const expiryStr = localStorage.getItem('auth_expiry');

        if (userStr && expiryStr) {
          const user = JSON.parse(userStr);
          const expiry = new Date(expiryStr);

          // 检查是否过期
          if (new Date() <= expiry) {
            this.currentUser = user;
            this.tokenExpiry = expiry;
          } else {
            // 已过期，清除缓存
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_expiry');
          }
        }
      } catch (error) {
        console.error('加载缓存用户信息失败:', error);
        // 清除可能损坏的缓存
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_expiry');
      }
    }
  }
}

// 创建并导出单例实例
const authService = new AuthService();
export default authService;