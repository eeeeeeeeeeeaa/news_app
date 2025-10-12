import ItemData from "@bundle:com.example.pageanddata/entry/ets/viewmodel/ItemData";
/**
 * Binds data to components and provides interfaces.
 */
export class MainViewModel {
    /**
     * Get swiper image data.
     *
     * @return {Array<Resource>} swiperImages.
     */
    getSwiperImages(): Array<Resource> {
        let swiperImages: Resource[] = [
            { "id": 16777395, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" },
            { "id": 16777396, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" },
            { "id": 16777397, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" },
            { "id": 16777398, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }
        ];
        return swiperImages;
    }
    /**
     * Get data of the first grid.
     *
     * @return {Array<PageResource>} firstGridData.
     */
    getFirstGridData(): Array<ItemData> {
        let firstGridData: ItemData[] = [
            new ItemData(0, { "id": 16777272, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777404, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            new ItemData(1, { "id": 16777249, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777410, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            new ItemData(2, { "id": 16777267, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777406, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            new ItemData(3, { "id": 16777290, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777414, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            new ItemData(4, { "id": 16777271, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777418, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            new ItemData(5, { "id": 16777248, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777390, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            new ItemData(6, { "id": 16777244, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777394, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            new ItemData(7, { "id": 16777278, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777411, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" })
        ];
        return firstGridData;
    }
    /**
     * Get data of the setting list.
     *
     * @return {Array<PageResource>} settingListData.
     */
    getSettingListData(): Array<Array<ItemData>> {
        let settingListData: ItemData[][] = [
            [
                new ItemData(0, { "id": 16777286, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777407, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777289, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" })
            ],
            [
                new ItemData(1, { "id": 16777284, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777391, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
                new ItemData(2, { "id": 16777285, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777405, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            ],
            [
                new ItemData(3, { "id": 16777239, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777417, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
                new ItemData(4, { "id": 16777287, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777409, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }),
            ],
            [
                new ItemData(5, { "id": 16777283, "type": 10003, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" }, { "id": 16777387, "type": 20000, params: [], "bundleName": "com.example.pageanddata", "moduleName": "entry" })
            ]
        ];
        return settingListData;
    }
}
export default new MainViewModel();
