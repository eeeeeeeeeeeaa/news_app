# JWT Token 获取问题调试指南

## 问题描述
在 Follow 页面显示"请先登录"，说明从本地获取 JWT 令牌失败。

## 已添加的调试功能

### 1. Follow.ets 页面调试
在页面加载时，会自动检查登录状态并输出详细日志：

```
🔍 [Follow] 检查登录状态...
🔍 [Follow] UserManager 实例: [object]
🔍 [Follow] Preferences 初始化成功
🔍 [Follow] Token 存在: 是/否
🔍 [Follow] Token 类型: string
🔍 [Follow] Token 长度: xxx
🔍 [Follow] Token 前30字符: eyJ...
🔍 [Follow] Token 是否有效: true/false
🔍 [Follow] Token Info: {...}
🔍 [Follow] 当前用户: {...}
```

### 2. NewsFollowService 调试
在获取关注列表时，会输出详细的 Token 获取过程：

```
🔍 [NewsFollowService] 创建新的单例实例
🔍 [NewsFollowService] 构造函数被调用
🔍 [NewsFollowService] UserManager 实例已获取
🔍 [NewsFollowService] 开始初始化...
✅ [NewsFollowService] 初始化成功
🔍 [getFollowedNewsList] 开始获取 token...
🔍 [getFollowedNewsList] Token 获取结果: 存在/null
🔍 [getFollowedNewsList] Token 类型: string
🔍 [getFollowedNewsList] Token 长度: xxx
```

## 调试步骤

### 步骤 1：查看控制台日志
1. 打开 DevEco Studio
2. 运行应用
3. 打开 Follow 页面
4. 查看 "Log" 面板中的日志输出

### 步骤 2：分析日志内容

#### 情况 A：Token 不存在
如果日志显示：
```
🔍 [Follow] Token 存在: 否
⚠️ [Follow] 未找到 Token，用户可能未登录
```

**原因：** 用户未登录或 Token 没有被正确保存

**解决方案：**
1. 确认用户已经在登录页面成功登录
2. 检查登录接口是否返回了 Token
3. 检查 Token 是否被正确保存到 Preferences

#### 情况 B：Token 存在但无效
如果日志显示：
```
🔍 [Follow] Token 存在: 是
🔍 [Follow] Token 是否有效: false
```

**原因：** Token 已过期或格式不正确

**解决方案：**
1. 检查 Token 的过期时间
2. 重新登录获取新的 Token
3. 检查后端 JWT 配置

#### 情况 C：Preferences 初始化失败
如果日志显示：
```
❌ [Follow] 检查登录状态失败: ...
❌ [Follow] 错误消息: ...
```

**原因：** Preferences 存储初始化失败

**解决方案：**
1. 检查应用权限
2. 检查设备存储空间
3. 清除应用数据后重试

#### 情况 D：UserManager 获取失败
如果日志显示：
```
❌ [NewsFollowService] 初始化失败: ...
```

**原因：** UserManager 或 JwtManager 初始化失败

**解决方案：**
1. 检查 login 模块是否正确导入
2. 检查模块依赖配置
3. 清理项目重新构建

### 步骤 3：手动测试 Token 存储

可以在登录成功后，添加以下代码来验证 Token 是否正确保存：

```typescript
// 在登录页面登录成功后
const userManager = UserManager.getInstance();
await userManager.initPreferences();
const token = await userManager.getToken();
console.log('登录后的 Token:', token);

const tokenInfo = await userManager.getTokenInfo();
console.log('Token 信息:', tokenInfo);
```

### 步骤 4：检查后端 JWT 配置

确保后端 JWT Token 格式正确：
- Token 应该包含三部分，用 `.` 分隔
- Payload 应该包含 `exp`（过期时间）字段
- Token 格式示例：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjE2OTg4ODg4ODh9.xxxxx`

## 常见问题排查

### Q1: 登录后立即跳转到 Follow 页面显示未登录
**原因：** Preferences 可能需要一些时间来持久化数据

**解决方案：**
在登录成功后添加延迟：
```typescript
await userManager.saveToken(token);
await new Promise(resolve => setTimeout(resolve, 100)); // 等待 100ms
```

### Q2: 应用重启后 Token 丢失
**原因：** Preferences 没有正确 flush

**解决方案：**
确保在保存 Token 后调用 `flush()`：
```typescript
await this.dataPreferences?.put(this.JWT_TOKEN_KEY, token);
await this.dataPreferences?.flush(); // 重要！
```

### Q3: Token 验证失败
**原因：** Token 格式不正确或签名验证失败

**解决方案：**
1. 检查后端返回的 Token 格式
2. 使用在线 JWT 解析工具验证 Token
3. 检查后端 JWT secret 配置

## 日志搜索关键字

在 DevEco Studio 的 Log 面板中使用以下关键字搜索：

- `[Follow]` - Follow 页面相关日志
- `[NewsFollowService]` - 服务层日志
- `[getFollowedNewsList]` - 获取列表相关日志
- `Token` - Token 相关日志
- `❌` - 错误日志
- `⚠️` - 警告日志
- `✅` - 成功日志
- `🔍` - 调试日志

## 需要提供的信息

如果问题仍未解决，请提供以下信息：

1. **完整的控制台日志**（从应用启动到打开 Follow 页面）
2. **登录接口的响应**（脱敏后的 Token）
3. **设备信息**（操作系统版本、设备型号）
4. **应用版本**
5. **是否是第一次登录**
6. **是否清除过应用数据**

## 临时解决方案

如果需要快速测试其他功能，可以先关闭 Token 验证：

```typescript
// 在 NewsFollowService.ets 中
public async getFollowedNewsList(): Promise<FollowedNewsItem[]> {
  // 临时注释掉 Token 检查（仅用于测试！）
  // const token = await this.userManager.getToken();
  // if (!token) { return []; }
  
  // 使用硬编码的 Token（仅用于测试！）
  const token = 'your_test_token_here';
  
  // ... 其余代码
}
```

**注意：** 这仅用于调试，不要在生产环境使用！

## 下一步

根据控制台日志的输出，你可以：

1. 如果 Token 不存在 → 检查登录流程
2. 如果 Token 存在但无效 → 检查 Token 格式和过期时间
3. 如果 Preferences 初始化失败 → 检查应用权限和存储
4. 如果所有检查都通过但仍然失败 → 提供完整日志进行进一步分析

