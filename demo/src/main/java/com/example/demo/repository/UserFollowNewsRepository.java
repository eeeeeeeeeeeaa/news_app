package com.example.demo.repository;

import com.example.demo.entity.UserFollowNews;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserFollowNewsRepository extends JpaRepository<UserFollowNews, Integer> {
    // 检查用户是否已关注某新闻（用于避免重复关注）
    boolean existsByUserIdAndNewsUniquekey(Integer userId, String newsUniquekey);
    
    // 根据用户ID和新闻唯一标识查找关注记录
    Optional<UserFollowNews> findByUserIdAndNewsUniquekey(Integer userId, String newsUniquekey);
    
    // 获取用户关注的所有新闻，按关注时间倒序排序（越晚关注越靠前）
    List<UserFollowNews> findByUserIdOrderByFollowTimeDesc(Integer userId);
}