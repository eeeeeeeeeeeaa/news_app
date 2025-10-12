if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MainPage_Params {
    currentIndex?: number;
    tabsController?: TabsController;
}
import News from "@bundle:com.example.pageanddata/entry/ets/view/News";
import VideoPage from "@bundle:com.example.pageanddata/entry/ets/view/Video";
import Follow from "@bundle:com.example.pageanddata/entry/ets/view/Follow";
import Mine from "@bundle:com.example.pageanddata/entry/ets/view/Mine";
export function MainPageBuilder(parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new MainPage(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 10, col: 3 });
                ViewPU.create(componentCall);
                let paramsLambda = () => {
                    return {};
                };
                componentCall.paramsGenerator_ = paramsLambda;
            }
            else {
                (parent ? parent : this).updateStateVarsOfChildByElmtId(elmtId, {});
            }
        }, { name: "MainPage" });
    }
}
export class MainPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.tabsController = new TabsController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MainPage_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.tabsController !== undefined) {
            this.tabsController = params.tabsController;
        }
    }
    updateStateVars(params: MainPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>; // 默认选中"新闻"页
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private tabsController: TabsController;
    /**
     * Tab项构建器：统一样式（仅文字，图标暂时置空）
     */
    TabBuilder(title: Resource, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MainPage.ets(26:5)", "entry");
            Column.justifyContent(FlexAlign.Center);
            Column.height(56);
            Column.width('100%');
            Column.onClick(() => {
                this.currentIndex = index;
                this.tabsController.changeIndex(this.currentIndex);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图标暂时隐藏（或传入空资源，这里直接不渲染Image）
            // 若需要占位，可保留Image但传空路径，示例：
            // Image('')
            //   .width(24)
            //   .height(24)
            //   .objectFit(ImageFit.Contain)
            // 文字（选中/未选中切换）
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/MainPage.ets(35:7)", "entry");
            // 图标暂时隐藏（或传入空资源，这里直接不渲染Image）
            // 若需要占位，可保留Image但传空路径，示例：
            // Image('')
            //   .width(24)
            //   .height(24)
            //   .objectFit(ImageFit.Contain)
            // 文字（选中/未选中切换）
            Text.margin({ top: 4 });
            // 图标暂时隐藏（或传入空资源，这里直接不渲染Image）
            // 若需要占位，可保留Image但传空路径，示例：
            // Image('')
            //   .width(24)
            //   .height(24)
            //   .objectFit(ImageFit.Contain)
            // 文字（选中/未选中切换）
            Text.fontSize(10);
            // 图标暂时隐藏（或传入空资源，这里直接不渲染Image）
            // 若需要占位，可保留Image但传空路径，示例：
            // Image('')
            //   .width(24)
            //   .height(24)
            //   .objectFit(ImageFit.Contain)
            // 文字（选中/未选中切换）
            Text.fontColor(this.currentIndex === index ? '#E60012' : '#666666');
        }, Text);
        // 图标暂时隐藏（或传入空资源，这里直接不渲染Image）
        // 若需要占位，可保留Image但传空路径，示例：
        // Image('')
        //   .width(24)
        //   .height(24)
        //   .objectFit(ImageFit.Contain)
        // 文字（选中/未选中切换）
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            NavDestination.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Tabs.create({
                        barPosition: BarPosition.End,
                        controller: this.tabsController
                    });
                    Tabs.debugLine("entry/src/main/ets/pages/MainPage.ets(51:7)", "entry");
                    Tabs.margin({ bottom: 64 });
                    Tabs.width('100%');
                    Tabs.height('100%');
                    Tabs.barHeight(80);
                    Tabs.barMode(BarMode.Fixed);
                    Tabs.onChange((index: number) => {
                        this.currentIndex = index;
                    });
                }, Tabs);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TabContent.create(() => {
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new News(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 57, col: 11 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {};
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "News" });
                        }
                    });
                    TabContent.padding({ left: 12, right: 12 });
                    TabContent.backgroundColor('#F5F5F5');
                    TabContent.tabBar({ builder: () => {
                            this.TabBuilder.call(this, { "id": 16777261, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, 0);
                        } });
                    TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(56:9)", "entry");
                }, TabContent);
                TabContent.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TabContent.create(() => {
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new VideoPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 65, col: 11 });
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
                            this.TabBuilder.call(this, { "id": 16777262, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, 1);
                        } });
                    TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(64:9)", "entry");
                }, TabContent);
                TabContent.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TabContent.create(() => {
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new Follow(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 73, col: 11 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {};
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "Follow" });
                        }
                    });
                    TabContent.padding({ left: 12, right: 12 });
                    TabContent.backgroundColor('#F5F5F5');
                    TabContent.tabBar({ builder: () => {
                            this.TabBuilder.call(this, { "id": 16777259, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, 2);
                        } });
                    TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(72:9)", "entry");
                }, TabContent);
                TabContent.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TabContent.create(() => {
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new Mine(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 81, col: 11 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {};
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "Mine" });
                        }
                    });
                    TabContent.padding({ left: 12, right: 12 });
                    TabContent.backgroundColor('#F5F5F5');
                    TabContent.tabBar({ builder: () => {
                            this.TabBuilder.call(this, { "id": 16777260, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, 3);
                        } });
                    TabContent.debugLine("entry/src/main/ets/pages/MainPage.ets(80:9)", "entry");
                }, TabContent);
                TabContent.pop();
                Tabs.pop();
            }, { moduleName: "entry", pagePath: "entry/src/main/ets/pages/MainPage" });
            NavDestination.height('100%');
            NavDestination.hideTitleBar(true);
            NavDestination.backgroundColor('#F5F5F5');
            NavDestination.debugLine("entry/src/main/ets/pages/MainPage.ets(50:5)", "entry");
        }, NavDestination);
        NavDestination.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
(function () {
    if (typeof NavigationBuilderRegister === "function") {
        NavigationBuilderRegister("MainPage", wrapBuilder(MainPageBuilder));
    }
})();
