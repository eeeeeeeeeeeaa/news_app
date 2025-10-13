if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterPage_Params {
    account?: string;
    password?: string;
    confirmPassword?: string;
    isShowProgress?: boolean;
    timeOutId?: number;
    userManager?: UserManager;
    onBack?: () => void;
}
import promptAction from "@ohos:promptAction";
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/ets/model/UserManager";
export function RegisterPageBuilder(parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new RegisterPage(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "features/login/src/main/ets/pages/RegisterPage.ets", line: 22, col: 3 });
                ViewPU.create(componentCall);
                let paramsLambda = () => {
                    return {};
                };
                componentCall.paramsGenerator_ = paramsLambda;
            }
            else {
                (parent ? parent : this).updateStateVarsOfChildByElmtId(elmtId, {});
            }
        }, { name: "RegisterPage" });
    }
}
function __TextInput__inputStyle(): void {
    TextInput.placeholderColor('#99182431');
    TextInput.height('45vp');
    TextInput.fontSize('18fp');
    TextInput.backgroundColor('#F1F3F5');
    TextInput.width('328vp');
    TextInput.margin({ top: 12 });
}
function __Line__lineStyle(): void {
    Line.width('328vp');
    Line.height('1vp');
    Line.backgroundColor('#33182431');
}
function __Text__blueTextStyle(): void {
    Text.fontColor('#007DFF');
    Text.fontSize('14fp');
    Text.fontWeight(FontWeight.Medium);
}
export class RegisterPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__account = new ObservedPropertySimplePU('', this, "account");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__isShowProgress = new ObservedPropertySimplePU(false, this, "isShowProgress");
        this.timeOutId = -1;
        this.userManager = UserManager.getInstance();
        this.onBack = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RegisterPage_Params) {
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.isShowProgress !== undefined) {
            this.isShowProgress = params.isShowProgress;
        }
        if (params.timeOutId !== undefined) {
            this.timeOutId = params.timeOutId;
        }
        if (params.userManager !== undefined) {
            this.userManager = params.userManager;
        }
        if (params.onBack !== undefined) {
            this.onBack = params.onBack;
        }
    }
    updateStateVars(params: RegisterPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowProgress.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__isShowProgress.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __account: ObservedPropertySimplePU<string>;
    get account() {
        return this.__account.get();
    }
    set account(newValue: string) {
        this.__account.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __isShowProgress: ObservedPropertySimplePU<boolean>;
    get isShowProgress() {
        return this.__isShowProgress.get();
    }
    set isShowProgress(newValue: boolean) {
        this.__isShowProgress.set(newValue);
    }
    private timeOutId: number;
    private userManager: UserManager;
    private onBack: () => void;
    async register(): Promise<void> {
        if (this.account === '' || this.password === '' || this.confirmPassword === '') {
            promptAction.showToast({
                message: { "id": 16777278, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
            });
            return;
        }
        this.isShowProgress = true;
        try {
            const success = await this.userManager.registerUser(this.account, this.password, this.confirmPassword);
            if (success) {
                if (this.timeOutId === -1) {
                    this.timeOutId = setTimeout(() => {
                        this.isShowProgress = false;
                        this.timeOutId = -1;
                        // 注册成功后返回登录页面
                        this.onBack();
                    }, 1500);
                }
            }
            else {
                this.isShowProgress = false;
            }
        }
        catch (err) {
            this.isShowProgress = false;
            console.error('Register failed:', err);
        }
    }
    aboutToDisappear() {
        clearTimeout(this.timeOutId);
        this.timeOutId = -1;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
            Column.padding({
                left: '12vp',
                right: '12vp',
                bottom: '24vp'
            });
            Column.backgroundColor('#F1F3F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Row.create();
            // 返回按钮
            Row.width('100%');
            // 返回按钮
            Row.padding({ top: '20vp', left: '12vp', right: '12vp' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.onBack();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777257, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Image.width('24vp');
            Image.height('24vp');
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        // 返回按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777296, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Image.width('78vp');
            Image.height('78vp');
            Image.margin({
                top: '150vp',
                bottom: '8vp'
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777290, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Text.fontSize('24fp');
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#182431');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777289, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Text.fontSize('16fp');
            Text.fontColor('#99182431');
            Text.margin({
                bottom: '30vp',
                top: '8vp'
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: { "id": 16777239, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" } });
            TextInput.maxLength(11);
            TextInput.type(InputType.Number);
            __TextInput__inputStyle();
            TextInput.onChange((value: string) => {
                this.account = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Line.create();
            __Line__lineStyle();
        }, Line);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: { "id": 16777285, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" } });
            TextInput.maxLength(8);
            TextInput.type(InputType.Password);
            __TextInput__inputStyle();
            TextInput.onChange((value: string) => {
                this.password = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Line.create();
            __Line__lineStyle();
        }, Line);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: { "id": 16777276, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" } });
            TextInput.maxLength(8);
            TextInput.type(InputType.Password);
            __TextInput__inputStyle();
            TextInput.onChange((value: string) => {
                this.confirmPassword = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Line.create();
            __Line__lineStyle();
        }, Line);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777287, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, { type: ButtonType.Capsule });
            Button.width('328vp');
            Button.height('40vp');
            Button.fontSize('16fp');
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor('#007DFF');
            Button.margin({
                top: '48vp',
                bottom: '12vp'
            });
            Button.onClick(() => {
                this.register();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777275, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Text.fontColor('#007DFF');
            Text.fontSize('16fp');
            Text.fontWeight(FontWeight.Medium);
            Text.onClick(() => {
                this.onBack();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isShowProgress) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.color('#182431');
                        LoadingProgress.width('30vp');
                        LoadingProgress.height('30vp');
                        LoadingProgress.margin({ top: '20vp' });
                    }, LoadingProgress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
