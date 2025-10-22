import { HttpUtils } from "@bundle:com.huawei.quickstart/default@utils/Index";
import { withBase } from "@bundle:com.huawei.quickstart/default@utils/Index";
import type { JwtPayload } from "@bundle:com.huawei.quickstart/default@utils/Index";
import type { FavoriteNews, FavoriteNewsRequest, FavoriteNewsResult } from '../model/FavoriteNews';
/**
 * HTTP请求头类型
 */
type HttpHeaders = Record<string, string>;
/**
 * 表单数据接口
 */
interface FormData {
    newsTitle: string;
    newsUniquekey: string;
    newsAuthor: string;
    newsTime: string;
}
/**
 * 通用API响应接口
 */
interface ApiResponse {
    code: number;
    message: string;
    data?: string | object | null;
}
/**
 * 收藏新闻服务类
 */
export class FavoriteNewsService {
    private static readonly FOLLOW_URL = '/api/news/follow';
    private static readonly FOLLOWED_URL = '/api/news/followed';
    private static readonly UNFOLLOW_URL = '/api/news/unfollow';
    /**
     * 收藏新闻
     * @param token JWT令牌
     * @param request 收藏请求参数
     * @param retryCount 重试次数（内部使用）
     * @returns Promise<boolean> 是否成功
     */
    static async followNews(token: string, request: FavoriteNewsRequest, retryCount: number = 0): Promise<boolean> {
        try {
            console.log('🔍 [FavoriteNewsService.followNews] ========== 开始收藏新闻 ==========');
            console.log('🔍 [FavoriteNewsService.followNews] 当前时间戳:', Date.now());
            console.log('🔍 [FavoriteNewsService.followNews] Token长度:', token.length);
            console.log('🔍 [FavoriteNewsService.followNews] Token前10个字符:', token.substring(0, 10));
            console.log('🔍 [FavoriteNewsService.followNews] Token后10个字符:', token.substring(token.length - 10));
            console.log('🔍 [FavoriteNewsService.followNews] Token是否包含Bearer:', token.startsWith('Bearer'));
            console.log('🔍 [FavoriteNewsService.followNews] Token完整内容:', token);
            // 检查Token是否过期
            const JwtUtilModule = await import("@bundle:com.huawei.quickstart/default@utils/Index");
            const JwtUtil = JwtUtilModule.JwtUtil;
            const isExpired = JwtUtil.isTokenExpired(token);
            const remainingTime = JwtUtil.getRemainingTime(token);
            const userId = JwtUtil.getUserIdFromToken(token);
            console.log('🔍 [FavoriteNewsService.followNews] Token是否过期:', isExpired);
            console.log('🔍 [FavoriteNewsService.followNews] Token剩余时间(秒):', remainingTime);
            console.log('🔍 [FavoriteNewsService.followNews] 从Token解析的用户ID:', userId);
            if (isExpired) {
                console.error('❌ [FavoriteNewsService.followNews] Token已过期，无法执行收藏操作');
                return false;
            }
            if (!userId) {
                console.error('❌ [FavoriteNewsService.followNews] 无法从Token中解析用户ID，Token可能无效');
                return false;
            }
            // 解码JWT Token以查看内容
            try {
                const payload: JwtPayload | null = JwtUtil.parseJwt(token);
                console.log('🔍 [FavoriteNewsService.followNews] JWT载荷内容:', JSON.stringify(payload));
                // 详细分析JWT结构
                const tokenParts: string[] = token.split('.');
                console.log('🔍 [FavoriteNewsService.followNews] JWT部分数量:', tokenParts.length);
                console.log('🔍 [FavoriteNewsService.followNews] JWT Header:', tokenParts[0]);
                console.log('🔍 [FavoriteNewsService.followNews] JWT Payload:', tokenParts[1]);
                console.log('🔍 [FavoriteNewsService.followNews] JWT Signature:', tokenParts[2]);
                // 检查时间戳
                const currentTime: number = Math.floor(Date.now() / 1000);
                console.log('🔍 [FavoriteNewsService.followNews] 当前时间戳:', currentTime);
                console.log('🔍 [FavoriteNewsService.followNews] JWT签发时间:', payload?.iat);
                console.log('🔍 [FavoriteNewsService.followNews] JWT过期时间:', payload?.exp);
                console.log('🔍 [FavoriteNewsService.followNews] 时间差(秒):', currentTime - (payload?.iat || 0));
            }
            catch (e) {
                console.error('❌ [FavoriteNewsService.followNews] JWT解析失败:', e);
            }
            // 确保token格式正确：如果token已经包含Bearer，不要重复添加
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            const url = withBase(FavoriteNewsService.FOLLOW_URL);
            const headers: HttpHeaders = {
                'Authorization': authToken
                // Content-Type将由HttpUtils.postForm自动设置为application/x-www-form-urlencoded
            };
            console.log('🔍 [FavoriteNewsService.followNews] ========== 请求详情 ==========');
            console.log('🔍 [FavoriteNewsService.followNews] 请求URL:', url);
            console.log('🔍 [FavoriteNewsService.followNews] 请求方法: POST');
            console.log('🔍 [FavoriteNewsService.followNews] 请求头数量:', Object.keys(headers).length);
            console.log('🔍 [FavoriteNewsService.followNews] 最终请求头 Authorization:', headers['Authorization'].substring(0, 30) + '...');
            console.log('🔍 [FavoriteNewsService.followNews] 完整请求头:', JSON.stringify(headers, null, 2));
            // 将时间格式转换为ISO格式（服务器端期望的格式）
            const isoTime = request.newsTime ? request.newsTime.replace(' ', 'T') : '';
            const formData: FormData = {
                newsTitle: request.newsTitle,
                newsUniquekey: request.newsUniquekey,
                newsAuthor: String(request.newsAuthor ?? ''),
                newsTime: isoTime
            };
            console.log('🔍 [FavoriteNewsService.followNews] 请求参数数量:', Object.keys(formData).length);
            console.log('🔍 [FavoriteNewsService.followNews] 请求参数详情:', JSON.stringify(formData, null, 2));
            console.log('🔍 [FavoriteNewsService.followNews] 新闻标题长度:', request.newsTitle.length);
            console.log('🔍 [FavoriteNewsService.followNews] 新闻唯一标识长度:', request.newsUniquekey.length);
            console.log('🔍 [FavoriteNewsService.followNews] ================================');
            // 测试JWT与服务器端的一致性
            console.log('🔍 [FavoriteNewsService.followNews] 开始测试JWT一致性');
            const isJwtConsistent = await FavoriteNewsService.testJwtConsistency(token);
            if (!isJwtConsistent) {
                console.error('❌ [FavoriteNewsService.followNews] JWT与服务器端不一致，可能的原因:');
                console.error('❌ [FavoriteNewsService.followNews] 1. 服务器端JWT secret已更改');
                console.error('❌ [FavoriteNewsService.followNews] 2. 服务器端JWT解析器配置错误');
                console.error('❌ [FavoriteNewsService.followNews] 3. 服务器端应用重启后配置丢失');
                console.error('❌ [FavoriteNewsService.followNews] 建议: 重新登录获取新的JWT Token');
                return false;
            }
            console.log('✅ [FavoriteNewsService.followNews] JWT与服务器端一致，继续执行收藏操作');
            try {
                // 使用表单数据发送POST请求
                console.log('🔍 [FavoriteNewsService.followNews] 使用表单数据发送POST请求');
                console.log('🔍 [FavoriteNewsService.followNews] 请求URL:', url);
                console.log('🔍 [FavoriteNewsService.followNews] 表单数据:', JSON.stringify(formData));
                // 使用HttpUtils.postForm方法发送表单数据
                const response = await HttpUtils.postForm(url, formData, headers);
                const result: FavoriteNewsResult = JSON.parse(response);
                console.log('🔍 [FavoriteNewsService.followNews] 响应结果:', JSON.stringify(result));
                return result.code === 200;
            }
            catch (httpError) {
                console.error('❌ [FavoriteNewsService.followNews] ========== HTTP请求失败 ==========');
                console.error('❌ [FavoriteNewsService.followNews] 错误时间戳:', Date.now());
                console.error('❌ [FavoriteNewsService.followNews] 错误类型:', typeof httpError);
                console.error('❌ [FavoriteNewsService.followNews] 错误构造函数:', httpError?.constructor?.name);
                console.error('❌ [FavoriteNewsService.followNews] 错误消息:', httpError?.message);
                console.error('❌ [FavoriteNewsService.followNews] 错误堆栈:', httpError?.stack);
                console.error('❌ [FavoriteNewsService.followNews] 完整错误对象:', JSON.stringify(httpError, null, 2));
                // 现在HttpUtils已经修复，可以获取详细的错误信息
                if (httpError instanceof Error) {
                    console.error('❌ [FavoriteNewsService.followNews] 错误详情:', httpError.message);
                    if (httpError.message.includes('403')) {
                        console.error('❌ [FavoriteNewsService.followNews] ========== 403错误分析 ==========');
                        console.error('❌ [FavoriteNewsService.followNews] 服务器返回403，可能是JWT验证失败');
                        console.error('❌ [FavoriteNewsService.followNews] 可能原因:');
                        console.error('❌ [FavoriteNewsService.followNews] 1. JWT签名验证失败');
                        console.error('❌ [FavoriteNewsService.followNews] 2. JWT已过期');
                        console.error('❌ [FavoriteNewsService.followNews] 3. 服务器端JWT secret配置错误');
                        console.error('❌ [FavoriteNewsService.followNews] 4. 请求被Spring Security拦截');
                        console.error('❌ [FavoriteNewsService.followNews] 5. 服务器端JWT解析器配置错误');
                        console.error('❌ [FavoriteNewsService.followNews] 请检查Token是否有效或服务器配置');
                        console.error('❌ [FavoriteNewsService.followNews] 完整错误信息:', httpError.message);
                        console.error('❌ [FavoriteNewsService.followNews] ================================');
                    }
                    else if (httpError.message.includes('502')) {
                        console.error('❌ [FavoriteNewsService.followNews] 服务器返回502，可能是服务器暂时不可用');
                        console.error('❌ [FavoriteNewsService.followNews] 建议稍后重试或检查服务器状态');
                        // 如果是502错误且重试次数小于2，则重试
                        if (retryCount < 2) {
                            console.log(`🔄 [FavoriteNewsService.followNews] 准备重试，当前重试次数: ${retryCount + 1}`);
                            // 等待1秒后重试
                            await new Promise<void>(resolve => setTimeout(resolve, 1000));
                            return FavoriteNewsService.followNews(token, request, retryCount + 1);
                        }
                    }
                }
                console.error('❌ [FavoriteNewsService.followNews] ================================');
                return false;
            }
        }
        catch (error) {
            console.error('❌ [FavoriteNewsService.followNews] 收藏失败:', error);
            return false;
        }
    }
    /**
     * 获取用户收藏的新闻列表
     * @param token JWT令牌
     * @returns Promise<FavoriteNews[]> 收藏的新闻列表
     */
    static async getFollowedNews(token: string): Promise<FavoriteNews[]> {
        try {
            console.log('🔍 [FavoriteNewsService.getFollowedNews] 开始获取收藏列表');
            console.log('🔍 [FavoriteNewsService.getFollowedNews] Token前10个字符:', token.substring(0, 10));
            console.log('🔍 [FavoriteNewsService.getFollowedNews] Token后10个字符:', token.substring(token.length - 10));
            console.log('🔍 [FavoriteNewsService.getFollowedNews] Token是否包含Bearer:', token.startsWith('Bearer'));
            // 如果token已经包含Bearer，不要重复添加
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            const url = withBase(FavoriteNewsService.FOLLOWED_URL);
            const headers: HttpHeaders = {
                'Authorization': authToken
            };
            console.log('🔍 [FavoriteNewsService.getFollowedNews] 最终请求头 Authorization:', headers['Authorization'].substring(0, 30) + '...');
            console.log('🔍 [FavoriteNewsService.getFollowedNews] 请求URL:', url);
            try {
                const response = await HttpUtils.get(url, headers);
                const result: FavoriteNewsResult = JSON.parse(response);
                console.log('🔍 [FavoriteNewsService.getFollowedNews] 响应结果:', JSON.stringify(result));
                if (result.code === 200 && result.data) {
                    return result.data;
                }
                return [];
            }
            catch (httpError) {
                console.error('❌ [FavoriteNewsService.getFollowedNews] HTTP请求失败:', httpError);
                if (httpError instanceof Error) {
                    console.error('❌ [FavoriteNewsService.getFollowedNews] 错误详情:', httpError.message);
                }
                return [];
            }
        }
        catch (error) {
            console.error('❌ [FavoriteNewsService.getFollowedNews] 获取收藏列表失败:', error);
            return [];
        }
    }
    /**
     * 测试JWT Token与服务器端的一致性
     * @param token JWT令牌
     * @returns Promise<boolean> Token是否与服务器端一致
     */
    static async testJwtConsistency(token: string): Promise<boolean> {
        try {
            console.log('🔍 [FavoriteNewsService.testJwtConsistency] 开始测试JWT一致性');
            // 使用登录接口测试JWT是否有效
            const loginUrl = withBase('/api/users/info');
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            const headers: HttpHeaders = {
                'Authorization': authToken
            };
            console.log('🔍 [FavoriteNewsService.testJwtConsistency] 测试URL:', loginUrl);
            console.log('🔍 [FavoriteNewsService.testJwtConsistency] 测试请求头:', JSON.stringify(headers));
            try {
                const response = await HttpUtils.get(loginUrl, headers);
                const result: ApiResponse = JSON.parse(response);
                console.log('🔍 [FavoriteNewsService.testJwtConsistency] 测试响应:', JSON.stringify(result));
                return result.code === 200;
            }
            catch (httpError) {
                console.error('❌ [FavoriteNewsService.testJwtConsistency] HTTP请求失败:', httpError);
                if (httpError instanceof Error) {
                    console.error('❌ [FavoriteNewsService.testJwtConsistency] 错误详情:', httpError.message);
                }
                return false;
            }
        }
        catch (error) {
            console.error('❌ [FavoriteNewsService.testJwtConsistency] JWT一致性测试失败:', error);
            return false;
        }
    }
    /**
     * 测试Token有效性（调用获取收藏列表接口）
     * @param token JWT令牌
     * @returns Promise<boolean> Token是否有效
     */
    static async testTokenValidity(token: string): Promise<boolean> {
        try {
            console.log('🔍 [FavoriteNewsService.testTokenValidity] 开始测试Token有效性');
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            const url = withBase(FavoriteNewsService.FOLLOWED_URL);
            const headers: HttpHeaders = {
                'Authorization': authToken
            };
            console.log('🔍 [FavoriteNewsService.testTokenValidity] 测试URL:', url);
            console.log('🔍 [FavoriteNewsService.testTokenValidity] 测试请求头:', JSON.stringify(headers));
            try {
                const response = await HttpUtils.get(url, headers);
                const result: FavoriteNewsResult = JSON.parse(response);
                console.log('🔍 [FavoriteNewsService.testTokenValidity] 测试响应:', JSON.stringify(result));
                return result.code === 200;
            }
            catch (httpError) {
                console.error('❌ [FavoriteNewsService.testTokenValidity] HTTP请求失败:', httpError);
                if (httpError instanceof Error) {
                    console.error('❌ [FavoriteNewsService.testTokenValidity] 错误详情:', httpError.message);
                }
                return false;
            }
        }
        catch (error) {
            console.error('❌ [FavoriteNewsService.testTokenValidity] Token测试失败:', error);
            return false;
        }
    }
    /**
     * 取消收藏新闻
     * @param token JWT令牌
     * @param newsUniquekey 新闻唯一标识
     * @returns Promise<boolean> 是否成功
     */
    static async unfollowNews(token: string, newsUniquekey: string): Promise<boolean> {
        try {
            console.log('🔍 [FavoriteNewsService.unfollowNews] 开始取消收藏新闻');
            console.log('🔍 [FavoriteNewsService.unfollowNews] Token前10个字符:', token.substring(0, 10));
            console.log('🔍 [FavoriteNewsService.unfollowNews] Token后10个字符:', token.substring(token.length - 10));
            console.log('🔍 [FavoriteNewsService.unfollowNews] Token是否包含Bearer:', token.startsWith('Bearer'));
            // 如果token已经包含Bearer，不要重复添加
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            const url = withBase(`${FavoriteNewsService.UNFOLLOW_URL}?newsUniquekey=${encodeURIComponent(newsUniquekey)}`);
            const headers: HttpHeaders = {
                'Authorization': authToken
            };
            console.log('🔍 [FavoriteNewsService.unfollowNews] 最终请求头 Authorization:', headers['Authorization'].substring(0, 30) + '...');
            console.log('🔍 [FavoriteNewsService.unfollowNews] 请求URL:', url);
            try {
                const response = await HttpUtils.delete(url, headers);
                const result: FavoriteNewsResult = JSON.parse(response);
                console.log('🔍 [FavoriteNewsService.unfollowNews] 响应结果:', JSON.stringify(result));
                return result.code === 200;
            }
            catch (httpError) {
                console.error('❌ [FavoriteNewsService.unfollowNews] HTTP请求失败:', httpError);
                if (httpError instanceof Error) {
                    console.error('❌ [FavoriteNewsService.unfollowNews] 错误详情:', httpError.message);
                }
                return false;
            }
        }
        catch (error) {
            console.error('❌ [FavoriteNewsService.unfollowNews] 取消收藏失败:', error);
            return false;
        }
    }
}
