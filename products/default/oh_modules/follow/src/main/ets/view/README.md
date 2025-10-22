# NewsFollowService 使用文档

## 概述

`NewsFollowService` 是一个用于处理用户关注新闻功能的服务类，提供了关注新闻、获取关注列表等功能。

## 特性

- ✅ 单例模式设计，全局共享实例
- ✅ 自动获取JWT认证令牌
- ✅ 完善的错误处理和用户提示
- ✅ 详细的日志输出，方便调试
- ✅ 多种便捷方法，适应不同使用场景
- ✅ TypeScript类型安全

## 文件说明

- `NewsFollowService.ets` - 核心服务类
- `NewsFollowServiceExample.ets` - 使用示例和最佳实践
- `README.md` - 本文档

## 快速开始

### 1. 导入服务

**在 `follows` 模块内部使用：**
```typescript
import { NewsFollowService, type FollowNewsRequest, type FollowedNewsItem } from './NewsFollowService';
```

**在其他模块中使用（推荐）：**
```typescript
import { NewsFollowService, type FollowNewsRequest, type FollowedNewsItem } from 'follows';
```

> 注意：如果在其他模块使用，需要在该模块的 `oh-package.json5` 中添加 `follows` 依赖：
> ```json5
> "dependencies": {
>   "follows": "file:../follows"
> }
> ```

### 2. 获取服务实例

```typescript
// 在组件中获取单例实例
private followService: NewsFollowService = NewsFollowService.getInstance();
```

### 3. 关注新闻

```typescript
// 最简单的方式：只需要标题和正文
const success = await this.followService.followNewsSimple(
  '新闻标题',
  '新闻正文内容...'
);
```

### 4. 获取关注列表

```typescript
// 获取用户关注的所有新闻
const newsList: FollowedNewsItem[] = await this.followService.getFollowedNewsList();
```

## API 文档

### 类型定义

#### FollowNewsRequest

关注新闻的请求参数

```typescript
interface FollowNewsRequest {
  newsTitle: string;      // 新闻标题（必填）
  newsContent: string;    // 新闻正文（必填）
  newsId?: string;        // 新闻ID（可选，不填则后端自动生成UUID）
  imageUrl?: string;      // 图片URL（可选）
}
```

#### FollowedNewsItem

关注的新闻数据结构

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

### 核心方法

#### followNews()

关注新闻（完整参数版本）

```typescript
public async followNews(request: FollowNewsRequest): Promise<boolean>
```

**参数：**
- `request`: `FollowNewsRequest` - 关注新闻的请求参数

**返回：**
- `Promise<boolean>` - 是否关注成功

**示例：**
```typescript
const request: FollowNewsRequest = {
  newsTitle: '新闻标题',
  newsContent: '新闻正文...',
  newsId: 'news_001',
  imageUrl: 'https://example.com/image.jpg'
};

const success = await this.followService.followNews(request);
```

#### getFollowedNewsList()

获取用户关注的新闻列表

```typescript
public async getFollowedNewsList(): Promise<FollowedNewsItem[]>
```

**返回：**
- `Promise<FollowedNewsItem[]>` - 关注的新闻列表（按关注时间倒序）

**示例：**
```typescript
const newsList = await this.followService.getFollowedNewsList();
console.log(`共关注了 ${newsList.length} 条新闻`);
```

### 便捷方法

#### followNewsSimple()

最简单的关注方式，只需要标题和正文

```typescript
public async followNewsSimple(title: string, content: string): Promise<boolean>
```

**示例：**
```typescript
await this.followService.followNewsSimple(
  '鸿蒙系统更新',
  '华为发布鸿蒙系统新版本...'
);
```

#### followNewsWithImage()

带图片的关注方式

```typescript
public async followNewsWithImage(title: string, content: string, imageUrl: string): Promise<boolean>
```

**示例：**
```typescript
await this.followService.followNewsWithImage(
  '科技新闻',
  '新闻内容...',
  'https://example.com/image.jpg'
);
```

#### followNewsFull()

完整参数的关注方式

```typescript
public async followNewsFull(newsId: string, title: string, content: string, imageUrl?: string): Promise<boolean>
```

**示例：**
```typescript
await this.followService.followNewsFull(
  'news_12345',
  '新闻标题',
  '新闻内容...',
  'https://example.com/image.jpg'
);
```

## 使用场景

### 场景1：在新闻详情页添加关注按钮

```typescript
@Component
export struct NewsDetailPage {
  @State newsData: NewsItem | null = null;
  private followService: NewsFollowService = NewsFollowService.getInstance();

  build() {
    Column() {
      // 新闻标题
      Text(this.newsData?.title)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
      
      // 新闻内容
      Text(this.newsData?.content)
        .fontSize(14)
      
      // 关注按钮
      Button('关注此新闻')
        .onClick(async () => {
          if (this.newsData) {
            const success = await this.followService.followNewsWithImage(
              this.newsData.title,
              this.newsData.content,
              this.newsData.imageUrl
            );
            
            if (success) {
              // 更新UI状态
            }
          }
        })
    }
  }
}
```

### 场景2：显示用户关注列表

```typescript
@Component
export struct MyFollowedNewsPage {
  @State followedNews: FollowedNewsItem[] = [];
  private followService: NewsFollowService = NewsFollowService.getInstance();

  async aboutToAppear(): Promise<void> {
    // 页面加载时获取关注列表
    this.followedNews = await this.followService.getFollowedNewsList();
  }

  build() {
    Column() {
      Text('我的关注')
        .fontSize(24)
        .margin(20)

      List() {
        ForEach(this.followedNews, (news: FollowedNewsItem) => {
          ListItem() {
            NewsItemCard({ newsData: news })
          }
        })
      }
    }
  }
}
```

### 场景3：批量关注新闻

```typescript
async batchFollowNews(newsList: Array<{ title: string, content: string }>): Promise<void> {
  const followService = NewsFollowService.getInstance();
  let successCount = 0;

  for (const news of newsList) {
    const success = await followService.followNewsSimple(news.title, news.content);
    if (success) {
      successCount++;
    }
  }

  console.log(`成功关注 ${successCount}/${newsList.length} 条新闻`);
}
```

## 错误处理

服务内部已经实现了完善的错误处理：

1. **参数验证** - 自动验证必填参数，缺失时显示提示
2. **认证检查** - 自动检查用户登录状态
3. **网络错误** - 捕获并友好提示网络相关错误
4. **权限错误** - 处理401/403等权限错误
5. **Toast提示** - 所有错误都会显示用户友好的提示信息

### 推荐的错误处理方式

```typescript
async handleFollowNews(): Promise<void> {
  try {
    const success = await this.followService.followNewsSimple(
      this.newsTitle,
      this.newsContent
    );

    if (success) {
      // 成功后的业务逻辑
      this.refreshFollowList();
    } else {
      // 失败后的业务逻辑（已经显示了Toast）
      console.log('用户取消或操作失败');
    }
  } catch (error) {
    // 捕获未预期的异常
    console.error('关注新闻时发生异常:', error);
  }
}
```

## 调试技巧

### 启用详细日志

服务已经内置了详细的控制台日志输出，使用DevEco Studio的日志面板可以看到：

- 🔍 请求参数
- 🔍 请求URL
- 🔍 响应数据
- 🔍 操作结果

### 日志搜索关键字

- `========== 开始关注新闻 ==========` - 关注操作开始
- `========== 获取关注新闻列表 ==========` - 获取列表操作
- `关注新闻成功` / `关注新闻失败` - 操作结果

## 依赖说明

本服务依赖以下模块：

- `utils` - 提供 `HttpUtils` 和 `withBase` 等工具函数
- `login` - 提供 `UserManager` 用于获取JWT认证
- `@kit.ArkUI` - 提供 `promptAction` 用于Toast提示

### follows 模块的 oh-package.json5 配置

```json5
{
  "name": "follows",
  "version": "1.0.0",
  "description": "Please describe the basic information.",
  "main": "Index.ets",
  "author": "",
  "license": "Apache-2.0",
  "dependencies": {
    "uicomponents": "file:../../commons/uicomponents",
    "utils": "file:../../commons/utils",
    "login": "file:../login"
  }
}
```

### 在其他模块中使用时的配置

如果在其他模块（如 `news`、`quickstart` 等）中使用 `NewsFollowService`，需要在该模块的 `oh-package.json5` 中添加依赖：

```json5
{
  "dependencies": {
    "follows": "file:../follows"
  }
}
```

## 注意事项

1. **用户必须先登录** - 调用任何方法前，用户必须已经登录并获取JWT token
2. **网络连接** - 确保设备有可用的网络连接
3. **后端服务** - 确保后端服务正常运行在配置的地址
4. **标题和正文是必填的** - 调用关注方法时，标题和正文不能为空

## 后端API对接

服务对接的后端接口：

### 关注新闻
- **接口**: `POST /api/news/follow`
- **认证**: 需要 JWT token
- **参数**: `newsTitle`, `newsContent`, `newsId`(可选), `imageUrl`(可选)

### 获取关注列表
- **接口**: `GET /api/news/followed`
- **认证**: 需要 JWT token
- **返回**: 关注的新闻列表（按时间倒序）

## 常见问题

### Q: 提示"请先登录"？
A: 用户未登录或JWT token已过期，需要重新登录。

### Q: 提示"没有权限"（403错误）？
A: 检查后端的Spring Security配置，确保 `/api/news/**` 路径已放行。

### Q: 如何判断用户是否已登录？
A: 可以通过 `UserManager.getInstance().getToken()` 检查是否有token。

### Q: 如何自定义错误提示？
A: 可以不使用便捷方法，直接调用 `followNews()` 并自行处理返回值。

## 版本历史

- **v1.0.0** (2024-10-19)
  - 首次发布
  - 实现关注新闻和获取列表功能
  - 完善的错误处理和日志输出

## 联系与支持

如有问题或建议，请联系开发团队。

