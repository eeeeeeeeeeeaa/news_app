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

import Follow from '../view/Follow';

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


@Builder
export function FollowPageBuilder() {
  FollowPage()
}

@Component
export struct FollowPage {
  build() {
    Column() {
      Follow()
    }
    .width('100%')
    .height('100%')
  }
}
