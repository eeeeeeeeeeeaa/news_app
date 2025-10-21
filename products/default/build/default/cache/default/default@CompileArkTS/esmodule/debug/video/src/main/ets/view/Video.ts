if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface VideoPage_Params {
    searchText?: string;
    hotTitles?: string[];
    selectedUrl?: string | null;
    webController?: webview.WebviewController;
    categories?: string[];
    currentCategory?: string;
    newsList?: NewsHeadlineItem[];
    isLoading?: boolean;
    debugRequestUrl?: string;
    refreshing?: boolean;
    loadingMore?: boolean;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
}
import { CommonSearchBar } from "@bundle:com.huawei.quickstart/default@uicomponents/Index";
import { BaiduHotSearchParser, NewsHeadlineService, buildNewsApiUrl, maskApiKey } from "@bundle:com.huawei.quickstart/default@utils/Index";
import type { NewsHeadlineItem, NewsApiRequestParams } from "@bundle:com.huawei.quickstart/default@utils/Index";
import webview from "@ohos:web.webview";
export default class VideoPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__hotTitles = new ObservedPropertyObjectPU([], this, "hotTitles");
        this.__selectedUrl = new ObservedPropertyObjectPU(null, this, "selectedUrl");
        this.webController = new webview.WebviewController();
        this.__categories = new ObservedPropertyObjectPU(['推荐', '国内', '国际', '娱乐', '体育', '军事', '科技', '财经', '游戏', '汽车', '健康'], this, "categories");
        this.__currentCategory = new ObservedPropertySimplePU('推荐', this, "currentCategory");
        this.__newsList = new ObservedPropertyObjectPU([], this, "newsList");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__debugRequestUrl = new ObservedPropertySimplePU('', this, "debugRequestUrl");
        this.__refreshing = new ObservedPropertySimplePU(false, this, "refreshing");
        this.__loadingMore = new ObservedPropertySimplePU(false, this, "loadingMore");
        this.__page = new ObservedPropertySimplePU(1, this, "page");
        this.__pageSize = new ObservedPropertySimplePU(20, this, "pageSize");
        this.__hasMore = new ObservedPropertySimplePU(true, this, "hasMore");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: VideoPage_Params) {
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.hotTitles !== undefined) {
            this.hotTitles = params.hotTitles;
        }
        if (params.selectedUrl !== undefined) {
            this.selectedUrl = params.selectedUrl;
        }
        if (params.webController !== undefined) {
            this.webController = params.webController;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.currentCategory !== undefined) {
            this.currentCategory = params.currentCategory;
        }
        if (params.newsList !== undefined) {
            this.newsList = params.newsList;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.debugRequestUrl !== undefined) {
            this.debugRequestUrl = params.debugRequestUrl;
        }
        if (params.refreshing !== undefined) {
            this.refreshing = params.refreshing;
        }
        if (params.loadingMore !== undefined) {
            this.loadingMore = params.loadingMore;
        }
        if (params.page !== undefined) {
            this.page = params.page;
        }
        if (params.pageSize !== undefined) {
            this.pageSize = params.pageSize;
        }
        if (params.hasMore !== undefined) {
            this.hasMore = params.hasMore;
        }
    }
    updateStateVars(params: VideoPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__hotTitles.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__categories.purgeDependencyOnElmtId(rmElmtId);
        this.__currentCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__newsList.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__debugRequestUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshing.purgeDependencyOnElmtId(rmElmtId);
        this.__loadingMore.purgeDependencyOnElmtId(rmElmtId);
        this.__page.purgeDependencyOnElmtId(rmElmtId);
        this.__pageSize.purgeDependencyOnElmtId(rmElmtId);
        this.__hasMore.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__hotTitles.aboutToBeDeleted();
        this.__selectedUrl.aboutToBeDeleted();
        this.__categories.aboutToBeDeleted();
        this.__currentCategory.aboutToBeDeleted();
        this.__newsList.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__debugRequestUrl.aboutToBeDeleted();
        this.__refreshing.aboutToBeDeleted();
        this.__loadingMore.aboutToBeDeleted();
        this.__page.aboutToBeDeleted();
        this.__pageSize.aboutToBeDeleted();
        this.__hasMore.aboutToBeDeleted();
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
    private __hotTitles: ObservedPropertyObjectPU<string[]>;
    get hotTitles() {
        return this.__hotTitles.get();
    }
    set hotTitles(newValue: string[]) {
        this.__hotTitles.set(newValue);
    }
    private __selectedUrl: ObservedPropertyObjectPU<string | null>;
    get selectedUrl() {
        return this.__selectedUrl.get();
    }
    set selectedUrl(newValue: string | null) {
        this.__selectedUrl.set(newValue);
    }
    private webController: webview.WebviewController;
    // Text-only news for video page
    private __categories: ObservedPropertyObjectPU<string[]>;
    get categories() {
        return this.__categories.get();
    }
    set categories(newValue: string[]) {
        this.__categories.set(newValue);
    }
    private __currentCategory: ObservedPropertySimplePU<string>;
    get currentCategory() {
        return this.__currentCategory.get();
    }
    set currentCategory(newValue: string) {
        this.__currentCategory.set(newValue);
    }
    private __newsList: ObservedPropertyObjectPU<NewsHeadlineItem[]>;
    get newsList() {
        return this.__newsList.get();
    }
    set newsList(newValue: NewsHeadlineItem[]) {
        this.__newsList.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __debugRequestUrl: ObservedPropertySimplePU<string>;
    get debugRequestUrl() {
        return this.__debugRequestUrl.get();
    }
    set debugRequestUrl(newValue: string) {
        this.__debugRequestUrl.set(newValue);
    }
    // Refresh & pagination
    private __refreshing: ObservedPropertySimplePU<boolean>;
    get refreshing() {
        return this.__refreshing.get();
    }
    set refreshing(newValue: boolean) {
        this.__refreshing.set(newValue);
    }
    private __loadingMore: ObservedPropertySimplePU<boolean>;
    get loadingMore() {
        return this.__loadingMore.get();
    }
    set loadingMore(newValue: boolean) {
        this.__loadingMore.set(newValue);
    }
    private __page: ObservedPropertySimplePU<number>;
    get page() {
        return this.__page.get();
    }
    set page(newValue: number) {
        this.__page.set(newValue);
    }
    private __pageSize: ObservedPropertySimplePU<number>;
    get pageSize() {
        return this.__pageSize.get();
    }
    set pageSize(newValue: number) {
        this.__pageSize.set(newValue);
    }
    private __hasMore: ObservedPropertySimplePU<boolean>;
    get hasMore() {
        return this.__hasMore.get();
    }
    set hasMore(newValue: boolean) {
        this.__hasMore.set(newValue);
    }
    async aboutToAppear() {
        // preload hot titles for search bar placeholder (reuse existing behavior)
        try {
            const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
            this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
        }
        catch (_) {
            this.hotTitles = [];
        }
        await this.reloadCurrentCategory();
    }
    private getTypeForCategory(category: string): string {
        switch (category) {
            case '推荐':
                return 'top';
            case '国内':
                return 'guonei';
            case '国际':
                return 'guoji';
            case '娱乐':
                return 'yule';
            case '体育':
                return 'tiyu';
            case '军事':
                return 'junshi';
            case '科技':
                return 'keji';
            case '财经':
                return 'caijing';
            case '游戏':
                return 'youxi';
            case '汽车':
                return 'qiche';
            case '健康':
                return 'jiankang';
            default:
                return 'top';
        }
    }
    private async reloadCurrentCategory() {
        this.page = 1;
        this.hasMore = true;
        await this.loadNewsByCategory(this.currentCategory, true);
    }
    private async loadNewsByCategory(category: string, replace: boolean = false) {
        this.isLoading = replace && !this.refreshing;
        try {
            const type = this.getTypeForCategory(category);
            const params: NewsApiRequestParams = { type: type, is_filter: 0, page: this.page, size: this.pageSize };
            // Debug: print and keep masked url
            const url = buildNewsApiUrl(params);
            this.debugRequestUrl = maskApiKey(url);
            const list = await NewsHeadlineService.fetch(params);
            this.currentCategory = category;
            this.hasMore = list.length >= this.pageSize;
            if (replace) {
                this.newsList = list;
            }
            else {
                this.newsList = [...this.newsList, ...list];
            }
        }
        catch (e) {
            if (replace) {
                this.newsList = [];
            }
            // no error code handling as requested
        }
        finally {
            this.isLoading = false;
            this.refreshing = false;
            this.loadingMore = false;
        }
    }
    private onTabClick(category: string) {
        if (this.currentCategory === category)
            return;
        this.page = 1;
        this.hasMore = true;
        this.loadNewsByCategory(category, true).catch(() => { });
    }
    private async onPullToRefresh() {
        if (this.refreshing)
            return;
        this.refreshing = true;
        this.page = 1;
        this.hasMore = true;
        await this.loadNewsByCategory(this.currentCategory, true);
    }
    private async onLoadMore() {
        if (this.loadingMore || !this.hasMore)
            return;
        this.loadingMore = true;
        this.page += 1;
        await this.loadNewsByCategory(this.currentCategory, false);
    }
    private openBrowser(url: string): void {
        this.selectedUrl = url;
    }
    private closeBrowser(): void {
        this.selectedUrl = null;
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
            Text.create('网页浏览');
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
    buildCategoryTabs(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor(Color.White);
            Column.shadow({ radius: 4, color: '#0A000000', offsetX: 0, offsetY: 1 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollable(ScrollDirection.Horizontal);
            Scroll.scrollBar(BarState.Off);
            Scroll.height('48vp');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.padding({ left: '12vp', right: '12vp' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const c = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(c);
                    Text.fontSize(16);
                    Text.fontWeight(this.currentCategory === c ? FontWeight.Bold : FontWeight.Regular);
                    Text.fontColor(this.currentCategory === c ? '#182431' : '#666666');
                    Text.backgroundColor(this.currentCategory === c ? '#E6F3FF' : Color.Transparent);
                    Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                    Text.borderRadius(14);
                    Text.onClick(() => this.onTabClick(c));
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Scroll.pop();
        Column.pop();
    }
    buildTextNewsItem(item: NewsHeadlineItem, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ top: '8vp', bottom: '8vp' });
            Column.onClick(() => this.openBrowser(item.url));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.title);
            Text.fontSize('16fp');
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#182431');
            Text.maxLines(3);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.lineHeight('21fp');
            Text.margin({ bottom: '6vp' });
            Text.textAlign(TextAlign.Start);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.source) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(String(item.source));
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.source && item.time) {
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
            If.create();
            if (item.time) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(String(item.time));
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
        Row.pop();
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
                    // Top search bar (keep consistent with other pages)
                    CommonSearchBar(this, {
                        value: this.searchText,
                        placeholder: '搜新�?热词',
                        hotTitles: this.hotTitles,
                        onSearch: (url: string) => this.openBrowser(url)
                    }, undefined, elmtId, () => { }, { page: "features/video/src/main/ets/view/Video.ets", line: 236, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            value: this.searchText,
                            placeholder: '搜新�?热词',
                            hotTitles: this.hotTitles,
                            onSearch: (url: string) => this.openBrowser(url)
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
        this.buildCategoryTabs.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Content list (text-only) with pull-to-refresh and load-more
            Refresh.create({ refreshing: this.refreshing });
            // Content list (text-only) with pull-to-refresh and load-more
            Refresh.onStateChange((s: RefreshStatus) => {
                if (s === RefreshStatus.Refresh) {
                    this.onPullToRefresh();
                }
            });
            // Content list (text-only) with pull-to-refresh and load-more
            Refresh.layoutWeight(1);
        }, Refresh);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: 0 });
            List.edgeEffect(EdgeEffect.Spring);
            List.onReachEnd(() => this.onLoadMore());
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isLoading && !this.refreshing && this.newsList.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
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
                                Column.create();
                                Column.padding(24);
                                Column.width('100%');
                                Column.justifyContent(FlexAlign.Center);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('暂无数据');
                                Text.fontSize('14fp');
                                Text.fontColor('#999999');
                                Text.margin({ bottom: 8 });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.debugRequestUrl && this.debugRequestUrl.length > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(this.debugRequestUrl);
                                            Text.fontSize('12fp');
                                            Text.fontColor('#666666');
                                            Text.lineHeight('16fp');
                                            Text.maxLines(3);
                                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                            Text.textAlign(TextAlign.Center);
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
                            Column.pop();
                            ListItem.pop();
                        };
                        this.observeComponentCreation2(itemCreation2, ListItem);
                        ListItem.pop();
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, i: number) => {
                            const n = _item;
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
                                    this.buildTextNewsItem.bind(this)(n, i);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (i < this.newsList.length - 1) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Divider.create();
                                                    Divider.strokeWidth('0.5vp');
                                                    Divider.color('#F0F0F0');
                                                }, Divider);
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.newsList, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.loadingMore) {
                            this.ifElseBranchUpdateFunction(0, () => {
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
                                            Row.create();
                                            Row.width('100%');
                                            Row.padding(12);
                                            Row.justifyContent(FlexAlign.Center);
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            LoadingProgress.create();
                                            LoadingProgress.width('16vp');
                                            LoadingProgress.height('16vp');
                                            LoadingProgress.margin({ right: '6vp' });
                                        }, LoadingProgress);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('加载');
                                            Text.fontSize('12fp');
                                            Text.fontColor('#999999');
                                        }, Text);
                                        Text.pop();
                                        Row.pop();
                                        ListItem.pop();
                                    };
                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                    ListItem.pop();
                                }
                            });
                        }
                        else if (!this.hasMore && this.newsList.length > 0) {
                            this.ifElseBranchUpdateFunction(1, () => {
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
                                            Text.create('没有更多');
                                            Text.fontSize('12fp');
                                            Text.fontColor('#999999');
                                            Text.padding(12);
                                            Text.width('100%');
                                            Text.textAlign(TextAlign.Center);
                                        }, Text);
                                        Text.pop();
                                        ListItem.pop();
                                    };
                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                    ListItem.pop();
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
        List.pop();
        // Content list (text-only) with pull-to-refresh and load-more
        Refresh.pop();
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
