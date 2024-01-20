package com.estudy.estudybackend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthTokenController {
    private static final String AUTH_TOKEN_HEADER_NAME = "X-API-KEY";

    @Value("${api.key}")
    private String key;

    private static String AUTH_TOKEN;

    @Value("${api.key}")
    public void setAuthToken(String key) {
        AUTH_TOKEN = key;
    }

    public static String getAuthToken() {
        return AUTH_TOKEN;
    }
}
