if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterPage_Params {
    account?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    isShowProgress?: boolean;
    timeOutId?: number;
    userManager?: UserManager;
    authService?: AuthService;
    onBack?: () => void;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/ets/model/UserManager";
import { AuthService } from "@bundle:com.huawei.quickstart/default@login/ets/model/useregister";
export function RegisterPageBuilder(parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new RegisterPage(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "features/login/src/main/ets/pages/RegisterPage.ets", line: 23, col: 3 });
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
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__isShowProgress = new ObservedPropertySimplePU(false, this, "isShowProgress");
        this.timeOutId = -1;
        this.userManager = UserManager.getInstance();
        this.authService = AuthService.getInstance();
        this.onBack = () => {
            router.back();
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RegisterPage_Params) {
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.username !== undefined) {
            this.username = params.username;
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
        if (params.authService !== undefined) {
            this.authService = params.authService;
        }
        if (params.onBack !== undefined) {
            this.onBack = params.onBack;
        }
    }
    updateStateVars(params: RegisterPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowProgress.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__account.aboutToBeDeleted();
        this.__username.aboutToBeDeleted();
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
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
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
    private authService: AuthService;
    private onBack: () => void;
    async register(): Promise<void> {
        if (this.account === '' || this.username === '' || this.password === '' || this.confirmPassword === '') {
            promptAction.showToast({
                message: "请输入完整信息"
            });
            return;
        }
        if (this.password !== this.confirmPassword) {
            promptAction.showToast({
                message: "两次输入的密码不一样"
            });
            return;
        }
        this.isShowProgress = true;
        try {
            const success: boolean = await this.authService.register(this.account, this.username, this.password);
            if (success) {
                if (this.timeOutId === -1) {
                    this.timeOutId = setTimeout(() => {
                        this.isShowProgress = false;
                        this.timeOutId = -1;
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
            Row.create();
            Row.width('100%');
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
            Image.create({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
            Image.width('24vp');
            Image.height('24vp');
        }, Image);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
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
            Text.create("注册");
            Text.fontSize('24fp');
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#182431');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create("创建账号，开始你的精彩之旅");
            Text.fontSize('16fp');
            Text.fontColor('#99182431');
            Text.margin({
                bottom: '30vp',
                top: '8vp'
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: "请输入昵称" });
            TextInput.maxLength(20);
            __TextInput__inputStyle();
            TextInput.onChange((value: string) => {
                this.username = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Line.create();
            __Line__lineStyle();
        }, Line);
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
            TextInput.create({ placeholder: "确认密码" });
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
            Button.createWithLabel("注册", { type: ButtonType.Capsule });
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
            Text.create("返回登录");
            __Text__blueTextStyle();
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
