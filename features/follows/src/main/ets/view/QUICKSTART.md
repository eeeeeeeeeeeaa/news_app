# NewsFollowService 快速开始指南

## 1. 在其他模块中添加依赖

假设你在 `features/news` 模块中使用，编辑 `features/news/oh-package.json5`：

```json5
{
  "name": "news",
  "dependencies": {
    "follows": "file:../follows",  // 添加这一行
    // ...其他依赖
  }
}
```

## 2. 导入并使用

在你的 TypeScript 文件中：

```typescript
import { NewsFollowService, type FollowNewsRequest, type FollowedNewsItem } from 'follows';

@Component
export struct YourComponent {
  private followService: NewsFollowService = NewsFollowService.getInstance();

  build() {
    Column() {
      // 示例1：关注新闻按钮（最简单）
      Button('关注新闻')
        .onClick(async () => {
          const success: boolean = await this.followService.followNewsSimple(
            '新闻标题',
            '新闻正文内容...'
          );
          
          if (success) {
            console.log('关注成功！');
          }
        })

      // 示例2：获取关注列表
      Button('查看我的关注')
        .onClick(async () => {
          const newsList: FollowedNewsItem[] = await this.followService.getFollowedNewsList();
          console.log(`共关注了 ${newsList.length} 条新闻`);
        })
    }
  }
}
```

## 3. 常用方法

### 关注新闻（3种方式）

```typescript
// 方式1：最简单 - 只需标题和正文
await followService.followNewsSimple('标题', '正文');

// 方式2：带图片
await followService.followNewsWithImage('标题', '正文', 'https://image.url');

// 方式3：完整参数（包含新闻ID）
await followService.followNewsFull('news_123', '标题', '正文', 'https://image.url');

// 方式4：使用对象参数
const request: FollowNewsRequest = {
  newsTitle: '标题',
  newsContent: '正文',
  newsId: 'news_123',      // 可选
  imageUrl: 'https://...'  // 可选
};
await followService.followNews(request);
```

### 获取关注列表

```typescript
const newsList: FollowedNewsItem[] = await followService.getFollowedNewsList();

// 遍历新闻列表
newsList.forEach((news: FollowedNewsItem) => {
  console.log(news.newsTitle);      // 标题
  console.log(news.newsContent);    // 正文
  console.log(news.imageUrl);       // 图片URL
  console.log(news.followTime);     // 关注时间
});
```

## 4. 类型定义

### FollowNewsRequest

```typescript
interface FollowNewsRequest {
  newsTitle: string;      // 必填：新闻标题
  newsContent: string;    // 必填：新闻正文
  newsId?: string;        // 可选：新闻ID（不填则自动生成）
  imageUrl?: string;      // 可选：图片URL
}
```

### FollowedNewsItem

```typescript
interface FollowedNewsItem {
  followId: number;       // 关注记录ID
  userId: number;         // 用户ID
  newsId: string;         // 新闻ID
  newsTitle: string;      // 新闻标题
  imageUrl?: string;      // 图片URL
  newsContent?: string;   // 新闻正文
  followTime: string;     // 关注时间
}
```

## 5. 注意事项

✅ **用户必须先登录** - 内部会自动从 UserManager 获取 JWT token  
✅ **自动错误提示** - 所有错误都会自动显示 Toast 提示  
✅ **返回值判断** - 关注方法返回 `boolean`，成功为 `true`  
✅ **类型安全** - 所有类型都已明确定义  

## 6. 完整示例

在新闻详情页添加关注功能：

```typescript
import { NewsFollowService } from 'follows';

@Component
export struct NewsDetailPage {
  @State newsId: string = '';
  @State newsTitle: string = '';
  @State newsContent: string = '';
  @State newsImage: string = '';
  @State isFollowed: boolean = false;
  
  private followService: NewsFollowService = NewsFollowService.getInstance();

  build() {
    Column() {
      // 新闻图片
      if (this.newsImage) {
        Image(this.newsImage)
          .width('100%')
          .height(200)
      }

      // 新闻标题
      Text(this.newsTitle)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin(10)

      // 新闻正文
      Text(this.newsContent)
        .fontSize(14)
        .margin(10)

      // 关注按钮
      Button(this.isFollowed ? '已关注' : '关注')
        .width('80%')
        .margin(20)
        .backgroundColor(this.isFollowed ? '#CCCCCC' : '#FF6B00')
        .onClick(async () => {
          if (!this.isFollowed) {
            const success: boolean = await this.followService.followNewsFull(
              this.newsId,
              this.newsTitle,
              this.newsContent,
              this.newsImage
            );
            
            if (success) {
              this.isFollowed = true;
            }
          }
        })
    }
    .width('100%')
    .height('100%')
  }
}
```

## 7. 故障排除

**问题：提示"请先登录"**  
解决：确保用户已经通过 LoginPage 登录

**问题：提示"网络连接失败"**  
解决：检查设备网络连接和后端服务是否正常

**问题：导入报错**  
解决：确保在 `oh-package.json5` 中添加了 `follows` 依赖

**问题：TypeScript 类型错误**  
解决：确保导入时使用 `type` 关键字：
```typescript
import { NewsFollowService, type FollowNewsRequest, type FollowedNewsItem } from 'follows';
```

## 需要帮助？

查看完整文档：[README.md](./README.md)

