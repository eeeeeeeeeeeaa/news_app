package com.example.demo.controller;

import com.example.demo.common.Result;
import com.example.demo.entity.UserInfo;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // 注册接口
    @PostMapping("/register")
    public Result<Void> register(
            @RequestParam String userPhone,
            @RequestParam String userPassword,
            @RequestParam(required = false) String userName) {  // 用户名可选
        return userService.register(userPhone, userPassword, userName);
    }

    // 登录接口
    @PostMapping("/login")
    public Result<String> login(
            @RequestParam(required = false) String userPhone,
            @RequestParam(required = false) String userPassword) {
        System.out.println("===== Controller 接收到的参数 =====");
        System.out.println("userPhone: " + userPhone);
        System.out.println("userPassword: " + userPassword);
        System.out.println("===================================");
        
        if (userPhone == null || userPassword == null) {
            return Result.error("手机号或密码不能为空");
        }
        
        return userService.login(userPhone, userPassword);
    }

    // 获取用户信息接口
    @GetMapping("/info")
    public Result<UserInfo> getUserInfo(HttpServletRequest request) {
        // 从请求头获取JWT令牌
        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null) {
            return Result.error("请先登录");
        }

        return userService.getUserInfoFromToken(token);
    }
}