if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface VideoPage_Params {
    searchText?: string;
    selectedUrl?: string | null;
    webController?: webview.WebviewController;
    hotTitles?: string[];
}
import { CommonSearchBar } from "@bundle:com.huawei.quickstart/default@uicomponents/Index";
import { BaiduHotSearchParser } from "@bundle:com.huawei.quickstart/default@utils/Index";
import webview from "@ohos:web.webview";
export default class VideoPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__selectedUrl = new ObservedPropertyObjectPU(null, this, "selectedUrl");
        this.webController = new webview.WebviewController();
        this.__hotTitles = new ObservedPropertyObjectPU([], this, "hotTitles");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: VideoPage_Params) {
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
    }
    updateStateVars(params: VideoPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__hotTitles.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__selectedUrl.aboutToBeDeleted();
        this.__hotTitles.aboutToBeDeleted();
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
    async aboutToAppear() {
        try {
            const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
            this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
        }
        catch (_) {
            this.hotTitles = [];
        }
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
                    }, undefined, elmtId, () => { }, { page: "features/video/src/main/ets/view/Video.ets", line: 67, col: 9 });
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
            // 页面内容
            Text.create('视频资讯');
            // 页面内容
            Text.fontSize('20fp');
            // 页面内容
            Text.fontWeight(FontWeight.Bold);
            // 页面内容
            Text.margin('40vp');
        }, Text);
        // 页面内容
        Text.pop();
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
