package com.backofficedemo.auth.dto;

public record AuthResponse(
        String token,
        String username,
        String role,
        long expiresInMinutes
) {}
