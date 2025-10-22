if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentUser?: UserInfo | null;
    isLoggedIn?: boolean;
    currentTabIndex?: number;
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
        this.__followRefreshTrigger.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        this.__currentTabIndex.aboutToBeDeleted();
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
        try {
            await this.userManager.initPreferences();
            await this.checkLoginStatus();
        }
        catch (error) {
            this.setLoggedIn(false);
        }
    }
    // 登录状态的设置方法
    setLoggedIn(status: boolean) {
        this.isLoggedIn = status;
    }
    TabBuilder(title: Resource, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.justifyContent(FlexAlign.Center);
            Column.height(68);
            Column.width('100%');
            Column.onClick(() => {
                this.currentTabIndex = index;
                this.tabsController.changeIndex(this.currentTabIndex);
                if (index === 2) { //用于触发关注页面的刷新
                    this.followRefreshTrigger++;
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.margin({ top: 8 });
            Text.fontSize(14);
            Text.fontColor(this.currentTabIndex === index ? '#E60012' : '#666666');
        }, Text);
        Text.pop();
        Column.pop();
    }
    async checkLoginStatus() {
        try {
            this.currentUser = await this.userManager.getCurrentUser();
            const loggedIn = this.currentUser !== null;
            this.setLoggedIn(loggedIn);
        }
        catch (error) {
            this.setLoggedIn(false);
        }
    }
    // 延迟函数 - 修复泛型问题
    delay(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }
    // 登录成功处理函数
    async handleLoginSuccess() {
        try {
            this.setLoggedIn(true);
            this.currentTabIndex = 0;
            // 立即获取用户信息
            try {
                this.currentUser = await this.userManager.getCurrentUser();
            }
            catch (error) {
            }
        }
        catch (error) {
            console.error('❌ 登录状态更新失败:', error);
            this.setLoggedIn(false);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 根据登录状态构建页面
            Column.create();
            // 根据登录状态构建页面
            Column.width('100%');
            // 根据登录状态构建页面
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
                                        let componentCall = new NewsPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 118, col: 17 });
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
                                        let componentCall = new VideoPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 126, col: 17 });
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
                                        let componentCall = new Follow(this, { refreshTrigger: this.followRefreshTrigger }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 134, col: 17 });
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
                                            onLogout: async () => {
                                                await this.checkLoginStatus();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 142, col: 18 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                userInfo: this.currentUser,
                                                onLogout: async () => {
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
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoginPage(this, {
                                    onLoginSuccess: () => {
                                        this.handleLoginSuccess();
                                    }
                                }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 171, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onLoginSuccess: () => {
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
                    // 用户未登录，显示登录页面
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 根据登录状态构建页面
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
