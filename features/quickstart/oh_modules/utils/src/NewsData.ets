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

/**
 * News data entity.
 */
export default class NewsData {
  /**
   * News ID.
   */
  id: number;
  
  /**
   * News title.
   */
  title: string;
  
  /**
   * News summary.
   */
  summary: string;
  
  /**
   * News source.
   */
  source: string;
  
  /**
   * News publish time.
   */
  publishTime: string;
  
  /**
   * News image URL.
   */
  imageUrl: Resource;
  
  /**
   * News category.
   */
  category: string;
  
  /**
   * News read count.
   */
  readCount: number;
  
  /**
   * Whether news is hot.
   */
  isHot: boolean;
  
  /**
   * Whether news is top.
   */
  isTop: boolean;

  constructor(
    id: number,
    title: string,
    summary: string,
    source: string,
    publishTime: string,
    imageUrl: Resource,
    category: string,
    readCount: number,
    isHot: boolean = false,
    isTop: boolean = false
  ) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.source = source;
    this.publishTime = publishTime;
    this.imageUrl = imageUrl;
    this.category = category;
    this.readCount = readCount;
    this.isHot = isHot;
    this.isTop = isTop;
  }
}
