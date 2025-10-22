if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentUser?: UserInfo | null;
    isLoggedIn?: boolean;
    currentTabIndex?: number;
    refreshKey?: number;
    followRefreshTrigger?: number;
    tabsController?: TabsController;
    userManager?: UserManager;
}
import { VideoPage } from "@bundle:com.huawei.quickstart/default@video/Index";
import { NewsPage } from "@bundle:com.huawei.quickstart/default@news/Index";
import { LoginPage } from "@bundle:com.huawei.quickstart/default@login/Index";
import { MinePage } from "@bundle:com.huawei.quickstart/default@mine/Index";
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/Index";
import type { UserInfo } from "@bundle:com.huawei.quickstart/default@login/Index";
import Follow from "@bundle:com.huawei.quickstart/default@follows/ets/view/Follow";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__isLoggedIn = new ObservedPropertySimplePU(false, this, "isLoggedIn");
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
        this.__refreshKey = new ObservedPropertySimplePU(0, this, "refreshKey");
        this.__followRefreshTrigger = new ObservedPropertySimplePU(0, this, "followRefreshTrigger");
        this.tabsController = new TabsController();
        this.userManager = UserManager.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.isLoggedIn !== undefined) {
            this.isLoggedIn = params.isLoggedIn;
        }
        if (params.currentTabIndex !== undefined) {
            this.currentTabIndex = params.currentTabIndex;
        }
        if (params.refreshKey !== undefined) {
            this.refreshKey = params.refreshKey;
        }
        if (params.followRefreshTrigger !== undefined) {
            this.followRefreshTrigger = params.followRefreshTrigger;
        }
        if (params.tabsController !== undefined) {
            this.tabsController = params.tabsController;
        }
        if (params.userManager !== undefined) {
            this.userManager = params.userManager;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoggedIn.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshKey.purgeDependencyOnElmtId(rmElmtId);
        this.__followRefreshTrigger.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        this.__currentTabIndex.aboutToBeDeleted();
        this.__refreshKey.aboutToBeDeleted();
        this.__followRefreshTrigger.aboutToBeDeleted();
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
    private __currentTabIndex: ObservedPropertySimplePU<number>;
    get currentTabIndex() {
        return this.__currentTabIndex.get();
    }
    set currentTabIndex(newValue: number) {
        this.__currentTabIndex.set(newValue);
    }
    private __refreshKey: ObservedPropertySimplePU<number>;
    get refreshKey() {
        return this.__refreshKey.get();
    }
    set refreshKey(newValue: number) {
        this.__refreshKey.set(newValue);
    }
    private __followRefreshTrigger: ObservedPropertySimplePU<number>; // 关注页面刷新触发器
    get followRefreshTrigger() {
        return this.__followRefreshTrigger.get();
    }
    set followRefreshTrigger(newValue: number) {
        this.__followRefreshTrigger.set(newValue);
    }
    private tabsController: TabsController;
    private userManager: UserManager;
    async aboutToAppear() {
        console.log('🚀 Index.aboutToAppear 开始');
        try {
            await this.userManager.initPreferences();
            await this.checkLoginStatus();
            console.log('🚀 Index.aboutToAppear 完成 - isLoggedIn:', this.isLoggedIn);
        }
        catch (error) {
            console.error('❌ Index.aboutToAppear 失败:', error);
            this.setLoggedIn(false);
        }
    }
    // 统一的登录状态设置方法
    setLoggedIn(status: boolean) {
        console.log('🔄 setLoggedIn:', status);
        this.isLoggedIn = status;
        this.refreshKey++;
    }
    TabBuilder(title: Resource, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.justifyContent(FlexAlign.Center);
            Column.height(56);
            Column.width('100%');
            Column.onClick(() => {
                this.currentTabIndex = index;
                this.tabsController.changeIndex(this.currentTabIndex);
                // 如果点击的是关注tab（index=2），触发刷新
                if (index === 2) {
                    console.log('🔄 点击关注tab，触发刷新');
                    this.followRefreshTrigger++;
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.margin({ top: 4 });
            Text.fontSize(10);
            Text.fontColor(this.currentTabIndex === index ? '#E60012' : '#666666');
        }, Text);
        Text.pop();
        Column.pop();
    }
    async checkLoginStatus() {
        console.log('🔄 checkLoginStatus 开始');
        try {
            this.currentUser = await this.userManager.getCurrentUser();
            const loggedIn = this.currentUser !== null;
            console.log('🔄 checkLoginStatus 完成 - 应该登录:', loggedIn, 'currentUser:', this.currentUser);
            this.setLoggedIn(loggedIn);
        }
        catch (error) {
            console.error('❌ checkLoginStatus 失败:', error);
            this.setLoggedIn(false);
        }
    }
    // 延迟函数 - 修复泛型问题
    delay(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }
    // 登录成功处理函数
    async handleLoginSuccess() {
        console.log('🎉 handleLoginSuccess 被调用');
        try {
            // 登录成功后直接设置为已登录状态
            console.log('✅ 登录成功，直接设置为已登录状态');
            this.setLoggedIn(true);
            this.currentTabIndex = 0;
            // 立即获取用户信息
            try {
                this.currentUser = await this.userManager.getCurrentUser();
                console.log('✅ 登录成功后获取用户信息:', this.currentUser);
            }
            catch (error) {
                console.error('❌ 获取用户信息失败:', error);
            }
        }
        catch (error) {
            console.error('❌ 登录状态更新失败:', error);
            this.setLoggedIn(false);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用 refreshKey 强制重新构建
            Column.create();
            // 使用 refreshKey 强制重新构建
            Column.width('100%');
            // 使用 refreshKey 强制重新构建
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoggedIn) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户已登录，显示主页面
                        Navigation.create(new NavPathStack(), { moduleName: "default", pagePath: "products/default/src/main/ets/pages/Index", isUserCreateStack: false });
                        // 用户已登录，显示主页面
                        Navigation.width('100%');
                        // 用户已登录，显示主页面
                        Navigation.height('100%');
                    }, Navigation);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#F5F5F5');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Tabs.create({
                            barPosition: BarPosition.End,
                            controller: this.tabsController
                        });
                        Tabs.margin({ bottom: 64 });
                        Tabs.width('100%');
                        Tabs.height('100%');
                        Tabs.barHeight(80);
                        Tabs.barMode(BarMode.Fixed);
                        Tabs.onChange((index: number) => {
                            this.currentTabIndex = index;
                        });
                    }, Tabs);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new NewsPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 121, col: 17 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {};
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "NewsPage" });
                            }
                        });
                        TabContent.padding({ left: 12, right: 12 });
                        TabContent.backgroundColor('#F5F5F5');
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, { "id": 16777223, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 0);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new VideoPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 129, col: 17 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {};
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "VideoPage" });
                            }
                        });
                        TabContent.padding({ left: 12, right: 12 });
                        TabContent.backgroundColor('#F5F5F5');
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, { "id": 16777224, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 1);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new Follow(this, { refreshTrigger: this.followRefreshTrigger }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 137, col: 17 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                refreshTrigger: this.followRefreshTrigger
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            refreshTrigger: this.followRefreshTrigger
                                        });
                                    }
                                }, { name: "Follow" });
                            }
                        });
                        TabContent.padding({ left: 12, right: 12 });
                        TabContent.backgroundColor('#F5F5F5');
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, { "id": 16777221, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 2);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new MinePage(this, {
                                            userInfo: this.currentUser,
                                            loginStatus: this.isLoggedIn,
                                            onLogout: async () => {
                                                console.log('🔄 MinePage.onLogout 被调用');
                                                await this.checkLoginStatus();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 145, col: 18 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                userInfo: this.currentUser,
                                                loginStatus: this.isLoggedIn,
                                                onLogout: async () => {
                                                    console.log('🔄 MinePage.onLogout 被调用');
                                                    await this.checkLoginStatus();
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "MinePage" });
                            }
                        });
                        TabContent.padding({ left: 12, right: 12 });
                        TabContent.backgroundColor('#F5F5F5');
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, { "id": 16777222, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 3);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    Tabs.pop();
                    Column.pop();
                    // 用户已登录，显示主页面
                    Navigation.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户未登录，显示登录页面
                        Column.create();
                        // 用户未登录，显示登录页面
                        Column.width('100%');
                        // 用户未登录，显示登录页面
                        Column.height('100%');
                        // 用户未登录，显示登录页面
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoginPage(this, {
                                    onLoginSuccess: () => {
                                        console.log('🎉 LoginPage.onLoginSuccess 回调被调用');
                                        this.handleLoginSuccess();
                                    }
                                }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 176, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onLoginSuccess: () => {
                                            console.log('🎉 LoginPage.onLoginSuccess 回调被调用');
                                            this.handleLoginSuccess();
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "LoginPage" });
                    }
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 调试按钮
                        Button.createWithLabel('手动检查登录状态');
                        // 调试按钮
                        Button.margin({ top: 20 });
                        // 调试按钮
                        Button.width('80%');
                        // 调试按钮
                        Button.height(40);
                        // 调试按钮
                        Button.backgroundColor('#E60012');
                        // 调试按钮
                        Button.fontColor('#FFFFFF');
                        // 调试按钮
                        Button.onClick(async () => {
                            console.log('🧪 手动测试检查登录状态');
                            await this.checkLoginStatus();
                        });
                    }, Button);
                    // 调试按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('强制设置为已登录');
                        Button.margin({ top: 10 });
                        Button.width('80%');
                        Button.height(40);
                        Button.backgroundColor('#007DFF');
                        Button.fontColor('#FFFFFF');
                        Button.onClick(() => {
                            console.log('🧪 强制设置为已登录');
                            this.setLoggedIn(true);
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('强制设置为未登录');
                        Button.margin({ top: 10 });
                        Button.width('80%');
                        Button.height(40);
                        Button.backgroundColor('#FF6B35');
                        Button.fontColor('#FFFFFF');
                        Button.onClick(() => {
                            console.log('🧪 强制设置为未登录');
                            this.setLoggedIn(false);
                        });
                    }, Button);
                    Button.pop();
                    // 用户未登录，显示登录页面
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 使用 refreshKey 强制重新构建
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.huawei.quickstart", moduleName: "default", pagePath: "pages/Index", pageFullPath: "products/default/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
