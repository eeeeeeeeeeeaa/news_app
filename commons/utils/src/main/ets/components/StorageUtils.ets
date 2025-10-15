/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { preferences } from '@kit.ArkData';

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
