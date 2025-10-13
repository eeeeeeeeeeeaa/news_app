if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentUser?: UserInfo | null;
    isLoggedIn?: boolean;
    currentTabIndex?: number;
    tabsController?: TabsController;
    userManager?: UserManager;
}
import { VideoPage } from "@bundle:com.huawei.quickstart/default@video/Index";
import { NewsPage } from "@bundle:com.huawei.quickstart/default@news/Index";
import { LoginPage } from "@bundle:com.huawei.quickstart/default@login/Index";
import { MinePage } from "@bundle:com.huawei.quickstart/default@mine/Index";
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/Index";
import type { UserInfo } from "@bundle:com.huawei.quickstart/default@login/Index";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__isLoggedIn = new ObservedPropertySimplePU(false, this, "isLoggedIn");
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
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
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        this.__currentTabIndex.aboutToBeDeleted();
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
    private __currentTabIndex: ObservedPropertySimplePU<number>; // 默认选中"新闻"页
    get currentTabIndex() {
        return this.__currentTabIndex.get();
    }
    set currentTabIndex(newValue: number) {
        this.__currentTabIndex.set(newValue);
    }
    FollowPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的关注');
            Text.fontSize('20fp');
            Text.fontWeight(FontWeight.Bold);
            Text.margin('40vp');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关注功能开发中...');
            Text.fontSize('16fp');
            Text.fontColor('#999999');
            Text.margin('20vp');
        }, Text);
        Text.pop();
        Column.pop();
    }
    private tabsController: TabsController;
    private userManager: UserManager;
    async aboutToAppear() {
        try {
            await this.userManager.initPreferences();
            this.currentUser = await this.userManager.getCurrentUser();
            this.isLoggedIn = this.currentUser !== null;
            console.log('Login status initialized:', this.isLoggedIn);
        }
        catch (error) {
            console.error('Failed to initialize login status:', error);
            this.isLoggedIn = false;
        }
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
        this.currentUser = await this.userManager.getCurrentUser();
        this.isLoggedIn = this.currentUser !== null;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoggedIn) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已登录，显示Tab页面
                        Navigation.create(new NavPathStack(), { moduleName: "default", pagePath: "products/default/src/main/ets/pages/Index", isUserCreateStack: false });
                        // 已登录，显示Tab页面
                        Navigation.width('100%');
                        // 已登录，显示Tab页面
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
                                        let componentCall = new NewsPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 87, col: 15 });
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
                                this.TabBuilder.call(this, { "id": 16777275, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 0);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new VideoPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 95, col: 15 });
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
                                this.TabBuilder.call(this, { "id": 16777276, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 1);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.FollowPage.bind(this)();
                        });
                        TabContent.padding({ left: 12, right: 12 });
                        TabContent.backgroundColor('#F5F5F5');
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, { "id": 16777273, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 2);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new MinePage(this, {
                                            onLogout: () => {
                                                this.checkLoginStatus();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 111, col: 15 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                onLogout: () => {
                                                    this.checkLoginStatus();
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
                                this.TabBuilder.call(this, { "id": 16777274, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 3);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    Tabs.pop();
                    Column.pop();
                    // 已登录，显示Tab页面
                    Navigation.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new 
                                // 未登录，显示登录页面
                                LoginPage(this, {
                                    onLoginSuccess: () => {
                                        this.checkLoginStatus();
                                    }
                                }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 138, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onLoginSuccess: () => {
                                            this.checkLoginStatus();
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
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.huawei.quickstart", moduleName: "default", pagePath: "pages/Index", pageFullPath: "products/default/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
