package com.example.demo.controller;

import com.example.demo.common.Result;
import com.example.demo.entity.UserFollowNews;
import com.example.demo.service.UserFollowNewsService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class UserFollowNewsController {
    private final UserFollowNewsService followNewsService;
    private final JwtUtil jwtUtil;

    public UserFollowNewsController(UserFollowNewsService followNewsService, JwtUtil jwtUtil) {
        this.followNewsService = followNewsService;
        this.jwtUtil = jwtUtil;
    }

    // 关注新闻接口（需要登录，从令牌中获取用户ID）
    @PostMapping("/follow")
    public Result<Void> followNews(
            HttpServletRequest request,  // 用于获取请求头中的令牌
            @RequestParam String newsTitle,  // 新闻标题必填
            @RequestParam(required = false) String newsUniquekey,  // 新闻唯一标识可选
            @RequestParam(required = false) String newsAuthor,  // 新闻发布者可选
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newsTime) {  // 新闻发布时间可选

        // 1. 从请求头获取令牌并验证
        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }

        // 2. 解析令牌中的用户ID
        Integer userId = jwtUtil.getUserIdFromToken(token);

        // 3. 调用服务层关注新闻
        return followNewsService.followNews(userId, newsUniquekey, newsTitle, newsAuthor, newsTime);
    }

    // 获取用户关注的新闻列表（需要登录）
    @GetMapping("/followed")
    public Result<List<UserFollowNews>> getFollowedNews(HttpServletRequest request) {
        // 1. 从请求头获取令牌并验证
        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }

        // 2. 解析令牌中的用户ID
        Integer userId = jwtUtil.getUserIdFromToken(token);

        // 3. 调用服务层获取关注的新闻列表
        return followNewsService.getFollowedNews(userId);
    }

    // 取消关注新闻接口（需要登录）
    @DeleteMapping("/unfollow")
    public Result<Void> unfollowNews(
            HttpServletRequest request,
            @RequestParam String newsUniquekey) {  // 新闻唯一标识必填

        // 1. 从请求头获取令牌并验证
        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }

        // 2. 解析令牌中的用户ID
        Integer userId = jwtUtil.getUserIdFromToken(token);

        // 3. 调用服务层取消关注新闻
        return followNewsService.unfollowNews(userId, newsUniquekey);
    }
}