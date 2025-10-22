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
  @State refreshKey: number = 0;
  @State followRefreshTrigger: number = 0; // 关注页面刷新触发器

  private tabsController: TabsController = new TabsController();
  private userManager: UserManager = UserManager.getInstance();

  async aboutToAppear() {
    console.log('🚀 Index.aboutToAppear 开始');
    try {
      await this.userManager.initPreferences();
      await this.checkLoginStatus();
      console.log('🚀 Index.aboutToAppear 完成 - isLoggedIn:', this.isLoggedIn);
    } catch (error) {
      console.error('❌ Index.aboutToAppear 失败:', error);
      this.setLoggedIn(false);
    }
  }

  // 统一的登录状态设置方法
  setLoggedIn(status: boolean) {
    console.log('🔄 setLoggedIn:', status);
    this.isLoggedIn = status;
    this.refreshKey++;
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
      
      // 如果点击的是关注tab（index=2），触发刷新
      if (index === 2) {
        console.log('🔄 点击关注tab，触发刷新');
        this.followRefreshTrigger++;
      }
    })
  }

  async checkLoginStatus() {
    console.log('🔄 checkLoginStatus 开始');
    try {
      this.currentUser = await this.userManager.getCurrentUser();
      const loggedIn = this.currentUser !== null;
      console.log('🔄 checkLoginStatus 完成 - 应该登录:', loggedIn, 'currentUser:', this.currentUser);
      this.setLoggedIn(loggedIn);
    } catch (error) {
      console.error('❌ checkLoginStatus 失败:', error);
      this.setLoggedIn(false);
    }
  }

  // 延迟函数 - 修复泛型问题
  delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  // 登录成功处理函数
  async handleLoginSuccess() {
    console.log('🎉 handleLoginSuccess 被调用');
    try {
      // 登录成功后直接设置为已登录状态
      console.log('✅ 登录成功，直接设置为已登录状态');
      this.setLoggedIn(true);
      this.currentTabIndex = 0;

      // 立即获取用户信息
      try {
        this.currentUser = await this.userManager.getCurrentUser();
        console.log('✅ 登录成功后获取用户信息:', this.currentUser);
      } catch (error) {
        console.error('❌ 获取用户信息失败:', error);
      }

    } catch (error) {
      console.error('❌ 登录状态更新失败:', error);
      this.setLoggedIn(false);
    }
  }

  build() {
    // 使用 refreshKey 强制重新构建
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
                   loginStatus: this.isLoggedIn,
                   onLogout: async () => {
                     console.log('🔄 MinePage.onLogout 被调用');
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
              console.log('🎉 LoginPage.onLoginSuccess 回调被调用');
              this.handleLoginSuccess();
            }
          })

          // 调试按钮
          Button('手动检查登录状态')
            .margin({ top: 20 })
            .width('80%')
            .height(40)
            .backgroundColor('#E60012')
            .fontColor('#FFFFFF')
            .onClick(async () => {
              console.log('🧪 手动测试检查登录状态');
              await this.checkLoginStatus();
            })

          Button('强制设置为已登录')
            .margin({ top: 10 })
            .width('80%')
            .height(40)
            .backgroundColor('#007DFF')
            .fontColor('#FFFFFF')
            .onClick(() => {
              console.log('🧪 强制设置为已登录');
              this.setLoggedIn(true);
            })

          Button('强制设置为未登录')
            .margin({ top: 10 })
            .width('80%')
            .height(40)
            .backgroundColor('#FF6B35')
            .fontColor('#FFFFFF')
            .onClick(() => {
              console.log('🧪 强制设置为未登录');
              this.setLoggedIn(false);
            })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
  }
}
