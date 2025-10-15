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

  import ItemData from './ItemData';
  import NewsData from './NewsData';
  import { BaiduHotSearchParser, BaiduHotSearchItem } from './BaiduHotSearchParser';

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
        $r('app.media.fig1'),
        $r('app.media.fig2'),
        $r('app.media.fig3'),
        $r('app.media.fig4')
      ];
      return swiperImages;
    }

    /**
     * Get data of the first grid.
     *
     * @return {Array<PageResource>} firstGridData.
     */
    getFirstGridData(): Array<ItemData> {
      // 该模块不再依赖应用侧的特定资源，返回空集合由上层自行渲染
      return [];
    }

    /**
     * Get data of the setting list.
     *
     * @return {Array<PageResource>} settingListData.
     */
    getSettingListData(): Array<Array<ItemData>> {
      return [];
    }

    /**
     * Get hot news data from Baidu hot search.
     *
     * @return {Promise<Array<NewsData>>} hotNewsData.
     */
    async getHotNewsData(): Promise<Array<NewsData>> {
      try {
        // 获取百度热搜数据
        const hotSearchItems = await BaiduHotSearchParser.getHotSearchData();
        
        // 转换为NewsData格式
        const hotNewsData: NewsData[] = hotSearchItems.map((item: BaiduHotSearchItem, index: number) => {
          const news: NewsData = new NewsData(
            index + 1,
            item.card_title,
            `热搜指数: ${BaiduHotSearchParser.formatHeatScore(item.heat_score)}`,
            "百度热搜",
            "刚刚",
            $r('app.media.fig1'),
            "热搜",
            parseInt(item.heat_score),
            true,
            index < 3
          );
          const detailUrl: string | undefined = item.rawUrl && item.rawUrl.length > 0 ? item.rawUrl : item.linkurl;
          news.detailUrl = detailUrl ?? null;
          return news;
        });
        
        return hotNewsData;
      } catch (error) {
        console.error('获取热搜数据失败:', error);
        // 返回备用数据
        return this.getMockHotNewsData();
      }
    }

    /**
     * Get mock hot news data as fallback.
     *
     * @return {Array<NewsData>} hotNewsData.
     */
    getMockHotNewsData(): Array<NewsData> {
      return [
        new NewsData(
          1,
          "科技突破：人工智能在医疗领域取得重大进展",
          "最新研究显示，AI技术在疾病诊断和治疗方案制定方面展现出巨大潜力...",
          "科技日报",
          "2小时前",
          $r('app.media.fig1'),
          "科技",
          125000,
          true,
          true
        ),
        new NewsData(
          2,
          "经济观察：全球股市震荡，投资者需谨慎",
          "受多重因素影响，全球主要股市出现不同程度波动，专家建议理性投资...",
          "财经网",
          "3小时前",
          $r('app.media.fig2'),
          "财经",
          89000,
          true,
          false
        )
      ];
    }

    /**
     * Get news list data.
     *
     * @return {Array<NewsData>} newsListData.
     */
    getNewsListData(): Array<NewsData> {
      let newsListData: NewsData[] = [
        new NewsData(
          3,
          "教育改革：新课程标准正式发布",
          "教育部发布最新课程标准，强调素质教育与创新能力培养...",
          "教育时报",
          "5小时前",
          $r('app.media.fig3'),
          "教育",
          67000,
          false,
          false
        ),
        new NewsData(
          4,
          "环保行动：多地启动绿色出行计划",
          "为减少碳排放，多个城市推出绿色出行激励政策...",
          "环保日报",
          "6小时前",
          $r('app.media.fig4'),
          "环保",
          43000,
          false,
          false
        )
      ];
      return newsListData;
    }

    /**
     * Get news categories.
     *
     * @return {Array<string>} categories.
     */
    getNewsCategories(): Array<string> {
      return ["热搜", "财经", "民生", "体育"];
    }

    /**
     * Format read count.
     *
     * @param {number} count - read count.
     * @return {string} formatted count.
     */
    formatReadCount(count: number): string {
      if (count >= 10000) {
        return Math.floor(count / 10000) + "万";
      } else if (count >= 1000) {
        return Math.floor(count / 1000) + "k";
      } else {
        return count.toString();
      }
    }
  }

  export default new MainViewModel();
