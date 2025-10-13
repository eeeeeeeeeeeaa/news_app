import {VideoPage} from 'video';
import {NewsPage} from 'news';
import {LoginPage} from 'login';
import {RegisterPage} from 'login';
import {MinePage} from 'mine';
import {UserManager} from 'login';
import {UserInfo} from 'login'
import Mine from 'mine/src/main/ets/view/Mine';


@Entry
@Component
struct Index {
  @State currentUser: UserInfo | null = null;
  @State isLoggedIn: boolean = false;
  @State currentTabIndex: number = 0; // 默认选中"新闻"页
  
  @Builder
  FollowPage() {
    Column() {
      Text('我的关注')
        .fontSize('20fp')
        .fontWeight(FontWeight.Bold)
        .margin('40vp')
      Text('关注功能开发中...')
        .fontSize('16fp')
        .fontColor('#999999')
        .margin('20vp')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
    .justifyContent(FlexAlign.Center)
  }
  private tabsController: TabsController = new TabsController();
  private userManager: UserManager = UserManager.getInstance();

  async aboutToAppear() {
    try {
      await this.userManager.initPreferences();
      this.currentUser = await this.userManager.getCurrentUser();
      this.isLoggedIn = this.currentUser !== null;
      console.log('Login status initialized:', this.isLoggedIn);
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
      // 已登录，显示Tab页面

      Navigation() {
        Column() {
          Tabs({
            barPosition: BarPosition.End, // 底部导航
            controller: this.tabsController
          }) {
            // 1. 新闻Tab（索引0）
            TabContent() {
              NewsPage()
            }
            .padding({ left: 12, right: 12 })
            .backgroundColor('#F5F5F5')
            .tabBar(this.TabBuilder($r('app.string.tab_news'), 0))

            // 2. 视频Tab（索引1）
            TabContent() {
              VideoPage()
            }
            .padding({ left: 12, right: 12 })
            .backgroundColor('#F5F5F5')
            .tabBar(this.TabBuilder($r('app.string.tab_video'), 1))

            // 3. 关注Tab（索引2）
            TabContent() {
              this.FollowPage()
            }
            .padding({ left: 12, right: 12 })
            .backgroundColor('#F5F5F5')
            .tabBar(this.TabBuilder($r('app.string.tab_follow'), 2))

            // 4. 我的Tab（索引3）
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
          .margin({ bottom: 64 }) // 适配底部系统栏
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
      // 未登录，显示登录页面
      LoginPage({
        onLoginSuccess: () => {
          this.checkLoginStatus();
        }
      })
    }
  }
}
