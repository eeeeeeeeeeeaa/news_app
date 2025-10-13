import preferences from "@ohos:data.preferences";
import promptAction from "@ohos:promptAction";
export interface UserInfo {
    account: string;
    password: string;
    username: string;
}
export class UserManager {
    private static instance: UserManager;
    private dataPreferences: preferences.Preferences | null = null;
    private readonly PREFERENCES_NAME = 'user_data';
    private readonly USER_KEY = 'user_info';
    private readonly CURRENT_USER_KEY = 'current_user';
    private constructor() { }
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
        }
        catch (err) {
            console.error('Failed to get preferences:', err);
        }
    }
    // 注册用户
    public async registerUser(account: string, password: string, confirmPassword: string): Promise<boolean> {
        if (password !== confirmPassword) {
            promptAction.showToast({
                message: { "id": 16777286, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
            });
            return false;
        }
        if (!this.dataPreferences) {
            await this.initPreferences();
        }
        try {
            // 检查用户是否已存在
            const existingUsers = await this.getAllUsers();
            const userExists = existingUsers.some(user => user.account === account);
            if (userExists) {
                promptAction.showToast({
                    message: { "id": 16777240, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
                });
                return false;
            }
            // 创建新用户
            const newUser: UserInfo = {
                account: account,
                password: password,
                username: `用户${account.slice(-4)}` // 使用手机号后4位作为默认用户名
            };
            existingUsers.push(newUser);
            await this.dataPreferences?.put(this.USER_KEY, JSON.stringify(existingUsers));
            await this.dataPreferences?.flush();
            // 确保注册后不会自动登录，清除任何之前的登录状态
            await this.dataPreferences?.delete(this.CURRENT_USER_KEY);
            await this.dataPreferences?.flush();
            promptAction.showToast({
                message: { "id": 16777291, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
            });
            return true;
        }
        catch (err) {
            console.error('Failed to register user:', err);
            return false;
        }
    }
    // 用户登录
    public async loginUser(account: string, password: string): Promise<boolean> {
        if (!this.dataPreferences) {
            await this.initPreferences();
        }
        try {
            const allUsers = await this.getAllUsers();
            const user = allUsers.find(u => u.account === account);
            if (!user) {
                promptAction.showToast({
                    message: { "id": 16777274, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
                });
                return false;
            }
            if (user.password !== password) {
                promptAction.showToast({
                    message: { "id": 16777292, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
                });
                return false;
            }
            // 保存当前登录用户
            await this.dataPreferences?.put(this.CURRENT_USER_KEY, JSON.stringify(user));
            await this.dataPreferences?.flush();
            promptAction.showToast({
                message: { "id": 16777282, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
            });
            return true;
        }
        catch (err) {
            console.error('Failed to login user:', err);
            return false;
        }
    }
    // 获取当前登录用户
    public async getCurrentUser(): Promise<UserInfo | null> {
        if (!this.dataPreferences) {
            await this.initPreferences();
        }
        try {
            const userStr = await this.dataPreferences?.get(this.CURRENT_USER_KEY, '');
            if (userStr && userStr !== '') {
                return JSON.parse(userStr as string);
            }
            return null;
        }
        catch (err) {
            console.error('Failed to get current user:', err);
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
            const userIndex = allUsers.findIndex(u => u.account === updatedUser.account);
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
            return JSON.parse(usersStr as string);
        }
        catch (err) {
            console.error('Failed to get all users:', err);
            return [];
        }
    }
}
