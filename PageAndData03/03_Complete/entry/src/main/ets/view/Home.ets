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

import { common } from '@kit.AbilityKit';
import mainViewModel from '../viewmodel/MainViewModel';
import ItemData from '../viewmodel/ItemData';
import ListInfo from '../viewmodel/ResponseData/ListInfo';
import { HttpUtils } from '../common/network/HttpUtils';
import { RCPUtils } from '../common/network/RCPUtils';

/**
 * Home tab content
 */
@Component
export default struct Home {
  @State httpGridItems: Array<ListInfo> = [];
  @State pictureUri: string = '';
  private swiperController: SwiperController = new SwiperController();
  private context = this.getUIContext().getHostContext() as common.UIAbilityContext;
  private applicationContext = this.context.getApplicationContext();
  private cacheDir = this.applicationContext.filesDir;

  async aboutToAppear(): Promise<void> {
    // let httpUtil: HttpUtils = new HttpUtils();
    // await httpUtil.postHttpRequest().then((value : Array<ListInfo>)=>{
    //   this.httpGridItems = value;
    // });
    // await httpUtil.getHttpRequest(this.cacheDir).then((value: string) => {
    //   this.pictureUri = value;
    // });
    // httpUtil.destroyHttpRequest();

    let rcpUtil: RCPUtils = new RCPUtils();
    await rcpUtil.postRCPRequest().then((value: Array<ListInfo>) => {
      this.httpGridItems = value;
    });
    await rcpUtil.getRCPRequest(this.cacheDir).then((value: string) => {
      this.pictureUri = value;
    });
    rcpUtil.destroySession();
  }

  build() {
    Column() {
      Text($r('app.string.mainPage_tabTitles_home'))
        .width('100%')
        .margin({
          top: '48vp',
          bottom: '12vp'
        })
        .fontWeight(700)
        .fontSize('26fp')

      Scroll() {
        Column() {
          Swiper(this.swiperController) {
            ForEach(mainViewModel.getSwiperImages(), (img: Resource) => {
              Image(img)
                .width('100%')
                .borderRadius('16vp')
            }, (img: Resource) => JSON.stringify(img.id))
          }
          .autoPlay(true)

          Grid() {
            ForEach(mainViewModel.getFirstGridData(), (item: ItemData) => {
              GridItem() {
                Column() {
                  Image(item.img)
                    .width('40vp')
                    .height('40vp')
                  Text(item.title)
                    .fontSize('12fp')
                    .margin({ top: '4vp' })
                }
              }
            }, (item: ItemData) => JSON.stringify(item))
          }
          .backgroundImage($r('app.media.backgroundImage'))
          .backgroundImageSize({
            width: '100%',
            height: '156vp'
          })
          .columnsTemplate('1fr 1fr 1fr 1fr')
          .rowsTemplate('1fr 1fr')
          .columnsGap('8vp')
          .rowsGap('12vp')
          .margin({ top: '12vp' })
          .padding({
            top: '12vp',
            bottom: '12vp'
          })
          .height('156vp')
          .backgroundColor(Color.White)
          .borderRadius('16vp')

          Text($r('app.string.home_list'))
            .fontSize('18fp')
            .fontWeight(700)
            .width('100%')
            .margin({
              top: '18vp',
              bottom: '8vp'
            })

          List() {
            ForEach(this.httpGridItems, (secondItem: ListInfo) => {
              ListItem() {
                Row() {
                  Image(secondItem.indexNavPic)
                    .width('130vp')
                    .height('80vp')
                    .objectFit(ImageFit.TOP_START)
                    .borderRadius('8vp')
                    .margin({ right: '12vp' })

                  Column() {
                    Text(secondItem.activityName)
                      .width('190vp')
                      .textOverflow({ overflow: TextOverflow.Ellipsis })
                      .maxLines(1)
                      .fontSize('16fp')
                      .fontWeight(FontWeight.Medium)
                    Text(secondItem.theme)
                      .width('190vp')
                      .textOverflow({ overflow: TextOverflow.Ellipsis })
                      .maxLines(2)
                      .margin({ top: '4vp' })
                      .fontSize('12fp')
                      .fontColor('#99182431')
                    Row() {
                      Image(this.pictureUri)
                        .width('20vp')
                        .opacity(0.5)
                    }
                    .width('170vp')
                    .margin({ top: '10.5vp' })
                    .justifyContent(FlexAlign.End)
                    .alignItems(VerticalAlign.Bottom)
                  }
                  .alignItems(HorizontalAlign.Start)
                }
                .width('100%')
                .padding({
                  left: '12vp',
                  right: '12vp',
                  top: '12vp',
                  bottom: '12vp'
                })
                .justifyContent(FlexAlign.SpaceBetween)
              }
              .margin({ bottom: '8vp' })
              .borderRadius('16vp')
              .backgroundColor('#ffffff')
              .borderRadius($r('app.float.home_backgroundImage_borderRadius'))
              .align(Alignment.TopStart)
              .width('100%')
            }, (secondItem: ListInfo) => JSON.stringify(secondItem))
          }
          .scrollBar(BarState.Off)
          .width('100%')
        }
      }
      .height('660vp')
      .align(Alignment.TopStart)
      .scrollBar(BarState.Off)
    }
    .justifyContent(FlexAlign.Start)
    .alignItems(HorizontalAlign.Start)
    .width('100%')
    .height('100%')
  }
}