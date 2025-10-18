/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     链接
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// UserManager lllll
import { preferences } from '@kit.ArkData';
import { promptAction } from '@kit.ArkUI';
import { HttpUtils, withBase, type ResultShape } from 'utils';

export interface UserInfo {
  account: string;
  password: string;
  username: string;
}

// 新增：定义登录/注册请求的接口
export interface LoginRequest {
  userPhone: string;
  userPassword: string;
  userName?: string;
}

export class UserManager {
  private static instance: UserManager;
  private dataPreferences: preferences.Preferences | null = null;
  private readonly PREFERENCES_NAME = 'user_data';
  private readonly USER_KEY = 'user_info';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly TOKEN_KEY = 'auth_token';

  private constructor() {}

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  // 初始化数据存储
  public async initPreferences(): Promise<void> {
    try {
      this.dataPreferences = await preferences.getPreferences(getContext(), this.PREFERENCES_NAME);
    } catch (err) {
      console.error('Failed to get preferences:', err);
    }
  }

  // 用户登录（调用后端接口）
  public async loginUser(account: string, password: string): Promise<boolean> {
    if (!this.dataPreferences) {
      await this.initPreferences();
    }

    try {
      const url = withBase('/api/users/login');
      // 修复第97行：使用具体的接口类型而不是Record<string, string>
      const form: LoginRequest = {
        userPhone: account,
        userPassword: password
      };
      const respText = await HttpUtils.postForm(url, form);
      const resp: ResultShape<string> = JSON.parse(respText);
      if (resp.code === 200 && resp.data) {
        const token = resp.data;
        const currentUser: UserInfo = { account: account, password: '', username: `用户${account.slice(-4)}` };
        await this.dataPreferences?.put(this.TOKEN_KEY, token);
        await this.dataPreferences?.put(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
        await this.dataPreferences?.flush();
        promptAction.showToast({ message: $r('app.string.login_success') });
        return true;
      }
      // 新增：根据不同的错误码提供具体的错误提示
      let errorMessage = resp.message ?? '登录失败';
      if (resp.code === 400) {
        errorMessage = '请求参数错误，请检查输入';
      } else if (resp.code === 401) {
        errorMessage = '用户名或密码错误';
      } else if (resp.code === 404) {
        errorMessage = '用户不存在，请先注册';
      } else if (resp.code === 500) {
        errorMessage = '服务器内部错误，请稍后再试';
      }
      promptAction.showToast({ message: errorMessage });
      return false;
    } catch (err) {
      console.error('Failed to login user:', err);
      // 新增：更详细的错误信息
      let errorMessage = '登录失败，请稍后再试';
      if (err.message.includes('Network')) {
        errorMessage = '网络连接失败，请检查网络设置';
      } else if (err.message.includes('Timeout')) {
        errorMessage = '请求超时，请检查网络连接';
      } else if (err.message.includes('JSON')) {
        errorMessage = '服务器响应格式错误';
      }
      promptAction.showToast({ message: errorMessage });
      return false;
    }
  }

  // 获取当前登录用户
  public async getCurrentUser(): Promise<UserInfo | null> {
    if (!this.dataPreferences) {
      await this.initPreferences();
    }

    try {
      const userStr = await this.dataPreferences?.get(this.CURRENT_USER_KEY, '');
      if (userStr && userStr !== '') {
        return JSON.parse(userStr as string);
      }
      return null;
    } catch (err) {
      console.error('Failed to get current user:', err);
      return null;
    }
  }

  // 退出登录
  public async logout(): Promise<void> {
    if (!this.dataPreferences) {
      await this.initPreferences();
    }

    try {
      await this.dataPreferences?.delete(this.CURRENT_USER_KEY);
      await this.dataPreferences?.delete(this.TOKEN_KEY);
      await this.dataPreferences?.flush();
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  }

  // 更新用户信息
  public async updateUserInfo(updatedUser: UserInfo): Promise<boolean> {
    if (!this.dataPreferences) {
      await this.initPreferences();
    }

    try {
      const allUsers = await this.getAllUsers();
      const userIndex = allUsers.findIndex(u => u.account === updatedUser.account);

      if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        await this.dataPreferences?.put(this.USER_KEY, JSON.stringify(allUsers));
        await this.dataPreferences?.put(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
        await this.dataPreferences?.flush();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update user info:', err);
      return false;
    }
  }

  // 获取所有用户（私有方法）
  private async getAllUsers(): Promise<UserInfo[]> {
    try {
      const usersStr = await this.dataPreferences?.get(this.USER_KEY, '[]');
      return JSON.parse(usersStr as string);
    } catch (err) {
      console.error('Failed to get all users:', err);
      return [];
    }
  }

  // 获取JWT令牌
  public async getToken(): Promise<string | null> {
    if (!this.dataPreferences) {
      await this.initPreferences();
    }
    try {
      const token = await this.dataPreferences?.get(this.TOKEN_KEY, '');
      if (token && token !== '') {
        return token as string;
      }
      return null;
    } catch (err) {
      console.error('Failed to get token:', err);
      return null;
    }
  }

  // 便捷方法：获取认证请求头
  public async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
}