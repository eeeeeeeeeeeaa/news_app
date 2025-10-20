import { CommonSearchBar } from 'uicomponents';
import { BaiduHotSearchParser } from 'utils';
import webview from '@ohos.web.webview';
import { NewsFollowService, type FollowedNewsItem } from './NewsFollowService';
import { promptAction } from '@kit.ArkUI';

// ets/view/Follow.ets
@Component
export default struct FollowPage {
  @State searchText: string = '';
  @State selectedUrl: string | null = null;
  private webController: webview.WebviewController = new webview.WebviewController();
  @State hotTitles: string[] = [];
  @State newsList: FollowedNewsItem[] = [];
  @State isLoading: boolean = false;
  private followService: NewsFollowService = NewsFollowService.getInstance();

  async aboutToAppear() {
    console.log('========== Follow 页面初始化 ==========');
    
    try {
      const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
      this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
    } catch (_) {
      this.hotTitles = [];
    }
    
    // 检查登录状态
    await this.checkLoginStatus();
    
    // 加载关注的新闻数据
    this.loadFollowNewsData();
  }
  
  // 检查登录状态（用于调试）
  private async checkLoginStatus() {
    console.log('🔍 [Follow] 检查登录状态...');
    
    try {
      // 从 login 模块导入 UserManager
      const loginModule = await import('login');
      const userManager = loginModule.UserManager.getInstance();
      
      console.log('🔍 [Follow] UserManager 实例:', userManager);
      
      // 初始化 preferences（如果需要）
      await userManager.initPreferences();
      console.log('🔍 [Follow] Preferences 初始化成功');
      
      // 获取 token
      const token = await userManager.getToken();
      console.log('🔍 [Follow] Token 存在:', token ? '是' : '否');
      
      if (token) {
        console.log('🔍 [Follow] Token 类型:', typeof token);
        console.log('🔍 [Follow] Token 长度:', token.length);
        console.log('🔍 [Follow] Token 前30字符:', token.substring(0, 30) + '...');
        
        // 检查 token 是否有效
        const isValid = await userManager.isTokenValid();
        console.log('🔍 [Follow] Token 是否有效:', isValid);
        
        // 获取 token 信息
        const tokenInfo = await userManager.getTokenInfo();
        console.log('🔍 [Follow] Token Info:', tokenInfo);
      } else {
        console.warn('⚠️ [Follow] 未找到 Token，用户可能未登录');
      }
      
      // 获取当前用户信息
      const currentUser = await userManager.getCurrentUser();
      console.log('🔍 [Follow] 当前用户:', currentUser);
      
    } catch (error) {
      console.error('❌ [Follow] 检查登录状态失败:', error);
      if (error instanceof Error) {
        console.error('❌ [Follow] 错误消息:', error.message);
        console.error('❌ [Follow] 错误堆栈:', error.stack);
      }
    }
    
    console.log('========================================');
  }

  private async loadFollowNewsData() {
    console.log('========== 开始加载关注的新闻列表 ==========');
    this.isLoading = true;
    
    try {
      // 从服务获取关注的新闻列表
      const followedNews = await this.followService.getFollowedNewsList();
      
      if (followedNews && followedNews.length > 0) {
        this.newsList = followedNews;
        console.log(`成功加载 ${followedNews.length} 条关注的新闻`);
      } else {
        this.newsList = [];
        console.log('暂无关注的新闻');
      }
    } catch (error) {
      console.error('加载关注新闻列表失败:', JSON.stringify(error));
      this.newsList = [];
      promptAction.showToast({ message: '加载失败，请稍后重试' });
    } finally {
      this.isLoading = false;
    }
  }
  
  // 刷新关注列表
  private async refreshNewsList() {
    await this.loadFollowNewsData();
  }

  private openBrowser(url: string): void {
    this.selectedUrl = url;
  }

  private closeBrowser(): void {
    this.selectedUrl = null;
  }

  @Builder
  buildNewsItem(item: FollowedNewsItem, index: number) {
    Column() {
      // 新闻标题
      Text(item.newsTitle)
        .fontSize('16fp')
        .fontWeight(FontWeight.Medium)
        .fontColor('#182431')
        .maxLines(3)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .lineHeight('21fp')
        .margin({ bottom: '6vp' })
        .textAlign(TextAlign.Start)
        .width('100%')

      // 发布者和时间信息
      Row() {
        // 显示新闻发布者
        if (item.newsAuthor) {
          Text(item.newsAuthor)
            .fontSize('12fp')
            .fontColor('#999999')
        }
        
        // 分隔符
        if (item.newsAuthor && item.newsTime) {
          Text('·')
            .fontSize('12fp')
            .fontColor('#999999')
            .margin({ left: 6, right: 6 })
        }
        
        // 显示新闻发布时间
        if (item.newsTime) {
          Text(this.formatDateTime(item.newsTime))
            .fontSize('12fp')
            .fontColor('#999999')
        }
        
        // 如果有关注时间但没有新闻发布时间，显示关注时间
        if (!item.newsTime && item.followTime) {
          if (item.newsAuthor) {
            Text('·')
              .fontSize('12fp')
              .fontColor('#999999')
              .margin({ left: 6, right: 6 })
          }
          Text(`关注于 ${this.formatDateTime(item.followTime)}`)
            .fontSize('12fp')
            .fontColor('#999999')
        }
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .padding({ top: '12vp', bottom: '12vp', left: '16vp', right: '16vp' })
    .backgroundColor(Color.White)
    .borderRadius('8vp')
    .margin({ bottom: '8vp', left: '12vp', right: '12vp' })
    .shadow({ radius: 4, color: '#0A000000', offsetX: 0, offsetY: 1 })
    .onClick(() => {
      // 这里可以添加点击新闻的处理逻辑
      console.log('点击新闻:', item.newsTitle);
    })
  }
  
  // 格式化日期时间
  private formatDateTime(dateTimeStr: string): string {
    try {
      // 如果是 ISO 8601 格式，转换为可读格式
      if (dateTimeStr.includes('T')) {
        const date = new Date(dateTimeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      return dateTimeStr;
    } catch (error) {
      return dateTimeStr;
    }
  }

  @Builder
  refreshBuilder() {
    Stack({ alignContent: Alignment.Bottom }) {
      LoadingProgress()
        .width('32vp')
        .height('32vp')
        .color('#FF6B00')
    }
    .clip(true)
    .height('64vp')
    .width('100%')
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

        Text('搜索结果')
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

        // 页面标题
        Text('我的关注')
          .fontSize('20fp')
          .fontWeight(FontWeight.Bold)
          .margin({ top: '20vp', bottom: '20vp' })
          .width('100%')
          .textAlign(TextAlign.Center)

        // 新闻列表
        if (this.isLoading) {
          // 加载状态
          Column() {
            LoadingProgress()
              .width('40vp')
              .height('40vp')
              .color('#FF6B00')
            Text('加载中...')
              .fontSize('14fp')
              .fontColor('#999999')
              .margin({ top: '16vp' })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else if (this.newsList.length > 0) {
          // 有数据时显示列表
          Refresh({ refreshing: $$this.isLoading, builder: this.refreshBuilder() }) {
            Scroll() {
              Column() {
                ForEach(this.newsList, (item: FollowedNewsItem, index: number) => {
                  this.buildNewsItem(item, index)
                })
              }
              .width('100%')
            }
            .scrollBar(BarState.Off)
            .width('100%')
          }
          .layoutWeight(1)
          .onRefreshing(() => {
            this.refreshNewsList();
          })
        } else {
          // 空状态
          Column() {
            Text('暂无关注的新闻')
              .fontSize('16fp')
              .fontColor('#999999')
              .margin({ top: '20vp' })
            Text('关注感兴趣的新闻，在这里查看')
              .fontSize('14fp')
              .fontColor('#CCCCCC')
              .margin({ top: '12vp' })
            
            Button('刷新')
              .fontSize('14fp')
              .backgroundColor('#FF6B00')
              .margin({ top: '24vp' })
              .onClick(() => {
                this.refreshNewsList();
              })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
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
