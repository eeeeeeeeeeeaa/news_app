package com.example.demo.service;

import com.example.demo.common.Result;
import com.example.demo.entity.User;
import com.example.demo.entity.UserFollowNews;
import com.example.demo.repository.UserFollowNewsRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserFollowNewsService {
    private final UserFollowNewsRepository followNewsRepository;
    private final UserRepository userRepository;

    public UserFollowNewsService(UserFollowNewsRepository followNewsRepository, UserRepository userRepository) {
        this.followNewsRepository = followNewsRepository;
        this.userRepository = userRepository;
    }

    // 用户关注新闻
    public Result<Void> followNews(Integer userId, String newsUniquekey, String newsTitle, String newsAuthor, LocalDateTime newsTime) {
        // 1. 验证必填参数
        if (newsTitle == null || newsTitle.trim().isEmpty()) {
            return Result.error("新闻标题不能为空");
        }
        if (newsUniquekey == null || newsUniquekey.trim().isEmpty()) {
            return Result.error("新闻唯一标识不能为空");
        }

        // 2. 检查用户是否存在
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Result.error("用户不存在");
        }

        // 3. 检查是否已关注该新闻
        if (followNewsRepository.existsByUserIdAndNewsUniquekey(userId, newsUniquekey)) {
            return Result.error("已关注该新闻");
        }

        // 4. 保存关注记录
        UserFollowNews followNews = new UserFollowNews();
        followNews.setUserId(userId);
        followNews.setNewsUniquekey(newsUniquekey);
        followNews.setNewsTitle(newsTitle);
        followNews.setNewsAuthor(newsAuthor);
        followNews.setNewsTime(newsTime);
        followNewsRepository.save(followNews);

        return Result.success();
    }

    // 获取用户关注的新闻列表（按关注时间倒序：越晚关注越靠前）
    public Result<List<UserFollowNews>> getFollowedNews(Integer userId) {
        // 1. 检查用户是否存在
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Result.error("用户不存在");
        }

        // 2. 查询用户关注的新闻列表（按关注时间倒序）
        List<UserFollowNews> followedNewsList = followNewsRepository.findByUserIdOrderByFollowTimeDesc(userId);

        return Result.success(followedNewsList);
    }

    // 取消关注新闻
    public Result<Void> unfollowNews(Integer userId, String newsUniquekey) {
        // 1. 验证必填参数
        if (newsUniquekey == null || newsUniquekey.trim().isEmpty()) {
            return Result.error("新闻唯一标识不能为空");
        }

        // 2. 检查用户是否存在
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Result.error("用户不存在");
        }

        // 3. 查找关注记录
        Optional<UserFollowNews> followNewsOptional = followNewsRepository.findByUserIdAndNewsUniquekey(userId, newsUniquekey);
        if (followNewsOptional.isEmpty()) {
            return Result.error("未关注该新闻");
        }

        // 4. 删除关注记录
        followNewsRepository.delete(followNewsOptional.get());

        return Result.success();
    }
}