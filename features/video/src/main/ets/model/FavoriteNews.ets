/**
 * 收藏新闻数据模型
 */
export interface FavoriteNews {
  followId: number;
  userId: number;
  newsUniquekey: string;
  newsTitle: string;
  newsTime?: string;
  newsAuthor?: string;
  followTime: string;
}

/**
 * 收藏新闻请求参数
 */
export interface FavoriteNewsRequest {
  newsTitle: string;
  newsUniquekey: string;
  newsAuthor?: string;
  newsTime?: string;
}

/**
 * 收藏新闻响应结果
 */
export interface FavoriteNewsResult {
  code: number;
  message: string;
  data: FavoriteNews[] | null;
}
