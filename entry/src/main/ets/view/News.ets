// ets/view/News.ets
@Component
export default struct News {
  build() {
    Column() {
      Text('头条新闻')
        .fontSize('20fp')
        .fontWeight(FontWeight.Bold)
        .margin('40vp')
      // 后续可添加新闻轮播、热点列表等
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}