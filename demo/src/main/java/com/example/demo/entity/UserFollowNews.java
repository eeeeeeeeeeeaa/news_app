package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_follow_news",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "news_id"}))  // 联合唯一约束
public class UserFollowNews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Integer followId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;  // 关联用户ID

    @Column(name = "news_id", nullable = false)
    private String newsId;  // 新闻唯一标识

    @Column(name = "news_title", nullable = false)
    private String newsTitle;  // 新闻标题

    @Column(name = "news_url")
    private String newsUrl;  // 新闻链接（可选）

    @Column(name = "follow_time", nullable = false, updatable = false)
    private LocalDateTime followTime;  // 关注时间

    // 自动填充关注时间
    @PrePersist
    public void prePersist() {
        this.followTime = LocalDateTime.now();
    }
}