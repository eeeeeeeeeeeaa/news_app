import { BaiduHotSearchParser } from 'utils';
import webview from '@ohos.web.webview';
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
class NewsData {
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
  imageUrl: Resource | string | null;

  /**
   * News detail url.
   */
  detailUrl: string | null;

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
    imageUrl: Resource | string | null,
    category: string,
    readCount: number,
    isHot: boolean = false,
    isTop: boolean = false,
    detailUrl: string | null = null
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
    this.detailUrl = detailUrl;
  }
}

/**
 * Main view model for news data.
 */
class MainViewModel {
  /**
   * Get hot news data.
   *
   * @return {Array<NewsData>} hotNewsData.
   */
  getHotNewsData(): Array<NewsData> {
    let hotNewsData: NewsData[] = [
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
      ),
      new NewsData(
        3,
        "教育改革：新课程标准正式发布",
        "教育部发布最新课程标准，强调素质教育与创新能力培养...",
        "教育时报",
        "5小时前",
        $r('app.media.fig3'),
        "教育",
        67000,
        true,
        false
      )
    ];
    return hotNewsData;
  }

  /**
   * Get news list data.
   *
   * @return {Array<NewsData>} newsListData.
   */
  getNewsListData(): Array<NewsData> {
    let newsListData: NewsData[] = [
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
      ),
      new NewsData(
        5,
        "体育赛事：世界杯预选赛精彩回顾",
        "多支强队在预选赛中展现出色表现，为即将到来的正赛做准备...",
        "体育周报",
        "8小时前",
        $r('app.media.fig1'),
        "体育",
        56000,
        false,
        false
      ),
      new NewsData(
        6,
        "文化传承：非物质文化遗产保护工作取得新进展",
        "各地加大非遗保护力度，让传统文化在新时代焕发新活力...",
        "文化周刊",
        "10小时前",
        $r('app.media.fig2'),
        "文化",
        32000,
        false,
        false
      ),
      new NewsData(
        7,
        "健康生活：专家建议的冬季养生指南",
        "冬季是养生的关键时期，专家提醒注意饮食调理和适度运动...",
        "健康时报",
        "12小时前",
        $r('app.media.fig3'),
        "健康",
        28000,
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
}

/**
 * News page component with all functionality integrated.
 */
@Component
export struct NewsPage {
  @State currentCategory: string = "热搜";
  @State hotNewsData: NewsData[] = [];
  @State categories: string[] = [];
  @State searchText: string = '';
  @State showSearchAction: boolean = false;
  @State isLoading: boolean = false;
  @State selectedNewsUrl: string | null = null;
  private mainViewModel: MainViewModel = new MainViewModel();
  private detailWebController: webview.WebviewController = new webview.WebviewController();

  async aboutToAppear() {
    this.categories = this.mainViewModel.getNewsCategories();
    if (this.categories.length > 0) {
      this.currentCategory = this.categories[0];
    }
    await this.loadHotNewsData(this.currentCategory);
  }

  /**
   * 加载热搜数据
   */
    private getTabKeyForCategory(category: string): string {
    switch (category) {
      case '财经':
        return 'finance';
      case '民生':
        return 'livelihood';
      case '体育':
        return 'sports';
      default:
        return 'realtime';
    }
  }

  async loadHotNewsData(category?: string) {
    const targetCategory: string = category ?? this.currentCategory;
    this.isLoading = true;
    try {
      const tabKey: string = this.getTabKeyForCategory(targetCategory);
      const hotItems = await BaiduHotSearchParser.getHotSearchData(tabKey);
      const sourceLabel: string = targetCategory === '热搜' ? '百度热搜' : `百度${targetCategory}榜`;
      this.hotNewsData = hotItems.map((it, idx) => {
        const detailUrl: string | undefined = it.rawUrl && it.rawUrl.length > 0 ? it.rawUrl : it.linkurl;
        const imageSource: string | undefined = targetCategory === '热搜' && it.imageUrl && it.imageUrl.length > 0 ? it.imageUrl : undefined;
        return new NewsData(
          idx + 1,
          it.card_title,
          '',
          sourceLabel,
          '',
          imageSource ?? null,
          targetCategory,
          parseInt(it.heat_score || '0') || 0,
          true,
          idx < 3,
          detailUrl ?? null
        );
      });
      this.currentCategory = targetCategory;
    } catch (error) {
      console.error('获取榜单数据失败:', error);
      this.hotNewsData = this.mainViewModel.getMockHotNewsData();
    } finally {
      this.isLoading = false;
    }
  }

  private onCategorySelected(category: string): void {
    if (this.currentCategory === category) {
      return;
    }
    this.currentCategory = category;
    this.loadHotNewsData(category).catch((error: Error) => {
      console.error('切换榜单失败:', error);
    });
  }

  private openNewsDetail(news: NewsData): void {
    if (!news.detailUrl || news.detailUrl.length === 0) {
      this.getUIContext().getPromptAction().showToast({
        message: '暂未提供有效链接'
      });
      return;
    }
    this.selectedNewsUrl = news.detailUrl;
  }

  private closeNewsDetail(): void {
    this.selectedNewsUrl = null;
  }

  /**
   * Build enhanced search bar.
   */
  @Builder
  buildSearchBar() {
    Row() {
      // 搜索框区域
      Row() {
        Image($r('app.media.sift')) // 搜索图标
          .width('16vp')
          .height('16vp')
          .margin({ left: '12vp', right: '8vp' })
          .fillColor('#999999')

        TextInput({ placeholder: '搜索新闻', text: this.searchText })
          .fontSize('14fp')
          .fontColor('#182431')
          .backgroundColor(Color.Transparent)
          .placeholderColor('#999999')
          .layoutWeight(1)
          .onChange((value: string) => {
            this.searchText = value;
            this.showSearchAction = value.length > 0;
          })

        if (this.showSearchAction) {
          Image($r('app.media.sift')) // 清除图标
            .width('14vp')
            .height('14vp')
            .margin({ right: '12vp' })
            .fillColor('#999999')
            .onClick(() => {
              this.searchText = '';
              this.showSearchAction = false;
            })
        }
      }
      .height('36vp')
      .backgroundColor('#FFFFFF')
      .borderRadius('18vp')
      .border({ width: '1vp', color: '#E5E5E5' })
      .layoutWeight(1)

      // 操作按钮
      Row() {
        Image($r('app.media.message')) // 消息图标
          .width('20vp')
          .height('20vp')
          .margin({ left: '12vp', right: '12vp' })
          .fillColor('#333333')
          .onClick(() => {
            // 处理消息点击
          })

        Image($r('app.media.menu')) // 刷新图标
          .width('20vp')
          .height('20vp')
          .margin({ right: '4vp' })
          .fillColor('#333333')
          .onClick(() => {
            // 刷新榜单数据
            this.loadHotNewsData(this.currentCategory);
          })

        // 测试按钮
        Text('测试')
          .fontSize('12fp')
          .fontColor('#007DFF')
          .margin({ right: '4vp' })
          .onClick(async () => {
            // 测试爬取功能
            console.log('🧪 用户点击测试按钮');
            try {
              // 这里可以调用测试方法
              console.log('开始测试爬取功能...');
            } catch (error) {
              console.error('测试失败:', error);
            }
          })
      }
      .height('36vp')
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .padding({ left: '12vp', right: '8vp', top: '8vp', bottom: '8vp' })
    .alignItems(VerticalAlign.Center)
  }

  /**
   * Build enhanced category tab.
   */
  @Builder
  buildCategoryTab(category: string, index: number) {
    Column() {
      Text(category)
        .fontSize(this.currentCategory === category ? '16fp' : '14fp')
        .fontColor(this.currentCategory === category ? '#007DFF' : '#666666')
        .fontWeight(this.currentCategory === category ? FontWeight.Medium : FontWeight.Normal)
        .padding({ left: '16vp', right: '16vp', top: '8vp', bottom: '8vp' })

      // 选中指示器
      if (this.currentCategory === category) {
        Column() {
          // 使用空的 Column 作为指示器，通过背景色实现
        }
        .width('20vp')
        .height('3vp')
        .backgroundColor('#007DFF')
        .borderRadius('2vp')
        .margin({ top: '2vp' })
      }
    }
    .alignItems(HorizontalAlign.Center)
    .onClick(() => {
      this.onCategorySelected(category);
    })
  }

  /**
   * Build enhanced hot news item.
   */
  @Builder
  buildHotNewsItem(news: NewsData, index: number) {
    Column() {
      Row() {
        // 排名标识
        if (index < 3) {
          Text((index + 1).toString())
            .fontSize('14fp')
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bold)
            .width('20vp')
            .height('20vp')
            .textAlign(TextAlign.Center)
            .backgroundColor(index === 0 ? '#FF4444' : index === 1 ? '#FF8800' : '#FFAA00')
            .borderRadius('10vp')
            .margin({ right: '8vp' })
        } else {
          Text((index + 1).toString())
            .fontSize('12fp')
            .fontColor('#999999')
            .width('16vp')
            .height('16vp')
            .textAlign(TextAlign.Center)
            .backgroundColor('#F0F0F0')
            .borderRadius('8vp')
            .margin({ right: '8vp' })
        }

        Column() {
          Text(news.title)
            .fontSize('15fp')
            .fontWeight(FontWeight.Medium)
            .fontColor('#182431')
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .margin({ bottom: '6vp' })
            .textAlign(TextAlign.Start)
            .lineHeight('20fp')

          Row() {
            Text(news.source)
              .fontSize('11fp')
              .fontColor('#999999')

            Text('·')
              .fontSize('11fp')
              .fontColor('#999999')
              .margin({ left: '4vp', right: '4vp' })

            Text(news.publishTime)
              .fontSize('11fp')
              .fontColor('#999999')

            Blank()

            Text(this.mainViewModel.formatReadCount(news.readCount))
              .fontSize('11fp')
              .fontColor('#999999')
          }
          .width('100%')
          .alignItems(VerticalAlign.Center)
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        if (typeof news.imageUrl === 'string') {
          Image(news.imageUrl as string)
            .width('70vp')
            .height('50vp')
            .borderRadius('6vp')
            .objectFit(ImageFit.Cover)
        } else if (news.imageUrl) {
          Image(news.imageUrl as Resource)
            .width('70vp')
            .height('50vp')
            .borderRadius('6vp')
            .objectFit(ImageFit.Cover)
        }
      }
      .width('100%')
      .alignItems(VerticalAlign.Top)

      // 分隔线
      if (index < this.hotNewsData.length - 1) {
        Divider()
          .strokeWidth('0.5vp')
          .color('#F0F0F0')
          .margin({ top: '12vp', bottom: '4vp' })
      }
    }
    .width('100%')
    .padding({ top: '8vp', bottom: '8vp' })
    .onClick(() => {
      this.openNewsDetail(news);
    })
  }

  /**
   * Build enhanced news list item.
   */
  @Builder
  buildNewsListItem(news: NewsData) {
    Column() {
      Row() {
        Column() {
          // 标签区域
          if (news.isHot || news.isTop || news.category) {
            Row() {
              if (news.isHot) {
                Text('热')
                  .fontSize('10fp')
                  .fontColor(Color.White)
                  .backgroundColor('#FF4444')
                  .padding({ left: '6vp', right: '6vp', top: '2vp', bottom: '2vp' })
                  .borderRadius('4vp')
                  .margin({ right: '6vp' })
              }

              if (news.isTop) {
                Text('置顶')
                  .fontSize('10fp')
                  .fontColor(Color.White)
                  .backgroundColor('#FF8800')
                  .padding({ left: '6vp', right: '6vp', top: '2vp', bottom: '2vp' })
                  .borderRadius('4vp')
                  .margin({ right: '6vp' })
              }

              if (news.category) {
                Text(news.category)
                  .fontSize('10fp')
                  .fontColor('#007DFF')
                  .backgroundColor('#E6F3FF')
                  .padding({ left: '6vp', right: '6vp', top: '2vp', bottom: '2vp' })
                  .borderRadius('4vp')
              }
            }
            .margin({ bottom: '8vp' })
            .alignItems(VerticalAlign.Center)
          }

          Text(news.title)
            .fontSize('16fp')
            .fontWeight(FontWeight.Medium)
            .fontColor('#182431')
            .maxLines(3)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .margin({ bottom: '6vp' })
            .textAlign(TextAlign.Start)
            .lineHeight('21fp')

          if (news.summary) {
            Text(news.summary)
              .fontSize('13fp')
              .fontColor('#666666')
              .maxLines(2)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .margin({ bottom: '8vp' })
              .textAlign(TextAlign.Start)
              .lineHeight('17fp')
          }

          Row() {
            Text(news.source)
              .fontSize(12)
              .fontColor('#999999')

            Text('·')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ left: 6, right: 6 })

            Text(news.publishTime)
              .fontSize(12)
              .fontColor('#999999')

            Blank()

            Row() {
              Image($r('app.media.message')) // 评论图标
                .width(12)
                .height(12)
                .margin({ right: 4 })
                .fillColor('#999999')

              Text(this.mainViewModel.formatReadCount(news.readCount))
                .fontSize(12)
                .fontColor('#999999')
            }
            .alignItems(VerticalAlign.Center)
          }
          .width('100%')
          .alignItems(VerticalAlign.Center)
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)

        if (typeof news.imageUrl === 'string') {
          Image(news.imageUrl as string)
            .width(100)
            .height(75)
            .borderRadius(8)
            .objectFit(ImageFit.Cover)
            .margin({ left: 12 })
        } else if (news.imageUrl) {
          Image(news.imageUrl as Resource)
            .width(100)
            .height(75)
            .borderRadius(8)
            .objectFit(ImageFit.Cover)
            .margin({ left: 12 })
        }
      }
      .width('100%')
      .alignItems(VerticalAlign.Top)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Color.White)
    .borderRadius(12)
    .margin({ bottom: 8, left: 12, right: 12 })
    .shadow({ radius: 8, color: '#1A000000', offsetX: 0, offsetY: 2 })
    .onClick(() => {
      this.openNewsDetail(news);
    })
  }

  @Builder
  buildMainLayout() {
    Column() {
      // Search bar
      this.buildSearchBar()

      // Category tabs with background
      Column() {
        Scroll() {
          Row({ space: 8 }) {
            ForEach(this.categories, (category: string, index: number) => {
              this.buildCategoryTab(category, index)
            })
          }
          .padding({ left: '12vp', right: '12vp' })
        }
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(BarState.Off)
        .height('48vp')
      }
      .width('100%')
      .backgroundColor(Color.White)
      .shadow({ radius: 4, color: '#0A000000', offsetX: 0, offsetY: 1 })

      // Content area
      Scroll() {
        Column() {
          // 榜单数据展示
          Column() {
            // 榜单标题
            Row() {
              Text(this.currentCategory + '榜')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor('#182431')

              Blank()

              if (this.isLoading) {
                LoadingProgress()
                  .width('16vp')
                  .height('16vp')
                  .margin({ right: '8vp' })
              }

              Text('更多')
                .fontSize(13)
                .fontColor('#999999')
                .onClick(() => {
                  this.loadHotNewsData(this.currentCategory);
                })
            }
            .width('100%')
            .padding({ left: 20, right: 20, top: 16, bottom: 12 })

            // 榜单列表
            Column() {
              ForEach(this.hotNewsData, (news: NewsData, index: number) => {
                this.buildHotNewsItem(news, index)
              })
            }
            .width('100%')
            .padding({ left: 20, right: 20 })
            .backgroundColor(Color.White)
            .borderRadius(12)
            .margin({ bottom: 16, left: 12, right: 12 })
            .shadow({ radius: 8, color: '#1A000000', offsetX: 0, offsetY: 2 })
          }

        }
      }
      .scrollBar(BarState.Off)
      .layoutWeight(1)
    }
    .padding({ top: '48vp' })
    .width('100%')
    .height('100%')
    .backgroundColor('#F8F9FA')
  }

  @Builder
  buildDetailLayer(url: string) {
    Column() {
      Row() {
        Text('关闭')
          .fontSize(16)
          .fontColor('#E60012')
          .padding({ left: 16, right: 16, top: 16, bottom: 16 })
          .onClick(() => {
            this.closeNewsDetail();
          })

        Blank()

        Text('新闻详情')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#182431')
          .margin({ right: 24 })
      }
      .width('100%')
      .backgroundColor('#FFFFFF')

      Web({ src: url, controller: this.detailWebController })
        .layoutWeight(1)
        .width('100%')
    }
    .padding({ top: '48vp' })
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      this.buildMainLayout();

      if (this.selectedNewsUrl !== null) {
        this.buildDetailLayer(this.selectedNewsUrl as string);
      }
    }
    .width('100%')
    .height('100%')
  }
}
