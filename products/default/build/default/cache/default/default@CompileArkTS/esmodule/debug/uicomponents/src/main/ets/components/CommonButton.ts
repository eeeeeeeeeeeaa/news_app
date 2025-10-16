if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommonButton_Params {
    label?: string;
    onClickAction?: () => void;
}
export class CommonButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__label = new SynchedPropertySimpleOneWayPU(params.label, this, "label");
        this.__onClickAction = new SynchedPropertyObjectOneWayPU(params.onClickAction, this, "onClickAction");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommonButton_Params) {
        if (params.label === undefined) {
            this.__label.set('Button');
        }
        if (params.onClickAction === undefined) {
            this.__onClickAction.set(() => { });
        }
    }
    updateStateVars(params: CommonButton_Params) {
        this.__label.reset(params.label);
        this.__onClickAction.reset(params.onClickAction);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__label.purgeDependencyOnElmtId(rmElmtId);
        this.__onClickAction.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__label.aboutToBeDeleted();
        this.__onClickAction.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __label: SynchedPropertySimpleOneWayPU<string>;
    get label() {
        return this.__label.get();
    }
    set label(newValue: string) {
        this.__label.set(newValue);
    }
    // 避免与基础组件的 onClick 冲突，改名为 onClickAction
    private __onClickAction: SynchedPropertySimpleOneWayPU<() => void>;
    get onClickAction() {
        return this.__onClickAction.get();
    }
    set onClickAction(newValue: () => void) {
        this.__onClickAction.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.label);
            Button.width('100%');
            Button.height('40vp');
            Button.fontSize('16fp');
            Button.backgroundColor('#007DFF');
            Button.fontColor(Color.White);
            Button.borderRadius('8vp');
            Button.onClick(() => {
                this.onClickAction();
            });
        }, Button);
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
