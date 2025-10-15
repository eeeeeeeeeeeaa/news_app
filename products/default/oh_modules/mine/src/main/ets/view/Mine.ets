// ets/view/Mine.ets

import { UserManager, UserInfo } from 'login';
import { promptAction } from '@kit.ArkUI';

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

  build() {
    Column() {
      if (this.isLoggedIn && this.currentUser) {
        // 已登录状态
        Column() {
          // 用户头像区域
          Image($r('app.media.person_shield'))
            .width('80vp')
            .height('80vp')
            .margin({ top: '40vp', bottom: '20vp' })
          
          // 用户名
          Text(`${$r('app.string.welcome')}，${this.currentUser.username}`)
            .fontSize('18fp')
            .fontWeight(FontWeight.Medium)
            .fontColor('#182431')
            .margin({ bottom: '8vp' })
          
          // 账号
          Text(`账号：${this.currentUser.account}`)
            .fontSize('14fp')
            .fontColor('#99182431')
            .margin({ bottom: '40vp' })

          // 功能按钮区域
          Column({ space: 16 }) {
            // 个人信息按钮
            Row() {
              Image($r('app.media.account'))
                .width('24vp')
                .height('24vp')
                .margin({ right: '12vp' })
              Text($r('app.string.user_info'))
                .fontSize('16fp')
                .fontColor('#182431')
              Blank()
              Image($r('app.media.right_grey'))
                .width('16vp')
                .height('16vp')
            }
            .width('100%')
            .height('48vp')
            .padding({ left: '16vp', right: '16vp' })
            .backgroundColor('#FFFFFF')
            .borderRadius('8vp')
            .onClick(() => {
              // 可以添加编辑个人信息功能
            })

            // 退出登录按钮
            Row() {
              Image($r('app.media.reset'))
                .width('24vp')
                .height('24vp')
                .margin({ right: '12vp' })
              Text($r('app.string.logout'))
                .fontSize('16fp')
                .fontColor('#E60012')
              Blank()
            }
            .width('100%')
            .height('48vp')
            .padding({ left: '16vp', right: '16vp' })
            .backgroundColor('#FFFFFF')
            .borderRadius('8vp')
            .onClick(() => {
              this.logout();
            })
          }
          .width('100%')
          .padding({ left: '16vp', right: '16vp' })
        }
        .width('100%')
        .alignItems(HorizontalAlign.Center)
      } else {
        // 未登录状态
        Column() {
          Image($r('app.media.person_shield'))
            .width('80vp')
            .height('80vp')
            .margin({ top: '100vp', bottom: '20vp' })
          
          Text('请先登录')
            .fontSize('18fp')
            .fontWeight(FontWeight.Medium)
            .fontColor('#99182431')
            .margin({ bottom: '40vp' })
        }
        .width('100%')
        .alignItems(HorizontalAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}