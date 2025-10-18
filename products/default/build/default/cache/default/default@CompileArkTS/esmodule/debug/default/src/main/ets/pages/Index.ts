if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentUser?: UserInfo | null;
    isLoggedIn?: boolean;
    currentTabIndex?: number;
    followSearchText?: string;
    followHotTitles?: string[];
    followSelectedUrl?: string | null;
    followWebController?: webview.WebviewController;
    tabsController?: TabsController;
    userManager?: UserManager;
}
import { CommonSearchBar } from "@bundle:com.huawei.quickstart/default@uicomponents/Index";
import { VideoPage } from "@bundle:com.huawei.quickstart/default@video/Index";
import { NewsPage } from "@bundle:com.huawei.quickstart/default@news/Index";
import { LoginPage } from "@bundle:com.huawei.quickstart/default@login/Index";
import { MinePage } from "@bundle:com.huawei.quickstart/default@mine/Index";
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/Index";
import type { UserInfo } from "@bundle:com.huawei.quickstart/default@login/Index";
import webview from "@ohos:web.webview";
import { BaiduHotSearchParser } from "@bundle:com.huawei.quickstart/default@utils/Index";
import type { BaiduHotSearchItem } from "@bundle:com.huawei.quickstart/default@utils/Index";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__isLoggedIn = new ObservedPropertySimplePU(false, this, "isLoggedIn");
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
        this.__followSearchText = new ObservedPropertySimplePU('', this, "followSearchText");
        this.__followHotTitles = new ObservedPropertyObjectPU([], this, "followHotTitles");
        this.__followSelectedUrl = new ObservedPropertyObjectPU(null, this, "followSelectedUrl");
        this.followWebController = new webview.WebviewController();
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
        if (params.followSearchText !== undefined) {
            this.followSearchText = params.followSearchText;
        }
        if (params.followHotTitles !== undefined) {
            this.followHotTitles = params.followHotTitles;
        }
        if (params.followSelectedUrl !== undefined) {
            this.followSelectedUrl = params.followSelectedUrl;
        }
        if (params.followWebController !== undefined) {
            this.followWebController = params.followWebController;
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
        this.__followSearchText.purgeDependencyOnElmtId(rmElmtId);
        this.__followHotTitles.purgeDependencyOnElmtId(rmElmtId);
        this.__followSelectedUrl.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        this.__currentTabIndex.aboutToBeDeleted();
        this.__followSearchText.aboutToBeDeleted();
        this.__followHotTitles.aboutToBeDeleted();
        this.__followSelectedUrl.aboutToBeDeleted();
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
    private __currentTabIndex: ObservedPropertySimplePU<number>; // 榛樿閫変腑"鏂伴椈"椤?
    get currentTabIndex() {
        return this.__currentTabIndex.get();
    }
    set currentTabIndex(newValue: number) {
        this.__currentTabIndex.set(newValue);
    }
    private __followSearchText: ObservedPropertySimplePU<string>;
    get followSearchText() {
        return this.__followSearchText.get();
    }
    set followSearchText(newValue: string) {
        this.__followSearchText.set(newValue);
    }
    private __followHotTitles: ObservedPropertyObjectPU<string[]>;
    get followHotTitles() {
        return this.__followHotTitles.get();
    }
    set followHotTitles(newValue: string[]) {
        this.__followHotTitles.set(newValue);
    }
    private __followSelectedUrl: ObservedPropertyObjectPU<string | null>;
    get followSelectedUrl() {
        return this.__followSelectedUrl.get();
    }
    set followSelectedUrl(newValue: string | null) {
        this.__followSelectedUrl.set(newValue);
    }
    private followWebController: webview.WebviewController;
    private openFollowBrowser(url: string): void {
        this.followSelectedUrl = url;
    }
    private closeFollowBrowser(): void {
        this.followSelectedUrl = null;
    }
    buildFollowBrowserLayer(url: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ top: '48vp' });
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关闭');
            Text.fontSize(16);
            Text.fontColor('#E60012');
            Text.padding({ left: 16, right: 16, top: 16, bottom: 16 });
            Text.onClick(() => {
                this.closeFollowBrowser();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('搜索结果');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#182431');
            Text.margin({ right: 24 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Web.create({ src: url, controller: this.followWebController });
            Web.layoutWeight(1);
            Web.width('100%');
        }, Web);
        Column.pop();
    }
    FollowPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ top: '48vp' });
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F8F9FA');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.padding({ left: '12vp', right: '12vp', top: '8vp', bottom: '8vp' });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 顶部搜索框（公共组件）
                    CommonSearchBar(this, {
                        value: this.followSearchText,
                        placeholder: '搜索新闻',
                        hotTitles: this.followHotTitles,
                        onSearch: (url: string) => {
                            this.openFollowBrowser(url);
                        }
                    }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 72, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            value: this.followSearchText,
                            placeholder: '搜索新闻',
                            hotTitles: this.followHotTitles,
                            onSearch: (url: string) => {
                                this.openFollowBrowser(url);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        value: this.followSearchText,
                        hotTitles: this.followHotTitles
                    });
                }
            }, { name: "CommonSearchBar" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 页面内容
            Text.create('我的关注');
            // 页面内容
            Text.fontSize('20fp');
            // 页面内容
            Text.fontWeight(FontWeight.Bold);
            // 页面内容
            Text.margin({ top: '40vp', bottom: '20vp' });
        }, Text);
        // 页面内容
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关注功能开发中...');
            Text.fontSize('16fp');
            Text.fontColor('#999999');
            Text.margin('20vp');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.followSelectedUrl !== null) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildFollowBrowserLayer.bind(this)(this.followSelectedUrl as string);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    private tabsController: TabsController;
    private userManager: UserManager;
    async aboutToAppear() {
        try {
            await this.userManager.initPreferences();
            this.currentUser = await this.userManager.getCurrentUser();
            this.isLoggedIn = this.currentUser !== null;
            console.log('Login status initialized:', this.isLoggedIn);
            // 预取热搜标题供关注页使用
            const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
            this.followHotTitles = realtime.slice(0, 10).map((it: BaiduHotSearchItem) => it.card_title);
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
                        // 宸茬櫥褰曪紝鏄剧ずTab椤甸潰
                        Navigation.create(new NavPathStack(), { moduleName: "default", pagePath: "products/default/src/main/ets/pages/Index", isUserCreateStack: false });
                        // 宸茬櫥褰曪紝鏄剧ずTab椤甸潰
                        Navigation.width('100%');
                        // 宸茬櫥褰曪紝鏄剧ずTab椤甸潰
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
                                        let componentCall = new NewsPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 159, col: 15 });
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
                                        let componentCall = new VideoPage(this, {}, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 167, col: 15 });
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
                                            onLogout: async () => {
                                                await this.checkLoginStatus();
                                            }
                                        }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 183, col: 15 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
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
                                this.TabBuilder.call(this, { "id": 16777274, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, 3);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    Tabs.pop();
                    Column.pop();
                    // 宸茬櫥褰曪紝鏄剧ずTab椤甸潰
                    Navigation.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new 
                                // 鏈櫥褰曪紝鏄剧ず鐧诲綍椤甸潰
                                LoginPage(this, {
                                    onLoginSuccess: async () => {
                                        await this.checkLoginStatus();
                                    }
                                }, undefined, elmtId, () => { }, { page: "products/default/src/main/ets/pages/Index.ets", line: 210, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onLoginSuccess: async () => {
                                            await this.checkLoginStatus();
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
