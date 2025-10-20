import { HttpUtils, withBase, type ResultShape } from "@bundle:com.huawei.quickstart/default@utils/Index";
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/Index";
import promptAction from "@ohos:promptAction";
/**
 * 关注新闻数据结构
 */
export interface FollowedNewsItem {
    followId: number; // 关注记录ID
    userId: number; // 用户ID
    newsUniquekey: string; // 新闻唯一标识
    newsTitle: string; // 新闻标题
    newsTime?: string; // 新闻发布时间
    newsAuthor?: string; // 新闻发布者
    followTime: string; // 关注时间
}
/**
 * 关注新闻请求参数
 */
export interface FollowNewsRequest {
    newsTitle: string; // 新闻标题（必填）
    newsUniquekey: string; // 新闻唯一标识（必填）
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
    private isInitialized: boolean = false;
    private constructor() {
        console.log('🔍 [NewsFollowService] 构造函数被调用');
        this.userManager = UserManager.getInstance();
        console.log('🔍 [NewsFollowService] UserManager 实例已获取');
    }
    /**
     * 获取单例实例
     */
    public static getInstance(): NewsFollowService {
        if (!NewsFollowService.instance) {
            console.log('🔍 [NewsFollowService] 创建新的单例实例');
            NewsFollowService.instance = new NewsFollowService();
        }
        return NewsFollowService.instance;
    }
    /**
     * 初始化服务（确保 UserManager 的 Preferences 已初始化）
     */
    private async ensureInitialized(): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        try {
            console.log('🔍 [NewsFollowService] 开始初始化...');
            await this.userManager.initPreferences();
            this.isInitialized = true;
            console.log('✅ [NewsFollowService] 初始化成功');
        }
        catch (error) {
            console.error('❌ [NewsFollowService] 初始化失败:', error);
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('初始化失败: ' + JSON.stringify(error));
            }
        }
    }
    /**
     * 关注新闻
     * @param request 关注新闻请求参数
     * @returns Promise<boolean> 是否关注成功
     */
    public async followNews(request: FollowNewsRequest): Promise<boolean> {
        console.log('========== 开始关注新闻 ==========');
        console.log('请求参数:', JSON.stringify(request));
        // 确保已初始化
        await this.ensureInitialized();
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
            }
            else {
                const errorMessage: string = resp.message ?? '关注失败';
                promptAction.showToast({ message: errorMessage });
                console.error('关注新闻失败:', errorMessage);
                return false;
            }
        }
        catch (err) {
            console.error('关注新闻异常:', JSON.stringify(err));
            let errorMessage: string = '关注失败，请稍后再试';
            if (err instanceof Error) {
                const errMsg: string = err.message;
                if (errMsg.includes('Network')) {
                    errorMessage = '网络连接失败，请检查网络设置';
                }
                else if (errMsg.includes('Timeout')) {
                    errorMessage = '请求超时，请检查网络连接';
                }
                else if (errMsg.includes('403')) {
                    errorMessage = '没有权限，请重新登录';
                }
                else if (errMsg.includes('401')) {
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
            // 确保已初始化
            await this.ensureInitialized();
            // 1. 获取认证 token
            console.log('🔍 [getFollowedNewsList] 开始获取 token...');
            console.log('🔍 [getFollowedNewsList] UserManager 实例:', this.userManager);
            const token: string | null = await this.userManager.getToken();
            console.log('🔍 [getFollowedNewsList] Token 获取结果:', token ? '存在' : 'null');
            console.log('🔍 [getFollowedNewsList] Token 类型:', typeof token);
            if (token) {
                console.log('🔍 [getFollowedNewsList] Token 长度:', token.length);
                console.log('🔍 [getFollowedNewsList] Token 前20字符:', token.substring(0, 20) + '...');
            }
            if (!token) {
                console.error('❌ [getFollowedNewsList] 未找到认证令牌，请先登录');
                // 额外调试：检查 UserManager 的状态
                try {
                    const tokenInfo = await this.userManager.getTokenInfo();
                    console.log('🔍 [getFollowedNewsList] Token Info:', tokenInfo);
                }
                catch (err) {
                    console.error('❌ [getFollowedNewsList] 获取 Token Info 失败:', err);
                }
                promptAction.showToast({ message: '请先登录' });
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
            }
            else {
                const errorMessage: string = resp.message ?? '获取关注列表失败';
                console.error('获取关注列表失败:', errorMessage);
                return [];
            }
        }
        catch (err) {
            console.error('获取关注列表异常:', JSON.stringify(err));
            let errorMessage: string = '获取失败，请稍后再试';
            if (err instanceof Error) {
                const errMsg: string = err.message;
                if (errMsg.includes('Network')) {
                    errorMessage = '网络连接失败，请检查网络设置';
                }
                else if (errMsg.includes('Timeout')) {
                    errorMessage = '请求超时，请检查网络连接';
                }
                else if (errMsg.includes('403')) {
                    errorMessage = '没有权限，请重新登录';
                }
                else if (errMsg.includes('401')) {
                    errorMessage = '登录已过期，请重新登录';
                }
            }
            promptAction.showToast({ message: errorMessage });
            return [];
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
        // 确保已初始化
        await this.ensureInitialized();
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
            }
            else {
                const errorMessage: string = resp.message ?? '取消关注失败';
                promptAction.showToast({ message: errorMessage });
                console.error('取消关注新闻失败:', errorMessage);
                return false;
            }
        }
        catch (err) {
            console.error('取消关注新闻异常:', JSON.stringify(err));
            let errorMessage: string = '取消关注失败，请稍后再试';
            if (err instanceof Error) {
                const errMsg: string = err.message;
                if (errMsg.includes('Network')) {
                    errorMessage = '网络连接失败，请检查网络设置';
                }
                else if (errMsg.includes('Timeout')) {
                    errorMessage = '请求超时，请检查网络连接';
                }
                else if (errMsg.includes('403')) {
                    errorMessage = '没有权限，请重新登录';
                }
                else if (errMsg.includes('401')) {
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
     * 快捷方法：关注新闻（包含作者信息）
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
