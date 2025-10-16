import { 
  CloudDatabaseService, 
  DatabaseInitializer,
  VideoItem,
  DatabaseResult,
  PaginationParams,
  PaginatedResult
} from 'utils';

/**
 * 视频数据管理器
 * 负责视频数据的获取、缓存和同步
 */
export class VideoDataManager {
  private static instance: VideoDataManager;
  private cloudDBService: CloudDatabaseService;
  private localCache: Map<string, VideoItem> = new Map();
  private isInitialized: boolean = false;

  private constructor() {
    this.cloudDBService = CloudDatabaseService.getInstance();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): VideoDataManager {
    if (!VideoDataManager.instance) {
      VideoDataManager.instance = new VideoDataManager();
    }
    return VideoDataManager.instance;
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
        console.log('VideoDataManager 初始化成功');
      }
      
      return initResult;
    } catch (error) {
      console.error('VideoDataManager 初始化失败:', error);
      return {
        success: false,
        error: `初始化失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 获取视频列表
   */
  public async getVideoList(params: PaginationParams): Promise<DatabaseResult<PaginatedResult<VideoItem>>> {
    if (!this.isInitialized) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return { success: false, error: '数据库未初始化', code: -1 };
      }
    }

    try {
      const result = await this.cloudDBService.getVideoList(params);
      
      if (result.success && result.data) {
        // 更新本地缓存
        result.data.data.forEach(video => {
          this.localCache.set(video.id, video);
        });
      }
      
      return result;
    } catch (error) {
      console.error('获取视频列表失败:', error);
      return {
        success: false,
        error: `获取视频列表失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 根据ID获取视频详情
   */
  public async getVideoById(videoId: string): Promise<DatabaseResult<VideoItem>> {
    // 先检查本地缓存
    const cachedVideo = this.localCache.get(videoId);
    if (cachedVideo) {
      return { success: true, data: cachedVideo };
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
        this.cloudDBService['cloudDB']!.createCloudDBZoneQuery(VideoItem).equalTo('id', videoId)
      );
      
      const result = await query;
      
      if (result.success && result.data && result.data.length > 0) {
        const video = result.data[0];
        this.localCache.set(video.id, video);
        return { success: true, data: video };
      } else {
        return { success: false, error: '视频不存在', code: 404 };
      }
    } catch (error) {
      console.error('获取视频详情失败:', error);
      return {
        success: false,
        error: `获取视频详情失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 保存视频
   */
  public async saveVideo(videoItem: VideoItem): Promise<DatabaseResult<boolean>> {
    if (!this.isInitialized) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        return { success: false, error: '数据库未初始化', code: -1 };
      }
    }

    try {
      const result = await this.cloudDBService.saveVideoItem(videoItem);
      
      if (result.success) {
        // 更新本地缓存
        this.localCache.set(videoItem.id, videoItem);
      }
      
      return result;
    } catch (error) {
      console.error('保存视频失败:', error);
      return {
        success: false,
        error: `保存视频失败: ${error.message || error}`,
        code: -1
      };
    }
  }

  /**
   * 更新视频点赞状态
   */
  public async updateVideoLike(videoId: string, isLiked: boolean): Promise<DatabaseResult<boolean>> {
    const videoResult = await this.getVideoById(videoId);
    if (!videoResult.success || !videoResult.data) {
      return { success: false, error: '视频不存在', code: 404 };
    }

    const video = videoResult.data;
    video.isLiked = isLiked;
    video.likeCount += isLiked ? 1 : -1;

    return await this.saveVideo(video);
  }

  /**
   * 增加视频浏览量
   */
  public async incrementVideoView(videoId: string): Promise<DatabaseResult<boolean>> {
    const videoResult = await this.getVideoById(videoId);
    if (!videoResult.success || !videoResult.data) {
      return { success: false, error: '视频不存在', code: 404 };
    }

    const video = videoResult.data;
    video.viewCount += 1;

    return await this.saveVideo(video);
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
