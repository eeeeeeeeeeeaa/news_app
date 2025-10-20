package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_follow_news",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "news_uniquekey"}))  // 联合唯一约束
public class UserFollowNews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Integer followId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;  // 关联用户ID

    @Column(name = "news_uniquekey", nullable = false, length = 50)
    private String newsUniquekey;  // 新闻唯一标识（替代原news_id）

    @Column(name = "news_title", nullable = false, length = 200)
    private String newsTitle;  // 新闻标题

    @Column(name = "news_time")
    private LocalDateTime newsTime;  // 新闻发布时间

    @Column(name = "news_author", length = 200)
    private String newsAuthor;  // 新闻发布者

    @Column(name = "follow_time", nullable = false, updatable = false)
    private LocalDateTime followTime;  // 关注时间

    // 自动填充关注时间
    @PrePersist
    public void prePersist() {
        this.followTime = LocalDateTime.now();
    }
}