// ets/main/MainPage.ets
import News from "../view/News";
import VideoPage from "../view/Video";
import Follow from "../view/Follow";
import Mine from "../view/Mine";


@Builder
export function MainPageBuilder() {
  MainPage()
}

@Component
export struct MainPage {
  @State currentIndex: number = 0; // 默认选中"新闻"页
  private tabsController: TabsController = new TabsController();


  @Builder
  TabBuilder(
    title: Resource,
    index: number
  ) {
    Column() {

      Text(title)
        .margin({ top: 4 })
        .fontSize(10)
        .fontColor(this.currentIndex === index ? '#E60012' : '#666666')
    }
    .justifyContent(FlexAlign.Center)
    .height(56)
    .width('100%')
    .onClick(() => {
      this.currentIndex = index;
      this.tabsController.changeIndex(this.currentIndex);
    })
  }

  build() {
    NavDestination() {
      Tabs({
        barPosition: BarPosition.End, // 底部导航
        controller: this.tabsController
      }) {
        // 1. 新闻Tab（索引0）
        TabContent() {
          News()
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
          Follow()
        }
        .padding({ left: 12, right: 12 })
        .backgroundColor('#F5F5F5')
        .tabBar(this.TabBuilder($r('app.string.tab_follow'), 2))

        // 4. 我的Tab（索引3）
        TabContent() {
          Mine()
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
        this.currentIndex = index;
      })
    }
    .height('100%')
    .hideTitleBar(true)
    .backgroundColor('#F5F5F5')
  }
}