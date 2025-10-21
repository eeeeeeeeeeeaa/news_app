// ets/view/Video.ets
import { CommonSearchBar } from 'uicomponents';
import { BaiduHotSearchParser, NewsHeadlineService, NewsHeadlineItem, buildNewsApiUrl, maskApiKey, NewsApiRequestParams } from 'utils';
import webview from '@ohos.web.webview';

@Component
export default struct VideoPage {
  @State searchText: string = '';
  @State hotTitles: string[] = [];
  @State selectedUrl: string | null = null;
  private webController: webview.WebviewController = new webview.WebviewController();

  // Text-only news for video page
  @State categories: string[] = ['推荐', '国内', '国际', '娱乐', '体育', '军事', '科技', '财经', '游戏', '汽车', '健康'];
  @State currentCategory: string = '推荐';
  @State newsList: NewsHeadlineItem[] = [];
  @State isLoading: boolean = false;
  @State debugRequestUrl: string = '';

  // Refresh & pagination
  @State refreshing: boolean = false;
  @State loadingMore: boolean = false;
  @State page: number = 1;
  @State pageSize: number = 20;
  @State hasMore: boolean = true;

  async aboutToAppear() {
    // preload hot titles for search bar placeholder (reuse existing behavior)
    try {
      const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
      this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
    } catch (_) {
      this.hotTitles = [];
    }
    await this.reloadCurrentCategory();
  }

  private getTypeForCategory(category: string): string {
    switch (category) {
      case '推荐':
        return 'top';
      case '国内':
        return 'guonei';
      case '国际':
        return 'guoji';
      case '娱乐':
        return 'yule';
      case '体育':
        return 'tiyu';
      case '军事':
        return 'junshi';
      case '科技':
        return 'keji';
      case '财经':
        return 'caijing';
      case '游戏':
        return 'youxi';
      case '汽车':
        return 'qiche';
      case '健康':
        return 'jiankang';
      default:
        return 'top';
    }
  }

  private async reloadCurrentCategory() {
    this.page = 1;
    this.hasMore = true;
    await this.loadNewsByCategory(this.currentCategory, true);
  }

  private async loadNewsByCategory(category: string, replace: boolean = false) {
    this.isLoading = replace && !this.refreshing;
    try {
      const type = this.getTypeForCategory(category);
      const params: NewsApiRequestParams = { type: type, is_filter: 0, page: this.page, size: this.pageSize };
      // Debug: print and keep masked url
      const url = buildNewsApiUrl(params);
      this.debugRequestUrl = maskApiKey(url);
      const list = await NewsHeadlineService.fetch(params);
      this.currentCategory = category;
      this.hasMore = list.length >= this.pageSize;
      if (replace) {
        this.newsList = list;
      } else {
        this.newsList = [...this.newsList, ...list];
      }
    } catch (e) {
      if (replace) {
        this.newsList = [];
      }
      // no error code handling as requested
    } finally {
      this.isLoading = false;
      this.refreshing = false;
      this.loadingMore = false;
    }
  }

  private onTabClick(category: string) {
    if (this.currentCategory === category) return;
    this.page = 1;
    this.hasMore = true;
    this.loadNewsByCategory(category, true).catch(() => {});
  }

  private async onPullToRefresh() {
    if (this.refreshing) return;
    this.refreshing = true;
    this.page = 1;
    this.hasMore = true;
    await this.loadNewsByCategory(this.currentCategory, true);
  }

  private async onLoadMore() {
    if (this.loadingMore || !this.hasMore) return;
    this.loadingMore = true;
    this.page += 1;
    await this.loadNewsByCategory(this.currentCategory, false);
  }

  private openBrowser(url: string): void {
    this.selectedUrl = url;
  }

  private closeBrowser(): void {
    this.selectedUrl = null;
  }

  @Builder
  buildBrowserLayer(url: string) {
    Column() {
      Row() {
        Text('关闭')
          .fontSize(16)
          .fontColor('#E60012')
          .padding({ left: 16, right: 16, top: 16, bottom: 16 })
          .onClick(() => {
            this.closeBrowser();
          })

        Blank()

        Text('网页浏览')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#182431')
          .margin({ right: 24 })
      }
      .width('100%')
      .backgroundColor('#FFFFFF')

      Web({ src: url, controller: this.webController })
        .layoutWeight(1)
        .width('100%')
    }
    .padding({ top: '48vp' })
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }

  @Builder
  buildCategoryTabs() {
    Column() {
      Scroll() {
        Row({ space: 8 }) {
          ForEach(this.categories, (c: string) => {
            Text(c)
              .fontSize(16)
              .fontWeight(this.currentCategory === c ? FontWeight.Bold : FontWeight.Regular)
              .fontColor(this.currentCategory === c ? '#182431' : '#666666')
              .backgroundColor(this.currentCategory === c ? '#E6F3FF' : Color.Transparent)
              .padding({ left: 12, right: 12, top: 6, bottom: 6 })
              .borderRadius(14)
              .onClick(() => this.onTabClick(c))
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
  }

  @Builder
  buildTextNewsItem(item: NewsHeadlineItem, index: number) {
    Column() {
      Text(item.title)
        .fontSize('16fp')
        .fontWeight(FontWeight.Medium)
        .fontColor('#182431')
        .maxLines(3)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .lineHeight('21fp')
        .margin({ bottom: '6vp' })
        .textAlign(TextAlign.Start)
        .width('100%')

      Row() {
        if (item.source) {
          Text(String(item.source))
            .fontSize('12fp')
            .fontColor('#999999')
        }
        if (item.source && item.time) {
          Text('·')
            .fontSize('12fp')
            .fontColor('#999999')
            .margin({ left: 6, right: 6 })
        }
        if (item.time) {
          Text(String(item.time))
            .fontSize('12fp')
            .fontColor('#999999')
        }
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .padding({ top: '8vp', bottom: '8vp' })
    .onClick(() => this.openBrowser(item.url))
  }

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      Column() {
        // Top search bar (keep consistent with other pages)
        CommonSearchBar({
          value: this.searchText,
          placeholder: '搜新�?热词',
          hotTitles: this.hotTitles,
          onSearch: (url: string) => this.openBrowser(url)
        })
        .padding({ left: '12vp', right: '12vp', top: '8vp', bottom: '8vp' })

        this.buildCategoryTabs();

        // Content list (text-only) with pull-to-refresh and load-more
        Refresh({ refreshing: this.refreshing }) {
          List({ space: 0 }) {
            if (!this.isLoading && !this.refreshing && this.newsList.length === 0) {
              ListItem() {
                Column() {
                  Text('暂无数据')
                    .fontSize('14fp')
                    .fontColor('#999999')
                    .margin({ bottom: 8 })
                  if (this.debugRequestUrl && this.debugRequestUrl.length > 0) {
                    Text(this.debugRequestUrl)
                      .fontSize('12fp')
                      .fontColor('#666666')
                      .lineHeight('16fp')
                      .maxLines(3)
                      .textOverflow({ overflow: TextOverflow.Ellipsis })
                      .textAlign(TextAlign.Center)
                  }
                }
                .padding(24)
                .width('100%')
                .justifyContent(FlexAlign.Center)
              }
            } else {
              ForEach(this.newsList, (n: NewsHeadlineItem, i: number) => {
                ListItem() {
                  this.buildTextNewsItem(n, i)
                  if (i < this.newsList.length - 1) {
                    Divider().strokeWidth('0.5vp').color('#F0F0F0')
                  }
                }
              })

              if (this.loadingMore) {
                ListItem() {
                  Row() {
                    LoadingProgress().width('16vp').height('16vp').margin({ right: '6vp' })
                    Text('加载').fontSize('12fp').fontColor('#999999')
                  }.width('100%').padding(12).justifyContent(FlexAlign.Center)
                }
              } else if (!this.hasMore && this.newsList.length > 0) {
                ListItem() {
                  Text('没有更多').fontSize('12fp').fontColor('#999999').padding(12).width('100%').textAlign(TextAlign.Center)
                }
              }
            }
          }
          .edgeEffect(EdgeEffect.Spring)
          .onReachEnd(() => this.onLoadMore())
        }
        .onStateChange((s: RefreshStatus) => {
          if (s === RefreshStatus.Refresh) {
            this.onPullToRefresh();
          }
        })
        .layoutWeight(1)
      }
      .padding({ top: '48vp' })
      .width('100%')
      .height('100%')
      .backgroundColor('#F8F9FA')

      if (this.selectedUrl !== null) {
        this.buildBrowserLayer(this.selectedUrl as string);
      }
    }
    .width('100%')
    .height('100%')
  }
}
