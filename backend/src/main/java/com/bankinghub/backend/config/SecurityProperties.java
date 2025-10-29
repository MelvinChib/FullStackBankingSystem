package com.bankinghub.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Configuration properties for application security settings.
 * <p>
 * This class binds security-related configuration from application.yml/properties
 * with the prefix "app". It includes JWT, CORS, and password strength configurations.
 * </p>
 * 
 * @author Melvin Musonda Chibanda
 * @version 2.0.0
 * @since 1.0.0
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class SecurityProperties {

    /** JWT configuration properties */
    private Jwt jwt = new Jwt();
    
    /** CORS configuration properties */
    private Cors cors = new Cors();
    
    /** Security configuration properties */
    private Security security = new Security();

    /**
     * JWT (JSON Web Token) configuration properties.
     * <p>
     * Configures JWT secret key, token expiration times, and refresh token settings.
     * </p>
     */
    @Data
    public static class Jwt {
        /** JWT secret key for signing tokens (minimum 256-bit) */
        @NotBlank(message = "JWT secret is required")
        private String secret;
        
        /** JWT token expiration time in milliseconds (default: 24 hours) */
        @Min(value = 300000, message = "JWT expiration must be at least 5 minutes")
        private long expiration = 86400000;
        
        /** JWT refresh token expiration time in milliseconds (default: 7 days) */
        @Min(value = 600000, message = "Refresh expiration must be at least 10 minutes")
        private long refreshExpiration = 604800000;
    }

    /**
     * CORS (Cross-Origin Resource Sharing) configuration properties.
     * <p>
     * Defines allowed origins, methods, headers, and credentials for cross-origin requests.
     * </p>
     */
    @Data
    public static class Cors {
        /** List of allowed origins for CORS requests */
        @NotEmpty(message = "At least one allowed origin is required")
        private List<String> allowedOrigins = List.of("http://localhost:3000", "http://localhost:5173");
        
        /** List of allowed HTTP methods for CORS requests */
        private List<String> allowedMethods = List.of("GET", "POST", "PUT", "DELETE", "OPTIONS");
        
        /** List of allowed headers for CORS requests */
        private List<String> allowedHeaders = List.of("*");
        
        /** Whether to allow credentials in CORS requests */
        private boolean allowCredentials = true;
        
        /** Maximum age (in seconds) for CORS preflight cache */
        private long maxAge = 3600L;
    }

    /**
     * Security configuration properties.
     * <p>
     * Contains password strength requirements and other security settings.
     * </p>
     */
    @Data
    public static class Security {
        /** Password strength configuration */
        private PasswordStrength passwordStrength = new PasswordStrength();
        
        /**
         * Password strength requirements configuration.
         * <p>
         * Defines minimum length and character requirements for user passwords.
         * </p>
         */
        @Data
        public static class PasswordStrength {
            /** Minimum password length (default: 8 characters) */
            @Min(value = 8, message = "Minimum password length must be at least 8")
            private int minLength = 8;
            
            /** Whether password must contain at least one uppercase letter */
            private boolean requireUppercase = true;
            
            /** Whether password must contain at least one lowercase letter */
            private boolean requireLowercase = true;
            
            /** Whether password must contain at least one digit */
            private boolean requireDigit = true;
            
            /** Whether password must contain at least one special character */
            private boolean requireSpecialChar = true;
        }
    }
}