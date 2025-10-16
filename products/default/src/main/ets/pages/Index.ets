import { CommonSearchBar } from 'uicomponents';
import {VideoPage} from 'video';
import {NewsPage} from 'news';
import {LoginPage} from 'login';
import {RegisterPage} from 'login';
import {MinePage} from 'mine';
import {UserManager} from 'login';
import {UserInfo} from 'login'
import Mine from 'mine/src/main/ets/view/Mine';
import webview from '@ohos.web.webview';
import { BaiduHotSearchParser, BaiduHotSearchItem } from 'utils';


@Entry
@Component
struct Index {
  @State currentUser: UserInfo | null = null;
  @State isLoggedIn: boolean = false;
  @State currentTabIndex: number = 0; // 榛樿閫変腑"鏂伴椈"椤?
  
  @State followSearchText: string = '';
  @State followHotTitles: string[] = [];
  @State followSelectedUrl: string | null = null;
  private followWebController: webview.WebviewController = new webview.WebviewController();

  private openFollowBrowser(url: string): void {
    this.followSelectedUrl = url;
  }

  private closeFollowBrowser(): void {
    this.followSelectedUrl = null;
  }

  @Builder
  buildFollowBrowserLayer(url: string) {
    Column() {
      Row() {
        Text('关闭')
          .fontSize(16)
          .fontColor('#E60012')
          .padding({ left: 16, right: 16, top: 16, bottom: 16 })
          .onClick(() => {
            this.closeFollowBrowser();
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

      Web({ src: url, controller: this.followWebController })
        .layoutWeight(1)
        .width('100%')
    }
    .padding({ top: '48vp' })
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }

  @Builder
  FollowPage() {
    Stack({ alignContent: Alignment.TopStart }) {
      Column() {
        // 顶部搜索框（公共组件）
        CommonSearchBar({
          value: this.followSearchText,
          placeholder: '搜索新闻',
          hotTitles: this.followHotTitles,
          onSearch: (url: string) => {
            this.openFollowBrowser(url);
          }
        })
        .padding({ left: '12vp', right: '12vp', top: '8vp', bottom: '8vp' })

        // 页面内容
        Text('我的关注')
          .fontSize('20fp')
          .fontWeight(FontWeight.Bold)
          .margin({ top: '40vp', bottom: '20vp' })
        Text('关注功能开发中...')
          .fontSize('16fp')
          .fontColor('#999999')
          .margin('20vp')
      }
      .padding({ top: '48vp' })
      .width('100%')
      .height('100%')
      .backgroundColor('#F8F9FA')

      if (this.followSelectedUrl !== null) {
        this.buildFollowBrowserLayer(this.followSelectedUrl as string);
      }
    }
    .width('100%')
    .height('100%')
  }
  private tabsController: TabsController = new TabsController();
  private userManager: UserManager = UserManager.getInstance();

  async aboutToAppear() {
    try {
      await this.userManager.initPreferences();
      this.currentUser = await this.userManager.getCurrentUser();
      this.isLoggedIn = this.currentUser !== null;
      console.log('Login status initialized:', this.isLoggedIn);
      // 预取热搜标题供关注页使用
      const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
      this.followHotTitles = realtime.slice(0, 10).map((it: BaiduHotSearchItem) => it.card_title);
    } catch (error) {
      console.error('Failed to initialize login status:', error);
      this.isLoggedIn = false;
    }
  }

  @Builder
  TabBuilder(
    title: Resource,
    index: number
  ) {
    Column() {
      Text(title)
        .margin({ top: 4 })
        .fontSize(10)
        .fontColor(this.currentTabIndex === index ? '#E60012' : '#666666')
    }
    .justifyContent(FlexAlign.Center)
    .height(56)
    .width('100%')
    .onClick(() => {
      this.currentTabIndex = index;
      this.tabsController.changeIndex(this.currentTabIndex);
    })
  }

  async checkLoginStatus() {
    this.currentUser = await this.userManager.getCurrentUser();
    this.isLoggedIn = this.currentUser !== null;
  }

  build() {
    if (this.isLoggedIn) {
      // 宸茬櫥褰曪紝鏄剧ずTab椤甸潰

      Navigation() {
        Column() {
          Tabs({
            barPosition: BarPosition.End, // 搴曢儴瀵艰埅
            controller: this.tabsController
          }) {
            // 1. 鏂伴椈Tab锛堢储寮?锛?
            TabContent() {
              NewsPage()
            }
            .padding({ left: 12, right: 12 })
            .backgroundColor('#F5F5F5')
            .tabBar(this.TabBuilder($r('app.string.tab_news'), 0))

            // 2. 瑙嗛Tab锛堢储寮?锛?
            TabContent() {
              VideoPage()
            }
            .padding({ left: 12, right: 12 })
            .backgroundColor('#F5F5F5')
            .tabBar(this.TabBuilder($r('app.string.tab_video'), 1))

            // 3. 鍏虫敞Tab锛堢储寮?锛?
            TabContent() {
              this.FollowPage()
            }
            .padding({ left: 12, right: 12 })
            .backgroundColor('#F5F5F5')
            .tabBar(this.TabBuilder($r('app.string.tab_follow'), 2))

            // 4. 鎴戠殑Tab锛堢储寮?锛?
            TabContent() {
              MinePage({
                onLogout: () => {
                  this.checkLoginStatus();
                }
              })
            }
            .padding({ left: 12, right: 12 })
            .backgroundColor('#F5F5F5')
            .tabBar(this.TabBuilder($r('app.string.tab_mine'), 3))
          }
          .margin({ bottom: 64 }) // 閫傞厤搴曢儴绯荤粺鏍?
          .width('100%')
          .height('100%')
          .barHeight(80)
          .barMode(BarMode.Fixed)
          .onChange((index: number) => {
            this.currentTabIndex = index;
          })
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#F5F5F5')
      }
      .width('100%')
      .height('100%')
    } else {
      // 鏈櫥褰曪紝鏄剧ず鐧诲綍椤甸潰
      LoginPage({
        onLoginSuccess: () => {
          this.checkLoginStatus();
        }
      })
    }
  }
}








