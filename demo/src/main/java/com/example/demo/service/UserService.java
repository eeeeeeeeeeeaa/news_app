package com.example.demo.service;

import com.example.demo.common.Result;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  // 密码加密器（Spring Security提供）
    private final JwtUtil jwtUtil;

    // 构造器注入依赖
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 用户注册
    public Result<Void> register(String userPhone, String userPassword, String userName) {
        // 1. 检查手机号是否已注册
        Optional<User> existingUser = userRepository.findByUserPhone(userPhone);
        if (existingUser.isPresent()) {
            return Result.error("手机号已注册");
        }

        // 2. 密码加密（BCrypt算法）
        String encodedPassword = passwordEncoder.encode(userPassword);

        // 3. 保存用户
        User user = new User();
        user.setUserPhone(userPhone);
        user.setUserPassword(encodedPassword);
        user.setUserName(userName);  // 用户名可为空
        userRepository.save(user);

        return Result.success();
    }

    // 用户登录（返回JWT令牌）
    public Result<String> login(String userPhone, String userPassword) {
        // 1. 查询用户
        Optional<User> userOptional = userRepository.findByUserPhone(userPhone);
        if (userOptional.isEmpty()) {
            return Result.error("手机号或密码错误");
        }
        User user = userOptional.get();

        // 2. 验证密码（加密后对比）
        if (!passwordEncoder.matches(userPassword, user.getUserPassword())) {
            return Result.error("手机号或密码错误");
        }

        // 3. 生成JWT令牌（包含用户ID）
        String token = jwtUtil.generateToken(user.getUserId());
        return Result.success(token);
    }
}