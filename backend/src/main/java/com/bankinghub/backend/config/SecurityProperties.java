package com.bankinghub.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class SecurityProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Security security = new Security();

    @Data
    public static class Jwt {
        @NotBlank(message = "JWT secret is required")
        private String secret;
        
        @Min(value = 300000, message = "JWT expiration must be at least 5 minutes")
        private long expiration = 86400000; // 24 hours
        
        @Min(value = 600000, message = "Refresh expiration must be at least 10 minutes")
        private long refreshExpiration = 604800000; // 7 days
    }

    @Data
    public static class Cors {
        @NotEmpty(message = "At least one allowed origin is required")
        private List<String> allowedOrigins = List.of("http://localhost:3000", "http://localhost:5173");
        
        private List<String> allowedMethods = List.of("GET", "POST", "PUT", "DELETE", "OPTIONS");
        private List<String> allowedHeaders = List.of("*");
        private boolean allowCredentials = true;
        private long maxAge = 3600L;
    }

    @Data
    public static class Security {
        private PasswordStrength passwordStrength = new PasswordStrength();
        
        @Data
        public static class PasswordStrength {
            @Min(value = 8, message = "Minimum password length must be at least 8")
            private int minLength = 8;
            private boolean requireUppercase = true;
            private boolean requireLowercase = true;
            private boolean requireDigit = true;
            private boolean requireSpecialChar = true;
        }
    }
}