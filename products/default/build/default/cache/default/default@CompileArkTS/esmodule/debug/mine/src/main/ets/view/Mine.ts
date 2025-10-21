if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Mine_Params {
    currentUser?: UserInfo | null;
    isLoggedIn?: boolean;
    userManager?: UserManager;
    onLogout?: () => void;
    // 接收外部传入的用户信息（组件参数）
    userInfo?: UserInfo | null;
    loginStatus?: boolean;
    quickAccessItems?: QuickAccessItem[];
    commonFunctions?: CommonFunction[];
    moreFunctions?: MoreFunction[];
}
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/Index";
import type { UserInfo } from "@bundle:com.huawei.quickstart/default@login/Index";
import promptAction from "@ohos:promptAction";
// 定义接口类型
interface QuickAccessItem {
    icon: string;
    text: string;
    badge: string;
}
interface CommonFunction {
    icon: string;
    text: string;
}
interface MoreFunction {
    icon: string;
    text: string;
    badge: string;
    color: string;
}
export default class Mine extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__isLoggedIn = new ObservedPropertySimplePU(false, this, "isLoggedIn");
        this.userManager = UserManager.getInstance();
        this.onLogout = () => { };
        this.userInfo = null;
        this.loginStatus = false;
        this.quickAccessItems = [
            { icon: '📧', text: '消息', badge: '1' },
            { icon: '⭐', text: '收藏', badge: '' },
            { icon: '🕐', text: '历史', badge: '' },
            { icon: '❤️', text: '已赞', badge: '' },
            { icon: '📋', text: '稍后听', badge: '' }
        ];
        this.commonFunctions = [
            { icon: 'Aa', text: '字体字号设置' },
            { icon: '🌙', text: '夜间模式' },
            { icon: '📰', text: '要闻主编精选' },
            { icon: '❓', text: '帮助反馈' },
            { icon: '📅', text: '我的阅读周报' },
            { icon: '⬇️', text: '我的下载' },
            { icon: '🛡️', text: '安全中心' },
            { icon: '⚙️', text: '更多设置' }
        ];
        this.moreFunctions = [
            { icon: '▶️', text: '腾讯视频VIP', badge: '', color: '#00C853' },
            { icon: '⚾', text: '腾讯体育', badge: '', color: '#FF9800' },
            { icon: '💰', text: '我的资产', badge: '', color: '#E91E63' },
            { icon: '🎮', text: 'BonBon 游戏', badge: '', color: '#9C27B0' },
            { icon: '📖', text: 'BonBon 读书', badge: '', color: '#03A9F4' },
            { icon: '🐷', text: '财富精选', badge: '', color: '#FF9800' },
            { icon: '👩', text: '新闻妹', badge: 'AI助手', color: '#2196F3' },
            { icon: '🎁', text: '签到领福利', badge: '', color: '#FFD700' }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Mine_Params) {
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.isLoggedIn !== undefined) {
            this.isLoggedIn = params.isLoggedIn;
        }
        if (params.userManager !== undefined) {
            this.userManager = params.userManager;
        }
        if (params.onLogout !== undefined) {
            this.onLogout = params.onLogout;
        }
        if (params.userInfo !== undefined) {
            this.userInfo = params.userInfo;
        }
        if (params.loginStatus !== undefined) {
            this.loginStatus = params.loginStatus;
        }
        if (params.quickAccessItems !== undefined) {
            this.quickAccessItems = params.quickAccessItems;
        }
        if (params.commonFunctions !== undefined) {
            this.commonFunctions = params.commonFunctions;
        }
        if (params.moreFunctions !== undefined) {
            this.moreFunctions = params.moreFunctions;
        }
    }
    updateStateVars(params: Mine_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoggedIn.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentUser: ObservedPropertyObjectPU<UserInfo | null>;
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: UserInfo | null) {
        this.__currentUser.set(newValue);
    }
    private __isLoggedIn: ObservedPropertySimplePU<boolean>;
    get isLoggedIn() {
        return this.__isLoggedIn.get();
    }
    set isLoggedIn(newValue: boolean) {
        this.__isLoggedIn.set(newValue);
    }
    private userManager: UserManager;
    private onLogout: () => void;
    // 接收外部传入的用户信息（组件参数）
    private userInfo: UserInfo | null;
    private loginStatus: boolean;
    async aboutToAppear() {
        console.log('🔍 Mine.aboutToAppear 开始');
        console.log('🔍 Mine.aboutToAppear - 传入的用户信息:', this.userInfo, '登录状态:', this.loginStatus);
        // 优先使用传入的参数，如果没有则主动获取
        if (this.userInfo && this.loginStatus) {
            this.updateUserInfo();
        }
        else {
            await this.loadUserInfo();
        }
    }
    async aboutToUpdate() {
        console.log('🔍 Mine.aboutToUpdate 开始');
        console.log('🔍 Mine.aboutToUpdate - 传入的用户信息:', this.userInfo, '登录状态:', this.loginStatus);
        // 优先使用传入的参数，如果没有则主动获取
        if (this.userInfo && this.loginStatus) {
            this.updateUserInfo();
        }
        else {
            await this.loadUserInfo();
        }
    }
    // 更新用户信息（优先使用传入的参数）
    updateUserInfo() {
        console.log('🔍 Mine.updateUserInfo 开始');
        // 使用传入的参数更新内部状态
        console.log('✅ 使用传入的用户信息:', this.userInfo);
        this.currentUser = this.userInfo;
        this.isLoggedIn = this.loginStatus;
        console.log('🔍 Mine.updateUserInfo 完成 - isLoggedIn:', this.isLoggedIn, 'currentUser:', this.currentUser);
    }
    async loadUserInfo() {
        try {
            console.log('🔍 Mine.loadUserInfo 开始');
            await this.userManager.initPreferences();
            const user = await this.userManager.getCurrentUser();
            console.log('🔍 Mine.loadUserInfo - 获取到的用户信息:', user);
            this.currentUser = user;
            this.isLoggedIn = user !== null;
            console.log('🔍 Mine.loadUserInfo 完成 - isLoggedIn:', this.isLoggedIn, 'currentUser:', this.currentUser);
        }
        catch (err) {
            console.error('❌ Mine.loadUserInfo 失败:', err);
        }
    }
    async logout() {
        try {
            await this.userManager.logout();
            this.currentUser = null;
            this.isLoggedIn = false;
            promptAction.showToast({
                message: { "id": 16777272, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
            });
            // 退出登录后调用回调函数
            setTimeout(() => {
                this.onLogout();
            }, 1000); // 延迟1秒让用户看到退出成功的提示
        }
        catch (err) {
            console.error('Failed to logout:', err);
        }
    }
    // 快速访问功能数据
    private quickAccessItems: QuickAccessItem[];
    // 常用功能数据
    private commonFunctions: CommonFunction[];
    // 更多功能数据
    private moreFunctions: MoreFunction[];
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoggedIn && this.currentUser) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已登录状态
                        Scroll.create();
                        // 已登录状态
                        Scroll.width('100%');
                        // 已登录状态
                        Scroll.height('100%');
                        // 已登录状态
                        Scroll.backgroundColor('#F5F5F5');
                        // 已登录状态
                        Scroll.scrollBar(BarState.Off);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户信息头部区域
                        Row.create();
                        // 用户信息头部区域
                        Row.width('100%');
                        // 用户信息头部区域
                        Row.height('50vp');
                        // 用户信息头部区域
                        Row.padding({ left: '16vp', right: '16vp' });
                        // 用户信息头部区域
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        // 用户信息头部区域
                        Row.margin({ top: '20vp', bottom: '20vp' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 右侧功能按钮
                        Row.create();
                        // 右侧功能按钮
                        Row.margin({ right: '16vp' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📅');
                        Text.fontSize('16fp');
                        Text.margin({ right: '8vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('日签');
                        Text.fontSize('12fp');
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    // 右侧功能按钮
                    Row.pop();
                    // 用户信息头部区域
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户头像和基本信息
                        Row.create();
                        // 用户头像和基本信息
                        Row.width('100%');
                        // 用户头像和基本信息
                        Row.padding({ left: '16vp', right: '16vp' });
                        // 用户头像和基本信息
                        Row.margin({ bottom: '20vp' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 头像
                        Text.create('👤');
                        // 头像
                        Text.fontSize('40fp');
                        // 头像
                        Text.width('60vp');
                        // 头像
                        Text.height('60vp');
                        // 头像
                        Text.textAlign(TextAlign.Center);
                        // 头像
                        Text.backgroundColor('#E0E0E0');
                        // 头像
                        Text.borderRadius('30vp');
                        // 头像
                        Text.margin({ right: '16vp' });
                    }, Text);
                    // 头像
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户名和徽章
                        Row.create();
                        // 用户名和徽章
                        Row.margin({ bottom: '8vp' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentUser.username || 'euphoria');
                        Text.fontSize('20fp');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#000000');
                        Text.margin({ right: '8vp' });
                    }, Text);
                    Text.pop();
                    // 用户名和徽章
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 统计数据
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('0发表');
                        Text.fontSize('14fp');
                        Text.fontColor('#666666');
                        Text.margin({ right: '16vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('0关注');
                        Text.fontSize('14fp');
                        Text.fontColor('#666666');
                        Text.margin({ right: '16vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('0粉丝');
                        Text.fontSize('14fp');
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    // 统计数据
                    Row.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Logout');
                        Text.fontSize('14fp');
                        Text.fontColor('#999999');
                        Text.onClick(() => {
                            this.logout();
                        });
                    }, Text);
                    Text.pop();
                    // 用户头像和基本信息
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 会员和专栏卡片
                        Row.create();
                        // 会员和专栏卡片
                        Row.width('100%');
                        // 会员和专栏卡片
                        Row.padding({ left: '16vp', right: '16vp' });
                        // 会员和专栏卡片
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        // 会员和专栏卡片
                        Row.margin({ bottom: '20vp' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 我的会员卡片
                        Row.create();
                        // 我的会员卡片
                        Row.width('48%');
                        // 我的会员卡片
                        Row.height('60vp');
                        // 我的会员卡片
                        Row.padding({ left: '12vp', right: '12vp' });
                        // 我的会员卡片
                        Row.backgroundColor('#FFFFFF');
                        // 我的会员卡片
                        Row.borderRadius('8vp');
                        // 我的会员卡片
                        Row.justifyContent(FlexAlign.Start);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔽');
                        Text.fontSize('20fp');
                        Text.fontColor('#FFD700');
                        Text.margin({ right: '8vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('我的会员');
                        Text.fontSize('14fp');
                        Text.fontColor('#000000');
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ bottom: '4vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('首月特惠低至2折');
                        Text.fontSize('12fp');
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    // 我的会员卡片
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 我的专栏卡片
                        Row.create();
                        // 我的专栏卡片
                        Row.width('48%');
                        // 我的专栏卡片
                        Row.height('60vp');
                        // 我的专栏卡片
                        Row.padding({ left: '12vp', right: '12vp' });
                        // 我的专栏卡片
                        Row.backgroundColor('#FFFFFF');
                        // 我的专栏卡片
                        Row.borderRadius('8vp');
                        // 我的专栏卡片
                        Row.justifyContent(FlexAlign.Start);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⬜');
                        Text.fontSize('20fp');
                        Text.fontColor('#FFD700');
                        Text.margin({ right: '8vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('我的专栏');
                        Text.fontSize('14fp');
                        Text.fontColor('#000000');
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ bottom: '4vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('领域专家,专业解读');
                        Text.fontSize('12fp');
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Column.pop();
                    // 我的专栏卡片
                    Row.pop();
                    // 会员和专栏卡片
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 快速访问图标行
                        Grid.create();
                        // 快速访问图标行
                        Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr');
                        // 快速访问图标行
                        Grid.rowsTemplate('1fr');
                        // 快速访问图标行
                        Grid.width('100%');
                        // 快速访问图标行
                        Grid.height('80vp');
                        // 快速访问图标行
                        Grid.padding({ left: '16vp', right: '16vp' });
                        // 快速访问图标行
                        Grid.margin({ bottom: '20vp' });
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.width('100%');
                                        Column.height('80vp');
                                        Column.justifyContent(FlexAlign.Center);
                                        Column.alignItems(HorizontalAlign.Center);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Stack.create();
                                        Stack.width('40vp');
                                        Stack.height('40vp');
                                        Stack.alignContent(Alignment.Center);
                                        Stack.margin({ bottom: '8vp' });
                                    }, Stack);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.icon);
                                        Text.fontSize('24fp');
                                        Text.alignSelf(ItemAlign.Center);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.badge) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.badge);
                                                    Text.fontSize('10fp');
                                                    Text.fontColor('#FFFFFF');
                                                    Text.backgroundColor('#FF0000');
                                                    Text.borderRadius('8vp');
                                                    Text.padding({ left: '4vp', right: '4vp', top: '2vp', bottom: '2vp' });
                                                    Text.position({ x: '20vp', y: '-5vp' });
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Stack.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.text);
                                        Text.fontSize('12fp');
                                        Text.fontColor('#666666');
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.quickAccessItems, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    // 快速访问图标行
                    Grid.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 常用功能区域
                        Column.create();
                        // 常用功能区域
                        Column.width('100%');
                        // 常用功能区域
                        Column.padding({ left: '16vp', right: '16vp' });
                        // 常用功能区域
                        Column.margin({ bottom: '20vp' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('常用功能');
                        Text.fontSize('16fp');
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#000000');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ bottom: '12vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.columnsTemplate('1fr 1fr 1fr 1fr');
                        Grid.rowsTemplate('1fr 1fr');
                        Grid.width('100%');
                        Grid.height('160vp');
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.width('100%');
                                        Column.height('80vp');
                                        Column.justifyContent(FlexAlign.Center);
                                        Column.alignItems(HorizontalAlign.Center);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.icon);
                                        Text.fontSize('24fp');
                                        Text.margin({ bottom: '8vp' });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.text);
                                        Text.fontSize('12fp');
                                        Text.fontColor('#666666');
                                        Text.textAlign(TextAlign.Center);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.commonFunctions, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                    // 常用功能区域
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 更多功能区域
                        Column.create();
                        // 更多功能区域
                        Column.width('100%');
                        // 更多功能区域
                        Column.padding({ left: '16vp', right: '16vp' });
                        // 更多功能区域
                        Column.margin({ bottom: '20vp' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('更多功能');
                        Text.fontSize('16fp');
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#000000');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ bottom: '12vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.columnsTemplate('1fr 1fr 1fr 1fr');
                        Grid.rowsTemplate('1fr 1fr');
                        Grid.width('100%');
                        Grid.height('140vp');
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.width('100%');
                                        Column.height('70vp');
                                        Column.justifyContent(FlexAlign.Center);
                                        Column.alignItems(HorizontalAlign.Center);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Stack.create();
                                        Stack.width('30vp');
                                        Stack.height('30vp');
                                        Stack.alignContent(Alignment.Center);
                                        Stack.margin({ bottom: '6vp' });
                                    }, Stack);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.icon);
                                        Text.fontSize('20fp');
                                        Text.fontColor(item.color);
                                        Text.alignSelf(ItemAlign.Center);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (item.badge) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.badge);
                                                    Text.fontSize('8fp');
                                                    Text.fontColor('#FFFFFF');
                                                    Text.backgroundColor('#FF0000');
                                                    Text.borderRadius('6vp');
                                                    Text.padding({ left: '2vp', right: '2vp', top: '1vp', bottom: '1vp' });
                                                    Text.position({ x: '15vp', y: '-3vp' });
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Stack.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.text);
                                        Text.fontSize('10fp');
                                        Text.fontColor('#666666');
                                        Text.textAlign(TextAlign.Center);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.moreFunctions, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                    // 更多功能区域
                    Column.pop();
                    Column.pop();
                    // 已登录状态
                    Scroll.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 未登录状态
                        Column.create();
                        // 未登录状态
                        Column.width('100%');
                        // 未登录状态
                        Column.height('100%');
                        // 未登录状态
                        Column.alignItems(HorizontalAlign.Center);
                        // 未登录状态
                        Column.backgroundColor('#F5F5F5');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('👤');
                        Text.fontSize('60fp');
                        Text.width('80vp');
                        Text.height('80vp');
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor('#E0E0E0');
                        Text.borderRadius('40vp');
                        Text.margin({ top: '100vp', bottom: '20vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请先登录');
                        Text.fontSize('18fp');
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#99182431');
                        Text.margin({ bottom: '40vp' });
                    }, Text);
                    Text.pop();
                    // 未登录状态
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
