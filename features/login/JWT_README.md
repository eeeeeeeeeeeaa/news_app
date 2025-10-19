# JWT 认证管理功能说明

## 概述

本次更新为登录模块添加了完善的 JWT Token 管理功能，提供了类型安全、功能完整的 JWT 认证解决方案。

## 新增文件

### 1. `JwtManager.ets` - JWT 管理器核心类
**位置**: `features/login/src/main/ets/model/JwtManager.ets`

**核心功能**:
- ✅ JWT Token 的存储、获取和删除
- ✅ JWT Token Payload 解析（Base64 解码）
- ✅ Token 有效性验证
- ✅ Token 过期时间检查
- ✅ 获取认证请求头（Authorization）
- ✅ 内存缓存机制提升性能
- ✅ 完整的类型定义（无 any 类型）

**主要接口**:
```typescript
// 存储和获取
await jwtManager.saveToken(token: string): Promise<boolean>
await jwtManager.getToken(): Promise<string | null>
await jwtManager.removeToken(): Promise<boolean>

// 解析和验证
await jwtManager.getPayload(): Promise<JwtPayload | null>
await jwtManager.isTokenValid(): Promise<boolean>
await jwtManager.isTokenExpired(): Promise<boolean | null>
await jwtManager.getExpirationDate(): Promise<Date | null>

// 实用功能
await jwtManager.getAuthHeaders(): Promise<Record<string, string>>
await jwtManager.getUserInfoFromToken(): Promise<{...} | null>
await jwtManager.getTokenInfo(): Promise<JwtTokenInfo | null>
```

### 2. `AuthHelper.ets` - 认证辅助工具类
**位置**: `features/login/src/main/ets/model/AuthHelper.ets`

**核心功能**:
- ✅ 快速检查认证状态
- ✅ Token 即将过期提醒
- ✅ 格式化的时间显示
- ✅ 自动清理过期 Token
- ✅ 便捷的 HTTP 请求头获取

**主要接口**:
```typescript
// 认证检查
await authHelper.checkAuth(showToast?: boolean): Promise<AuthCheckResult>
await authHelper.requireAuth(): Promise<boolean>

// Token 过期管理
await authHelper.isTokenExpiringSoon(minutes?: number): Promise<boolean>
await authHelper.remindTokenExpiration(minutes?: number): Promise<void>
await authHelper.cleanupExpiredToken(): Promise<boolean>

// 时间格式化
await authHelper.getFormattedExpirationTime(): Promise<string | null>
await authHelper.getRemainingTimeDescription(): Promise<string | null>

// 其他
await authHelper.getAuthHeaders(additionalHeaders?: Record<string, string>)
await authHelper.logout(): Promise<void>
await authHelper.printAuthStatus(): Promise<void>  // 调试用
```

### 3. `JWT_USAGE.md` - 完整使用文档
**位置**: `features/login/src/main/ets/model/JWT_USAGE.md`

详细的 API 文档和使用说明，包含：
- 所有方法的详细说明
- 类型定义
- 使用示例
- 最佳实践
- 完整的登录流程示例

### 4. `USAGE_EXAMPLE.ets` - 实际应用示例
**位置**: `features/login/src/main/ets/model/USAGE_EXAMPLE.ets`

10 个实际应用场景的完整代码示例，包括：
- 应用启动时检查登录状态
- 登录功能实现
- 退出登录功能
- 请求受保护的 API
- Token 过期检查
- 页面生命周期中使用
- 发送带认证的 POST 请求
- 显示 Token 详细信息
- 自定义 HTTP 客户端集成 JWT
- 使用自定义 HTTP 客户端

## 更新的文件

### `UserManager.ets` - 用户管理器
已集成 `JwtManager`，提供以下新方法：
```typescript
await userManager.isTokenValid(): Promise<boolean>
await userManager.getTokenInfo()
userManager.getJwtManager(): JwtManager
```

### `Index.ets` - 模块导出
新增导出：
```typescript
export { JwtManager } from './src/main/ets/model/JwtManager';
export type { JwtPayload, JwtTokenInfo } from './src/main/ets/model/JwtManager';

export { AuthHelper } from './src/main/ets/model/AuthHelper';
export type { AuthCheckResult } from './src/main/ets/model/AuthHelper';
```

## 类型定义

### JwtPayload
JWT Token 载荷信息：
```typescript
interface JwtPayload {
  userId?: string;
  userPhone?: string;
  userName?: string;
  iat?: number;      // 签发时间（秒级时间戳）
  exp?: number;      // 过期时间（秒级时间戳）
  sub?: string;
  iss?: string;
  aud?: string;
}
```

### JwtTokenInfo
完整的 Token 信息：
```typescript
interface JwtTokenInfo {
  token: string;
  payload: JwtPayload;
  isValid: boolean;
  isExpired: boolean;
  expirationDate: Date | null;
}
```

### AuthCheckResult
认证检查结果：
```typescript
interface AuthCheckResult {
  isAuthenticated: boolean;
  message: string;
  hasToken: boolean;
  isTokenValid: boolean;
  isTokenExpired: boolean;
}
```

## 快速开始

### 1. 登录并保存 Token
```typescript
const userManager = UserManager.getInstance();
const success = await userManager.loginUser(phone, password);
// Token 已自动保存
```

### 2. 检查登录状态
```typescript
const authHelper = AuthHelper.getInstance();
await authHelper.init();
const result = await authHelper.checkAuth();
console.log('是否已登录:', result.isAuthenticated);
```

### 3. 请求受保护的 API
```typescript
const jwtManager = JwtManager.getInstance();
const headers = await jwtManager.getAuthHeaders();
const response = await HttpUtils.get('/api/protected', headers);
```

### 4. 退出登录
```typescript
const userManager = UserManager.getInstance();
await userManager.logout();
// Token 已自动删除
```

## 技术特点

1. **类型安全**: 所有代码都使用明确的类型定义，完全避免使用 `any` 类型
2. **单例模式**: JwtManager、UserManager 和 AuthHelper 都使用单例模式
3. **缓存机制**: 内存缓存提升性能，减少持久化存储的读取次数
4. **错误处理**: 完善的错误处理，不会抛出未捕获的异常
5. **Base64 解码**: 使用 HarmonyOS 官方的 `util.Base64Helper` 进行解码
6. **分离关注点**: JWT 管理、用户管理和认证辅助功能分离，职责清晰
7. **易于使用**: 提供多个层次的 API，从底层到高层都可以使用

## 使用建议

1. **推荐使用 `AuthHelper`**: 对于大多数场景，直接使用 `AuthHelper` 即可
2. **需要底层控制时使用 `JwtManager`**: 当需要更精细的控制时，使用 `JwtManager`
3. **通过 `UserManager` 访问**: 如果已经在使用 `UserManager`，可以直接调用其 JWT 相关方法
4. **定期检查过期**: 建议在应用中定期检查 Token 是否即将过期，提醒用户
5. **自动清理**: 在应用启动时调用 `authHelper.cleanupExpiredToken()` 清理过期 Token

## 示例场景

### 在应用启动时
```typescript
const authHelper = AuthHelper.getInstance();
await authHelper.init();
await authHelper.cleanupExpiredToken();
const result = await authHelper.checkAuth();
```

### 在页面中检查认证
```typescript
async aboutToAppear() {
  const authHelper = AuthHelper.getInstance();
  const isAuthenticated = await authHelper.requireAuth();
  if (!isAuthenticated) {
    router.replaceUrl({ url: 'pages/LoginPage' });
  }
}
```

### 发送受保护的请求
```typescript
const authHelper = AuthHelper.getInstance();
if (await authHelper.requireAuth()) {
  const headers = await authHelper.getAuthHeaders();
  const response = await HttpUtils.get('/api/data', headers);
}
```

## 调试支持

使用 `AuthHelper.printAuthStatus()` 打印当前认证状态：
```typescript
const authHelper = AuthHelper.getInstance();
await authHelper.printAuthStatus();
```

输出示例：
```
========== 认证状态 ==========
Token 存在: true
Token 有效: true
Token 过期: false
过期时间: 2024-10-20 15:30:00
Payload: { userId: '123', userPhone: '138****8000', ... }
剩余时间: 还有 2 小时 30 分钟
当前用户: { account: '13800138000', username: '用户8000' }
==============================
```

## 文件结构

```
features/login/src/main/ets/model/
├── JwtManager.ets          # JWT 管理器核心类
├── AuthHelper.ets          # 认证辅助工具类
├── UserManager.ets         # 用户管理器（已更新）
├── JWT_USAGE.md            # 完整使用文档
└── USAGE_EXAMPLE.ets       # 实际应用示例
```

## 注意事项

1. 在使用前需要调用 `initPreferences()` 或 `init()` 进行初始化
2. Token 存储在 HarmonyOS 的 Preferences 中，应用卸载后会清除
3. Base64 解码使用 HarmonyOS 官方 API，兼容性良好
4. 所有异步方法都返回 Promise，需要使用 `await` 或 `.then()`
5. Token 过期时间由后端控制，前端只能读取和验证

## 后续优化建议

1. 可以添加 Token 自动刷新机制
2. 可以添加多设备登录管理
3. 可以添加 Token 黑名单机制
4. 可以添加更多的认证策略（如生物识别）

---

如有问题或建议，请参考 `JWT_USAGE.md` 或查看 `USAGE_EXAMPLE.ets` 中的示例代码。

