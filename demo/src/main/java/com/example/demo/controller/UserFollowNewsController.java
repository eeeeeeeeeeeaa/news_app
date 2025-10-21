package com.example.demo.controller;

import com.example.demo.common.Result;
import com.example.demo.service.UserFollowNewsService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
            @RequestParam String newsContent,  // 新闻正文必填
            @RequestParam(required = false) String newsId,  // 新闻ID可选
            @RequestParam(required = false) String imageUrl) {  // 图片链接可选

        // 1. 从请求头获取令牌并验证
        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null || !jwtUtil.validateToken(token)) {
            return Result.error("请先登录");
        }

        // 2. 解析令牌中的用户ID
        Integer userId = jwtUtil.getUserIdFromToken(token);

        // 3. 调用服务层关注新闻
        return followNewsService.followNews(userId, newsId, newsTitle, imageUrl, newsContent);
    }
}