// ets/view/Follow.ets
@Component
export default struct FollowPage {
  build() {
    Column() {
      Text('我的关注')
        .fontSize('20fp')
        .fontWeight(FontWeight.Bold)
        .margin('40vp')
      // 后续可添加关注的媒体号、定制内容等
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}