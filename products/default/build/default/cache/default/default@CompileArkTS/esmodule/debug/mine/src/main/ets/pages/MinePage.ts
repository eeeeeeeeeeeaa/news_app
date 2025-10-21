if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MinePage_Params {
    onLogout?: () => void;
    userInfo?: UserInfo | null;
    loginStatus?: boolean;
}
import Mine from "@bundle:com.huawei.quickstart/default@mine/ets/view/Mine";
import type { UserInfo } from 'login';
export function MinePageBuilder(parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new MinePage(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "features/mine/src/main/ets/pages/MinePage.ets", line: 21, col: 3 });
                ViewPU.create(componentCall);
                let paramsLambda = () => {
                    return {};
                };
                componentCall.paramsGenerator_ = paramsLambda;
            }
            else {
                (parent ? parent : this).updateStateVarsOfChildByElmtId(elmtId, {});
            }
        }, { name: "MinePage" });
    }
}
export class MinePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.onLogout = () => { };
        this.userInfo = null;
        this.loginStatus = false;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MinePage_Params) {
        if (params.onLogout !== undefined) {
            this.onLogout = params.onLogout;
        }
        if (params.userInfo !== undefined) {
            this.userInfo = params.userInfo;
        }
        if (params.loginStatus !== undefined) {
            this.loginStatus = params.loginStatus;
        }
    }
    updateStateVars(params: MinePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private onLogout: () => void;
    private userInfo: UserInfo | null;
    private loginStatus: boolean;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new Mine(this, {
                        userInfo: this.userInfo,
                        loginStatus: this.loginStatus,
                        onLogout: () => {
                            this.onLogout();
                        }
                    }, undefined, elmtId, () => { }, { page: "features/mine/src/main/ets/pages/MinePage.ets", line: 32, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            userInfo: this.userInfo,
                            loginStatus: this.loginStatus,
                            onLogout: () => {
                                this.onLogout();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "Mine" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
