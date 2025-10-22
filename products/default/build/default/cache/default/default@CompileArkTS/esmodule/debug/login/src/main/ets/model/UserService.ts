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
    data?: string; // JWT token
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
    private static instance: AuthService | null = null;
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
    /**
     * 用户登录方法
     * @param phone 手机号
     * @param password 密码
     * @returns Promise<boolean> 登录是否成功
     */
    async login(phone: string, password: string): Promise<boolean> {
        try {
            console.log('========== 开始登录请求 ==========');
            console.log('📱 手机号:', phone);
            console.log('🔒 密码:', password ? '***（已设置）' : '（空）');
            const url = 'http://hmos.w1.luyouxia.net/api/users/login';
            console.log('🌐 请求URL:', url);
            const formData: LoginFormData = {
                userPhone: phone,
                userPassword: password
            };
            console.log('📦 登录参数对象:', JSON.stringify(formData));
            console.log('📦 formData.userPhone:', formData.userPhone);
            console.log('📦 formData.userPassword:', formData.userPassword);
            // 发送POST请求
            const respText = await HttpUtils.postForm(url, formData);
            console.log('✅ 响应数据:', respText);
            // 解析响应
            const resp: LoginResponse = JSON.parse(respText) as LoginResponse;
            console.log('解析后的响应:', resp);
            if (resp.code === 200 && resp.data) {
                // 登录成功，保存JWT和用户信息
                await this.saveJWT(resp.data);
                await this.saveUserInfo(phone, resp.data);
                // 调试：校验本地是否写入成功
                try {
                    const pref = await preferences.getPreferences(globalThis.abilityContext, 'user_data');
                    const savedToken = await pref.get('auth_token', '');
                    const savedUser = await pref.get('current_user', '');
                    console.log('🧪 调试: 写入后的 auth_token 是否存在:', !!savedToken);
                    console.log('🧪 调试: 写入后的 current_user:', savedUser);
                }
                catch (e) {
                    console.error('🧪 调试: 读取写入结果失败:', e);
                }
                promptAction.showToast({ message: '登录成功' });
                console.log('✅ 登录成功！');
                return true;
            }
            else {
                promptAction.showToast({ message: `登录失败: ${resp.message}` });
                console.error(`❌ 登录失败！错误码: ${resp.code}, 消息: ${resp.message}`);
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
    /**
     * 保存JWT到本地存储
     * @param token JWT令牌
     */
    private async saveJWT(token: string): Promise<void> {
        try {
            // 统一写入 user_data/auth_token
            const pref = await preferences.getPreferences(getContext(), 'user_data');
            await pref.put('auth_token', token);
            await pref.flush();
            console.log('JWT保存成功');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('保存JWT失败:', errorMessage);
        }
    }
    /**
     * 保存用户信息到本地存储（简化版本，主要存储JWT）
     * @param phone 手机号
     * @param token JWT令牌
     */
    private async saveUserInfo(phone: string, token: string): Promise<void> {
        try {
            console.log('🔍 AuthService.saveUserInfo - 开始保存用户信息');
            const pref = await preferences.getPreferences(getContext(), 'user_data');
            // 只保存必要的账号信息用于显示，其他信息从JWT中获取
            const userInfo: UserInfo = {
                account: phone,
                password: '',
                username: `用户${phone.slice(-4)}` // 临时用户名，实际会从JWT中获取
            };
            console.log('🔍 AuthService.saveUserInfo - 要保存的用户信息:', userInfo);
            // 仅保存基本用户信息（JWT 已在 saveJWT 中写入）
            await pref.put('current_user', JSON.stringify(userInfo));
            await pref.flush();
            console.log('✅ AuthService.saveUserInfo - 用户信息保存成功');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('❌ AuthService.saveUserInfo - 保存用户信息失败:', errorMessage);
        }
    }
    /**
     * 获取保存的JWT
     * @returns Promise<string | null> JWT令牌
     */
    async getJWT(): Promise<string | null> {
        try {
            // 优先从统一的新位置读取
            const prefNew = await preferences.getPreferences(getContext(), 'user_data');
            const tokenNew = await prefNew.get('auth_token', '');
            if (tokenNew && tokenNew.toString() !== '') {
                return tokenNew.toString();
            }
            // 回退读取旧位置并迁移
            const prefOld = await preferences.getPreferences(getContext(), 'user_prefs');
            const tokenOld = await prefOld.get('jwt_token', '');
            const t = tokenOld ? tokenOld.toString() : '';
            if (t !== '') {
                await prefNew.put('auth_token', t);
                await prefNew.flush();
                await prefOld.delete('jwt_token');
                await prefOld.flush();
                return t;
            }
            return null;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('获取JWT失败:', errorMessage);
            return null;
        }
    }
    /**
     * 清除JWT和用户信息（用于登出）
     */
    async clearJWT(): Promise<void> {
        try {
            // 清除 user_data 中的 JWT 与用户信息
            const pref2 = await preferences.getPreferences(getContext(), 'user_data');
            await pref2.delete('current_user');
            await pref2.delete('auth_token');
            await pref2.flush();
            // 兼容：同时清理旧位置
            const pref1 = await preferences.getPreferences(getContext(), 'user_prefs');
            await pref1.delete('jwt_token');
            await pref1.flush();
            console.log('JWT和用户信息清除成功');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            console.error('清除JWT和用户信息失败:', errorMessage);
        }
    }
}
