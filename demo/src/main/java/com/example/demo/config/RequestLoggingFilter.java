package com.example.demo.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Enumeration;

@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        System.out.println("========== 请求详情 ==========");
        System.out.println("请求方法: " + httpRequest.getMethod());
        System.out.println("请求URL: " + httpRequest.getRequestURL());
        System.out.println("Content-Type: " + httpRequest.getContentType());
        System.out.println("Content-Length: " + httpRequest.getContentLength());
        
        System.out.println("--- 请求头 ---");
        Enumeration<String> headerNames = httpRequest.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            System.out.println(headerName + ": " + httpRequest.getHeader(headerName));
        }
        
        System.out.println("--- 请求参数 ---");
        Enumeration<String> paramNames = httpRequest.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            System.out.println(paramName + " = " + httpRequest.getParameter(paramName));
        }
        System.out.println("================================");
        
        chain.doFilter(request, response);
    }
}

