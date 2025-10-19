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
 * 关注新闻数据结构
 */
export interface FollowedNewsItem {
  followId: number; // 关注记录ID
  userId: number; // 用户ID
  newsId: string; // 新闻ID
  newsTitle: string; // 新闻标题
  imageUrl?: string; // 图片URL
  newsContent?: string; // 新闻正文
  followTime: string; // 关注时间
}

/**
 * 关注新闻请求参数
 */
export interface FollowNewsRequest {
  newsTitle: string; // 新闻标题（必填）
  newsContent: string; // 新闻正文（必填）
  newsId?: string; // 新闻ID（可选，不填则后端自动生成）
  imageUrl?: string; // 图片URL（可选）
}

/**
 * 表单数据接口（用于HTTP请求）
 */
interface FormDataParams {
  newsTitle: string;
  newsContent: string;
  newsId?: string;
  imageUrl?: string;
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
    if (!request.newsContent || request.newsContent.trim() === '') {
      promptAction.showToast({ message: '新闻正文不能为空' });
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
        newsContent: request.newsContent,
        newsId: request.newsId,
        imageUrl: request.imageUrl
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
   * 获取用户关注的新闻列表
   * @returns Promise<FollowedNewsItem[]> 关注的新闻列表
   */
  public async getFollowedNewsList(): Promise<FollowedNewsItem[]> {
    console.log('========== 获取关注新闻列表 ==========');

    try {
      // 1. 获取认证 token
      const token: string | null = await this.userManager.getToken();
      if (!token) {
        promptAction.showToast({ message: '请先登录' });
        console.error('未找到认证令牌，请先登录');
        return [];
      }

      // 2. 构建请求头
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`
      };

      // 3. 发送请求
      const url: string = withBase('/api/news/followed');
      console.log('请求URL:', url);

      const respText: string = await HttpUtils.get(url, headers);
      console.log('响应数据:', respText);

      // 4. 解析响应
      const resp: ResultShape<FollowedNewsItem[]> = JSON.parse(respText) as ResultShape<FollowedNewsItem[]>;

      if (resp.code === 200 && resp.data) {
        console.log(`获取关注列表成功，共 ${resp.data.length} 条`);
        return resp.data;
      } else {
        const errorMessage: string = resp.message ?? '获取关注列表失败';
        console.error('获取关注列表失败:', errorMessage);
        return [];
      }
    } catch (err) {
      console.error('获取关注列表异常:', JSON.stringify(err));
      let errorMessage: string = '获取失败，请稍后再试';

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
      return [];
    }
  }

  /**
   * 快捷方法：关注新闻（仅标题和正文）
   * @param title 新闻标题
   * @param content 新闻正文
   * @returns Promise<boolean> 是否关注成功
   */
  public async followNewsSimple(title: string, content: string): Promise<boolean> {
    return this.followNews({
      newsTitle: title,
      newsContent: content
    });
  }

  /**
   * 快捷方法：关注新闻（包含图片）
   * @param title 新闻标题
   * @param content 新闻正文
   * @param imageUrl 图片URL
   * @returns Promise<boolean> 是否关注成功
   */
  public async followNewsWithImage(title: string, content: string, imageUrl: string): Promise<boolean> {
    return this.followNews({
      newsTitle: title,
      newsContent: content,
      imageUrl: imageUrl
    });
  }

  /**
   * 快捷方法：关注新闻（完整参数）
   * @param newsId 新闻ID
   * @param title 新闻标题
   * @param content 新闻正文
   * @param imageUrl 图片URL
   * @returns Promise<boolean> 是否关注成功
   */
  public async followNewsFull(newsId: string, title: string, content: string, imageUrl?: string): Promise<boolean> {
    return this.followNews({
      newsId: newsId,
      newsTitle: title,
      newsContent: content,
      imageUrl: imageUrl
    });
  }
}

