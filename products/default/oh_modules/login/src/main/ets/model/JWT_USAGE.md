# JWT Manager 使用说明

## 概述

`JwtManager` 是一个专门用于管理 JWT Token 的工具类，提供了完整的 Token 存储、解析、验证等功能。所有方法都使用了明确的类型定义，避免使用 `any` 类型。

## 核心功能

### 1. Token 存储和获取

#### 保存 Token
```typescript
const jwtManager = JwtManager.getInstance();
await jwtManager.initPreferences();
const success = await jwtManager.saveToken(token);
```

#### 获取 Token
```typescript
const token = await jwtManager.getToken();
if (token) {
  console.log('Token:', token);
}
```

#### 删除 Token
```typescript
const success = await jwtManager.removeToken();
```

### 2. Token 解析

#### 获取 Payload
```typescript
const payload: JwtPayload | null = await jwtManager.getPayload();
if (payload) {
  console.log('用户ID:', payload.userId);
  console.log('手机号:', payload.userPhone);
  console.log('用户名:', payload.userName);
  console.log('过期时间:', payload.exp);
}
```

#### 获取用户信息
```typescript
const userInfo = await jwtManager.getUserInfoFromToken();
if (userInfo) {
  console.log('用户信息:', userInfo);
}
```

### 3. Token 验证

#### 检查是否过期
```typescript
const isExpired = await jwtManager.isTokenExpired();
if (isExpired === true) {
  console.log('Token 已过期');
} else if (isExpired === false) {
  console.log('Token 未过期');
} else {
  console.log('无法判断过期状态');
}
```

#### 检查是否有效
```typescript
const isValid = await jwtManager.isTokenValid();
if (isValid) {
  console.log('Token 有效');
} else {
  console.log('Token 无效或已过期');
}
```

#### 获取过期时间
```typescript
const expirationDate = await jwtManager.getExpirationDate();
if (expirationDate) {
  console.log('过期时间:', expirationDate.toLocaleString());
}
```

#### 获取剩余有效时间
```typescript
const remainingTime = await jwtManager.getTimeToExpiration();
if (remainingTime !== null) {
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
  console.log(`Token 还有 ${hours} 小时过期`);
}
```

### 4. 获取完整 Token 信息

```typescript
const tokenInfo = await jwtManager.getTokenInfo();
if (tokenInfo) {
  console.log('Token:', tokenInfo.token);
  console.log('Payload:', tokenInfo.payload);
  console.log('是否有效:', tokenInfo.isValid);
  console.log('是否过期:', tokenInfo.isExpired);
  console.log('过期时间:', tokenInfo.expirationDate);
}
```

### 5. HTTP 请求认证

#### 获取认证请求头
```typescript
const headers = await jwtManager.getAuthHeaders();
// headers = { 'Authorization': 'Bearer <token>' }

// 在 HTTP 请求中使用
const response = await HttpUtils.get(url, headers);
```

## 与 UserManager 集成

`UserManager` 已经集成了 `JwtManager`，您可以通过以下方式使用：

### 登录时自动保存 Token
```typescript
const userManager = UserManager.getInstance();
const success = await userManager.loginUser(phone, password);
// Token 会自动保存到 JwtManager
```

### 获取 Token
```typescript
const token = await userManager.getToken();
```

### 获取认证请求头
```typescript
const headers = await userManager.getAuthHeaders();
```

### 检查 Token 有效性
```typescript
const isValid = await userManager.isTokenValid();
```

### 获取 Token 信息
```typescript
const tokenInfo = await userManager.getTokenInfo();
```

### 获取 JwtManager 实例
```typescript
const jwtManager = userManager.getJwtManager();
// 可以使用 JwtManager 的所有方法
```

### 退出登录时自动删除 Token
```typescript
await userManager.logout();
// Token 会自动从 JwtManager 中删除
```

## 类型定义

### JwtPayload
JWT Token 载荷信息：
```typescript
interface JwtPayload {
  userId?: string;        // 用户ID
  userPhone?: string;     // 用户手机号
  userName?: string;      // 用户名
  iat?: number;          // 签发时间（秒级时间戳）
  exp?: number;          // 过期时间（秒级时间戳）
  sub?: string;          // 主题
  iss?: string;          // 签发者
  aud?: string;          // 受众
}
```

### JwtTokenInfo
完整的 Token 信息：
```typescript
interface JwtTokenInfo {
  token: string;              // 原始 token 字符串
  payload: JwtPayload;        // 解析后的载荷信息
  isValid: boolean;           // token 是否有效
  isExpired: boolean;         // token 是否过期
  expirationDate: Date | null; // 过期时间
}
```

## 最佳实践

### 1. 在应用启动时检查 Token
```typescript
async function checkAuthOnStartup() {
  const jwtManager = JwtManager.getInstance();
  await jwtManager.initPreferences();
  
  const isValid = await jwtManager.isTokenValid();
  if (!isValid) {
    // 跳转到登录页
    console.log('Token 无效，需要重新登录');
  } else {
    // 可以继续使用应用
    console.log('Token 有效，已登录');
  }
}
```

### 2. 在受保护的 API 请求前验证 Token
```typescript
async function fetchProtectedData() {
  const jwtManager = JwtManager.getInstance();
  
  // 检查 Token 是否有效
  const isValid = await jwtManager.isTokenValid();
  if (!isValid) {
    console.log('Token 无效，请重新登录');
    return;
  }
  
  // 获取认证请求头
  const headers = await jwtManager.getAuthHeaders();
  
  // 发送请求
  const response = await HttpUtils.get('/api/protected', headers);
}
```

### 3. Token 即将过期时提醒用户
```typescript
async function checkTokenExpiration() {
  const jwtManager = JwtManager.getInstance();
  
  const remainingTime = await jwtManager.getTimeToExpiration();
  if (remainingTime !== null && remainingTime < 5 * 60 * 1000) {
    // Token 将在 5 分钟内过期
    console.log('Token 即将过期，请重新登录');
    promptAction.showToast({ message: 'Token 即将过期，请重新登录' });
  }
}
```

### 4. 清除缓存
```typescript
// 在某些场景下（如切换账号），需要清除缓存
const jwtManager = JwtManager.getInstance();
jwtManager.clearCache();
```

## 注意事项

1. **初始化**: 在使用 JwtManager 之前，建议先调用 `initPreferences()` 进行初始化
2. **单例模式**: JwtManager 使用单例模式，使用 `getInstance()` 获取实例
3. **类型安全**: 所有方法都有明确的类型定义，不使用 `any` 类型
4. **缓存机制**: JwtManager 内部使用缓存提高性能，在删除 Token 时会自动清除缓存
5. **错误处理**: 所有异步方法都包含错误处理，不会抛出异常
6. **Base64 解码**: 使用 HarmonyOS 官方的 `util.Base64Helper` 进行 Base64 解码

## 示例：完整的登录流程

```typescript
import { UserManager } from 'login';
import { JwtManager } from 'login';

// 1. 用户登录
async function login(phone: string, password: string) {
  const userManager = UserManager.getInstance();
  const success = await userManager.loginUser(phone, password);
  
  if (success) {
    // 登录成功，Token 已自动保存
    const tokenInfo = await userManager.getTokenInfo();
    console.log('登录成功，Token 信息:', tokenInfo);
    
    // 跳转到首页
    router.pushUrl({ url: 'pages/HomePage' });
  }
}

// 2. 检查登录状态
async function checkLoginStatus() {
  const userManager = UserManager.getInstance();
  const isValid = await userManager.isTokenValid();
  
  if (!isValid) {
    // 跳转到登录页
    router.pushUrl({ url: 'pages/LoginPage' });
  }
}

// 3. 请求受保护的 API
async function fetchUserData() {
  const userManager = UserManager.getInstance();
  const headers = await userManager.getAuthHeaders();
  
  try {
    const response = await HttpUtils.get('/api/user/profile', headers);
    console.log('用户数据:', response);
  } catch (err) {
    console.error('请求失败:', err);
  }
}

// 4. 退出登录
async function logout() {
  const userManager = UserManager.getInstance();
  await userManager.logout();
  
  // 跳转到登录页
  router.pushUrl({ url: 'pages/LoginPage' });
}
```

