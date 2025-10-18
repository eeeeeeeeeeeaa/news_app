import promptAction from "@ohos:promptAction";
import { HttpUtils } from "@bundle:com.huawei.quickstart/default@utils/Index";
interface RegisterFormData {
    userPhone: string;
    userPassword: string;
    userName: string;
}
export interface RegisterResponse {
    code: number;
    message: string;
    data?: string;
}
/**
 * 用户注册服务
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
     * 用户注册方法
     * @param phone 手机号
     * @param username 用户名
     * @param password 密码
     * @returns Promise<boolean> 注册是否成功
     */
    async register(phone: string, username: string, password: string): Promise<boolean> {
        try {
            console.log('开始注册请求...');
            const url = 'http://hmos.w1.luyouxia.net/api/users/register';
            console.log('请求URL:', url);
            const formData: RegisterFormData = {
                userPhone: phone,
                userPassword: password,
                userName: username
            };
            console.log('注册参数:', JSON.stringify(formData));
            // 发送POST请求
            const respText = await HttpUtils.postForm(url, formData);
            console.log('响应数据:', respText);
            // 解析响应
            const resp: RegisterResponse = JSON.parse(respText);
            console.log('解析后的响应:', resp);
            if (resp.code === 200) {
                promptAction.showToast({ message: '注册成功' });
                console.log('✅ 注册成功！响应:', resp);
                return true;
            }
            else {
                promptAction.showToast({ message: `注册失败: ${resp.message}` });
                console.error(`❌ 注册失败！错误码: ${resp.code}, 消息: ${resp.message}`);
                return false;
            }
        }
        catch (err) {
            console.error('注册请求失败:', err);
            promptAction.showToast({ message: `请求异常: ${err.message}` });
            return false;
        }
    }
}
