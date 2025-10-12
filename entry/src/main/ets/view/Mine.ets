// ets/view/Mine.ets
@Component
export default struct Mine {
  build() {
    Column() {
      Text('个人中心')
        .fontSize('20fp')
        .fontWeight(FontWeight.Bold)
        .margin('40vp')
      // 后续可添加头像、收藏、设置等
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}