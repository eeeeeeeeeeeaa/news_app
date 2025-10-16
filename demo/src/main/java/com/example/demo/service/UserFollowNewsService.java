package com.example.demo.service;

import com.example.demo.common.Result;
import com.example.demo.entity.User;
import com.example.demo.entity.UserFollowNews;
import com.example.demo.repository.UserFollowNewsRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserFollowNewsService {
    private final UserFollowNewsRepository followNewsRepository;
    private final UserRepository userRepository;

    public UserFollowNewsService(UserFollowNewsRepository followNewsRepository, UserRepository userRepository) {
        this.followNewsRepository = followNewsRepository;
        this.userRepository = userRepository;
    }

    // 用户关注新闻
    public Result<Void> followNews(Integer userId, String newsId, String newsTitle, String newsUrl) {
        // 1. 检查用户是否存在
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            return Result.error("用户不存在");
        }

        // 2. 检查是否已关注该新闻
        if (followNewsRepository.existsByUserIdAndNewsId(userId, newsId)) {
            return Result.error("已关注该新闻");
        }

        // 3. 保存关注记录
        UserFollowNews followNews = new UserFollowNews();
        followNews.setUserId(userId);
        followNews.setNewsId(newsId);
        followNews.setNewsTitle(newsTitle);
        followNews.setNewsUrl(newsUrl);
        followNewsRepository.save(followNews);

        return Result.success();
    }
}