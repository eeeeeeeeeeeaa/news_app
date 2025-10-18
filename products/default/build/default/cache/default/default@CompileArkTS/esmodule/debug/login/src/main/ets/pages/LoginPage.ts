if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    account?: string;
    password?: string;
    isShowProgress?: boolean;
    showRegisterPage?: boolean;
    testResult?: string;
    timeOutId?: number;
    userService?: AuthService;
    onLoginSuccess?: () => void;
}
import promptAction from "@ohos:promptAction";
import { RegisterPage } from "@bundle:com.huawei.quickstart/default@login/ets/pages/RegisterPage";
import { AuthService } from "@bundle:com.huawei.quickstart/default@login/ets/model/UserService";
interface RegisterFormData {
    userPhone: string;
    userPassword: string;
    userName: string;
}
interface ApiResponse {
    code: number;
    message: string;
    data?: string; // 根据实际响应结构调整
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
        this.__testResult = new ObservedPropertySimplePU('', this, "testResult");
        this.timeOutId = -1;
        this.userService = AuthService.getInstance();
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
        if (params.testResult !== undefined) {
            this.testResult = params.testResult;
        }
        if (params.timeOutId !== undefined) {
            this.timeOutId = params.timeOutId;
        }
        if (params.userService !== undefined) {
            this.userService = params.userService;
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
        this.__testResult.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isShowProgress.aboutToBeDeleted();
        this.__showRegisterPage.aboutToBeDeleted();
        this.__testResult.aboutToBeDeleted();
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
    private __testResult: ObservedPropertySimplePU<string>; // 新增：测试结果显示
    get testResult() {
        return this.__testResult.get();
    }
    set testResult(newValue: string) {
        this.__testResult.set(newValue);
    }
    private timeOutId: number;
    private userService: AuthService;
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
                message: "请输入账号和密码"
            });
            return;
        }
        this.isShowProgress = true;
        try {
            const success: boolean = await this.userService.login(this.account, this.password);
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
                                }, undefined, elmtId, () => { }, { page: "features/login/src/main/ets/pages/LoginPage.ets", line: 122, col: 9 });
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
                        Image.create({ "id": 16777309, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Image.width('78vp');
                        Image.height('78vp');
                        Image.margin({
                            top: '150vp',
                            bottom: '8vp'
                        });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('登录');
                        Text.fontSize('24fp');
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#182431');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('更多精彩内容等你发现');
                        Text.fontSize('16fp');
                        Text.fontColor('#99182431');
                        Text.margin({
                            bottom: '30vp',
                            top: '8vp'
                        });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: "请输入手机号" });
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
                        TextInput.create({ placeholder: "请输入密码" });
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
                    Column.pop();
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
