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

import { HttpUtils, withBase, type ResultShape } from 'utils';
import { UserManager } from 'login';
import { promptAction } from '@kit.ArkUI';

/**
 * 关注新闻数据结构（根据新API更新）
 */
export interface FollowedNewsItem {
  followId: number; // 关注记录ID
  userId: number; // 用户ID
  newsUniquekey: string; // 新闻唯一标识（实际存储的是新闻URL）
  newsTitle: string; // 新闻标题
  newsTime?: string; // 新闻发布时间
  newsAuthor?: string; // 新闻发布者
  followTime: string; // 关注时间
}

/**
 * 关注新闻请求参数（根据新API更新）
 */
export interface FollowNewsRequest {
  newsTitle: string; // 新闻标题（必填）
  newsUniquekey: string; // 新闻唯一标识（必填，实际为新闻URL）
  newsAuthor?: string; // 新闻发布者（可选）
  newsTime?: string; // 新闻发布时间（可选，ISO 8601格式）
}

/**
 * 表单数据接口（用于HTTP请求）
 */
interface FormDataParams {
  newsTitle: string;
  newsUniquekey: string;
  newsAuthor?: string;
  newsTime?: string;
}

/**
 * 用户关注新闻服务类
 * 提供关注新闻、取消关注、获取关注列表等功能
 */
export class NewsFollowService {
  private static instance: NewsFollowService;
  private userManager: UserManager;

  private constructor() {
    this.userManager = UserManager.getInstance();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): NewsFollowService {
    if (!NewsFollowService.instance) {
      NewsFollowService.instance = new NewsFollowService();
    }
    return NewsFollowService.instance;
  }

  /**
   * 关注新闻
   * @param request 关注新闻请求参数
   * @returns Promise<boolean> 是否关注成功
   */
  public async followNews(request: FollowNewsRequest): Promise<boolean> {
    console.log('========== 开始关注新闻 ==========');
    console.log('请求参数:', JSON.stringify(request));

    // 1. 验证必填参数
    if (!request.newsTitle || request.newsTitle.trim() === '') {
      promptAction.showToast({ message: '新闻标题不能为空' });
      return false;
    }
    if (!request.newsUniquekey || request.newsUniquekey.trim() === '') {
      promptAction.showToast({ message: '新闻唯一标识不能为空' });
      return false;
    }

    try {
      // 2. 获取认证 token
      const token: string | null = await this.userManager.getToken();
      if (!token) {
        promptAction.showToast({ message: '请先登录' });
        console.error('未找到认证令牌，请先登录');
        return false;
      }

      // 3. 构建请求头
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`
      };

      // 4. 构建表单数据
      const formData: FormDataParams = {
        newsTitle: request.newsTitle,
        newsUniquekey: request.newsUniquekey,
        newsAuthor: request.newsAuthor,
        newsTime: request.newsTime
      };

      // 5. 发送请求
      const url: string = withBase('/api/news/follow');
      console.log('请求URL:', url);

      const respText: string = await HttpUtils.postForm(url, formData, headers);
      console.log('响应数据:', respText);

      // 6. 解析响应
      const resp: ResultShape<null> = JSON.parse(respText) as ResultShape<null>;

      if (resp.code === 200) {
        promptAction.showToast({ message: '关注成功' });
        console.log('关注新闻成功');
        return true;
      } else {
        const errorMessage: string = resp.message ?? '关注失败';
        promptAction.showToast({ message: errorMessage });
        console.error('关注新闻失败:', errorMessage);
        return false;
      }
    } catch (err) {
      console.error('关注新闻异常:', JSON.stringify(err));
      let errorMessage: string = '关注失败，请稍后再试';

      if (err instanceof Error) {
        const errMsg: string = err.message;
        if (errMsg.includes('Network')) {
          errorMessage = '网络连接失败，请检查网络设置';
        } else if (errMsg.includes('Timeout')) {
          errorMessage = '请求超时，请检查网络连接';
        } else if (errMsg.includes('403')) {
          errorMessage = '没有权限，请重新登录';
        } else if (errMsg.includes('401')) {
          errorMessage = '登录已过期，请重新登录';
        }
      }

      promptAction.showToast({ message: errorMessage });
      return false;
    }
  }

  /**
   * 测试token有效性（通过调用用户信息接口）
   * @returns Promise<boolean> token是否有效
   */
  private async testTokenValidity(): Promise<boolean> {
    try {
      const token: string | null = await this.userManager.getToken();
      if (!token) {
        return false;
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const headers: Record<string, string> = {
        'Authorization': authToken
      };

      const url: string = withBase('/api/users/info');
      console.log('🧪 测试token有效性，请求URL:', url);
      
      const respText: string = await HttpUtils.get(url, headers);
      const resp: ResultShape<object> = JSON.parse(respText) as ResultShape<object>;
      
      console.log('🧪 token验证结果:', resp);
      return resp.code === 200;
    } catch (err) {
      console.error('🧪 token验证失败:', err);
      return false;
    }
  }

  /**
   * 获取用户关注的新闻列表
   * @returns Promise<FollowedNewsItem[]> 关注的新闻列表
   */
  public async getFollowedNewsList(): Promise<FollowedNewsItem[]> {
    console.log('========== 获取关注新闻列表 ==========');

    try {
      // 1. 获取认证 token
      const token: string | null = await this.userManager.getToken();
      if (!token) {
        console.error('未找到认证令牌，请先登录');
        throw new Error('请先登录');
      }

      console.log('🔍 Token前10个字符:', token.substring(0, 10));
      console.log('🔍 Token后10个字符:', token.substring(token.length - 10));
      console.log('🔍 Token是否包含Bearer:', token.startsWith('Bearer'));
      
      // 先测试token有效性
      const isValidToken = await this.testTokenValidity();
      console.log('🧪 Token有效性测试结果:', isValidToken);
      
      if (!isValidToken) {
        throw new Error('Token无效或已过期，请重新登录');
      }
      
      // 如果token已经包含Bearer，不要重复添加
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      // 2. 构建请求头
      const headers: Record<string, string> = {
        'Authorization': authToken
      };

      console.log('🔍 最终请求头 Authorization:', headers['Authorization'].substring(0, 30) + '...');

      // 3. 发送请求
      const url: string = withBase('/api/news/followed');
      console.log('请求URL:', url);

      const respText: string = await HttpUtils.get(url, headers);
      console.log('响应数据:', respText);

      // 4. 解析响应
      const resp: ResultShape<FollowedNewsItem[]> = JSON.parse(respText) as ResultShape<FollowedNewsItem[]>;

      if (resp.code === 200) {
        const data = resp.data || [];
        console.log(`获取关注列表成功，共 ${data.length} 条`);
        return data;
      } else {
        const errorMessage: string = resp.message ?? '获取关注列表失败';
        console.error('获取关注列表失败:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('获取关注列表异常:', JSON.stringify(err));
      
      // 重新抛出异常，让调用方决定如何处理
      if (err instanceof Error) {
        const errMsg: string = err.message;
        if (errMsg.includes('Network') || errMsg.includes('network')) {
          throw new Error('网络连接失败，请检查网络设置');
        } else if (errMsg.includes('Timeout') || errMsg.includes('timeout')) {
          throw new Error('请求超时，请检查网络连接');
        } else if (errMsg.includes('403')) {
          throw new Error('没有权限，请重新登录');
        } else if (errMsg.includes('401')) {
          throw new Error('登录已过期，请重新登录');
        } else {
          throw new Error(errMsg); // 重新抛出原始异常信息
        }
      }
      
      // 如果不是Error类型，转换为Error
      throw new Error('获取关注列表失败');
    }
  }

  /**
   * 取消关注新闻
   * @param newsUniquekey 新闻唯一标识
   * @returns Promise<boolean> 是否取消关注成功
   */
  public async unfollowNews(newsUniquekey: string): Promise<boolean> {
    console.log('========== 开始取消关注新闻 ==========');
    console.log('新闻唯一标识:', newsUniquekey);

    // 1. 验证必填参数
    if (!newsUniquekey || newsUniquekey.trim() === '') {
      promptAction.showToast({ message: '新闻唯一标识不能为空' });
      return false;
    }

    try {
      // 2. 获取认证 token
      const token: string | null = await this.userManager.getToken();
      if (!token) {
        promptAction.showToast({ message: '请先登录' });
        console.error('未找到认证令牌，请先登录');
        return false;
      }

      // 3. 构建请求头
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`
      };

      // 4. 发送请求
      const url: string = withBase(`/api/news/unfollow?newsUniquekey=${encodeURIComponent(newsUniquekey)}`);
      console.log('请求URL:', url);

      const respText: string = await HttpUtils.delete(url, headers);
      console.log('响应数据:', respText);

      // 5. 解析响应
      const resp: ResultShape<null> = JSON.parse(respText) as ResultShape<null>;

      if (resp.code === 200) {
        promptAction.showToast({ message: '取消关注成功' });
        console.log('取消关注新闻成功');
        return true;
      } else {
        const errorMessage: string = resp.message ?? '取消关注失败';
        promptAction.showToast({ message: errorMessage });
        console.error('取消关注新闻失败:', errorMessage);
        return false;
      }
    } catch (err) {
      console.error('取消关注新闻异常:', JSON.stringify(err));
      let errorMessage: string = '取消关注失败，请稍后再试';

      if (err instanceof Error) {
        const errMsg: string = err.message;
        if (errMsg.includes('Network')) {
          errorMessage = '网络连接失败，请检查网络设置';
        } else if (errMsg.includes('Timeout')) {
          errorMessage = '请求超时，请检查网络连接';
        } else if (errMsg.includes('403')) {
          errorMessage = '没有权限，请重新登录';
        } else if (errMsg.includes('401')) {
          errorMessage = '登录已过期，请重新登录';
        }
      }

      promptAction.showToast({ message: errorMessage });
      return false;
    }
  }

  /**
   * 快捷方法：关注新闻（仅标题和唯一标识）
   * @param title 新闻标题
   * @param newsUniquekey 新闻唯一标识
   * @returns Promise<boolean> 是否关注成功
   */
  public async followNewsSimple(title: string, newsUniquekey: string): Promise<boolean> {
    return this.followNews({
      newsTitle: title,
      newsUniquekey: newsUniquekey
    });
  }

  /**
   * 快捷方法：关注新闻（包含发布者信息）
   * @param title 新闻标题
   * @param newsUniquekey 新闻唯一标识
   * @param newsAuthor 新闻发布者
   * @returns Promise<boolean> 是否关注成功
   */
  public async followNewsWithAuthor(title: string, newsUniquekey: string, newsAuthor: string): Promise<boolean> {
    return this.followNews({
      newsTitle: title,
      newsUniquekey: newsUniquekey,
      newsAuthor: newsAuthor
    });
  }

  /**
   * 快捷方法：关注新闻（完整参数）
   * @param title 新闻标题
   * @param newsUniquekey 新闻唯一标识
   * @param newsAuthor 新闻发布者
   * @param newsTime 新闻发布时间
   * @returns Promise<boolean> 是否关注成功
   */
  public async followNewsFull(title: string, newsUniquekey: string, newsAuthor?: string, newsTime?: string): Promise<boolean> {
    return this.followNews({
      newsTitle: title,
      newsUniquekey: newsUniquekey,
      newsAuthor: newsAuthor,
      newsTime: newsTime
    });
  }
}

