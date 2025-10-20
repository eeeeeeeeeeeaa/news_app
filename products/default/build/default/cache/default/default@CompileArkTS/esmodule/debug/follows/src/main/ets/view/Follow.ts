if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FollowPage_Params {
    searchText?: string;
    selectedUrl?: string | null;
    webController?: webview.WebviewController;
    hotTitles?: string[];
    newsList?: FollowedNewsItem[];
    isLoading?: boolean;
    followService?: NewsFollowService;
}
import { CommonSearchBar } from "@bundle:com.huawei.quickstart/default@uicomponents/Index";
import { BaiduHotSearchParser } from "@bundle:com.huawei.quickstart/default@utils/Index";
import webview from "@ohos:web.webview";
import { NewsFollowService, type FollowedNewsItem } from "@bundle:com.huawei.quickstart/default@follows/ets/view/NewsFollowService";
import promptAction from "@ohos:promptAction";
export default class FollowPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__selectedUrl = new ObservedPropertyObjectPU(null, this, "selectedUrl");
        this.webController = new webview.WebviewController();
        this.__hotTitles = new ObservedPropertyObjectPU([], this, "hotTitles");
        this.__newsList = new ObservedPropertyObjectPU([], this, "newsList");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.followService = NewsFollowService.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: FollowPage_Params) {
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.selectedUrl !== undefined) {
            this.selectedUrl = params.selectedUrl;
        }
        if (params.webController !== undefined) {
            this.webController = params.webController;
        }
        if (params.hotTitles !== undefined) {
            this.hotTitles = params.hotTitles;
        }
        if (params.newsList !== undefined) {
            this.newsList = params.newsList;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.followService !== undefined) {
            this.followService = params.followService;
        }
    }
    updateStateVars(params: FollowPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__hotTitles.purgeDependencyOnElmtId(rmElmtId);
        this.__newsList.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__selectedUrl.aboutToBeDeleted();
        this.__hotTitles.aboutToBeDeleted();
        this.__newsList.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __selectedUrl: ObservedPropertyObjectPU<string | null>;
    get selectedUrl() {
        return this.__selectedUrl.get();
    }
    set selectedUrl(newValue: string | null) {
        this.__selectedUrl.set(newValue);
    }
    private webController: webview.WebviewController;
    private __hotTitles: ObservedPropertyObjectPU<string[]>;
    get hotTitles() {
        return this.__hotTitles.get();
    }
    set hotTitles(newValue: string[]) {
        this.__hotTitles.set(newValue);
    }
    private __newsList: ObservedPropertyObjectPU<FollowedNewsItem[]>;
    get newsList() {
        return this.__newsList.get();
    }
    set newsList(newValue: FollowedNewsItem[]) {
        this.__newsList.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private followService: NewsFollowService;
    async aboutToAppear() {
        console.log('========== Follow 页面初始化 ==========');
        try {
            const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
            this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
        }
        catch (_) {
            this.hotTitles = [];
        }
        // 检查登录状态
        await this.checkLoginStatus();
        // 加载关注的新闻数据
        this.loadFollowNewsData();
    }
    // 检查登录状态（用于调试）
    private async checkLoginStatus() {
        console.log('🔍 [Follow] 检查登录状态...');
        try {
            // 从 login 模块导入 UserManager
            const loginModule = await import("@bundle:com.huawei.quickstart/default@login/Index");
            const userManager = loginModule.UserManager.getInstance();
            console.log('🔍 [Follow] UserManager 实例:', userManager);
            // 初始化 preferences（如果需要）
            await userManager.initPreferences();
            console.log('🔍 [Follow] Preferences 初始化成功');
            // 获取 token
            const token = await userManager.getToken();
            console.log('🔍 [Follow] Token 存在:', token ? '是' : '否');
            if (token) {
                console.log('🔍 [Follow] Token 类型:', typeof token);
                console.log('🔍 [Follow] Token 长度:', token.length);
                console.log('🔍 [Follow] Token 前30字符:', token.substring(0, 30) + '...');
                // 检查 token 是否有效
                const isValid = await userManager.isTokenValid();
                console.log('🔍 [Follow] Token 是否有效:', isValid);
                // 获取 token 信息
                const tokenInfo = await userManager.getTokenInfo();
                console.log('🔍 [Follow] Token Info:', tokenInfo);
            }
            else {
                console.warn('⚠️ [Follow] 未找到 Token，用户可能未登录');
            }
            // 获取当前用户信息
            const currentUser = await userManager.getCurrentUser();
            console.log('🔍 [Follow] 当前用户:', currentUser);
        }
        catch (error) {
            console.error('❌ [Follow] 检查登录状态失败:', error);
            if (error instanceof Error) {
                console.error('❌ [Follow] 错误消息:', error.message);
                console.error('❌ [Follow] 错误堆栈:', error.stack);
            }
        }
        console.log('========================================');
    }
    private async loadFollowNewsData() {
        console.log('========== 开始加载关注的新闻列表 ==========');
        this.isLoading = true;
        try {
            // 从服务获取关注的新闻列表
            const followedNews = await this.followService.getFollowedNewsList();
            if (followedNews && followedNews.length > 0) {
                this.newsList = followedNews;
                console.log(`成功加载 ${followedNews.length} 条关注的新闻`);
            }
            else {
                this.newsList = [];
                console.log('暂无关注的新闻');
            }
        }
        catch (error) {
            console.error('加载关注新闻列表失败:', JSON.stringify(error));
            this.newsList = [];
            promptAction.showToast({ message: '加载失败，请稍后重试' });
        }
        finally {
            this.isLoading = false;
        }
    }
    // 刷新关注列表
    private async refreshNewsList() {
        await this.loadFollowNewsData();
    }
    private openBrowser(url: string): void {
        this.selectedUrl = url;
    }
    private closeBrowser(): void {
        this.selectedUrl = null;
    }
    buildNewsItem(item: FollowedNewsItem, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ top: '12vp', bottom: '12vp', left: '16vp', right: '16vp' });
            Column.backgroundColor(Color.White);
            Column.borderRadius('8vp');
            Column.margin({ bottom: '8vp', left: '12vp', right: '12vp' });
            Column.shadow({ radius: 4, color: '#0A000000', offsetX: 0, offsetY: 1 });
            Column.onClick(() => {
                // 这里可以添加点击新闻的处理逻辑
                console.log('点击新闻:', item.newsTitle);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 新闻标题
            Text.create(item.newsTitle);
            // 新闻标题
            Text.fontSize('16fp');
            // 新闻标题
            Text.fontWeight(FontWeight.Medium);
            // 新闻标题
            Text.fontColor('#182431');
            // 新闻标题
            Text.maxLines(3);
            // 新闻标题
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 新闻标题
            Text.lineHeight('21fp');
            // 新闻标题
            Text.margin({ bottom: '6vp' });
            // 新闻标题
            Text.textAlign(TextAlign.Start);
            // 新闻标题
            Text.width('100%');
        }, Text);
        // 新闻标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布者和时间信息
            Row.create();
            // 发布者和时间信息
            Row.width('100%');
            // 发布者和时间信息
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 显示新闻发布者
            if (item.newsAuthor) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.newsAuthor);
                        Text.fontSize('12fp');
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                });
            }
            // 分隔符
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 分隔符
            if (item.newsAuthor && item.newsTime) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('·');
                        Text.fontSize('12fp');
                        Text.fontColor('#999999');
                        Text.margin({ left: 6, right: 6 });
                    }, Text);
                    Text.pop();
                });
            }
            // 显示新闻发布时间
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 显示新闻发布时间
            if (item.newsTime) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.formatDateTime(item.newsTime));
                        Text.fontSize('12fp');
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                });
            }
            // 如果有关注时间但没有新闻发布时间，显示关注时间
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 如果有关注时间但没有新闻发布时间，显示关注时间
            if (!item.newsTime && item.followTime) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (item.newsAuthor) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('·');
                                    Text.fontSize('12fp');
                                    Text.fontColor('#999999');
                                    Text.margin({ left: 6, right: 6 });
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`关注于 ${this.formatDateTime(item.followTime)}`);
                        Text.fontSize('12fp');
                        Text.fontColor('#999999');
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
        // 发布者和时间信息
        Row.pop();
        Column.pop();
    }
    // 格式化日期时间
    private formatDateTime(dateTimeStr: string): string {
        try {
            // 如果是 ISO 8601 格式，转换为可读格式
            if (dateTimeStr.includes('T')) {
                const date = new Date(dateTimeStr);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            }
            return dateTimeStr;
        }
        catch (error) {
            return dateTimeStr;
        }
    }
    refreshBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.clip(true);
            Stack.height('64vp');
            Stack.width('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            LoadingProgress.create();
            LoadingProgress.width('32vp');
            LoadingProgress.height('32vp');
            LoadingProgress.color('#FF6B00');
        }, LoadingProgress);
        Stack.pop();
    }
    buildBrowserLayer(url: string, parent = null) {
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
                this.closeBrowser();
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
            Web.create({ src: url, controller: this.webController });
            Web.layoutWeight(1);
            Web.width('100%');
        }, Web);
        Column.pop();
    }
    initialRender() {
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
                        value: this.searchText,
                        placeholder: '搜索新闻',
                        hotTitles: this.hotTitles,
                        onSearch: (url: string) => {
                            this.openBrowser(url);
                        }
                    }, undefined, elmtId, () => { }, { page: "features/follows/src/main/ets/view/Follow.ets", line: 259, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            value: this.searchText,
                            placeholder: '搜索新闻',
                            hotTitles: this.hotTitles,
                            onSearch: (url: string) => {
                                this.openBrowser(url);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        value: this.searchText,
                        hotTitles: this.hotTitles
                    });
                }
            }, { name: "CommonSearchBar" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 页面标题
            Text.create('我的关注');
            // 页面标题
            Text.fontSize('20fp');
            // 页面标题
            Text.fontWeight(FontWeight.Bold);
            // 页面标题
            Text.margin({ top: '20vp', bottom: '20vp' });
            // 页面标题
            Text.width('100%');
            // 页面标题
            Text.textAlign(TextAlign.Center);
        }, Text);
        // 页面标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 新闻列表
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 加载状态
                        Column.create();
                        // 加载状态
                        Column.width('100%');
                        // 加载状态
                        Column.layoutWeight(1);
                        // 加载状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width('40vp');
                        LoadingProgress.height('40vp');
                        LoadingProgress.color('#FF6B00');
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize('14fp');
                        Text.fontColor('#999999');
                        Text.margin({ top: '16vp' });
                    }, Text);
                    Text.pop();
                    // 加载状态
                    Column.pop();
                });
            }
            else if (this.newsList.length > 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 有数据时显示列表
                        Refresh.create({ refreshing: { value: this.isLoading, changeEvent: newValue => { this.isLoading = newValue; } }, builder: this.refreshBuilder.bind(this) });
                        // 有数据时显示列表
                        Refresh.layoutWeight(1);
                        // 有数据时显示列表
                        Refresh.onRefreshing(() => {
                            this.refreshNewsList();
                        });
                    }, Refresh);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollBar(BarState.Off);
                        Scroll.width('100%');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            this.buildNewsItem.bind(this)(item, index);
                        };
                        this.forEachUpdateFunction(elmtId, this.newsList, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    Scroll.pop();
                    // 有数据时显示列表
                    Refresh.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态
                        Column.create();
                        // 空状态
                        Column.width('100%');
                        // 空状态
                        Column.layoutWeight(1);
                        // 空状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无关注的新闻');
                        Text.fontSize('16fp');
                        Text.fontColor('#999999');
                        Text.margin({ top: '20vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('关注感兴趣的新闻，在这里查看');
                        Text.fontSize('14fp');
                        Text.fontColor('#CCCCCC');
                        Text.margin({ top: '12vp' });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('刷新');
                        Button.fontSize('14fp');
                        Button.backgroundColor('#FF6B00');
                        Button.margin({ top: '24vp' });
                        Button.onClick(() => {
                            this.refreshNewsList();
                        });
                    }, Button);
                    Button.pop();
                    // 空状态
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedUrl !== null) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildBrowserLayer.bind(this)(this.selectedUrl as string);
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
    rerender() {
        this.updateDirtyElements();
    }
}
