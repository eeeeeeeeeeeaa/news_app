package com.example.demo.entity;

import lombok.Data;

@Data
public class UserInfo {
    private Integer userId;
    private String userPhone;
    private String userName;

    public UserInfo() {}

    public UserInfo(Integer userId, String userPhone, String userName) {
        this.userId = userId;
        this.userPhone = userPhone;
        this.userName = userName;
    }
}
