import { CommonSearchBar } from 'uicomponents';
import { BaiduHotSearchParser } from 'utils';
import webview from '@ohos.web.webview';

// ets/view/Follow.ets
@Component
export default struct FollowPage {
  @State searchText: string = '';
  @State selectedUrl: string | null = null;
  private webController: webview.WebviewController = new webview.WebviewController();
  @State hotTitles: string[] = [];

  async aboutToAppear() {
    try {
      const realtime = await BaiduHotSearchParser.getHotSearchData('realtime');
      this.hotTitles = realtime.slice(0, 10).map((it) => it.card_title);
    } catch (_) {
      this.hotTitles = [];
    }
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

        // 页面内容
        Text('我的关注')
          .fontSize('20fp')
          .fontWeight(FontWeight.Bold)
          .margin('40vp')
        // 后续可添加关注的媒体号、定制内容等
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
