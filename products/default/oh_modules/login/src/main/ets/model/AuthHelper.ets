/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { JwtManager } from './JwtManager';
import { UserManager } from './UserManager';
import { promptAction } from '@kit.ArkUI';

/**
 * 认证检查结果接口
 */
export interface AuthCheckResult {
  /** 是否已认证 */
  isAuthenticated: boolean;
  /** 提示消息 */
  message: string;
  /** Token 是否存在 */
  hasToken: boolean;
  /** Token 是否有效 */
  isTokenValid: boolean;
  /** Token 是否过期 */
  isTokenExpired: boolean;
}

/**
 * 认证辅助工具类
 * 提供便捷的认证相关功能
 */
export class AuthHelper {
  private static instance: AuthHelper | null = null;
  private jwtManager: JwtManager;
  private userManager: UserManager;

  private constructor() {
    this.jwtManager = JwtManager.getInstance();
    this.userManager = UserManager.getInstance();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): AuthHelper {
    if (!AuthHelper.instance) {
      AuthHelper.instance = new AuthHelper();
    }
    return AuthHelper.instance;
  }

  /**
   * 初始化认证管理器
   */
  public async init(): Promise<void> {
    try {
      await this.userManager.initPreferences();
      console.log('AuthHelper: 初始化成功');
    } catch (err) {
      console.error('AuthHelper: 初始化失败:', err);
      throw err;
    }
  }

  /**
   * 检查用户是否已认证
   * @param showToast 是否显示提示消息，默认为 false
   * @returns 认证检查结果
   */
  public async checkAuth(showToast: boolean = false): Promise<AuthCheckResult> {
    const token = await this.jwtManager.getToken();
    const hasToken = token !== null;
    
    if (!hasToken) {
      const result: AuthCheckResult = {
        isAuthenticated: false,
        message: '未登录',
        hasToken: false,
        isTokenValid: false,
        isTokenExpired: false
      };
      
      if (showToast) {
        promptAction.showToast({ message: result.message });
      }
      
      return result;
    }

    const isExpired = await this.jwtManager.isTokenExpired();
    const isValid = await this.jwtManager.isTokenValid();

    if (isExpired === true) {
      const result: AuthCheckResult = {
        isAuthenticated: false,
        message: 'Token 已过期，请重新登录',
        hasToken: true,
        isTokenValid: false,
        isTokenExpired: true
      };
      
      if (showToast) {
        promptAction.showToast({ message: result.message });
      }
      
      return result;
    }

    if (!isValid) {
      const result: AuthCheckResult = {
        isAuthenticated: false,
        message: 'Token 无效，请重新登录',
        hasToken: true,
        isTokenValid: false,
        isTokenExpired: false
      };
      
      if (showToast) {
        promptAction.showToast({ message: result.message });
      }
      
      return result;
    }

    return {
      isAuthenticated: true,
      message: '已登录',
      hasToken: true,
      isTokenValid: true,
      isTokenExpired: false
    };
  }

  /**
   * 要求用户必须已认证
   * 如果未认证，会显示提示消息
   * @returns 是否已认证
   */
  public async requireAuth(): Promise<boolean> {
    const result = await this.checkAuth(true);
    return result.isAuthenticated;
  }

  /**
   * 检查 Token 是否即将过期
   * @param thresholdMinutes 阈值（分钟），默认为 10 分钟
   * @returns 是否即将过期
   */
  public async isTokenExpiringSoon(thresholdMinutes: number = 10): Promise<boolean> {
    const remainingTime = await this.jwtManager.getTimeToExpiration();
    
    if (remainingTime === null) {
      return false;
    }

    const thresholdMs = thresholdMinutes * 60 * 1000;
    return remainingTime < thresholdMs && remainingTime > 0;
  }

  /**
   * 提醒用户 Token 即将过期
   * @param thresholdMinutes 阈值（分钟），默认为 10 分钟
   */
  public async remindTokenExpiration(thresholdMinutes: number = 10): Promise<void> {
    const isExpiringSoon = await this.isTokenExpiringSoon(thresholdMinutes);
    
    if (isExpiringSoon) {
      const remainingTime = await this.jwtManager.getTimeToExpiration();
      if (remainingTime !== null) {
        const minutes = Math.floor(remainingTime / (1000 * 60));
        promptAction.showToast({ 
          message: `登录状态将在 ${minutes} 分钟后过期，请及时保存数据`,
          duration: 3000
        });
      }
    }
  }

  /**
   * 获取格式化的 Token 过期时间
   * @returns 格式化的过期时间字符串，如 "2024-10-19 15:30:00"
   */
  public async getFormattedExpirationTime(): Promise<string | null> {
    const expirationDate = await this.jwtManager.getExpirationDate();
    
    if (!expirationDate) {
      return null;
    }

    const year = expirationDate.getFullYear();
    const month = String(expirationDate.getMonth() + 1).padStart(2, '0');
    const day = String(expirationDate.getDate()).padStart(2, '0');
    const hours = String(expirationDate.getHours()).padStart(2, '0');
    const minutes = String(expirationDate.getMinutes()).padStart(2, '0');
    const seconds = String(expirationDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 获取 Token 剩余时间的描述
   * @returns 剩余时间描述，如 "还有 2 小时 30 分钟"
   */
  public async getRemainingTimeDescription(): Promise<string | null> {
    const remainingTime = await this.jwtManager.getTimeToExpiration();
    
    if (remainingTime === null) {
      return null;
    }

    if (remainingTime <= 0) {
      return '已过期';
    }

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `还有 ${hours} 小时 ${minutes} 分钟`;
    } else {
      return `还有 ${minutes} 分钟`;
    }
  }

  /**
   * 获取带认证的 HTTP 请求头
   * @param additionalHeaders 额外的请求头
   * @returns 包含认证信息的请求头对象
   */
  public async getAuthHeaders(additionalHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const authHeaders = await this.jwtManager.getAuthHeaders();
    
    if (additionalHeaders) {
      return { ...authHeaders, ...additionalHeaders };
    }
    
    return authHeaders;
  }

  /**
   * 安全退出登录
   * 会清除所有认证信息
   */
  public async logout(): Promise<void> {
    try {
      await this.userManager.logout();
      console.log('AuthHelper: 退出登录成功');
    } catch (err) {
      console.error('AuthHelper: 退出登录失败:', err);
      throw err;
    }
  }

  /**
   * 打印当前认证状态（用于调试）
   */
  public async printAuthStatus(): Promise<void> {
    console.log('========== 认证状态 ==========');
    
    const token = await this.jwtManager.getToken();
    console.log('Token 存在:', token !== null);
    
    if (token) {
      const tokenInfo = await this.jwtManager.getTokenInfo();
      if (tokenInfo) {
        console.log('Token 有效:', tokenInfo.isValid);
        console.log('Token 过期:', tokenInfo.isExpired);
        console.log('过期时间:', tokenInfo.expirationDate?.toLocaleString());
        console.log('Payload:', tokenInfo.payload);
      }
      
      const remainingTime = await this.getRemainingTimeDescription();
      console.log('剩余时间:', remainingTime);
    }
    
    const currentUser = await this.userManager.getCurrentUser();
    console.log('当前用户:', currentUser);
    
    console.log('==============================');
  }

  /**
   * 检查并自动清理过期的 Token
   * @returns 是否清理了过期 Token
   */
  public async cleanupExpiredToken(): Promise<boolean> {
    const isExpired = await this.jwtManager.isTokenExpired();
    
    if (isExpired === true) {
      await this.jwtManager.removeToken();
      console.log('AuthHelper: 已清理过期 Token');
      return true;
    }
    
    return false;
  }
}

