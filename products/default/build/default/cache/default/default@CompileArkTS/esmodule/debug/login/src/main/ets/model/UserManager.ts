import preferences from "@ohos:data.preferences";
import promptAction from "@ohos:promptAction";
import { HttpUtils, withBase, type ResultShape } from "@bundle:com.huawei.quickstart/default@utils/Index";
import { JwtManager } from "@bundle:com.huawei.quickstart/default@login/ets/model/JwtManager";
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
    private readonly PREFERENCES_NAME: string = 'user_data';
    private readonly USER_KEY: string = 'user_info';
    private readonly CURRENT_USER_KEY: string = 'current_user';
    private jwtManager: JwtManager;
    private constructor() {
        this.jwtManager = JwtManager.getInstance();
    }
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
            // 同时初始化 JWT 管理器
            await this.jwtManager.initPreferences();
        }
        catch (err) {
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
            const form: LoginRequest = {
                userPhone: account,
                userPassword: password
            };
            const respText = await HttpUtils.postForm(url, form);
            const resp: ResultShape<string> = JSON.parse(respText) as ResultShape<string>;
            if (resp.code === 200 && resp.data) {
                const token = resp.data;
                // 使用 JwtManager 存储 token
                await this.jwtManager.saveToken(token);
                const currentUser: UserInfo = { account: account, password: '', username: `用户${account.slice(-4)}` };
                await this.dataPreferences?.put(this.CURRENT_USER_KEY, JSON.stringify(currentUser));
                await this.dataPreferences?.flush();
                promptAction.showToast({ message: { "id": 16777295, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" } });
                return true;
            }
            // 新增：根据不同的错误码提供具体的错误提示
            let errorMessage = resp.message ?? '登录失败';
            if (resp.code === 400) {
                errorMessage = '请求参数错误，请检查输入';
            }
            else if (resp.code === 401) {
                errorMessage = '用户名或密码错误';
            }
            else if (resp.code === 404) {
                errorMessage = '用户不存在，请先注册';
            }
            else if (resp.code === 500) {
                errorMessage = '服务器内部错误，请稍后再试';
            }
            promptAction.showToast({ message: errorMessage });
            return false;
        }
        catch (err) {
            console.error('Failed to login user:', err);
            // 新增：更详细的错误信息
            let errorMessage = '登录失败，请稍后再试';
            if (err instanceof Error && err.message.includes('Network')) {
                errorMessage = '网络连接失败，请检查网络设置';
            }
            else if (err instanceof Error && err.message.includes('Timeout')) {
                errorMessage = '请求超时，请检查网络连接';
            }
            else if (err instanceof Error && err.message.includes('JSON')) {
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
            console.log('🔍 UserManager.getCurrentUser - 开始获取用户信息');
            console.log('🔍 UserManager.getCurrentUser - 存储键:', this.CURRENT_USER_KEY);
            const userStr = await this.dataPreferences?.get(this.CURRENT_USER_KEY, '');
            console.log('🔍 UserManager.getCurrentUser - 从存储获取的字符串:', userStr);
            console.log('🔍 UserManager.getCurrentUser - 字符串类型:', typeof userStr);
            // 安全地检查字符串长度
            const userStrLength = typeof userStr === 'string' ? userStr.length : 0;
            console.log('🔍 UserManager.getCurrentUser - 字符串长度:', userStrLength);
            if (userStr && typeof userStr === 'string' && userStr !== '') {
                const userInfo: UserInfo = JSON.parse(userStr as string) as UserInfo;
                console.log('🔍 UserManager.getCurrentUser - 解析后的用户信息:', userInfo);
                console.log('🔍 UserManager.getCurrentUser - 用户信息类型:', typeof userInfo);
                return userInfo;
            }
            console.log('🔍 UserManager.getCurrentUser - 没有找到用户信息');
            return null;
        }
        catch (err) {
            console.error('❌ UserManager.getCurrentUser - 获取用户信息失败:', err);
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
            await this.dataPreferences?.flush();
            // 使用 JwtManager 删除 token
            await this.jwtManager.removeToken();
        }
        catch (err) {
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
            const userIndex = allUsers.findIndex((u: UserInfo) => u.account === updatedUser.account);
            if (userIndex !== -1) {
                allUsers[userIndex] = updatedUser;
                await this.dataPreferences?.put(this.USER_KEY, JSON.stringify(allUsers));
                await this.dataPreferences?.put(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
                await this.dataPreferences?.flush();
                return true;
            }
            return false;
        }
        catch (err) {
            console.error('Failed to update user info:', err);
            return false;
        }
    }
    // 获取所有用户（私有方法）
    private async getAllUsers(): Promise<UserInfo[]> {
        try {
            const usersStr = await this.dataPreferences?.get(this.USER_KEY, '[]');
            return JSON.parse(usersStr as string) as UserInfo[];
        }
        catch (err) {
            console.error('Failed to get all users:', err);
            return [];
        }
    }
    // 获取JWT令牌
    public async getToken(): Promise<string | null> {
        // 使用 JwtManager 获取 token
        return await this.jwtManager.getToken();
    }
    // 便捷方法：获取认证请求头
    public async getAuthHeaders(): Promise<Record<string, string>> {
        // 使用 JwtManager 获取认证请求头
        return await this.jwtManager.getAuthHeaders();
    }
    // 检查 Token 是否有效
    public async isTokenValid(): Promise<boolean> {
        return await this.jwtManager.isTokenValid();
    }
    // 获取 Token 信息
    public async getTokenInfo() {
        return await this.jwtManager.getTokenInfo();
    }
    // 获取 JWT 管理器实例
    public getJwtManager(): JwtManager {
        return this.jwtManager;
    }
}
