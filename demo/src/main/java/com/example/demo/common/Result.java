package com.example.demo.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    private int code;  // 状态码：200成功，400错误
    private String message;  // 消息
    private T data;  // 数据

    // 成功响应（带数据）
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "成功", data);
    }

    // 成功响应（无数据）
    public static Result<Void> success() {
        return new Result<>(200, "成功", null);
    }

    // 错误响应
    // 改为泛型方法：支持返回任意 Result<T>
    public static <T> Result<T> error(String message) {
        return new Result<>(400, message, null);
    }
}