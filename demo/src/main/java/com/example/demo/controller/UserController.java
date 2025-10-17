package com.example.demo.controller;

import com.example.demo.common.Result;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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
            @RequestParam String userPhone,
            @RequestParam String userPassword) {
        return userService.login(userPhone, userPassword);
    }
}