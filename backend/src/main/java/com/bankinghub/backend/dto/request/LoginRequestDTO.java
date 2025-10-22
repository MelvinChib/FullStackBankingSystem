package com.bankinghub.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequestDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 1, max = 100, message = "Password must not exceed 100 characters")
    private String password;

    @Size(max = 6, message = "Two-factor code must not exceed 6 characters")
    private String twoFactorCode;

    private Boolean rememberMe = false;
}