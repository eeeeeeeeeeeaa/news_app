import { VideoPage } from 'video';
import { NewsPage } from 'news';
import { LoginPage } from 'login';
import { MinePage } from 'mine';
import { UserManager } from 'login';
import { UserInfo } from 'login';
import { FollowPage } from 'follow';
import Follow from 'follow/src/main/ets/view/Follow';

@Entry
@Component
struct Index {
  @State currentUser: UserInfo | null = null;
  @State isLoggedIn: boolean = false;
  @State currentTabIndex: number = 0;

  @State followRefreshTrigger: number = 0; // 关注页面刷新触发器

  private tabsController: TabsController = new TabsController();
  private userManager: UserManager = UserManager.getInstance();

  async aboutToAppear() {

    try {
      await this.userManager.initPreferences();
      await this.checkLoginStatus();

    } catch (error) {

      this.setLoggedIn(false);
    }
  }

  // 登录状态的设置方法
  setLoggedIn(status: boolean) {
    this.isLoggedIn = status;
  }

  @Builder
  TabBuilder(
    title: Resource,
    index: number
  ) {
    Column() {
      Text(title)
        .margin({ top: 8 })
        .fontSize(14)
        .fontColor(this.currentTabIndex === index ? '#E60012' : '#666666')
    }
    .justifyContent(FlexAlign.Center)
    .height(68)
    .width('100%')
    .onClick(() => {
      this.currentTabIndex = index;
      this.tabsController.changeIndex(this.currentTabIndex);
      

      if (index === 2) {  //用于触发关注页面的刷新

        this.followRefreshTrigger++;
      }
    })
  }

  async checkLoginStatus() { //异步更新登录状态

    try {
      this.currentUser = await this.userManager.getCurrentUser();
      const loggedIn = this.currentUser !== null;

      this.setLoggedIn(loggedIn);
    } catch (error) {

      this.setLoggedIn(false);
    }
  }

  // 延迟函数 - 修复泛型问题
  delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  // 登录成功处理函数
  async handleLoginSuccess() {

    try {

      this.setLoggedIn(true);
      this.currentTabIndex = 0;

      // 立即获取用户信息
      try {
        this.currentUser = await this.userManager.getCurrentUser();

      } catch (error) {

      }

    } catch (error) {
      console.error('❌ 登录状态更新失败:', error);
      this.setLoggedIn(false);
    }
  }

  build() {
    // 根据登录状态构建页面
    Column() {
      if (this.isLoggedIn) {
        // 用户已登录，显示主页面
        Navigation() {
          Column() {
            Tabs({
              barPosition: BarPosition.End,
              controller: this.tabsController
            }) {
              // 1. 新闻Tab
              TabContent() {
                NewsPage()
              }
              .padding({ left: 12, right: 12 })
              .backgroundColor('#F5F5F5')
              .tabBar(this.TabBuilder($r('app.string.tab_news'), 0))

              // 2. 视频Tab
              TabContent() {
                VideoPage()
              }
              .padding({ left: 12, right: 12 })
              .backgroundColor('#F5F5F5')
              .tabBar(this.TabBuilder($r('app.string.tab_video'), 1))

              // 3. 关注Tab
              TabContent() {
                Follow({ refreshTrigger: this.followRefreshTrigger })
              }
              .padding({ left: 12, right: 12 })
              .backgroundColor('#F5F5F5')
              .tabBar(this.TabBuilder($r('app.string.tab_follow'), 2))

               // 4. 我的Tab
               TabContent() {
                 MinePage({
                   userInfo: this.currentUser,
                   onLogout: async () => {
                     await this.checkLoginStatus();
                   }
                 })
               }
              .padding({ left: 12, right: 12 })
              .backgroundColor('#F5F5F5')
              .tabBar(this.TabBuilder($r('app.string.tab_mine'), 3))
            }
            .margin({ bottom: 64 })
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
        // 用户未登录，显示登录页面
        Column() {
          LoginPage({
            onLoginSuccess: () => {
              this.handleLoginSuccess();
            }
          })

        }
        .width('100%')
        .height('100%')
      }
    }
    .width('100%')
    .height('100%')
  }
}
