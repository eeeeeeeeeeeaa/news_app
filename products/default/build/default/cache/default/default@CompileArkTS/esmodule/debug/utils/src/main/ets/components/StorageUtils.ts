import preferences from "@ohos:data.preferences";
export default class StorageUtils {
    private static prefs: preferences.Preferences;
    private static readonly PREFS_NAME = 'app_storage';
    static async initPreferences(): Promise<void> {
        if (!StorageUtils.prefs) {
            StorageUtils.prefs = await preferences.getPreferences(getContext(), StorageUtils.PREFS_NAME);
        }
    }
    static async put(key: string, value: preferences.ValueType): Promise<void> {
        await StorageUtils.prefs.put(key, value);
        await StorageUtils.prefs.flush();
    }
    static async get(key: string, defaultValue: preferences.ValueType): Promise<preferences.ValueType> {
        return await StorageUtils.prefs.get(key, defaultValue);
    }
    static async delete(key: string): Promise<void> {
        await StorageUtils.prefs.delete(key);
        await StorageUtils.prefs.flush();
    }
}
