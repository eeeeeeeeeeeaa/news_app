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
import { RegisterPage } from './RegisterPage';
import { AuthService } from '../model/UserService'


interface RegisterFormData {
  userPhone: string;
  userPassword: string;
  userName: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data?: string; // 根据实际响应结构调整
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
 * Login page
 */

@Component
export struct LoginPage {
  @State account: string = '';
  @State password: string = '';
  @State isShowProgress: boolean = false;
  @State showRegisterPage: boolean = false;
  @State testResult: string = ''; // 新增：测试结果显示
  private timeOutId: number = -1;

  private userService: AuthService = AuthService.getInstance();

  onLoginSuccess: () => void = () => {};

  @Builder
  imageButton(src: Resource) {
    Button({ type: ButtonType.Circle, stateEffect: true }) {
      Image(src)
    }
    .height('48vp')
    .width('48vp')
    .backgroundColor('#F1F3F5')
  }

  async login(): Promise<void> {
    if (this.account === '' || this.password === '') {
      promptAction.showToast({
        message: "请输入账号和密码"
      });
      return;
    }

    this.isShowProgress = true;

    try {
      const success:boolean = await this.userService.login(this.account, this.password);
      if (success) {
        if (this.timeOutId === -1) {
          this.timeOutId = setTimeout(() => {
            this.isShowProgress = false;
            this.timeOutId = -1;
            this.onLoginSuccess();
          }, 1500);
        }
      } else {
        this.isShowProgress = false;
      }
    } catch (err) {
      this.isShowProgress = false;
      console.error('Login failed:', err);
    }
  }

  aboutToDisappear() {
    clearTimeout(this.timeOutId);
    this.timeOutId = -1;
  }

  build() {
    if (this.showRegisterPage) {
      Column() {
        RegisterPage({
          onBack: () => {
            this.showRegisterPage = false;
          }
        })
      }
      .width('100%')
      .height('100%')
      .backgroundColor('#F1F3F5')
    } else {
      Column() {
        Image($r('app.media.logo'))
          .width('78vp')
          .height('78vp')
          .margin({
            top: '150vp',
            bottom: '8vp'
          })
        Text('登录')
          .fontSize('24fp')
          .fontWeight(FontWeight.Medium)
          .fontColor('#182431')
        Text('更多精彩内容等你发现')
          .fontSize('16fp')
          .fontColor('#99182431')
          .margin({
            bottom: '30vp',
            top: '8vp'
          })

        TextInput({ placeholder: "请输入手机号"})
          .maxLength(11)
          .type(InputType.Number)
          .inputStyle()
          .onChange((value: string) => {
            this.account = value;
          })
        Line()
          .lineStyle()

        TextInput({ placeholder:"请输入密码"})
          .maxLength(8)
          .type(InputType.Password)
          .inputStyle()
          .onChange((value: string) => {
            this.password = value;
          })
        Line()
          .lineStyle()


        Button($r('app.string.login'), { type: ButtonType.Capsule })
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
            this.login();
          })

        Text($r('app.string.register_account'))
          .fontColor('#007DFF')
          .fontSize('16fp')
          .fontWeight(FontWeight.Medium)
          .onClick(() => {
            this.showRegisterPage = true;
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
}