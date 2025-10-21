package com.example.demo.repository;

import com.example.demo.entity.UserFollowNews;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserFollowNewsRepository extends JpaRepository<UserFollowNews, Integer> {
    // 检查用户是否已关注某新闻（用于避免重复关注）
    boolean existsByUserIdAndNewsId(Integer userId, String newsId);
}