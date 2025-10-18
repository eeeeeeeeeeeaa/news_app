/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { promptAction } from '@kit.ArkUI';
import { router } from '@kit.ArkUI';
import { UserManager } from '../model/UserManager';
import { AuthService } from '../model/useregister';

@Builder
export function RegisterPageBuilder() {
  RegisterPage()
}

@Extend(TextInput)
function inputStyle() {
  .placeholderColor('#99182431')
  .height('45vp')
  .fontSize('18fp')
  .backgroundColor('#F1F3F5')
  .width('328vp')
  .margin({ top: 12 })
}

@Extend(Line)
function lineStyle() {
  .width('328vp')
  .height('1vp')
  .backgroundColor('#33182431')
}

@Extend(Text)
function blueTextStyle() {
  .fontColor('#007DFF')
  .fontSize('14fp')
  .fontWeight(FontWeight.Medium)
}

/**
 * Register page
 */

@Component
export struct RegisterPage {
  @State account: string = '';
  @State username: string = '';
  @State password: string = '';
  @State confirmPassword: string = '';
  @State isShowProgress: boolean = false;
  private timeOutId: number = -1;
  private userManager: UserManager = UserManager.getInstance();
  private authService: AuthService = AuthService.getInstance();

  onBack: () => void = () => {
    router.back();
  };

  async register(): Promise<void> {
    if (this.account === '' || this.username === '' || this.password === '' || this.confirmPassword === '') {
      promptAction.showToast({
        message: "请输入完整信息"
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      promptAction.showToast({
        message: "两次输入的密码不一样"
      });
      return;
    }

    this.isShowProgress = true;

    try {
      const success: boolean = await this.authService.register(this.account, this.username, this.password);
      if (success) {
        if (this.timeOutId === -1) {
          this.timeOutId = setTimeout(() => {
            this.isShowProgress = false;
            this.timeOutId = -1;
            this.onBack();
          }, 1500);
        }
      } else {
        this.isShowProgress = false;
      }
    } catch (err) {
      this.isShowProgress = false;
      console.error('Register failed:', err);
    }
  }

  aboutToDisappear() {
    clearTimeout(this.timeOutId);
    this.timeOutId = -1;
  }

  build() {
    Column() {
      Row() {
        Button() {
          Image($r('app.media.ic_back'))
            .width('24vp')
            .height('24vp')
        }
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.onBack();
        })

        Blank()
      }
      .width('100%')
      .padding({ top: '20vp', left: '12vp', right: '12vp' })

      Image($r('app.media.logo'))
        .width('78vp')
        .height('78vp')
        .margin({
          top: '150vp',
          bottom: '8vp'
        })

      Text("注册")
        .fontSize('24fp')
        .fontWeight(FontWeight.Medium)
        .fontColor('#182431')

      Text("创建账号，开始你的精彩之旅")
        .fontSize('16fp')
        .fontColor('#99182431')
        .margin({
          bottom: '30vp',
          top: '8vp'
        })

      TextInput({ placeholder: "请输入昵称" })
        .maxLength(20)
        .inputStyle()
        .onChange((value: string) => {
          this.username = value;
        })
      Line()
        .lineStyle()

      TextInput({ placeholder: "请输入手机号" })
        .maxLength(11)
        .type(InputType.Number)
        .inputStyle()
        .onChange((value: string) => {
          this.account = value;
        })
      Line()
        .lineStyle()

      TextInput({ placeholder: "请输入密码" })
        .maxLength(8)
        .type(InputType.Password)
        .inputStyle()
        .onChange((value: string) => {
          this.password = value;
        })
      Line()
        .lineStyle()

      TextInput({ placeholder: "确认密码" })
        .maxLength(8)
        .type(InputType.Password)
        .inputStyle()
        .onChange((value: string) => {
          this.confirmPassword = value;
        })
      Line()
        .lineStyle()

      Button("注册", { type: ButtonType.Capsule })
        .width('328vp')
        .height('40vp')
        .fontSize('16fp')
        .fontWeight(FontWeight.Medium)
        .backgroundColor('#007DFF')
        .margin({
          top: '48vp',
          bottom: '12vp'
        })
        .onClick(() => {
          this.register();
        })

      Text("返回登录")
        .blueTextStyle()
        .onClick(() => {
          this.onBack();
        })

      if (this.isShowProgress) {
        LoadingProgress()
          .color('#182431')
          .width('30vp')
          .height('30vp')
          .margin({ top: '20vp' })
      }

      Blank()
    }
    .height('100%')
    .width('100%')
    .padding({
      left: '12vp',
      right: '12vp',
      bottom: '24vp'
    })
    .backgroundColor('#F1F3F5')
  }
}