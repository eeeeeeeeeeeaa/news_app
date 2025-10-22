import promptAction from "@ohos:promptAction";
import { HttpUtils } from "@bundle:com.huawei.quickstart/default@utils/Index";
import preferences from "@ohos:data.preferences";
// 定义API响应类型
interface ApiResult<T> {
    code: number;
    message: string;
    data: T | null;
}
interface LoginFormData {
    userPhone: string;
    userPassword: string;
}
interface LoginResponse {
    code: number;
    message: string;
    data?: string; // jwt token
}
interface UserInfo {
    account: string;
    password: string;
    username: string;
}
/**
 * 认证服务（包含登录和注册）
 */
export class AuthService {
    private static instance: AuthService | null = null; //单例模式
    private constructor() { }
    /**
     * 获取单例实例
     */
    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    //登录方法
    async login(phone: string, password: string): Promise<boolean> {
        try {
            const url = 'http://hmos.w1.luyouxia.net/api/users/login';
            const formData: LoginFormData = {
                userPhone: phone,
                userPassword: password
            };
            // 发送POST请求
            const respText = await HttpUtils.postForm(url, formData);
            // 解析响应
            const resp: LoginResponse = JSON.parse(respText) as LoginResponse;
            if (resp.code === 200 && resp.data) {
                // 登录成功，保存jwt和用户信息
                await this.saveJWT(resp.data); //存token
                await this.saveUserInfo(phone, resp.data);
                promptAction.showToast({ message: '登录成功' });
                console.log('登录成功');
                return true;
            }
            else {
                promptAction.showToast({ message: `登录失败: ${resp.message}` });
                return false;
            }
        }
        catch (err) {
            console.error('登录请求失败:', err);
            const errorMessage = err instanceof Error ? err.message : '未知错误';
            promptAction.showToast({ message: `请求异常: ${errorMessage}` });
            return false;
        }
    }
    // 保存jwt到本地存储,用户首选项
    private async saveJWT(token: string): Promise<void> {
        try {
            // 统一写入 user_data/auth_token
            const pref = await preferences.getPreferences(getContext(), 'user_data');
            await pref.put('auth_token', token);
            await pref.flush(); //相当于保存
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('保存jwt失败:', errorMessage);
        }
    }
    /**
     * 保存用户信息到本地存储（简化版本，主要存储JWT）
     * @param phone 手机号
     * @param token JWT令牌
     */
    private async saveUserInfo(phone: string, token: string): Promise<void> {
        try {
            const pref = await preferences.getPreferences(getContext(), 'user_data');
            // 只保存必要的账号信息用于显示，其他信息从jwt中获取
            const userInfo: UserInfo = {
                account: phone,
                password: '',
                username: `用户${phone.slice(-4)}` // 默认用户名，如果有会使用jwt中的
            };
            // 仅保存基本用户信息（jwt 已在 saveJWT 中写入）
            await pref.put('current_user', JSON.stringify(userInfo));
            await pref.flush();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('AuthService.saveUserInfo - 保存用户信息失败:', errorMessage);
        }
    }
    //获取jwt
    async getJWT(): Promise<string | null> {
        try {
            // 优先从统一的新位置读取
            const prefNew = await preferences.getPreferences(getContext(), 'user_data');
            const tokenNew = await prefNew.get('auth_token', '');
            if (tokenNew && tokenNew.toString() !== '') {
                return tokenNew.toString();
            }
            return null;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('获取jwt失败:', errorMessage);
            return null;
        }
    }
    //登出时 清除jwt user_data
    async clearJWT(): Promise<void> {
        try {
            // 清除 user_data 中的 JWT 与用户信息
            const pref = await preferences.getPreferences(getContext(), 'user_data');
            await pref.delete('current_user');
            await pref.delete('auth_token');
            await pref.flush();
            console.log('jwt和用户信息清除成功');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('清除jwt2和用户信息失败:', errorMessage);
        }
    }
}
