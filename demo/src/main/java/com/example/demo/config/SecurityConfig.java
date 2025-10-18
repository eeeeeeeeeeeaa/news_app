package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 密码加密器（BCrypt算法）
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 配置安全规则（放行注册、登录接口，其他接口需要认证）
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // 开发环境关闭CSRF（简化测试）
                .formLogin(form -> form.disable())  // 禁用默认的表单登录
                .httpBasic(basic -> basic.disable())  // 禁用HTTP Basic认证
                .authorizeHttpRequests(auth -> auth
                        // 公开接口（无需登录）
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                        // 其他接口需要认证
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}