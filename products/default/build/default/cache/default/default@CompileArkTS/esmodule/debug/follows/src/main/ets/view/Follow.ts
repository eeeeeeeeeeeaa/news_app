if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FollowPage_Params {
    searchText?: string;
    selectedUrl?: string | null;
    webController?: webview.WebviewController;
    hotTitles?: string[];
    followedNewsList?: FollowedNewsItem[];
    isLoading?: boolean;
    errorMessage?: string;
    newsFollowService?: NewsFollowService;
}
interface NewsCard_Params {
    newsData?: FollowedNewsData;
    onCardClick?: (newsData: FollowedNewsData) => void;
    onUnfollow?: () => void;
}
import { CommonSearchBar } from "@bundle:com.huawei.quickstart/default@uicomponents/Index";
import { BaiduHotSearchParser } from "@bundle:com.huawei.quickstart/default@utils/Index";
import webview from "@ohos:web.webview";
import { NewsFollowService, type FollowedNewsItem } from "@bundle:com.huawei.quickstart/default@follows/ets/view/NewsFollowService";
/**
 * 关注新闻数据接口
 */
export interface FollowedNewsData {
    id: string;
    title: string;
    publishTime: string;
    publisher: string;
    imageUrl?: string;
    content?: string;
}
export class NewsCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__newsData = new SynchedPropertyObjectOneWayPU(params.newsData, this, "newsData");
        this.onCardClick = undefined;
        this.onUnfollow = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NewsCard_Params) {
        if (params.onCardClick !== undefined) {
            this.onCardClick = params.onCardClick;
        }
        if (params.onUnfollow !== undefined) {
            this.onUnfollow = params.onUnfollow;
        }
    }
    updateStateVars(params: NewsCard_Params) {
        this.__newsData.reset(params.newsData);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__newsData.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__newsData.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __newsData: SynchedPropertySimpleOneWayPU<FollowedNewsData>;
    get newsData() {
        return this.__newsData.get();
    }
    set newsData(newValue: FollowedNewsData) {
        this.__newsData.set(newValue);
    }
    private onCardClick?: (newsData: FollowedNewsData) => void;
    private onUnfollow?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(8);
            Column.shadow({
                radius: 4,
                color: '#1A000000',
                offsetX: 0,
                offsetY: 2
            });
            Column.onClick(() => {
                if (this.onCardClick) {
                    this.onCardClick(ObservedObject.GetRawObject(this.newsData));
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 新闻标题
            Text.create(this.newsData.title);
            // 新闻标题
            Text.fontSize(16);
            // 新闻标题
            Text.fontWeight(FontWeight.Medium);
            // 新闻标题
            Text.fontColor('#182431');
            // 新闻标题
            Text.maxLines(2);
            // 新闻标题
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 新闻标题
            Text.width('100%');
            // 新闻标题
            Text.margin({ bottom: 8 });
        }, Text);
        // 新闻标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部信息行
            Row.create();
            // 底部信息行
            Row.width('100%');
            // 底部信息行
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布者
            Text.create(this.newsData.publisher);
            // 发布者
            Text.fontSize(12);
            // 发布者
            Text.fontColor('#666666');
            // 发布者
            Text.backgroundColor('#F5F5F5');
            // 发布者
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            // 发布者
            Text.borderRadius(4);
        }, Text);
        // 发布者
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 取消关注按钮
            if (this.onUnfollow) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('取消关注');
                        Text.fontSize(12);
                        Text.fontColor('#E60012');
                        Text.backgroundColor('#FFF5F5');
                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                        Text.borderRadius(4);
                        Text.margin({ right: 8 });
                        Text.onClick(() => {
                            if (this.onUnfollow) {
                                this.onUnfollow();
                            }
                        });
                    }, Text);
                    Text.pop();
                });
            }
            // 发布时间
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布时间
            Text.create(this.formatTime(this.newsData.publishTime));
            // 发布时间
            Text.fontSize(12);
            // 发布时间
            Text.fontColor('#999999');
        }, Text);
        // 发布时间
        Text.pop();
        // 底部信息行
        Row.pop();
        Column.pop();
    }
    /**
     * 格式化时间显示
     * @param timeStr 时间字符串
     * @returns 格式化后的时间
     */
    private formatTime(timeStr: string): string {
        try {
            const date = new Date(timeStr);
            const now = new Date();
            const diff = now.getTime() - date.getTime();
            // 计算时间差
            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (minutes < 60) {
                return `${minutes}分钟前`;
            }
            else if (hours < 24) {
                return `${hours}小时前`;
            }
            else if (days < 7) {
                return `${days}天前`;
            }
            else {
                // 超过7天显示具体日期
                return `${date.getMonth() + 1}月${date.getDate()}日`;
            }
        }
        catch (error) {
            return timeStr;
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
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
        this.__followedNewsList = new ObservedPropertyObjectPU([], this, "followedNewsList");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.newsFollowService = NewsFollowService.getInstance();
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
        if (params.followedNewsList !== undefined) {
            this.followedNewsList = params.followedNewsList;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.newsFollowService !== undefined) {
            this.newsFollowService = params.newsFollowService;
        }
    }
    updateStateVars(params: FollowPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__hotTitles.purgeDependencyOnElmtId(rmElmtId);
        this.__followedNewsList.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__selectedUrl.aboutToBeDeleted();
        this.__hotTitles.aboutToBeDeleted();
        this.__followedNewsList.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
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
    private __followedNewsList: ObservedPropertyObjectPU<FollowedNewsItem[]>;
    get followedNewsList() {
        return this.__followedNewsList.get();
    }
    set followedNewsList(newValue: FollowedNewsItem[]) {
        this.__followedNewsList.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>; // 标记是否正在加载
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>; // 错误信息
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private newsFollowService: NewsFollowService;
    async aboutToAppear() {
        try {
            const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
            this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
        }
        catch (_) {
            this.hotTitles = [];
        }
        // 加载关注的新闻数据
        await this.loadFollowedNewsList();
    }
    /**
     * 加载关注的新闻列表
     */
    private async loadFollowedNewsList(): Promise<void> {
        this.isLoading = true;
        this.errorMessage = '';
        try {
            const followedNews = await this.newsFollowService.getFollowedNewsList();
            this.followedNewsList = followedNews;
            this.isLoading = false;
            console.log('✅ 成功加载关注列表，共', followedNews.length, '条数据');
        }
        catch (error) {
            console.error('❌ 加载关注列表失败:', error);
            this.followedNewsList = [];
            this.isLoading = false;
            if (error instanceof Error) {
                this.errorMessage = error.message;
            }
            else {
                this.errorMessage = '加载失败，请稍后再试';
            }
        }
    }
    private openBrowser(url: string): void {
        this.selectedUrl = url;
    }
    private closeBrowser(): void {
        this.selectedUrl = null;
    }
    /**
     * 点击新闻卡片，打开新闻详情
     * @param newsData 新闻数据
     */
    private onNewsCardClick(newsData: FollowedNewsItem): void {
        console.log('点击新闻卡片:', newsData.newsTitle);
        console.log('新闻URL:', newsData.newsUniquekey);
        // newsUniquekey 实际存放的是新闻的 URL
        if (newsData.newsUniquekey && newsData.newsUniquekey.trim().length > 0) {
            this.openBrowser(newsData.newsUniquekey);
        }
        else {
            console.warn('新闻URL为空，无法打开详情');
        }
    }
    /**
     * 取消关注新闻
     * @param newsData 新闻数据
     */
    private async onUnfollowNews(newsData: FollowedNewsItem): Promise<void> {
        try {
            const success = await this.newsFollowService.unfollowNews(newsData.newsUniquekey);
            if (success) {
                // 从列表中移除该新闻
                this.followedNewsList = this.followedNewsList.filter(item => item.followId !== newsData.followId);
            }
        }
        catch (error) {
            console.error('取消关注失败:', error);
        }
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
            Text.create('新闻详情');
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
                    }, undefined, elmtId, () => { }, { page: "features/follows/src/main/ets/view/Follow.ets", line: 251, col: 9 });
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
            // 页面标题和刷新按钮
            Row.create();
            // 页面标题和刷新按钮
            Row.width('100%');
            // 页面标题和刷新按钮
            Row.margin({ left: 16, right: 16, top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的关注');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#182431');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 刷新按钮
            Text.create('刷新');
            // 刷新按钮
            Text.fontSize(12);
            // 刷新按钮
            Text.fontColor('#1890FF');
            // 刷新按钮
            Text.backgroundColor('#F0F9FF');
            // 刷新按钮
            Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            // 刷新按钮
            Text.borderRadius(4);
            // 刷新按钮
            Text.onClick(() => {
                this.loadFollowedNewsList();
            });
        }, Text);
        // 刷新按钮
        Text.pop();
        // 页面标题和刷新按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 内容区域
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 加载状态
                        Column.create();
                        // 加载状态
                        Column.layoutWeight(1);
                        // 加载状态
                        Column.justifyContent(FlexAlign.Center);
                        // 加载状态
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.margin({ bottom: 16 });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在加载...');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    // 加载状态
                    Column.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 错误状态
                        Column.create();
                        // 错误状态
                        Column.layoutWeight(1);
                        // 错误状态
                        Column.justifyContent(FlexAlign.Center);
                        // 错误状态
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚠️');
                        Text.fontSize(48);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载失败');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#FF4D4F');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击刷新重试');
                        Text.fontSize(12);
                        Text.fontColor('#1890FF');
                        Text.onClick(() => {
                            this.loadFollowedNewsList();
                        });
                    }, Text);
                    Text.pop();
                    // 错误状态
                    Column.pop();
                });
            }
            else if (this.followedNewsList.length > 0) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 有数据状态
                        List.create();
                        // 有数据状态
                        List.layoutWeight(1);
                        // 有数据状态
                        List.width('100%');
                        // 有数据状态
                        List.backgroundColor('#F8F9FA');
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const newsItem = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    itemCreation2(elmtId, isInitialRender);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        __Common__.create();
                                        __Common__.margin({ left: 16, right: 16, bottom: 12 });
                                    }, __Common__);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new NewsCard(this, {
                                                    newsData: {
                                                        id: newsItem.newsUniquekey,
                                                        title: newsItem.newsTitle,
                                                        publishTime: newsItem.newsTime || '',
                                                        publisher: newsItem.newsAuthor || '',
                                                        imageUrl: undefined,
                                                        content: undefined
                                                    },
                                                    onCardClick: (newsData: FollowedNewsData) => {
                                                        this.onNewsCardClick(newsItem);
                                                    },
                                                    onUnfollow: () => {
                                                        this.onUnfollowNews(newsItem);
                                                    }
                                                }, undefined, elmtId, () => { }, { page: "features/follows/src/main/ets/view/Follow.ets", line: 334, col: 17 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        newsData: {
                                                            id: newsItem.newsUniquekey,
                                                            title: newsItem.newsTitle,
                                                            publishTime: newsItem.newsTime || '',
                                                            publisher: newsItem.newsAuthor || '',
                                                            imageUrl: undefined,
                                                            content: undefined
                                                        },
                                                        onCardClick: (newsData: FollowedNewsData) => {
                                                            this.onNewsCardClick(newsItem);
                                                        },
                                                        onUnfollow: () => {
                                                            this.onUnfollowNews(newsItem);
                                                        }
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    newsData: {
                                                        id: newsItem.newsUniquekey,
                                                        title: newsItem.newsTitle,
                                                        publishTime: newsItem.newsTime || '',
                                                        publisher: newsItem.newsAuthor || '',
                                                        imageUrl: undefined,
                                                        content: undefined
                                                    }
                                                });
                                            }
                                        }, { name: "NewsCard" });
                                    }
                                    __Common__.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.followedNewsList, forEachItemGenFunction, (newsItem: FollowedNewsItem, index: number) => `${newsItem.followId}-${index}`, true, true);
                    }, ForEach);
                    ForEach.pop();
                    // 有数据状态
                    List.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态（没有关注任何新闻）
                        Column.create();
                        // 空状态（没有关注任何新闻）
                        Column.layoutWeight(1);
                        // 空状态（没有关注任何新闻）
                        Column.justifyContent(FlexAlign.Center);
                        // 空状态（没有关注任何新闻）
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📰');
                        Text.fontSize(48);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无关注的新闻');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#999999');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('去关注一些感兴趣的新闻吧');
                        Text.fontSize(14);
                        Text.fontColor('#CCCCCC');
                    }, Text);
                    Text.pop();
                    // 空状态（没有关注任何新闻）
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
