import preferences from "@ohos:data.preferences";
import util from "@ohos:util";
/**
 * JWT Token 载荷接口
 * 定义 JWT Token 解析后的数据结构
 */
export interface JwtPayload {
    /** 用户ID */
    userId?: string;
    /** 用户手机号 */
    userPhone?: string;
    /** 用户名 */
    userName?: string;
    /** 签发时间（秒级时间戳） */
    iat?: number;
    /** 过期时间（秒级时间戳） */
    exp?: number;
    /** 主题 */
    sub?: string;
    /** 签发者 */
    iss?: string;
    /** 受众 */
    aud?: string;
}
/**
 * JWT Token 信息接口
 */
export interface JwtTokenInfo {
    /** 原始 token 字符串 */
    token: string;
    /** 解析后的载荷信息 */
    payload: JwtPayload;
    /** token 是否有效 */
    isValid: boolean;
    /** token 是否过期 */
    isExpired: boolean;
    /** 过期时间（Date 对象） */
    expirationDate: Date | null;
}
/**
 * 用户 Token 信息接口
 * 从 JWT Token 中提取的用户信息
 */
export interface UserTokenInfo {
    /** 用户ID */
    userId?: string;
    /** 用户手机号 */
    userPhone?: string;
    /** 用户名 */
    userName?: string;
}
/**
 * JWT 管理器
 * 负责 JWT Token 的存储、获取、解析和验证
 */
export class JwtManager {
    private static instance: JwtManager | null = null;
    private dataPreferences: preferences.Preferences | null = null;
    /** Preferences 存储名称 */
    private readonly PREFERENCES_NAME: string = 'jwt_storage';
    /** JWT Token 存储键 */
    private readonly JWT_TOKEN_KEY: string = 'jwt_token';
    /** Token 刷新时间存储键（可选） */
    private readonly TOKEN_REFRESH_TIME_KEY: string = 'token_refresh_time';
    /** 缓存的 token */
    private cachedToken: string | null = null;
    /** 缓存的 payload */
    private cachedPayload: JwtPayload | null = null;
    private constructor() {
    }
    /**
     * 获取单例实例
     */
    public static getInstance(): JwtManager {
        if (!JwtManager.instance) {
            JwtManager.instance = new JwtManager();
        }
        return JwtManager.instance;
    }
    /**
     * 初始化 Preferences 数据存储
     */
    public async initPreferences(): Promise<void> {
        try {
            console.log('🔍 [JwtManager.initPreferences] 开始初始化...');
            console.log('🔍 [JwtManager.initPreferences] 当前 dataPreferences:', this.dataPreferences);
            if (!this.dataPreferences) {
                console.log('🔍 [JwtManager.initPreferences] 获取 context...');
                const context = getContext();
                console.log('🔍 [JwtManager.initPreferences] Context:', context);
                console.log('🔍 [JwtManager.initPreferences] Preferences 名称:', this.PREFERENCES_NAME);
                this.dataPreferences = await preferences.getPreferences(context, this.PREFERENCES_NAME);
                console.log('✅ [JwtManager.initPreferences] Preferences 初始化成功');
                console.log('🔍 [JwtManager.initPreferences] dataPreferences:', this.dataPreferences);
            }
            else {
                console.log('✅ [JwtManager.initPreferences] Preferences 已经初始化过');
            }
        }
        catch (err) {
            console.error('❌ [JwtManager.initPreferences] 初始化 Preferences 失败:', err);
            if (err instanceof Error) {
                console.error('❌ [JwtManager.initPreferences] 错误消息:', err.message);
                console.error('❌ [JwtManager.initPreferences] 错误堆栈:', err.stack);
            }
            throw new Error('JWT 存储初始化失败');
        }
    }
    /**
     * 存储 JWT Token
     * @param token JWT Token 字符串
     * @returns 是否存储成功
     */
    public async saveToken(token: string): Promise<boolean> {
        console.log('🔍 [JwtManager.saveToken] 开始保存 Token...');
        console.log('🔍 [JwtManager.saveToken] Token 类型:', typeof token);
        console.log('🔍 [JwtManager.saveToken] Token 是否为空:', !token);
        if (!token || typeof token !== 'string' || token.trim() === '') {
            console.error('❌ [JwtManager.saveToken] 无效的 token');
            return false;
        }
        console.log('🔍 [JwtManager.saveToken] Token 长度:', token.length);
        console.log('🔍 [JwtManager.saveToken] dataPreferences 存在:', !!this.dataPreferences);
        if (!this.dataPreferences) {
            console.log('🔍 [JwtManager.saveToken] Preferences 未初始化，开始初始化...');
            await this.initPreferences();
        }
        try {
            console.log('🔍 [JwtManager.saveToken] 开始写入 Token 到 Preferences...');
            console.log('🔍 [JwtManager.saveToken] 存储键:', this.JWT_TOKEN_KEY);
            // 存储 token
            await this.dataPreferences?.put(this.JWT_TOKEN_KEY, token);
            console.log('✅ [JwtManager.saveToken] Token 已写入');
            // 存储刷新时间
            await this.dataPreferences?.put(this.TOKEN_REFRESH_TIME_KEY, Date.now());
            console.log('✅ [JwtManager.saveToken] 刷新时间已写入');
            // 持久化
            await this.dataPreferences?.flush();
            console.log('✅ [JwtManager.saveToken] flush 完成');
            // 更新缓存
            this.cachedToken = token;
            this.cachedPayload = this.parseJwtPayload(token);
            console.log('✅ [JwtManager.saveToken] 缓存已更新');
            console.log('✅ [JwtManager.saveToken] Token 存储成功');
            return true;
        }
        catch (err) {
            console.error('❌ [JwtManager.saveToken] 存储 token 失败:', err);
            if (err instanceof Error) {
                console.error('❌ [JwtManager.saveToken] 错误消息:', err.message);
                console.error('❌ [JwtManager.saveToken] 错误堆栈:', err.stack);
            }
            return false;
        }
    }
    /**
     * 获取存储的 JWT Token
     * @returns JWT Token 字符串，不存在则返回 null
     */
    public async getToken(): Promise<string | null> {
        console.log('🔍 [JwtManager.getToken] 开始获取 Token...');
        console.log('🔍 [JwtManager.getToken] 缓存的 Token:', this.cachedToken ? '存在' : 'null');
        // 优先返回缓存
        if (this.cachedToken) {
            console.log('✅ [JwtManager.getToken] 从缓存返回 Token，长度:', this.cachedToken.length);
            return this.cachedToken;
        }
        console.log('🔍 [JwtManager.getToken] dataPreferences 存在:', !!this.dataPreferences);
        if (!this.dataPreferences) {
            console.log('🔍 [JwtManager.getToken] Preferences 未初始化，开始初始化...');
            await this.initPreferences();
        }
        try {
            console.log('🔍 [JwtManager.getToken] 从 Preferences 读取 Token...');
            console.log('🔍 [JwtManager.getToken] 存储键:', this.JWT_TOKEN_KEY);
            const token = await this.dataPreferences?.get(this.JWT_TOKEN_KEY, '');
            console.log('🔍 [JwtManager.getToken] 读取结果类型:', typeof token);
            console.log('🔍 [JwtManager.getToken] 读取结果长度:', typeof token === 'string' ? token.length : 0);
            if (token && typeof token === 'string' && token !== '') {
                this.cachedToken = token;
                console.log('✅ [JwtManager.getToken] Token 获取成功并更新缓存');
                return token;
            }
            console.warn('⚠️ [JwtManager.getToken] Token 不存在或为空');
            return null;
        }
        catch (err) {
            console.error('❌ [JwtManager.getToken] 获取 token 失败:', err);
            if (err instanceof Error) {
                console.error('❌ [JwtManager.getToken] 错误消息:', err.message);
                console.error('❌ [JwtManager.getToken] 错误堆栈:', err.stack);
            }
            return null;
        }
    }
    /**
     * 删除存储的 JWT Token
     * @returns 是否删除成功
     */
    public async removeToken(): Promise<boolean> {
        if (!this.dataPreferences) {
            await this.initPreferences();
        }
        try {
            await this.dataPreferences?.delete(this.JWT_TOKEN_KEY);
            await this.dataPreferences?.delete(this.TOKEN_REFRESH_TIME_KEY);
            await this.dataPreferences?.flush();
            // 清空缓存
            this.cachedToken = null;
            this.cachedPayload = null;
            console.log('JwtManager: Token 删除成功');
            return true;
        }
        catch (err) {
            console.error('JwtManager: 删除 token 失败:', err);
            return false;
        }
    }
    /**
     * 解析 JWT Token 的 Payload 部分
     * JWT 格式: header.payload.signature
     * @param token JWT Token 字符串
     * @returns 解析后的 Payload 对象，解析失败返回空对象
     */
    private parseJwtPayload(token: string): JwtPayload {
        try {
            // JWT 由三部分组成，用 . 分隔
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('JwtManager: JWT 格式无效，应该包含3部分');
                const emptyPayload: JwtPayload = {};
                return emptyPayload;
            }
            // 获取 payload 部分（第二部分）
            const payloadBase64 = parts[1];
            // Base64 解码
            const payloadStr = this.base64UrlDecode(payloadBase64);
            // 解析 JSON
            const payload: JwtPayload = JSON.parse(payloadStr) as JwtPayload;
            console.log('JwtManager: JWT Payload 解析成功:', payload);
            return payload;
        }
        catch (err) {
            console.error('JwtManager: 解析 JWT Payload 失败:', err);
            const emptyPayload: JwtPayload = {};
            return emptyPayload;
        }
    }
    /**
     * Base64 URL 解码
     * @param base64Url Base64 URL 编码的字符串
     * @returns 解码后的字符串
     */
    private base64UrlDecode(base64Url: string): string {
        try {
            // Base64 URL 使用 - 和 _ 替换了 + 和 /
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            // 补齐 padding
            const padding = base64.length % 4;
            if (padding > 0) {
                base64 += '='.repeat(4 - padding);
            }
            // 使用 util.Base64Helper 进行解码
            const decoder = new util.Base64Helper();
            const uint8Array = decoder.decodeSync(base64);
            // 将 Uint8Array 转换为字符串
            const textDecoder = util.TextDecoder.create('utf-8', { ignoreBOM: true });
            const decodedStr = textDecoder.decodeWithStream(uint8Array, { stream: false });
            return decodedStr;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Base64 解码失败';
            console.error('JwtManager: Base64 解码失败:', err);
            throw new Error(`JWT Base64 解码失败: ${errorMessage}`);
        }
    }
    /**
     * 获取 JWT Token 的 Payload
     * @returns Payload 对象，不存在或解析失败返回 null
     */
    public async getPayload(): Promise<JwtPayload | null> {
        // 优先返回缓存
        if (this.cachedPayload) {
            return this.cachedPayload;
        }
        const token = await this.getToken();
        if (!token) {
            return null;
        }
        const payload = this.parseJwtPayload(token);
        if (Object.keys(payload).length === 0) {
            return null;
        }
        this.cachedPayload = payload;
        return payload;
    }
    /**
     * 检查 Token 是否过期
     * @returns true 表示已过期，false 表示未过期，null 表示无法判断
     */
    public async isTokenExpired(): Promise<boolean | null> {
        const payload = await this.getPayload();
        if (!payload || !payload.exp) {
            console.warn('JwtManager: 无法获取 token 过期时间');
            return null;
        }
        // exp 是秒级时间戳，需要转换为毫秒
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const isExpired = currentTime >= expirationTime;
        console.log(`JwtManager: Token ${isExpired ? '已过期' : '未过期'}`);
        return isExpired;
    }
    /**
     * 检查 Token 是否有效（存在且未过期）
     * @returns true 表示有效，false 表示无效
     */
    public async isTokenValid(): Promise<boolean> {
        const token = await this.getToken();
        if (!token) {
            console.log('JwtManager: Token 不存在');
            return false;
        }
        const isExpired = await this.isTokenExpired();
        if (isExpired === null) {
            // 无法判断过期时间，认为 token 无效
            console.warn('JwtManager: 无法判断 token 有效性');
            return false;
        }
        const isValid = !isExpired;
        console.log(`JwtManager: Token ${isValid ? '有效' : '无效'}`);
        return isValid;
    }
    /**
     * 获取 Token 过期时间
     * @returns Date 对象，不存在返回 null
     */
    public async getExpirationDate(): Promise<Date | null> {
        const payload = await this.getPayload();
        if (!payload || !payload.exp) {
            return null;
        }
        // exp 是秒级时间戳，需要转换为毫秒
        return new Date(payload.exp * 1000);
    }
    /**
     * 获取 Token 剩余有效时间（毫秒）
     * @returns 剩余时间（毫秒），已过期返回 0，无法判断返回 null
     */
    public async getTimeToExpiration(): Promise<number | null> {
        const expirationDate = await this.getExpirationDate();
        if (!expirationDate) {
            return null;
        }
        const remainingTime = expirationDate.getTime() - Date.now();
        return remainingTime > 0 ? remainingTime : 0;
    }
    /**
     * 获取完整的 Token 信息
     * @returns JwtTokenInfo 对象，不存在返回 null
     */
    public async getTokenInfo(): Promise<JwtTokenInfo | null> {
        const token = await this.getToken();
        if (!token) {
            return null;
        }
        const payload = await this.getPayload();
        if (!payload) {
            return null;
        }
        const isExpired = await this.isTokenExpired();
        const expirationDate = await this.getExpirationDate();
        const tokenInfo: JwtTokenInfo = {
            token: token,
            payload: payload,
            isValid: isExpired === false,
            isExpired: isExpired === true,
            expirationDate: expirationDate
        };
        return tokenInfo;
    }
    /**
     * 获取认证请求头
     * @returns 包含 Authorization 的请求头对象
     */
    public async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await this.getToken();
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
    /**
     * 从 Payload 中获取用户信息
     * @returns 用户信息对象，不存在返回 null
     */
    public async getUserInfoFromToken(): Promise<UserTokenInfo | null> {
        const payload = await this.getPayload();
        if (!payload) {
            return null;
        }
        return {
            userId: payload.userId,
            userPhone: payload.userPhone,
            userName: payload.userName
        };
    }
    /**
     * 清除所有缓存
     */
    public clearCache(): void {
        this.cachedToken = null;
        this.cachedPayload = null;
        console.log('JwtManager: 缓存已清除');
    }
}
