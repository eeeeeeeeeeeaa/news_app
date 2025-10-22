import { CommonSearchBar } from 'uicomponents';
import { BaiduHotSearchParser } from 'utils';
import webview from '@ohos.web.webview';
import { NewsFollowService, type FollowedNewsItem } from './NewsFollowService';

/**
 * 关注新闻数据接口
 */
export interface FollowedNewsData {
  id: string;
  title: string;
  publishTime: string;
  publisher: string;
  imageUrl?: string;
  content?: string;
}

/**
 * 新闻卡片组件
 * 显示新闻标题、发布时间、发布者等信息
 */
@Component
export struct NewsCard {
  @Prop newsData: FollowedNewsData;
  onCardClick?: (newsData: FollowedNewsData) => void;
  onUnfollow?: () => void;

  build() {
    Column() {
      // 新闻标题
      Text(this.newsData.title)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#182431')
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .width('100%')
        .margin({ bottom: 8 })

      // 底部信息行
      Row() {
        // 发布者
        Text(this.newsData.publisher)
          .fontSize(12)
          .fontColor('#666666')
          .backgroundColor('#F5F5F5')
          .padding({ left: 8, right: 8, top: 4, bottom: 4 })
          .borderRadius(4)

        // 发布时间
        Text(this.formatTime(this.newsData.publishTime))
          .fontSize(12)
          .fontColor('#999999')
          .margin({ left: 8 })

        Blank()

        // 取消关注按钮
        if (this.onUnfollow) {
          Text('取消关注')
            .fontSize(12)
            .fontColor('#E60012')
            .backgroundColor('#FFF5F5')
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .borderRadius(4)
            .onClick(() => {
              if (this.onUnfollow) {
                this.onUnfollow();
              }
            })
        }
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
    .borderRadius(8)
    .shadow({
      radius: 4,
      color: '#1A000000',
      offsetX: 0,
      offsetY: 2
    })
    .onClick(() => {
      if (this.onCardClick) {
        this.onCardClick(this.newsData);
      }
    })
  }

  /**
   * 格式化时间显示
   * @param timeStr 时间字符串
   * @returns 格式化后的时间
   */
  private formatTime(timeStr: string): string {
    try {
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      // 返回格式：2024-10-22 14:30
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      return timeStr;
    }
  }
}

// ets/view/Follow.ets
@Component
export default struct FollowPage {
  @Prop refreshTrigger: number = 0; // 从外部传入的刷新触发器
  @State searchText: string = '';
  @State selectedUrl: string | null = null;
  @State currentViewingNews: FollowedNewsItem | null = null; // 当前正在查看的新闻数据
  private webController: webview.WebviewController = new webview.WebviewController();
  @State hotTitles: string[] = [];
  @State followedNewsList: FollowedNewsItem[] = [];
  @State isLoading: boolean = true; // 标记是否正在加载
  @State errorMessage: string = ''; // 错误信息
  private newsFollowService: NewsFollowService = NewsFollowService.getInstance();

  async aboutToAppear() {
    try {
      const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
      this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
    } catch (_) {
      this.hotTitles = [];
    }
    
    // 加载关注的新闻数据
    await this.loadFollowedNewsList();
  }

  /**
   * 监听刷新触发器变化
   */
  onPageShow() {
    console.log('🔄 FollowPage.onPageShow 被调用，refreshTrigger:', this.refreshTrigger);
    if (this.refreshTrigger > 0) {
      this.loadFollowedNewsList();
    }
  }

  /**
   * 监听refreshTrigger变化
   */
  onPageUpdate() {
    console.log('🔄 FollowPage.onPageUpdate 被调用，refreshTrigger:', this.refreshTrigger);
    if (this.refreshTrigger > 0) {
      this.loadFollowedNewsList();
    }
  }

  /**
   * 加载关注的新闻列表
   */
  private async loadFollowedNewsList(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const followedNews = await this.newsFollowService.getFollowedNewsList();
      this.followedNewsList = followedNews;
      this.isLoading = false;
      console.log('✅ 成功加载关注列表，共', followedNews.length, '条数据');
    } catch (error) {
      console.error('❌ 加载关注列表失败:', error);
      this.followedNewsList = [];
      this.isLoading = false;
      
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = '加载失败，请稍后再试';
      }
    }
  }

  private openBrowser(url: string, newsData?: FollowedNewsItem): void {
    this.selectedUrl = url;
    this.currentViewingNews = newsData || null;
  }

  private closeBrowser(): void {
    this.selectedUrl = null;
    this.currentViewingNews = null;
  }

  /**
   * 点击新闻卡片，打开新闻详情
   * @param newsData 新闻数据
   */
  private onNewsCardClick(newsData: FollowedNewsItem): void {
    console.log('点击新闻卡片:', newsData.newsTitle);
    console.log('新闻URL:', newsData.newsUniquekey);
    
    // newsUniquekey 实际存放的是新闻的 URL
    if (newsData.newsUniquekey && newsData.newsUniquekey.trim().length > 0) {
      this.openBrowser(newsData.newsUniquekey, newsData);
    } else {
      console.warn('新闻URL为空，无法打开详情');
    }
  }

  /**
   * 取消关注新闻
   * @param newsData 新闻数据
   */
  private async onUnfollowNews(newsData: FollowedNewsItem): Promise<void> {
    try {
      const success = await this.newsFollowService.unfollowNews(newsData.newsUniquekey);
      if (success) {
        // 从列表中移除该新闻
        this.followedNewsList = this.followedNewsList.filter(item => item.followId !== newsData.followId);
      }
    } catch (error) {
      console.error('取消关注失败:', error);
    }
  }

  /**
   * 在详情页取消关注新闻
   */
  private async onUnfollowNewsInDetail(): Promise<void> {
    if (!this.currentViewingNews) {
      return;
    }
    
    try {
      const success = await this.newsFollowService.unfollowNews(this.currentViewingNews.newsUniquekey);
      if (success) {
        // 从列表中移除该新闻
        this.followedNewsList = this.followedNewsList.filter(item => item.followId !== this.currentViewingNews?.followId);
        // 关闭详情页
        this.closeBrowser();
      }
    } catch (error) {
      console.error('取消关注失败:', error);
    }
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

        // 取消关注按钮（仅当从关注列表打开时显示）
        if (this.currentViewingNews !== null) {
          Text('取消关注')
            .fontSize(14)
            .fontColor('#E60012')
            .backgroundColor('#FFF5F5')
            .padding({ left: 12, right: 12, top: 8, bottom: 8 })
            .borderRadius(4)
            .margin({ right: 16 })
            .onClick(() => {
              this.onUnfollowNewsInDetail();
            })
        }
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

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      Column() {
        // 顶部搜索框（公共组件）
        CommonSearchBar({
          value: this.searchText,
          placeholder: '搜索新闻',
          hotTitles: this.hotTitles,
          onSearch: (url: string) => {
            this.openBrowser(url);
          }
        })
        .padding({ left: '12vp', right: '12vp', top: '8vp', bottom: '8vp' })

        // 页面标题和刷新按钮
        Row() {
          Text('我的关注')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#182431')
          
          Blank()
          
          // 刷新按钮
          Text('刷新')
            .fontSize(12)
            .fontColor('#1890FF')
            .backgroundColor('#F0F9FF')
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .borderRadius(4)
            .onClick(() => {
              this.loadFollowedNewsList();
            })
        }
        .width('100%')
        .margin({ left: 16, right: 16, top: 16, bottom: 16 })

        // 内容区域
        if (this.isLoading) {
          // 加载状态
          Column() {
            LoadingProgress()
              .width(40)
              .height(40)
              .margin({ bottom: 16 })
            
            Text('正在加载...')
              .fontSize(16)
              .fontColor('#999999')
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        } else if (this.errorMessage) {
          // 错误状态
          Column() {
            Text('⚠️')
              .fontSize(48)
              .margin({ bottom: 16 })
            
            Text('加载失败')
              .fontSize(18)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FF4D4F')
              .margin({ bottom: 8 })
            
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#999999')
              .textAlign(TextAlign.Center)
              .margin({ bottom: 16 })
            
            Text('点击刷新重试')
              .fontSize(12)
              .fontColor('#1890FF')
              .onClick(() => {
                this.loadFollowedNewsList();
              })
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        } else if (this.followedNewsList.length > 0) {
          // 有数据状态
          List() {
            ForEach(this.followedNewsList, (newsItem: FollowedNewsItem, index: number) => {
              ListItem() {
                NewsCard({
                  newsData: {
                    id: newsItem.newsUniquekey,
                    title: newsItem.newsTitle,
                    publishTime: newsItem.newsTime || '',
                    publisher: newsItem.newsAuthor || '',
                    imageUrl: undefined,
                    content: undefined
                  },
                  onCardClick: (newsData: FollowedNewsData) => {
                    this.onNewsCardClick(newsItem);
                  },
                  onUnfollow: () => {
                    this.onUnfollowNews(newsItem);
                  }
                })
                .margin({ left: 16, right: 16, bottom: 12 })
              }
            }, (newsItem: FollowedNewsItem, index: number) => `${newsItem.followId}-${index}`)
          }
          .layoutWeight(1)
          .width('100%')
          .backgroundColor('#F8F9FA')
        } else {
          // 空状态（没有关注任何新闻）
          Column() {
            Text('📰')
              .fontSize(48)
              .margin({ bottom: 16 })
            
            Text('暂无关注的新闻')
              .fontSize(18)
              .fontWeight(FontWeight.Medium)
              .fontColor('#999999')
              .margin({ bottom: 8 })
            
            Text('去关注一些感兴趣的新闻吧')
              .fontSize(14)
              .fontColor('#CCCCCC')
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        }
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
