if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NewsPage_Params {
    currentCategory?: string;
    hotNewsData?: NewsData[];
    newsListData?: NewsData[];
    categories?: string[];
    searchText?: string;
    showSearchAction?: boolean;
    mainViewModel?: MainViewModel;
}
/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * News data entity.
 */
class NewsData {
    /**
     * News ID.
     */
    id: number;
    /**
     * News title.
     */
    title: string;
    /**
     * News summary.
     */
    summary: string;
    /**
     * News source.
     */
    source: string;
    /**
     * News publish time.
     */
    publishTime: string;
    /**
     * News image URL.
     */
    imageUrl: Resource;
    /**
     * News category.
     */
    category: string;
    /**
     * News read count.
     */
    readCount: number;
    /**
     * Whether news is hot.
     */
    isHot: boolean;
    /**
     * Whether news is top.
     */
    isTop: boolean;
    constructor(id: number, title: string, summary: string, source: string, publishTime: string, imageUrl: Resource, category: string, readCount: number, isHot: boolean = false, isTop: boolean = false) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.source = source;
        this.publishTime = publishTime;
        this.imageUrl = imageUrl;
        this.category = category;
        this.readCount = readCount;
        this.isHot = isHot;
        this.isTop = isTop;
    }
}
/**
 * Main view model for news data.
 */
class MainViewModel {
    /**
     * Get hot news data.
     *
     * @return {Array<NewsData>} hotNewsData.
     */
    getHotNewsData(): Array<NewsData> {
        let hotNewsData: NewsData[] = [
            new NewsData(1, "科技突破：人工智能在医疗领域取得重大进展", "最新研究显示，AI技术在疾病诊断和治疗方案制定方面展现出巨大潜力...", "科技日报", "2小时前", { "id": 16777236, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, "科技", 125000, true, true),
            new NewsData(2, "经济观察：全球股市震荡，投资者需谨慎", "受多重因素影响，全球主要股市出现不同程度波动，专家建议理性投资...", "财经网", "3小时前", { "id": 16777237, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, "财经", 89000, true, false),
            new NewsData(3, "教育改革：新课程标准正式发布", "教育部发布最新课程标准，强调素质教育与创新能力培养...", "教育时报", "5小时前", { "id": 16777238, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, "教育", 67000, true, false)
        ];
        return hotNewsData;
    }
    /**
     * Get news list data.
     *
     * @return {Array<NewsData>} newsListData.
     */
    getNewsListData(): Array<NewsData> {
        let newsListData: NewsData[] = [
            new NewsData(4, "环保行动：多地启动绿色出行计划", "为减少碳排放，多个城市推出绿色出行激励政策...", "环保日报", "6小时前", { "id": 16777239, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, "环保", 43000, false, false),
            new NewsData(5, "体育赛事：世界杯预选赛精彩回顾", "多支强队在预选赛中展现出色表现，为即将到来的正赛做准备...", "体育周报", "8小时前", { "id": 16777236, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, "体育", 56000, false, false),
            new NewsData(6, "文化传承：非物质文化遗产保护工作取得新进展", "各地加大非遗保护力度，让传统文化在新时代焕发新活力...", "文化周刊", "10小时前", { "id": 16777237, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, "文化", 32000, false, false),
            new NewsData(7, "健康生活：专家建议的冬季养生指南", "冬季是养生的关键时期，专家提醒注意饮食调理和适度运动...", "健康时报", "12小时前", { "id": 16777238, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, "健康", 28000, false, false)
        ];
        return newsListData;
    }
    /**
     * Get news categories.
     *
     * @return {Array<string>} categories.
     */
    getNewsCategories(): Array<string> {
        return ["推荐", "科技", "财经", "体育", "教育", "环保", "文化", "健康", "旅游"];
    }
    /**
     * Format read count.
     *
     * @param {number} count - read count.
     * @return {string} formatted count.
     */
    formatReadCount(count: number): string {
        if (count >= 10000) {
            return Math.floor(count / 10000) + "万";
        }
        else if (count >= 1000) {
            return Math.floor(count / 1000) + "k";
        }
        else {
            return count.toString();
        }
    }
}
export class NewsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentCategory = new ObservedPropertySimplePU("推荐", this, "currentCategory");
        this.__hotNewsData = new ObservedPropertyObjectPU([], this, "hotNewsData");
        this.__newsListData = new ObservedPropertyObjectPU([], this, "newsListData");
        this.__categories = new ObservedPropertyObjectPU([], this, "categories");
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__showSearchAction = new ObservedPropertySimplePU(false, this, "showSearchAction");
        this.mainViewModel = new MainViewModel();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NewsPage_Params) {
        if (params.currentCategory !== undefined) {
            this.currentCategory = params.currentCategory;
        }
        if (params.hotNewsData !== undefined) {
            this.hotNewsData = params.hotNewsData;
        }
        if (params.newsListData !== undefined) {
            this.newsListData = params.newsListData;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.showSearchAction !== undefined) {
            this.showSearchAction = params.showSearchAction;
        }
        if (params.mainViewModel !== undefined) {
            this.mainViewModel = params.mainViewModel;
        }
    }
    updateStateVars(params: NewsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__hotNewsData.purgeDependencyOnElmtId(rmElmtId);
        this.__newsListData.purgeDependencyOnElmtId(rmElmtId);
        this.__categories.purgeDependencyOnElmtId(rmElmtId);
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__showSearchAction.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentCategory.aboutToBeDeleted();
        this.__hotNewsData.aboutToBeDeleted();
        this.__newsListData.aboutToBeDeleted();
        this.__categories.aboutToBeDeleted();
        this.__searchText.aboutToBeDeleted();
        this.__showSearchAction.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentCategory: ObservedPropertySimplePU<string>;
    get currentCategory() {
        return this.__currentCategory.get();
    }
    set currentCategory(newValue: string) {
        this.__currentCategory.set(newValue);
    }
    private __hotNewsData: ObservedPropertyObjectPU<NewsData[]>;
    get hotNewsData() {
        return this.__hotNewsData.get();
    }
    set hotNewsData(newValue: NewsData[]) {
        this.__hotNewsData.set(newValue);
    }
    private __newsListData: ObservedPropertyObjectPU<NewsData[]>;
    get newsListData() {
        return this.__newsListData.get();
    }
    set newsListData(newValue: NewsData[]) {
        this.__newsListData.set(newValue);
    }
    private __categories: ObservedPropertyObjectPU<string[]>;
    get categories() {
        return this.__categories.get();
    }
    set categories(newValue: string[]) {
        this.__categories.set(newValue);
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __showSearchAction: ObservedPropertySimplePU<boolean>;
    get showSearchAction() {
        return this.__showSearchAction.get();
    }
    set showSearchAction(newValue: boolean) {
        this.__showSearchAction.set(newValue);
    }
    private mainViewModel: MainViewModel;
    aboutToAppear() {
        this.hotNewsData = this.mainViewModel.getHotNewsData();
        this.newsListData = this.mainViewModel.getNewsListData();
        this.categories = this.mainViewModel.getNewsCategories();
    }
    /**
     * Build enhanced search bar.
     */
    buildSearchBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: '12vp', right: '8vp', top: '8vp', bottom: '8vp' });
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框区域
            Row.create();
            // 搜索框区域
            Row.height('36vp');
            // 搜索框区域
            Row.backgroundColor('#FFFFFF');
            // 搜索框区域
            Row.borderRadius('18vp');
            // 搜索框区域
            Row.border({ width: '1vp', color: '#E5E5E5' });
            // 搜索框区域
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777242, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Image.width('16vp');
            Image.height('16vp');
            Image.margin({ left: '12vp', right: '8vp' });
            Image.fillColor('#999999');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索新闻', text: this.searchText });
            TextInput.fontSize('14fp');
            TextInput.fontColor('#182431');
            TextInput.backgroundColor(Color.Transparent);
            TextInput.placeholderColor('#999999');
            TextInput.layoutWeight(1);
            TextInput.onChange((value: string) => {
                this.searchText = value;
                this.showSearchAction = value.length > 0;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showSearchAction) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777242, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Image.width('14vp');
                        Image.height('14vp');
                        Image.margin({ right: '12vp' });
                        Image.fillColor('#999999');
                        Image.onClick(() => {
                            this.searchText = '';
                            this.showSearchAction = false;
                        });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 搜索框区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Row.create();
            // 操作按钮
            Row.height('36vp');
            // 操作按钮
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777241, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Image.width('20vp');
            Image.height('20vp');
            Image.margin({ left: '12vp', right: '12vp' });
            Image.fillColor('#333333');
            Image.onClick(() => {
                // 处理消息点击
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777240, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Image.width('20vp');
            Image.height('20vp');
            Image.margin({ right: '4vp' });
            Image.fillColor('#333333');
            Image.onClick(() => {
                // 处理更多操作
            });
        }, Image);
        // 操作按钮
        Row.pop();
        Row.pop();
    }
    /**
     * Build enhanced category tab.
     */
    buildCategoryTab(category: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Center);
            Column.onClick(() => {
                this.currentCategory = category;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(category);
            Text.fontSize(this.currentCategory === category ? '16fp' : '14fp');
            Text.fontColor(this.currentCategory === category ? '#007DFF' : '#666666');
            Text.fontWeight(this.currentCategory === category ? FontWeight.Medium : FontWeight.Normal);
            Text.padding({ left: '16vp', right: '16vp', top: '8vp', bottom: '8vp' });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 选中指示器
            if (this.currentCategory === category) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('20vp');
                        Column.height('3vp');
                        Column.backgroundColor('#007DFF');
                        Column.borderRadius('2vp');
                        Column.margin({ top: '2vp' });
                    }, Column);
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * Build enhanced hot news item.
     */
    buildHotNewsItem(news: NewsData, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ top: '8vp', bottom: '8vp' });
            Column.onClick(() => {
                // Handle news click
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 排名标识
            if (index < 3) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create((index + 1).toString());
                        Text.fontSize('14fp');
                        Text.fontColor(Color.White);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width('20vp');
                        Text.height('20vp');
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(index === 0 ? '#FF4444' : index === 1 ? '#FF8800' : '#FFAA00');
                        Text.borderRadius('10vp');
                        Text.margin({ right: '8vp' });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create((index + 1).toString());
                        Text.fontSize('12fp');
                        Text.fontColor('#999999');
                        Text.width('16vp');
                        Text.height('16vp');
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor('#F0F0F0');
                        Text.borderRadius('8vp');
                        Text.margin({ right: '8vp' });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(news.title);
            Text.fontSize('15fp');
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#182431');
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ bottom: '6vp' });
            Text.textAlign(TextAlign.Start);
            Text.lineHeight('20fp');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(news.source);
            Text.fontSize('11fp');
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('·');
            Text.fontSize('11fp');
            Text.fontColor('#999999');
            Text.margin({ left: '4vp', right: '4vp' });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(news.publishTime);
            Text.fontSize('11fp');
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.mainViewModel.formatReadCount(news.readCount));
            Text.fontSize('11fp');
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(news.imageUrl || '');
            Image.width('70vp');
            Image.height('50vp');
            Image.borderRadius('6vp');
            Image.objectFit(ImageFit.Cover);
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 分隔线
            if (index < this.hotNewsData.length - 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.strokeWidth('0.5vp');
                        Divider.color('#F0F0F0');
                        Divider.margin({ top: '12vp', bottom: '4vp' });
                    }, Divider);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * Build enhanced news list item.
     */
    buildNewsListItem(news: NewsData, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(12);
            Column.margin({ bottom: 8, left: 12, right: 12 });
            Column.shadow({ radius: 8, color: '#1A000000', offsetX: 0, offsetY: 2 });
            Column.onClick(() => {
                // Handle news click
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 标签区域
            if (news.isHot || news.isTop || news.category) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ bottom: '8vp' });
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (news.isHot) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('热');
                                    Text.fontSize('10fp');
                                    Text.fontColor(Color.White);
                                    Text.backgroundColor('#FF4444');
                                    Text.padding({ left: '6vp', right: '6vp', top: '2vp', bottom: '2vp' });
                                    Text.borderRadius('4vp');
                                    Text.margin({ right: '6vp' });
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
                        if (news.isTop) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('置顶');
                                    Text.fontSize('10fp');
                                    Text.fontColor(Color.White);
                                    Text.backgroundColor('#FF8800');
                                    Text.padding({ left: '6vp', right: '6vp', top: '2vp', bottom: '2vp' });
                                    Text.borderRadius('4vp');
                                    Text.margin({ right: '6vp' });
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
                        if (news.category) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(news.category);
                                    Text.fontSize('10fp');
                                    Text.fontColor('#007DFF');
                                    Text.backgroundColor('#E6F3FF');
                                    Text.padding({ left: '6vp', right: '6vp', top: '2vp', bottom: '2vp' });
                                    Text.borderRadius('4vp');
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
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(news.title);
            Text.fontSize('16fp');
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#182431');
            Text.maxLines(3);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ bottom: '6vp' });
            Text.textAlign(TextAlign.Start);
            Text.lineHeight('21fp');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (news.summary) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(news.summary);
                        Text.fontSize('13fp');
                        Text.fontColor('#666666');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.margin({ bottom: '8vp' });
                        Text.textAlign(TextAlign.Start);
                        Text.lineHeight('17fp');
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
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(news.source);
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('·');
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ left: 6, right: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(news.publishTime);
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777241, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Image.width(12);
            Image.height(12);
            Image.margin({ right: 4 });
            Image.fillColor('#999999');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.mainViewModel.formatReadCount(news.readCount));
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (news.imageUrl) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(news.imageUrl || '');
                        Image.width(100);
                        Image.height(75);
                        Image.borderRadius(8);
                        Image.objectFit(ImageFit.Cover);
                        Image.margin({ left: 12 });
                    }, Image);
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
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F8F9FA');
        }, Column);
        // Search bar
        this.buildSearchBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Category tabs with background
            Column.create();
            // Category tabs with background
            Column.width('100%');
            // Category tabs with background
            Column.backgroundColor(Color.White);
            // Category tabs with background
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
            const forEachItemGenFunction = (_item, index: number) => {
                const category = _item;
                this.buildCategoryTab.bind(this)(category, index);
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Scroll.pop();
        // Category tabs with background
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Content area
            Scroll.create();
            // Content area
            Scroll.scrollBar(BarState.Off);
            // Content area
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Hot news section with header
            if (this.currentCategory === "推荐") {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 热点新闻标题
                        Row.create();
                        // 热点新闻标题
                        Row.width('100%');
                        // 热点新闻标题
                        Row.padding({ left: 20, right: 20, top: 16, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('热点新闻');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#182431');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('更多');
                        Text.fontSize(13);
                        Text.fontColor('#999999');
                        Text.onClick(() => {
                            // 处理更多点击
                        });
                    }, Text);
                    Text.pop();
                    // 热点新闻标题
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 热点新闻列表
                        Column.create();
                        // 热点新闻列表
                        Column.width('100%');
                        // 热点新闻列表
                        Column.padding({ left: 20, right: 20 });
                        // 热点新闻列表
                        Column.backgroundColor(Color.White);
                        // 热点新闻列表
                        Column.borderRadius(12);
                        // 热点新闻列表
                        Column.margin({ bottom: 16, left: 12, right: 12 });
                        // 热点新闻列表
                        Column.shadow({ radius: 8, color: '#1A000000', offsetX: 0, offsetY: 2 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const news = _item;
                            this.buildHotNewsItem.bind(this)(news, index);
                        };
                        this.forEachUpdateFunction(elmtId, this.hotNewsData, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    // 热点新闻列表
                    Column.pop();
                    Column.pop();
                });
            }
            // News list section
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // News list section
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 列表标题
            if (this.currentCategory !== "推荐") {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentCategory);
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#182431');
                        Text.margin({ left: 20, top: 16, bottom: 16 });
                        Text.alignSelf(ItemAlign.Start);
                    }, Text);
                    Text.pop();
                });
            }
            // 新闻列表
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 新闻列表
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const news = _item;
                this.buildNewsListItem.bind(this)(news);
            };
            this.forEachUpdateFunction(elmtId, this.newsListData, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 新闻列表
        Column.pop();
        // News list section
        Column.pop();
        Column.pop();
        // Content area
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
