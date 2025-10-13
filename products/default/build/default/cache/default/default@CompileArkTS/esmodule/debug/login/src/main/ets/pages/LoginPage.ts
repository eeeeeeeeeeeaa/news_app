if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    account?: string;
    password?: string;
    isShowProgress?: boolean;
    showRegisterPage?: boolean;
    timeOutId?: number;
    pathStack?: NavPathStack;
    userManager?: UserManager;
    onLoginSuccess?: () => void;
}
import promptAction from "@ohos:promptAction";
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/ets/model/UserManager";
import { RegisterPage } from "@bundle:com.huawei.quickstart/default@login/ets/pages/RegisterPage";
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
export class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__account = new ObservedPropertySimplePU('', this, "account");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__isShowProgress = new ObservedPropertySimplePU(false, this, "isShowProgress");
        this.__showRegisterPage = new ObservedPropertySimplePU(false, this, "showRegisterPage");
        this.timeOutId = -1;
        this.pathStack = new NavPathStack();
        this.userManager = UserManager.getInstance();
        this.onLoginSuccess = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.isShowProgress !== undefined) {
            this.isShowProgress = params.isShowProgress;
        }
        if (params.showRegisterPage !== undefined) {
            this.showRegisterPage = params.showRegisterPage;
        }
        if (params.timeOutId !== undefined) {
            this.timeOutId = params.timeOutId;
        }
        if (params.pathStack !== undefined) {
            this.pathStack = params.pathStack;
        }
        if (params.userManager !== undefined) {
            this.userManager = params.userManager;
        }
        if (params.onLoginSuccess !== undefined) {
            this.onLoginSuccess = params.onLoginSuccess;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowProgress.purgeDependencyOnElmtId(rmElmtId);
        this.__showRegisterPage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isShowProgress.aboutToBeDeleted();
        this.__showRegisterPage.aboutToBeDeleted();
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
    private __isShowProgress: ObservedPropertySimplePU<boolean>;
    get isShowProgress() {
        return this.__isShowProgress.get();
    }
    set isShowProgress(newValue: boolean) {
        this.__isShowProgress.set(newValue);
    }
    private __showRegisterPage: ObservedPropertySimplePU<boolean>;
    get showRegisterPage() {
        return this.__showRegisterPage.get();
    }
    set showRegisterPage(newValue: boolean) {
        this.__showRegisterPage.set(newValue);
    }
    private timeOutId: number;
    private pathStack: NavPathStack;
    private userManager: UserManager;
    private onLoginSuccess: () => void;
    imageButton(src: Resource, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
            Button.height('48vp');
            Button.width('48vp');
            Button.backgroundColor('#F1F3F5');
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(src);
        }, Image);
        Button.pop();
    }
    async login(): Promise<void> {
        if (this.account === '' || this.password === '') {
            promptAction.showToast({
                message: { "id": 16777291, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
            });
            return;
        }
        this.isShowProgress = true;
        try {
            const success = await this.userManager.loginUser(this.account, this.password);
            if (success) {
                if (this.timeOutId === -1) {
                    this.timeOutId = setTimeout(() => {
                        this.isShowProgress = false;
                        this.timeOutId = -1;
                        this.onLoginSuccess();
                    }, 1500);
                }
            }
            else {
                this.isShowProgress = false;
            }
        }
        catch (err) {
            this.isShowProgress = false;
            console.error('Login failed:', err);
        }
    }
    aboutToDisappear() {
        clearTimeout(this.timeOutId);
        this.timeOutId = -1;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showRegisterPage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('#F1F3F5');
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RegisterPage(this, {
                                    onBack: () => {
                                        this.showRegisterPage = false;
                                    }
                                }, undefined, elmtId, () => { }, { page: "features/login/src/main/ets/pages/LoginPage.ets", line: 107, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onBack: () => {
                                            this.showRegisterPage = false;
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RegisterPage" });
                    }
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Navigation.create(this.pathStack, { moduleName: "default", pagePath: "features/login/src/main/ets/pages/LoginPage", isUserCreateStack: true });
                        Navigation.backgroundColor('#F1F3F5');
                        Navigation.width('100%');
                        Navigation.height('100%');
                        Navigation.hideTitleBar(true);
                        Navigation.hideToolBar(true);
                    }, Navigation);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        NavDestination.create(() => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.height('100%');
                                Column.width('100%');
                                Column.padding({
                                    left: '12vp',
                                    right: '12vp',
                                    bottom: '24vp'
                                });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Image.create({ "id": 16777309, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                                Image.width('78vp');
                                Image.height('78vp');
                                Image.margin({
                                    top: '150vp',
                                    bottom: '8vp'
                                });
                            }, Image);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create({ "id": 16777294, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                                Text.fontSize('24fp');
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor('#182431');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create({ "id": 16777293, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                                Text.fontSize('16fp');
                                Text.fontColor('#99182431');
                                Text.margin({
                                    bottom: '30vp',
                                    top: '8vp'
                                });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TextInput.create({ placeholder: { "id": 16777285, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" } });
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
                                TextInput.create({ placeholder: { "id": 16777298, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" } });
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
                                Row.create();
                                Row.justifyContent(FlexAlign.SpaceBetween);
                                Row.width('328vp');
                                Row.margin({ top: '8vp' });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create({ "id": 16777296, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                                __Text__blueTextStyle();
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create({ "id": 16777290, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                                __Text__blueTextStyle();
                            }, Text);
                            Text.pop();
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel({ "id": 16777292, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }, { type: ButtonType.Capsule });
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
                                    this.login();
                                });
                            }, Button);
                            Button.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create({ "id": 16777301, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                                Text.fontColor('#007DFF');
                                Text.fontSize('16fp');
                                Text.fontWeight(FontWeight.Medium);
                                Text.onClick(() => {
                                    this.showRegisterPage = true;
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
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create({ "id": 16777297, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                                Text.fontColor('#838D97');
                                Text.fontSize('12fp');
                                Text.fontWeight(FontWeight.Medium);
                                Text.margin({
                                    top: '50vp',
                                    bottom: '12vp'
                                });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 44 });
                                Row.margin({ bottom: '16vp' });
                            }, Row);
                            this.imageButton.bind(this)({ "id": 16777306, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                            this.imageButton.bind(this)({ "id": 16777307, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                            this.imageButton.bind(this)({ "id": 16777308, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                            Row.pop();
                            Column.pop();
                        }, { moduleName: "default", pagePath: "features/login/src/main/ets/pages/LoginPage" });
                        NavDestination.backgroundColor('#F1F3F5');
                        NavDestination.width('100%');
                        NavDestination.height('100%');
                        NavDestination.hideTitleBar(true);
                        NavDestination.hideToolBar(true);
                    }, NavDestination);
                    NavDestination.pop();
                    Navigation.pop();
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
