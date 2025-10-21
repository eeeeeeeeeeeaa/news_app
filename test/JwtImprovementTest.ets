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

/**
 * JWT改进测试示例
 * 展示如何使用改进后的JWT解析功能
 */

import { UserManager } from 'login';
import { JwtUtil } from 'utils';

export class JwtImprovementTest {
  private userManager: UserManager = UserManager.getInstance();

  /**
   * 测试JWT解析功能
   */
  async testJwtParsing(): Promise<void> {
    console.log('🧪 开始测试JWT解析功能');

    try {
      // 1. 测试获取当前用户（从JWT解析）
      const currentUser = await this.userManager.getCurrentUser();
      console.log('✅ 当前用户信息:', currentUser);

      // 2. 测试JWT验证
      const isValid = await this.userManager.validateToken();
      console.log('✅ JWT有效性:', isValid);

      // 3. 测试获取剩余时间
      const remainingTime = await this.userManager.getTokenRemainingTime();
      console.log('✅ JWT剩余时间:', remainingTime, '秒');

      // 4. 测试JWT工具类功能
      const token = await this.userManager.getToken();
      if (token) {
        console.log('🔍 测试JWT工具类功能:');
        
        const payload = JwtUtil.parseJwt(token);
        console.log('✅ JWT载荷:', payload);
        
        const userId = JwtUtil.getUserIdFromToken(token);
        console.log('✅ 用户ID:', userId);
        
        const isExpired = JwtUtil.isTokenExpired(token);
        console.log('✅ 是否过期:', isExpired);
        
        const isValidFormat = JwtUtil.isValidFormat(token);
        console.log('✅ 格式是否有效:', isValidFormat);
        
        const remaining = JwtUtil.getRemainingTime(token);
        console.log('✅ 剩余时间:', remaining, '秒');
      }

    } catch (error) {
      console.error('❌ JWT测试失败:', error);
    }
  }

  /**
   * 测试登录状态检查
   */
  async testLoginStatusCheck(): Promise<void> {
    console.log('🧪 开始测试登录状态检查');

    try {
      // 检查登录状态
      const user = await this.userManager.getCurrentUser();
      const isLoggedIn = user !== null;
      
      console.log('✅ 登录状态:', isLoggedIn ? '已登录' : '未登录');
      
      if (isLoggedIn) {
        console.log('✅ 用户信息:', user);
        
        // 验证JWT
        const isValid = await this.userManager.validateToken();
        console.log('✅ JWT验证结果:', isValid ? '有效' : '无效');
        
        if (!isValid) {
          console.log('⚠️ JWT无效，建议重新登录');
        }
      }

    } catch (error) {
      console.error('❌ 登录状态检查失败:', error);
    }
  }

  /**
   * 运行所有测试
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 开始运行JWT改进测试');
    
    await this.testJwtParsing();
    await this.testLoginStatusCheck();
    
    console.log('✅ 所有测试完成');
  }
}
