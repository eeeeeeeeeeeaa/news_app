if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FollowPage_Params {
}
import Follow from "@bundle:com.huawei.quickstart/default@follows/ets/view/Follow";
/**
 * 关注的新闻数据模型
 */
export interface FollowedNewsData {
    id: string; // 新闻ID
    title: string; // 新闻标题
    publishTime: string; // 发布时间
    publisher: string; // 发布者
    imageUrl?: string; // 新闻图片URL（可选）
    content?: string; // 新闻内容（可选）
}
export function FollowPageBuilder(parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new FollowPage(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "features/follows/src/main/ets/pages/FollowPage.ets", line: 33, col: 3 });
                ViewPU.create(componentCall);
                let paramsLambda = () => {
                    return {};
                };
                componentCall.paramsGenerator_ = paramsLambda;
            }
            else {
                (parent ? parent : this).updateStateVarsOfChildByElmtId(elmtId, {});
            }
        }, { name: "FollowPage" });
    }
}
export class FollowPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: FollowPage_Params) {
    }
    updateStateVars(params: FollowPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new Follow(this, {}, undefined, elmtId, () => { }, { page: "features/follows/src/main/ets/pages/FollowPage.ets", line: 40, col: 7 });
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
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
