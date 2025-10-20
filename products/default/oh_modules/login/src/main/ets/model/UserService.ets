// utils/AuthService.ts
import { promptAction } from '@kit.ArkUI';
import { HttpUtils } from 'utils';
import preferences from '@ohos.data.preferences';

// 全局 Token 缓存键（与 UserManager 共用）
const GLOBAL_TOKEN_KEY = 'app_jwt_token';
const GLOBAL_USER_KEY = 'app_current_user';

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

  private constructor() {}

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
        console.log('✅ 登录成功，Token:', resp.data.substring(0, 30) + '...');
        
        // 使用 AppStorage 保存（不需要 Context，跨模块可访问）
        this.saveToAppStorage(phone, resp.data);
        
        // 尝试保存到 Preferences（如果失败也不影响）
        await this.saveJWT(resp.data);
        await this.saveUserInfo(phone, resp.data);
        
        promptAction.showToast({ message: '登录成功' });
        console.log('✅ 登录成功！');
        return true;
      } else {
        promptAction.showToast({ message: `登录失败: ${resp.message}` });
        console.error(`❌ 登录失败！错误码: ${resp.code}, 消息: ${resp.message}`);
        return false;
      }
    } catch (err) {
      console.error('登录请求失败:', err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      promptAction.showToast({ message: `请求异常: ${errorMessage}` });
      return false;
    }
  }

  /**
   * 保存到 AppStorage（全局内存存储，不需要 Context）
   * @param phone 手机号
   * @param token JWT令牌
   */
  private saveToAppStorage(phone: string, token: string): void {
    try {
      console.log('🔍 [AuthService] 开始保存到 AppStorage...');
      
      // 保存 Token
      AppStorage.setOrCreate(GLOBAL_TOKEN_KEY, token);
      console.log('✅ [AuthService] Token 已保存到 AppStorage');
      
      // 保存用户信息
      const userInfo: UserInfo = {
        account: phone,
        password: '',
        username: `用户${phone.slice(-4)}`
      };
      AppStorage.setOrCreate(GLOBAL_USER_KEY, JSON.stringify(userInfo));
      console.log('✅ [AuthService] 用户信息已保存到 AppStorage');
      
      // 验证保存
      const savedToken = AppStorage.get<string>(GLOBAL_TOKEN_KEY);
      console.log('🔍 [AuthService] 验证 Token:', savedToken ? '成功' : '失败');
      
      const savedUser = AppStorage.get<string>(GLOBAL_USER_KEY);
      console.log('🔍 [AuthService] 验证用户信息:', savedUser ? '成功' : '失败');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error('❌ [AuthService] 保存到 AppStorage 失败:', errorMessage);
    }
  }

  /**
   * 保存JWT到本地存储（Preferences，可能因为 Context 问题失败）
   * @param token JWT令牌
   */
  private async saveJWT(token: string): Promise<void> {
    try {
      console.log('🔍 [AuthService] 尝试保存到 Preferences...');
      const pref = await preferences.getPreferences(globalThis.abilityContext, 'user_prefs');
      await pref.put('jwt_token', token);
      await pref.flush();
      console.log('✅ [AuthService] JWT 保存到 Preferences 成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.warn('⚠️ [AuthService] 保存JWT到 Preferences 失败（已保存到 AppStorage）:', errorMessage);
    }
  }

  /**
   * 保存用户信息到本地存储（与UserManager兼容）
   * @param phone 手机号
   * @param token JWT令牌
   */
  private async saveUserInfo(phone: string, token: string): Promise<void> {
    try {
      console.log('🔍 AuthService.saveUserInfo - 开始保存用户信息');
      const pref = await preferences.getPreferences(globalThis.abilityContext, 'user_data');
      const userInfo: UserInfo = {
        account: phone,
        password: '',
        username: `用户${phone.slice(-4)}`
      };
      console.log('🔍 AuthService.saveUserInfo - 要保存的用户信息:', userInfo);
      
      await pref.put('current_user', JSON.stringify(userInfo));
      await pref.put('auth_token', token);
      await pref.flush();
      console.log('✅ AuthService.saveUserInfo - 用户信息保存成功');
    } catch (error) {
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
      console.log('🔍 [AuthService.getJWT] 开始获取 Token...');
      
      // 先从 AppStorage 获取（最可靠）
      const appToken = AppStorage.get<string>(GLOBAL_TOKEN_KEY);
      if (appToken && typeof appToken === 'string' && appToken !== '') {
        console.log('✅ [AuthService.getJWT] 从 AppStorage 获取成功');
        return appToken;
      }
      console.log('⚠️ [AuthService.getJWT] AppStorage 中没有 Token');
      
      // 尝试从 Preferences 获取
      const pref = await preferences.getPreferences(globalThis.abilityContext, 'user_prefs');
      const token = await pref.get('jwt_token', '');
      if (token && token !== '') {
        console.log('✅ [AuthService.getJWT] 从 Preferences 获取成功');
        return token.toString();
      }
      
      console.log('⚠️ [AuthService.getJWT] 未找到 Token');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error('❌ [AuthService.getJWT] 获取JWT失败:', errorMessage);
      return null;
    }
  }

  /**
   * 清除JWT和用户信息（用于登出）
   */
  async clearJWT(): Promise<void> {
    try {
      console.log('🔍 [AuthService] 开始清除登录信息...');
      
      // 清除 AppStorage
      AppStorage.delete(GLOBAL_TOKEN_KEY);
      AppStorage.delete(GLOBAL_USER_KEY);
      console.log('✅ [AuthService] AppStorage 已清除');
      
      // 尝试清除 Preferences
      try {
        const pref1 = await preferences.getPreferences(globalThis.abilityContext, 'user_prefs');
        await pref1.delete('jwt_token');
        await pref1.flush();
        
        const pref2 = await preferences.getPreferences(globalThis.abilityContext, 'user_data');
        await pref2.delete('current_user');
        await pref2.delete('auth_token');
        await pref2.flush();
        
        console.log('✅ [AuthService] Preferences 已清除');
      } catch (err) {
        console.warn('⚠️ [AuthService] 清除 Preferences 失败（已清除 AppStorage）');
      }
      
      console.log('✅ [AuthService] JWT和用户信息清除成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error('❌ [AuthService] 清除JWT和用户信息失败:', errorMessage);
    }
  }
}