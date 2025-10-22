# Follows 模块使用说明

## 概述
Follows 模块提供了用户关注新闻和取消关注的功能，包括获取关注列表、关注新闻、取消关注等操作。**注意：本模块不再使用模拟数据，所有操作都基于真实API。**

## 主要功能

### 1. 获取用户关注列表
```typescript
import { NewsFollowService } from 'follows';

const newsFollowService = NewsFollowService.getInstance();
try {
  const followedNewsList = await newsFollowService.getFollowedNewsList();
  // 处理数据
} catch (error) {
  // 处理错误：未登录、网络错误等
  console.error('获取关注列表失败:', error.message);
}
```

### 2. 关注新闻
```typescript
import { NewsFollowService } from 'follows';

const newsFollowService = NewsFollowService.getInstance();

// 简单关注（仅标题和唯一标识）
await newsFollowService.followNewsSimple('新闻标题', 'news_unique_key');

// 包含发布者信息
await newsFollowService.followNewsWithAuthor('新闻标题', 'news_unique_key', '发布者');

// 完整参数
await newsFollowService.followNewsFull('新闻标题', 'news_unique_key', '发布者', '2025-01-20T10:00:00');
```

### 3. 取消关注
```typescript
import { NewsFollowService } from 'follows';

const newsFollowService = NewsFollowService.getInstance();
const success = await newsFollowService.unfollowNews('news_unique_key');
```

## 数据结构

### FollowedNewsItem（API数据模型）
```typescript
interface FollowedNewsItem {
  followId: number;        // 关注记录ID
  userId: number;          // 用户ID
  newsUniquekey: string;   // 新闻唯一标识
  newsTitle: string;       // 新闻标题
  newsTime?: string;       // 新闻发布时间
  newsAuthor?: string;     // 新闻发布者
  followTime: string;      // 关注时间
}
```

### FollowedNewsData（UI数据模型）
```typescript
interface FollowedNewsData {
  id: string;              // 新闻ID
  title: string;           // 新闻标题
  publishTime: string;      // 发布时间
  publisher: string;        // 发布者
  imageUrl?: string;        // 新闻图片URL（可选）
  content?: string;         // 新闻内容（可选）
}
```

### FollowNewsRequest
```typescript
interface FollowNewsRequest {
  newsTitle: string;       // 新闻标题（必填）
  newsUniquekey: string;    // 新闻唯一标识（必填）
  newsAuthor?: string;      // 新闻发布者（可选）
  newsTime?: string;        // 新闻发布时间（可选，ISO 8601格式）
}
```

## API 接口说明

### 关注新闻
- **URL**: `/api/news/follow`
- **Method**: POST
- **Auth**: 需要 JWT Token
- **参数**: newsTitle, newsUniquekey, newsAuthor, newsTime

### 获取关注列表
- **URL**: `/api/news/followed`
- **Method**: GET
- **Auth**: 需要 JWT Token
- **返回**: FollowedNewsItem[] 数组

### 取消关注
- **URL**: `/api/news/unfollow`
- **Method**: DELETE
- **Auth**: 需要 JWT Token
- **参数**: newsUniquekey

## 错误处理

所有方法都包含完整的错误处理机制：
- 网络错误处理
- 认证失败处理
- 参数验证
- 错误信息直接显示在页面上

## 页面状态

页面会根据不同情况显示不同状态：

1. **加载状态**：显示加载动画和"正在加载..."文字
2. **错误状态**：显示错误图标、错误信息和"点击刷新重试"按钮
3. **空状态**：显示"暂无关注的新闻"提示
4. **数据状态**：显示关注的新闻列表

## 注意事项

1. **不再使用模拟数据**：所有操作都基于真实API
2. 所有API调用都需要用户登录（JWT Token）
3. 新闻唯一标识（newsUniquekey）是必填参数
4. 错误信息直接显示在页面上，不再使用Toast提示
5. 如果用户未登录，会显示"请先登录"错误信息
6. 如果网络连接失败，会显示相应的网络错误信息
