if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Mine_Params {
    currentUser?: UserInfo | null;
    isLoggedIn?: boolean;
    userManager?: UserManager;
    onLogout?: () => void;
}
import { UserManager } from "@bundle:com.huawei.quickstart/default@login/Index";
import type { UserInfo } from "@bundle:com.huawei.quickstart/default@login/Index";
import promptAction from "@ohos:promptAction";
export default class Mine extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__isLoggedIn = new ObservedPropertySimplePU(false, this, "isLoggedIn");
        this.userManager = UserManager.getInstance();
        this.onLogout = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Mine_Params) {
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.isLoggedIn !== undefined) {
            this.isLoggedIn = params.isLoggedIn;
        }
        if (params.userManager !== undefined) {
            this.userManager = params.userManager;
        }
        if (params.onLogout !== undefined) {
            this.onLogout = params.onLogout;
        }
    }
    updateStateVars(params: Mine_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoggedIn.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentUser: ObservedPropertyObjectPU<UserInfo | null>;
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: UserInfo | null) {
        this.__currentUser.set(newValue);
    }
    private __isLoggedIn: ObservedPropertySimplePU<boolean>;
    get isLoggedIn() {
        return this.__isLoggedIn.get();
    }
    set isLoggedIn(newValue: boolean) {
        this.__isLoggedIn.set(newValue);
    }
    private userManager: UserManager;
    private onLogout: () => void;
    async aboutToAppear() {
        await this.loadUserInfo();
    }
    async loadUserInfo() {
        try {
            await this.userManager.initPreferences();
            const user = await this.userManager.getCurrentUser();
            this.currentUser = user;
            this.isLoggedIn = user !== null;
        }
        catch (err) {
            console.error('Failed to load user info:', err);
        }
    }
    async logout() {
        try {
            await this.userManager.logout();
            this.currentUser = null;
            this.isLoggedIn = false;
            promptAction.showToast({
                message: { "id": 16777272, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }
            });
            // 退出登录后调用回调函数
            setTimeout(() => {
                this.onLogout();
            }, 1000); // 延迟1秒让用户看到退出成功的提示
        }
        catch (err) {
            console.error('Failed to logout:', err);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoggedIn && this.currentUser) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已登录状态
                        Column.create();
                        // 已登录状态
                        Column.width('100%');
                        // 已登录状态
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户头像区域
                        Image.create({ "id": 16777281, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        // 用户头像区域
                        Image.width('80vp');
                        // 用户头像区域
                        Image.height('80vp');
                        // 用户头像区域
                        Image.margin({ top: '40vp', bottom: '20vp' });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户名
                        Text.create(`${{ "id": 16777278, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" }}，${this.currentUser.username}`);
                        // 用户名
                        Text.fontSize('18fp');
                        // 用户名
                        Text.fontWeight(FontWeight.Medium);
                        // 用户名
                        Text.fontColor('#182431');
                        // 用户名
                        Text.margin({ bottom: '8vp' });
                    }, Text);
                    // 用户名
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 账号
                        Text.create(`账号：${this.currentUser.account}`);
                        // 账号
                        Text.fontSize('14fp');
                        // 账号
                        Text.fontColor('#99182431');
                        // 账号
                        Text.margin({ bottom: '40vp' });
                    }, Text);
                    // 账号
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 功能按钮区域
                        Column.create({ space: 16 });
                        // 功能按钮区域
                        Column.width('100%');
                        // 功能按钮区域
                        Column.padding({ left: '16vp', right: '16vp' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 个人信息按钮
                        Row.create();
                        // 个人信息按钮
                        Row.width('100%');
                        // 个人信息按钮
                        Row.height('48vp');
                        // 个人信息按钮
                        Row.padding({ left: '16vp', right: '16vp' });
                        // 个人信息按钮
                        Row.backgroundColor('#FFFFFF');
                        // 个人信息按钮
                        Row.borderRadius('8vp');
                        // 个人信息按钮
                        Row.onClick(() => {
                            // 可以添加编辑个人信息功能
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777279, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Image.width('24vp');
                        Image.height('24vp');
                        Image.margin({ right: '12vp' });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777277, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Text.fontSize('16fp');
                        Text.fontColor('#182431');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777283, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Image.width('16vp');
                        Image.height('16vp');
                    }, Image);
                    // 个人信息按钮
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 退出登录按钮
                        Row.create();
                        // 退出登录按钮
                        Row.width('100%');
                        // 退出登录按钮
                        Row.height('48vp');
                        // 退出登录按钮
                        Row.padding({ left: '16vp', right: '16vp' });
                        // 退出登录按钮
                        Row.backgroundColor('#FFFFFF');
                        // 退出登录按钮
                        Row.borderRadius('8vp');
                        // 退出登录按钮
                        Row.onClick(() => {
                            this.logout();
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777282, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Image.width('24vp');
                        Image.height('24vp');
                        Image.margin({ right: '12vp' });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777272, "type": 10003, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Text.fontSize('16fp');
                        Text.fontColor('#E60012');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    // 退出登录按钮
                    Row.pop();
                    // 功能按钮区域
                    Column.pop();
                    // 已登录状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 未登录状态
                        Column.create();
                        // 未登录状态
                        Column.width('100%');
                        // 未登录状态
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777281, "type": 20000, params: [], "bundleName": "com.huawei.quickstart", "moduleName": "default" });
                        Image.width('80vp');
                        Image.height('80vp');
                        Image.margin({ top: '100vp', bottom: '20vp' });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请先登录');
                        Text.fontSize('18fp');
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#99182431');
                        Text.margin({ bottom: '40vp' });
                    }, Text);
                    Text.pop();
                    // 未登录状态
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
