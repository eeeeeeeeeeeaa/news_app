package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    // 根据手机号查询用户（用于注册查重和登录）
    Optional<User> findByUserPhone(String userPhone);
}