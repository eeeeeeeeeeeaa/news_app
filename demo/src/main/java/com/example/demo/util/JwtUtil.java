package com.example.demo.util;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;  // 密钥（从配置文件读取）

    @Value("${jwt.expiration}")
    private long expiration;  // 过期时间（毫秒）

    private JwtParser parser;  // JWT解析器

    // 初始化解析器
    @PostConstruct
    public void init() {
        parser = Jwts.parserBuilder()
                .setSigningKey(secret.getBytes())
                .build();
    }

    // 生成令牌（根据用户ID）
    public String generateToken(Integer userId) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))  // 存储用户ID
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, secret.getBytes())  // 签名算法
                .compact();
    }

    // 从令牌中解析用户ID
    public Integer getUserIdFromToken(String token) {
        Claims claims = parser.parseClaimsJws(token).getBody();
        return Integer.parseInt(claims.getSubject());
    }

    // 从请求头中获取令牌（请求头格式：Authorization: Bearer <token>）
    public String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // 去掉"Bearer "前缀
        }
        return null;
    }

    // 验证令牌是否有效
    public boolean validateToken(String token) {
        try {
            parser.parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}