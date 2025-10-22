if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommonInput_Params {
    placeholder?: string;
    value?: string;
    type?: InputType;
    maxLength?: number;
}
export class CommonInput extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__placeholder = new SynchedPropertySimpleOneWayPU(params.placeholder, this, "placeholder");
        this.__value = new SynchedPropertySimpleTwoWayPU(params.value, this, "value");
        this.__type = new SynchedPropertySimpleOneWayPU(params.type, this, "type");
        this.__maxLength = new SynchedPropertySimpleOneWayPU(params.maxLength, this, "maxLength");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommonInput_Params) {
        if (params.placeholder === undefined) {
            this.__placeholder.set('');
        }
        if (params.type === undefined) {
            this.__type.set(InputType.Normal);
        }
        if (params.maxLength === undefined) {
            this.__maxLength.set(20);
        }
    }
    updateStateVars(params: CommonInput_Params) {
        this.__placeholder.reset(params.placeholder);
        this.__type.reset(params.type);
        this.__maxLength.reset(params.maxLength);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__placeholder.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__type.purgeDependencyOnElmtId(rmElmtId);
        this.__maxLength.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__placeholder.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        this.__type.aboutToBeDeleted();
        this.__maxLength.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __placeholder: SynchedPropertySimpleOneWayPU<string>;
    get placeholder() {
        return this.__placeholder.get();
    }
    set placeholder(newValue: string) {
        this.__placeholder.set(newValue);
    }
    private __value: SynchedPropertySimpleTwoWayPU<string>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: string) {
        this.__value.set(newValue);
    }
    private __type: SynchedPropertySimpleOneWayPU<InputType>;
    get type() {
        return this.__type.get();
    }
    set type(newValue: InputType) {
        this.__type.set(newValue);
    }
    private __maxLength: SynchedPropertySimpleOneWayPU<number>;
    get maxLength() {
        return this.__maxLength.get();
    }
    set maxLength(newValue: number) {
        this.__maxLength.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: this.placeholder, text: this.value });
            TextInput.height('45vp');
            TextInput.fontSize('18fp');
            TextInput.backgroundColor('#F1F3F5');
            TextInput.width('328vp');
            TextInput.margin({ top: '12vp' });
            TextInput.type(this.type);
            TextInput.maxLength(this.maxLength);
            TextInput.onChange((value: string) => {
                this.value = value;
            });
        }, TextInput);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
