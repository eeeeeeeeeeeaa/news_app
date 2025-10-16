// ets/view/Mine.ets

import { UserManager, UserInfo } from 'login';
import { promptAction } from '@kit.ArkUI';


// 定义接口类型
interface QuickAccessItem {
  icon: string;
  text: string;
  badge: string;
}

interface CommonFunction {
  icon: string;
  text: string;
}

interface MoreFunction {
  icon: string;
  text: string;
  badge: string;
  color: string;
}

@Component
export default struct Mine {
  @State currentUser: UserInfo | null = null;
  @State isLoggedIn: boolean = false;
  private userManager: UserManager = UserManager.getInstance();
  onLogout: () => void = () => {};

  async aboutToAppear() {
    await this.loadUserInfo();
  }

  async loadUserInfo() {
    try {
      await this.userManager.initPreferences();
      const user = await this.userManager.getCurrentUser();
      this.currentUser = user;
      this.isLoggedIn = user !== null;
    } catch (err) {
      console.error('Failed to load user info:', err);
    }
  }

  async logout() {
    try {
      await this.userManager.logout();
      this.currentUser = null;
      this.isLoggedIn = false;
      promptAction.showToast({
        message: $r('app.string.logout')
      });
      
      // 退出登录后调用回调函数
      setTimeout(() => {
        this.onLogout();
      }, 1000); // 延迟1秒让用户看到退出成功的提示
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  }

  // 快速访问功能数据
  private quickAccessItems: QuickAccessItem[] = [
    { icon: '📧', text: '消息', badge: '1' },
    { icon: '⭐', text: '收藏', badge: '' },
    { icon: '🕐', text: '历史', badge: '' },
    { icon: '❤️', text: '已赞', badge: '' },
    { icon: '📋', text: '稍后听', badge: '' }
  ];

  // 常用功能数据
  private commonFunctions: CommonFunction[] = [
    { icon: 'Aa', text: '字体字号设置' },
    { icon: '🌙', text: '夜间模式' },
    { icon: '📰', text: '要闻主编精选' },
    { icon: '❓', text: '帮助反馈' },
    { icon: '📅', text: '我的阅读周报' },
    { icon: '⬇️', text: '我的下载' },
    { icon: '🛡️', text: '安全中心' },
    { icon: '⚙️', text: '更多设置' }
  ];

  // 更多功能数据
  private moreFunctions: MoreFunction[] = [
    { icon: '▶️', text: '腾讯视频VIP', badge: '', color: '#00C853' },
    { icon: '⚾', text: '腾讯体育', badge: '', color: '#FF9800' },
    { icon: '💰', text: '我的资产', badge: '', color: '#E91E63' },
    { icon: '🎮', text: 'BonBon 游戏', badge: '', color: '#9C27B0' },
    { icon: '📖', text: 'BonBon 读书', badge: '', color: '#03A9F4' },
    { icon: '🐷', text: '财富精选', badge: '', color: '#FF9800' },
    { icon: '👩', text: '新闻妹', badge: 'AI助手', color: '#2196F3' },
    { icon: '🎁', text: '签到领福利', badge: '', color: '#FFD700' }
  ];

  build() {
    Column() {
      if (this.isLoggedIn && this.currentUser) {
        // 已登录状态
        Scroll() {
          Column() {
            // 用户信息头部区域
            Row() {
              Blank()

              // 右侧功能按钮
              Row() {
                Text('📅')
                  .fontSize('16fp')
                  .margin({ right: '8vp' })
                Text('日签')
                  .fontSize('12fp')
                  .fontColor('#666666')
              }
              .margin({ right: '16vp' })

              Text('📱')
                .fontSize('16fp')
            }
            .width('100%')
            .height('50vp')
            .padding({ left: '16vp', right: '16vp' })
            .justifyContent(FlexAlign.SpaceBetween)
            .margin({ top: '20vp', bottom: '20vp' })

            // 用户头像和基本信息
            Row() {
              // 头像
              Text('👤')
                .fontSize('40fp')
                .width('60vp')
                .height('60vp')
                .textAlign(TextAlign.Center)
                .backgroundColor('#E0E0E0')
                .borderRadius('30vp')
                .margin({ right: '16vp' })

              Column() {
                // 用户名和徽章
                Row() {
                  Text(this.currentUser.username || 'euphoria')
                    .fontSize('20fp')
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#000000')
                    .margin({ right: '8vp' })

                  Row() {
                    Text('⭐')
                      .fontSize('12fp')
                    Text('0枚')
                      .fontSize('12fp')
                      .fontColor('#666666')
                  }
                  .padding({ left: '6vp', right: '6vp', top: '2vp', bottom: '2vp' })
                  .backgroundColor('#F5F5F5')
                  .borderRadius('10vp')
                }
                .margin({ bottom: '8vp' })

                // 统计数据
                Row() {
                  Text('0发表')
                    .fontSize('14fp')
                    .fontColor('#666666')
                    .margin({ right: '16vp' })
                  
                  Text('0关注')
                    .fontSize('14fp')
                    .fontColor('#666666')
                    .margin({ right: '16vp' })
                  
                  Text('0粉丝')
                    .fontSize('14fp')
                    .fontColor('#666666')
                }
              }

              Blank()

              Text('▶')
                .fontSize('14fp')
                .fontColor('#999999')
            }
            .width('100%')
            .padding({ left: '16vp', right: '16vp' })
            .margin({ bottom: '20vp' })

            // 会员和专栏卡片
            Row() {
              // 我的会员卡片
              Row() {
                Text('🔽')
                  .fontSize('20fp')
                  .fontColor('#FFD700')
                  .margin({ right: '8vp' })
                
                Column() {
                  Text('我的会员')
                    .fontSize('14fp')
                    .fontColor('#000000')
                    .fontWeight(FontWeight.Medium)
                    .margin({ bottom: '4vp' })
                  
                  Text('首月特惠低至2折')
                    .fontSize('12fp')
                    .fontColor('#666666')
                }
              }
              .width('48%')
              .height('60vp')
              .padding({ left: '12vp', right: '12vp' })
              .backgroundColor('#FFFFFF')
              .borderRadius('8vp')
              .justifyContent(FlexAlign.Start)

              // 我的专栏卡片
              Row() {
                Text('⬜')
                  .fontSize('20fp')
                  .fontColor('#FFD700')
                  .margin({ right: '8vp' })
                
                Column() {
                  Text('我的专栏')
                    .fontSize('14fp')
                    .fontColor('#000000')
                    .fontWeight(FontWeight.Medium)
                    .margin({ bottom: '4vp' })
                  
                  Text('领域专家,专业解读')
                    .fontSize('12fp')
                    .fontColor('#666666')
                }
              }
              .width('48%')
              .height('60vp')
              .padding({ left: '12vp', right: '12vp' })
              .backgroundColor('#FFFFFF')
              .borderRadius('8vp')
              .justifyContent(FlexAlign.Start)
            }
            .width('100%')
            .padding({ left: '16vp', right: '16vp' })
            .justifyContent(FlexAlign.SpaceBetween)
            .margin({ bottom: '20vp' })

            // 快速访问图标行
            Grid() {
              ForEach(this.quickAccessItems, (item: QuickAccessItem, index: number) => {
                GridItem() {
                  Column() {
                    Stack() {
                      Text(item.icon)
                        .fontSize('24fp')
                        .alignSelf(ItemAlign.Center)
                      
                      if (item.badge) {
                        Text(item.badge)
                          .fontSize('10fp')
                          .fontColor('#FFFFFF')
                          .backgroundColor('#FF0000')
                          .borderRadius('8vp')
                          .padding({ left: '4vp', right: '4vp', top: '2vp', bottom: '2vp' })
                          .position({ x: '20vp', y: '-5vp' })
                      }
                    }
                    .width('40vp')
                    .height('40vp')
                    .alignContent(Alignment.Center)
                    .margin({ bottom: '8vp' })

                    Text(item.text)
                      .fontSize('12fp')
                      .fontColor('#666666')
                  }
                  .width('100%')
                  .height('80vp')
                  .justifyContent(FlexAlign.Center)
                  .alignItems(HorizontalAlign.Center)
                }
              })
            }
            .columnsTemplate('1fr 1fr 1fr 1fr 1fr')
            .rowsTemplate('1fr')
            .width('100%')
            .height('80vp')
            .padding({ left: '16vp', right: '16vp' })
            .margin({ bottom: '20vp' })

            // 常用功能区域
            Column() {
              Text('常用功能')
                .fontSize('16fp')
                .fontWeight(FontWeight.Medium)
                .fontColor('#000000')
                .alignSelf(ItemAlign.Start)
                .margin({ bottom: '12vp' })

              Grid() {
                ForEach(this.commonFunctions, (item: CommonFunction, index: number) => {
                  GridItem() {
                    Column() {
                      Text(item.icon)
                        .fontSize('24fp')
                        .margin({ bottom: '8vp' })

                      Text(item.text)
                        .fontSize('12fp')
                        .fontColor('#666666')
                        .textAlign(TextAlign.Center)
                    }
                    .width('100%')
                    .height('80vp')
                    .justifyContent(FlexAlign.Center)
                    .alignItems(HorizontalAlign.Center)
                  }
                })
              }
              .columnsTemplate('1fr 1fr 1fr 1fr')
              .rowsTemplate('1fr 1fr')
              .width('100%')
              .height('160vp')
            }
            .width('100%')
            .padding({ left: '16vp', right: '16vp' })
            .margin({ bottom: '20vp' })

            // 更多功能区域
            Column() {
              Text('更多功能')
                .fontSize('16fp')
                .fontWeight(FontWeight.Medium)
                .fontColor('#000000')
                .alignSelf(ItemAlign.Start)
                .margin({ bottom: '12vp' })

              Grid() {
                ForEach(this.moreFunctions, (item: MoreFunction, index: number) => {
                  GridItem() {
                    Column() {
                      Stack() {
                        Text(item.icon)
                          .fontSize('20fp')
                          .fontColor(item.color)
                          .alignSelf(ItemAlign.Center)

                        if (item.badge) {
                          Text(item.badge)
                            .fontSize('8fp')
                            .fontColor('#FFFFFF')
                            .backgroundColor('#FF0000')
                            .borderRadius('6vp')
                            .padding({ left: '2vp', right: '2vp', top: '1vp', bottom: '1vp' })
                            .position({ x: '15vp', y: '-3vp' })
                        }
                      }
                      .width('30vp')
                      .height('30vp')
                      .alignContent(Alignment.Center)
                      .margin({ bottom: '6vp' })

                      Text(item.text)
                        .fontSize('10fp')
                        .fontColor('#666666')
                        .textAlign(TextAlign.Center)
                    }
                    .width('100%')
                    .height('70vp')
                    .justifyContent(FlexAlign.Center)
                    .alignItems(HorizontalAlign.Center)
                  }
                })
              }
              .columnsTemplate('1fr 1fr 1fr 1fr')
              .rowsTemplate('1fr 1fr')
              .width('100%')
              .height('140vp')
            }
            .width('100%')
            .padding({ left: '16vp', right: '16vp' })
            .margin({ bottom: '20vp' })
          }
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#F5F5F5')
        .scrollBar(BarState.Off)
      } else {
        // 未登录状态
        Column() {
          Text('👤')
            .fontSize('60fp')
            .width('80vp')
            .height('80vp')
            .textAlign(TextAlign.Center)
            .backgroundColor('#E0E0E0')
            .borderRadius('40vp')
            .margin({ top: '100vp', bottom: '20vp' })
          
          Text('请先登录')
            .fontSize('18fp')
            .fontWeight(FontWeight.Medium)
            .fontColor('#99182431')
            .margin({ bottom: '40vp' })
        }
        .width('100%')
        .height('100%')
        .alignItems(HorizontalAlign.Center)
        .backgroundColor('#F5F5F5')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}