if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommonSearchBar_Params {
    value?: string;
    placeholder?: string;
    text?: string;
    hotTitles?: string[];
    currentPlaceholderIndex?: number;
    currentPlaceholder?: string;
    placeholderTimer?: number;
    onSearch?: (url: string) => void;
}
export class CommonSearchBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__value = new SynchedPropertySimpleOneWayPU(params.value, this, "value");
        this.placeholder = '搜索新闻';
        this.__text = new ObservedPropertySimplePU('', this, "text");
        this.__hotTitles = new SynchedPropertyObjectOneWayPU(params.hotTitles, this, "hotTitles");
        this.__currentPlaceholderIndex = new ObservedPropertySimplePU(0, this, "currentPlaceholderIndex");
        this.__currentPlaceholder = new ObservedPropertySimplePU('搜索新闻', this, "currentPlaceholder");
        this.placeholderTimer = -1;
        this.onSearch = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommonSearchBar_Params) {
        if (params.value === undefined) {
            this.__value.set('');
        }
        if (params.placeholder !== undefined) {
            this.placeholder = params.placeholder;
        }
        if (params.text !== undefined) {
            this.text = params.text;
        }
        if (params.hotTitles === undefined) {
            this.__hotTitles.set([]);
        }
        if (params.currentPlaceholderIndex !== undefined) {
            this.currentPlaceholderIndex = params.currentPlaceholderIndex;
        }
        if (params.currentPlaceholder !== undefined) {
            this.currentPlaceholder = params.currentPlaceholder;
        }
        if (params.placeholderTimer !== undefined) {
            this.placeholderTimer = params.placeholderTimer;
        }
        if (params.onSearch !== undefined) {
            this.onSearch = params.onSearch;
        }
    }
    updateStateVars(params: CommonSearchBar_Params) {
        this.__value.reset(params.value);
        this.__hotTitles.reset(params.hotTitles);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__text.purgeDependencyOnElmtId(rmElmtId);
        this.__hotTitles.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPlaceholderIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPlaceholder.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__value.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        this.__hotTitles.aboutToBeDeleted();
        this.__currentPlaceholderIndex.aboutToBeDeleted();
        this.__currentPlaceholder.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 父组件传入的初始值（不强制双向绑定）
    private __value: SynchedPropertySimpleOneWayPU<string>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: string) {
        this.__value.set(newValue);
    }
    private placeholder: string;
    private __text: ObservedPropertySimplePU<string>;
    get text() {
        return this.__text.get();
    }
    set text(newValue: string) {
        this.__text.set(newValue);
    }
    private __hotTitles: SynchedPropertySimpleOneWayPU<string[]>;
    get hotTitles() {
        return this.__hotTitles.get();
    }
    set hotTitles(newValue: string[]) {
        this.__hotTitles.set(newValue);
    }
    private __currentPlaceholderIndex: ObservedPropertySimplePU<number>;
    get currentPlaceholderIndex() {
        return this.__currentPlaceholderIndex.get();
    }
    set currentPlaceholderIndex(newValue: number) {
        this.__currentPlaceholderIndex.set(newValue);
    }
    private __currentPlaceholder: ObservedPropertySimplePU<string>;
    get currentPlaceholder() {
        return this.__currentPlaceholder.get();
    }
    set currentPlaceholder(newValue: string) {
        this.__currentPlaceholder.set(newValue);
    }
    private placeholderTimer: number;
    aboutToAppear() {
        this.text = this.value;
        // 使用父组件传入的热搜标题启动轮播
        if (this.hotTitles && this.hotTitles.length > 0) {
            this.currentPlaceholder = this.hotTitles[0];
        }
        this.startPlaceholderRotation();
    }
    aboutToDisappear() {
        if (this.placeholderTimer !== -1) {
            clearInterval(this.placeholderTimer);
            this.placeholderTimer = -1;
        }
    }
    private startPlaceholderRotation() {
        this.placeholderTimer = setInterval(() => {
            if (this.hotTitles && this.hotTitles.length > 1) {
                this.currentPlaceholderIndex = (this.currentPlaceholderIndex + 1) % this.hotTitles.length;
                this.currentPlaceholder = this.hotTitles[this.currentPlaceholderIndex];
            }
        }, 6000); // 每6秒切换一次
    }
    private onSearchSubmit() {
        const inputText: string = this.text ? this.text.trim() : '';
        const keyword: string = inputText.length > 0 ? inputText : (this.currentPlaceholder || '');
        if (keyword.length === 0) {
            return;
        }
        const searchUrl: string = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`;
        this.onSearch?.(searchUrl);
    }
    private onSearch?: (url: string) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: '12vp', right: '12vp', top: '8vp', bottom: '8vp' });
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height('36vp');
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius('18vp');
            Row.border({ width: '1vp', color: '#E5E5E5' });
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 固定的搜索前缀文字
            Text.create('🔍');
            // 固定的搜索前缀文字
            Text.fontSize('16fp');
            // 固定的搜索前缀文字
            Text.margin({ left: '12vp', right: '8vp' });
            // 固定的搜索前缀文字
            Text.fontColor('#999999');
            // 固定的搜索前缀文字
            Text.onClick(() => {
                this.onSearchSubmit();
            });
        }, Text);
        // 固定的搜索前缀文字
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: this.currentPlaceholder, text: this.text });
            TextInput.fontSize('14fp');
            TextInput.fontColor('#182431');
            TextInput.backgroundColor(Color.Transparent);
            TextInput.placeholderColor('#999999');
            TextInput.layoutWeight(1);
            TextInput.onChange((v: string) => {
                this.text = v;
            });
            TextInput.onSubmit(() => {
                this.onSearchSubmit();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.text && this.text.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 固定的清除按钮
                        Text.create('清除');
                        // 固定的清除按钮
                        Text.fontSize('14fp');
                        // 固定的清除按钮
                        Text.fontColor('#999999');
                        // 固定的清除按钮
                        Text.margin({ right: '12vp' });
                        // 固定的清除按钮
                        Text.onClick(() => {
                            this.text = '';
                        });
                    }, Text);
                    // 固定的清除按钮
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
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
