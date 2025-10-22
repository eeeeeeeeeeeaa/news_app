# 临时解决方案：Token 跨模块访问问题

## 方案 1：使用 AppStorage 共享 Token（推荐用于快速测试）

在登录成功后，将 Token 同时保存到 AppStorage：

```typescript
// UserManager.ets 登录成功后
await this.jwtManager.saveToken(token);

// 同时保存到 AppStorage（全局共享存储）
AppStorage.setOrCreate('jwt_token', token);
console.log('Token 已保存到 AppStorage');
```

在 NewsFollowService 中获取 Token：

```typescript
// NewsFollowService.ets
public async getToken(): Promise<string | null> {
  // 先尝试从 AppStorage 获取
  const appStorageToken = AppStorage.get<string>('jwt_token');
  if (appStorageToken) {
    console.log('从 AppStorage 获取到 Token');
    return appStorageToken;
  }
  
  // 再从 UserManager 获取
  return await this.userManager.getToken();
}
```

## 方案 2：确保使用相同的 Context

问题可能是不同模块使用了不同的 Context。解决方法：

### 在应用启动时初始化 UserManager

```typescript
// 在主入口文件（如 EntryAbility.ets）
import { UserManager } from 'login';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    // 应用启动时初始化 UserManager
    UserManager.getInstance().initPreferences()
      .then(() => {
        console.log('✅ UserManager 初始化成功');
      })
      .catch((err) => {
        console.error('❌ UserManager 初始化失败:', err);
      });
  }
}
```

## 方案 3：使用全局 Context

创建一个全局 Context 管理器：

```typescript
// commons/utils/src/GlobalContext.ets
let globalContext: Context | null = null;

export function setGlobalContext(context: Context): void {
  globalContext = context;
  console.log('全局 Context 已设置');
}

export function getGlobalContext(): Context {
  if (!globalContext) {
    throw new Error('全局 Context 未初始化');
  }
  return globalContext;
}
```

在应用启动时设置：

```typescript
// EntryAbility.ets
import { setGlobalContext } from 'utils';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    setGlobalContext(this.context);
  }
}
```

在 JwtManager 中使用：

```typescript
// JwtManager.ets
import { getGlobalContext } from 'utils';

public async initPreferences(): Promise<void> {
  try {
    if (!this.dataPreferences) {
      const context = getGlobalContext(); // 使用全局 Context
      this.dataPreferences = await preferences.getPreferences(context, this.PREFERENCES_NAME);
    }
  } catch (err) {
    console.error('初始化失败:', err);
  }
}
```

## 如何选择方案

1. **快速测试**：使用方案 1（AppStorage），最简单
2. **生产环境**：使用方案 2 或 3，更稳定
3. **调试阶段**：先收集完整日志，确定问题根源

## 验证方案是否有效

使用方案后，检查日志：

```
✅ Token 已保存到 AppStorage
✅ 从 AppStorage 获取到 Token
✅ Token 获取成功
```

如果还是失败，请提供完整的登录和获取 Token 的日志。

