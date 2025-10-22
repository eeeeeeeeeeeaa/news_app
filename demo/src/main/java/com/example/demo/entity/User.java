package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user")  // 对应数据库表名
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 自增主键
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "user_phone", unique = true, nullable = false)
    private String userPhone;  // 手机号（唯一）

    @Column(name = "user_name")
    private String userName;  // 用户名（可空）

    @Column(name = "user_password", nullable = false)
    private String userPassword;  // 加密后的密码

    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;  // 创建时间（自动生成）

    // 自动填充创建时间
    @PrePersist
    public void prePersist() {
        this.createTime = LocalDateTime.now();
    }
}