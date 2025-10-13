// ets/view/Video.ets
@Component
export default struct VideoPage {
  build() {
    Column() {
      Text('视频资讯')
        .fontSize('20fp')
        .fontWeight(FontWeight.Bold)
        .margin('40vp')
      // 后续可添加视频分类、推荐视频列表等
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}