@Component
export struct CommonSearchBar {
  // 父组件传入的初始值（不强制双向绑定）
  @Prop value: string = '';
  placeholder: string = '搜索新闻';
  @State text: string = '';
  @Prop hotTitles: string[] = [];
  @State currentPlaceholderIndex: number = 0;
  @State currentPlaceholder: string = '搜索新闻';
  private placeholderTimer: number = -1;

  aboutToAppear() {
    this.text = this.value;
    // 使用父组件传入的热搜标题启动轮播
    if (this.hotTitles && this.hotTitles.length > 0) {
      this.currentPlaceholder = this.hotTitles[0];
    }
    this.startPlaceholderRotation();
  }

  aboutToDisappear() {
    if (this.placeholderTimer !== -1) {
      clearInterval(this.placeholderTimer);
      this.placeholderTimer = -1;
    }
  }

  private startPlaceholderRotation() {
    this.placeholderTimer = setInterval(() => {
      if (this.hotTitles && this.hotTitles.length > 1) {
        this.currentPlaceholderIndex = (this.currentPlaceholderIndex + 1) % this.hotTitles.length;
        this.currentPlaceholder = this.hotTitles[this.currentPlaceholderIndex];
      }
    }, 6000); // 每6秒切换一次
  }

  private onSearchSubmit() {
    const inputText: string = this.text ? this.text.trim() : '';
    const keyword: string = inputText.length > 0 ? inputText : (this.currentPlaceholder || '');
    if (keyword.length === 0) {
      return;
    }
    const searchUrl: string = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`;
    this.onSearch?.(searchUrl);
  }

  onSearch?: (url: string) => void;

  build() {
    Row() {
      Row() {
        // 固定的搜索前缀文字
        Text('🔍')
          .fontSize('16fp')
          .margin({ left: '12vp', right: '8vp' })
          .fontColor('#999999')
          .onClick(() => {
            this.onSearchSubmit();
          })

        TextInput({ placeholder: this.currentPlaceholder, text: this.text })
          .fontSize('14fp')
          .fontColor('#182431')
          .backgroundColor(Color.Transparent)
          .placeholderColor('#999999')
          .layoutWeight(1)
          .onChange((v: string) => {
            this.text = v;
          })
          .onSubmit(() => {
            this.onSearchSubmit();
          })

        if (this.text && this.text.length > 0) {
          // 固定的清除按钮
          Text('清除')
            .fontSize('14fp')
            .fontColor('#999999')
            .margin({ right: '12vp' })
            .onClick(() => {
              this.text = '';
            })
        }
      }
      .height('36vp')
      .backgroundColor('#FFFFFF')
      .borderRadius('18vp')
      .border({ width: '1vp', color: '#E5E5E5' })
      .layoutWeight(1)
    }
    .width('100%')
    .padding({ left: '12vp', right: '12vp', top: '8vp', bottom: '8vp' })
    .alignItems(VerticalAlign.Center)
  }
}