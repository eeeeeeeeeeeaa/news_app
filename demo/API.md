## 接口文档

本项目提供两个模块的接口：用户模块（注册/登录）与新闻关注。所有接口返回统一结构 `Result<T>`：

```json
{
  "code": 200,
  "message": "成功",
  "data": {}
}
```

- code：200 表示成功，400 表示业务错误
- message：提示信息
- data：成功时携带的数据；无数据则为 null

### 认证说明
- 公开接口：`/api/users/register`、`/api/users/login`
- 受保护接口：其余接口均需要在请求头携带 `Authorization: Bearer <JWT>`

---

## 用户模块

### 1) 用户注册
- **URL**: `/api/users/register`
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded` 或 `application/json`（如下为表单参数说明）
- **Auth**: 不需要

#### 请求参数
- userPhone (string, 必填)：手机号（唯一）
- userPassword (string, 必填)：登录密码
- userName (string, 可选)：用户名

#### 成功响应
```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

#### 失败响应（示例）
```json
{
  "code": 400,
  "message": "手机号已注册",
  "data": null
}
```

#### curl 示例
```bash
curl -X POST "http://localhost:8080/api/users/register" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "userPhone=13800138000" \
  -d "userPassword=Passw0rd" \
  -d "userName=Tom"
```

---

### 2) 用户登录
- **URL**: `/api/users/login`
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **Auth**: 不需要

#### 请求参数
- userPhone (string, 必填)：手机号
- userPassword (string, 必填)：密码

#### 成功响应（data 为 JWT 字符串）
```json
{
  "code": 200,
  "message": "成功",
  "data": "<jwt-token>"
}
```

#### 失败响应（示例）
```json
{
  "code": 400,
  "message": "手机号或密码错误",
  "data": null
}
```

#### curl 示例
```bash
curl -X POST "http://localhost:8080/api/users/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "userPhone=13800138000" \
  -d "userPassword=Passw0rd"
```

---

## 新闻关注模块

### 1) 关注新闻
- **URL**: `/api/news/follow`
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **Auth**: 需要；请求头 `Authorization: Bearer <jwt-token>`

#### 请求参数
- newsTitle (string, 必填)：新闻标题
- newsUniquekey (string, 必填)：新闻唯一标识
- newsAuthor (string, 可选)：新闻发布者
- newsTime (datetime, 可选)：新闻发布时间（ISO 8601格式，如：2025-10-20T15:30:00）

#### 成功响应
```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

#### 失败响应（示例）
- 未登录或令牌无效：
```json
{
  "code": 400,
  "message": "请先登录",
  "data": null
}
```

- 重复关注：
```json
{
  "code": 400,
  "message": "已关注该新闻",
  "data": null
}
```

#### curl 示例
```bash
# 完整参数示例（包含所有可选参数）
curl -X POST "http://localhost:8080/api/news/follow" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "newsTitle=示例新闻标题" \
  -d "newsUniquekey=abc123" \
  -d "newsAuthor=新华社" \
  -d "newsTime=2025-10-20T15:30:00"

# 最简参数示例（仅必填参数）
curl -X POST "http://localhost:8080/api/news/follow" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "newsTitle=示例新闻标题" \
  -d "newsUniquekey=abc123"
```

---

### 2) 获取用户关注的新闻列表
- **URL**: `/api/news/followed`
- **Method**: GET
- **Auth**: 需要；请求头 `Authorization: Bearer <jwt-token>`

#### 请求参数
无

#### 成功响应
> **注意**：返回的新闻列表按关注时间倒序排序，即关注时间越靠后的新闻越靠前。

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "followId": 2,
      "userId": 1,
      "newsUniquekey": "xyz789",
      "newsTitle": "另一条新闻",
      "newsTime": "2025-10-20T10:00:00",
      "newsAuthor": "人民日报",
      "followTime": "2025-10-20T21:30:00"
    },
    {
      "followId": 1,
      "userId": 1,
      "newsUniquekey": "abc123",
      "newsTitle": "示例新闻标题",
      "newsTime": "2025-10-19T15:30:00",
      "newsAuthor": "新华社",
      "followTime": "2025-10-20T20:15:00"
    }
  ]
}
```

#### 失败响应（示例）
- 未登录或令牌无效：
```json
{
  "code": 400,
  "message": "请先登录",
  "data": null
}
```

#### curl 示例
```bash
curl -X GET "http://localhost:8080/api/news/followed" \
  -H "Authorization: Bearer <jwt-token>"
```

---

### 3) 取消关注新闻
- **URL**: `/api/news/unfollow`
- **Method**: DELETE
- **Content-Type**: `application/x-www-form-urlencoded`
- **Auth**: 需要；请求头 `Authorization: Bearer <jwt-token>`

#### 请求参数
- newsUniquekey (string, 必填)：新闻唯一标识

#### 成功响应
```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

#### 失败响应（示例）
- 未登录或令牌无效：
```json
{
  "code": 400,
  "message": "请先登录",
  "data": null
}
```

- 未关注该新闻：
```json
{
  "code": 400,
  "message": "未关注该新闻",
  "data": null
}
```

#### curl 示例
```bash
curl -X DELETE "http://localhost:8080/api/news/unfollow?newsUniquekey=abc123" \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 错误码约定
- 200：成功
- 400：业务失败（参数错误、未登录、重复操作等）

## 环境与配置
- 端口：默认 `8080`
- 数据库：在 `src/main/resources/application.yml` 中配置 `spring.datasource.*`
- JWT：在 `application.yml` 中配置 `jwt.secret` 与 `jwt.expiration`


