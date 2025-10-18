// utils/AuthService.ts
import { promptAction } from '@kit.ArkUI';
import { HttpUtils } from 'utils';
import preferences from '@ohos.data.preferences';

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
      const resp: LoginResponse = JSON.parse(respText);
      console.log('解析后的响应:', resp);

      if (resp.code === 200 && resp.data) {
        // 登录成功，保存JWT
        await this.saveJWT(resp.data);
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
      promptAction.showToast({ message: `请求异常: ${err.message}` });
      return false;
    }
  }

  /**
   * 保存JWT到本地存储
   * @param token JWT令牌
   */
  private async saveJWT(token: string): Promise<void> {
    try {
      const pref = await preferences.getPreferences(globalThis.abilityContext, 'user_prefs');
      await pref.put('jwt_token', token);
      await pref.flush();
      console.log('JWT保存成功');
    } catch (error) {
      console.error('保存JWT失败:', error.message);
    }
  }

  /**
   * 获取保存的JWT
   * @returns Promise<string | null> JWT令牌
   */
  async getJWT(): Promise<string | null> {
    try {
      const pref = await preferences.getPreferences(globalThis.abilityContext, 'user_prefs');
      const token = await pref.get('jwt_token', '');
      return token ? token.toString() : null;
    } catch (error) {
      console.error('获取JWT失败:', error.message);
      return null;
    }
  }

  /**
   * 清除JWT（用于登出）
   */
  async clearJWT(): Promise<void> {
    try {
      const pref = await preferences.getPreferences(globalThis.abilityContext, 'user_prefs');
      await pref.delete('jwt_token');
      await pref.flush();
      console.log('JWT清除成功');
    } catch (error) {
      console.error('清除JWT失败:', error.message);
    }
  }
}