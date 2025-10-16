import { 
  CloudDatabaseService, 
  DatabaseInitializer,
  NewsItem,
  DatabaseResult,
  PaginationParams,
  PaginatedResult
} from 'utils';

/**
 * 新闻数据管理器
 * 负责新闻数据的获取、缓存和同步
 */
export class NewsDataManager {
  private static instance: NewsDataManager;
  private cloudDBService: CloudDatabaseService;
  private localCache: Map<string, NewsItem> = new Map();
  private isInitialized: boolean = false;

  private constructor() {
    this.cloudDBService = CloudDatabaseService.getInstance();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): NewsDataManager {
    if (!NewsDataManager.instance) {
      NewsDataManager.instance = new NewsDataManager();
    }
    return NewsDataManager.instance;
  }

  /**
   * 初始化数据管理器
   */
  public async initialize(): Promise<DatabaseResult<boolean>> {
    if (this.isInitialized) {
      return { success: true, data: true };
    }

    try {
      const dbInitializer = DatabaseInitializer.getInstance();
      const initResult = await dbInitializer.initialize();
      
      if (initResult.success) {
        this.isInitialized = true;
        console.log('NewsDataManager 初始化成功');
      }
      
      return initResult;
    } catch (error) {
      console.error('NewsDataManager 初始化失败:', error);
      return {
        success: false,
        error: `初始化失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 获取新闻列表
   */
  public async getNewsList(params: PaginationParams): Promise<DatabaseResult<PaginatedResult<NewsItem>>> {
    if (!this.isInitialized) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return { success: false, error: '数据库未初始化', code: -1 };
      }
    }

    try {
      const result = await this.cloudDBService.getNewsList(params);
      
      if (result.success && result.data) {
        // 更新本地缓存
        result.data.data.forEach(news => {
          this.localCache.set(news.id, news);
        });
      }
      
      return result;
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      return {
        success: false,
        error: `获取新闻列表失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 根据分类获取新闻
   */
  public async getNewsByCategory(category: string, params: PaginationParams): Promise<DatabaseResult<PaginatedResult<NewsItem>>> {
    if (!this.isInitialized) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return { success: false, error: '数据库未初始化', code: -1 };
      }
    }

    try {
      const result = await this.cloudDBService.getNewsByCategory(category, params);
      
      if (result.success && result.data) {
        // 更新本地缓存
        result.data.data.forEach(news => {
          this.localCache.set(news.id, news);
        });
      }
      
      return result;
    } catch (error) {
      console.error('获取分类新闻失败:', error);
      return {
        success: false,
        error: `获取分类新闻失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 根据ID获取新闻详情
   */
  public async getNewsById(newsId: string): Promise<DatabaseResult<NewsItem>> {
    // 先检查本地缓存
    const cachedNews = this.localCache.get(newsId);
    if (cachedNews) {
      return { success: true, data: cachedNews };
    }

    if (!this.isInitialized) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return { success: false, error: '数据库未初始化', code: -1 };
      }
    }

    try {
      // 从云数据库查询
      const query = this.cloudDBService['executeQuery'](
        this.cloudDBService['cloudDB']!.createCloudDBZoneQuery(NewsItem).equalTo('id', newsId)
      );
      
      const result = await query;
      
      if (result.success && result.data && result.data.length > 0) {
        const news = result.data[0];
        this.localCache.set(news.id, news);
        return { success: true, data: news };
      } else {
        return { success: false, error: '新闻不存在', code: 404 };
      }
    } catch (error) {
      console.error('获取新闻详情失败:', error);
      return {
        success: false,
        error: `获取新闻详情失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 保存新闻
   */
  public async saveNews(newsItem: NewsItem): Promise<DatabaseResult<boolean>> {
    if (!this.isInitialized) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return { success: false, error: '数据库未初始化', code: -1 };
      }
    }

    try {
      const result = await this.cloudDBService.saveNewsItem(newsItem);
      
      if (result.success) {
        // 更新本地缓存
        this.localCache.set(newsItem.id, newsItem);
      }
      
      return result;
    } catch (error) {
      console.error('保存新闻失败:', error);
      return {
        success: false,
        error: `保存新闻失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 更新新闻点赞状态
   */
  public async updateNewsLike(newsId: string, isLiked: boolean): Promise<DatabaseResult<boolean>> {
    const newsResult = await this.getNewsById(newsId);
    if (!newsResult.success || !newsResult.data) {
      return { success: false, error: '新闻不存在', code: 404 };
    }

    const news = newsResult.data;
    news.isLiked = isLiked;
    news.likeCount += isLiked ? 1 : -1;

    return await this.saveNews(news);
  }

  /**
   * 增加新闻浏览量
   */
  public async incrementNewsView(newsId: string): Promise<DatabaseResult<boolean>> {
    const newsResult = await this.getNewsById(newsId);
    if (!newsResult.success || !newsResult.data) {
      return { success: false, error: '新闻不存在', code: 404 };
    }

    const news = newsResult.data;
    news.viewCount += 1;

    return await this.saveNews(news);
  }

  /**
   * 清除本地缓存
   */
  public clearCache(): void {
    this.localCache.clear();
  }

  /**
   * 获取缓存大小
   */
  public getCacheSize(): number {
    return this.localCache.size;
  }
}
