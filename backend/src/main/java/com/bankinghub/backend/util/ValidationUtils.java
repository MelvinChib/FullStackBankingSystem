package com.bankinghub.backend.util;

import com.bankinghub.backend.config.SecurityProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class ValidationUtils {

    private final SecurityProperties securityProperties;

    // SQL Injection patterns to detect
    private static final Pattern[] SQL_INJECTION_PATTERNS = {
        Pattern.compile("(?i).*(union|select|insert|update|delete|drop|create|alter|exec|execute).*"),
        Pattern.compile("(?i).*(script|javascript|vbscript|onload|onerror).*"),
        Pattern.compile(".*[';\"\\\\].*")
    };

    // XSS patterns to detect
    private static final Pattern[] XSS_PATTERNS = {
        Pattern.compile("(?i).*<script.*>.*</script>.*"),
        Pattern.compile("(?i).*javascript:.*"),
        Pattern.compile("(?i).*on\\w+\\s*=.*")
    };

    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    // Password validation pattern (at least 8 chars, 1 upper, 1 lower, 1 digit, 1 special)
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    // Phone number pattern (international format)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[+]?[1-9]\\d{1,14}$"
    );

    // Account number pattern (alphanumeric, 8-20 characters)
    private static final Pattern ACCOUNT_NUMBER_PATTERN = Pattern.compile(
        "^[A-Za-z0-9]{8,20}$"
    );

    // Bank routing number pattern (9 digits)
    private static final Pattern ROUTING_NUMBER_PATTERN = Pattern.compile(
        "^\\d{9}$"
    );

    /**
     * Validate email format with security checks
     */
    public boolean isValidEmail(String email) {
        return email != null && 
               !containsSqlInjection(email) && 
               !containsXss(email) &&
               EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Validate password strength using configuration
     */
    public boolean isValidPassword(String password) {
        if (password == null) {
            return false;
        }

        SecurityProperties.Security.PasswordStrength strength = securityProperties.getSecurity().getPasswordStrength();
        
        if (password.length() < strength.getMinLength()) {
            return false;
        }
        
        if (strength.isRequireUppercase() && !password.chars().anyMatch(Character::isUpperCase)) {
            return false;
        }
        
        if (strength.isRequireLowercase() && !password.chars().anyMatch(Character::isLowerCase)) {
            return false;
        }
        
        if (strength.isRequireDigit() && !password.chars().anyMatch(Character::isDigit)) {
            return false;
        }
        
        if (strength.isRequireSpecialChar() && 
            !password.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0)) {
            return false;
        }
        
        return true;
    }

    /**
     * Validate phone number format with security checks
     */
    public boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && 
               !containsSqlInjection(phoneNumber) &&
               PHONE_PATTERN.matcher(phoneNumber).matches();
    }

    /**
     * Validate account number format with security checks
     */
    public boolean isValidAccountNumber(String accountNumber) {
        return accountNumber != null && 
               !containsSqlInjection(accountNumber) &&
               ACCOUNT_NUMBER_PATTERN.matcher(accountNumber).matches();
    }

    /**
     * Validate routing number format
     */
    public boolean isValidRoutingNumber(String routingNumber) {
        return routingNumber != null && ROUTING_NUMBER_PATTERN.matcher(routingNumber).matches();
    }

    /**
     * Validate amount (positive and within range)
     */
    public boolean isValidAmount(BigDecimal amount) {
        return amount != null && 
               amount.compareTo(BigDecimal.ZERO) > 0 && 
               amount.compareTo(new BigDecimal("9999999999999.99")) <= 0;
    }

    /**
     * Validate amount for transfers (minimum 1.00 ZMW)
     */
    public boolean isValidTransferAmount(BigDecimal amount) {
        return amount != null && 
               amount.compareTo(new BigDecimal("1.00")) >= 0 && 
               amount.compareTo(new BigDecimal("1000000.00")) <= 0; // Max 1M ZMW per transfer
    }

    /**
     * Validate percentage (0-100)
     */
    public boolean isValidPercentage(BigDecimal percentage) {
        return percentage != null && 
               percentage.compareTo(BigDecimal.ZERO) >= 0 && 
               percentage.compareTo(new BigDecimal("100.00")) <= 0;
    }

    /**
     * Validate string length
     */
    public boolean isValidLength(String str, int minLength, int maxLength) {
        if (str == null) return false;
        int length = str.trim().length();
        return length >= minLength && length <= maxLength;
    }

    /**
     * Check if string is null or empty
     */
    public boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * Check if string is not null and not empty
     */
    public boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    /**
     * Validate Zambian phone number format
     */
    public boolean isValidZambianPhoneNumber(String phoneNumber) {
        if (phoneNumber == null) return false;
        
        // Remove spaces and common separators
        String cleanNumber = phoneNumber.replaceAll("[\\s\\-\\(\\)]", "");
        
        // Check for Zambian mobile patterns
        Pattern zambianMobilePattern = Pattern.compile(
            "^(\\+260|260|0)?(9[567]\\d{7}|7[67]\\d{7})$"
        );
        
        return zambianMobilePattern.matcher(cleanNumber).matches();
    }

    /**
     * Validate National Registration Card (NRC) format for Zambia
     */
    public boolean isValidZambianNRC(String nrc) {
        if (nrc == null) return false;
        
        // Remove spaces and forward slashes
        String cleanNRC = nrc.replaceAll("[\\s/]", "");
        
        // Zambian NRC format: 6 digits + 2 digits + 1 digit (e.g., 123456/78/9)
        Pattern nrcPattern = Pattern.compile("^\\d{6}\\d{2}\\d{1}$");
        
        return nrcPattern.matcher(cleanNRC).matches();
    }

    /**
     * Sanitize input string (remove dangerous characters)
     */
    public String sanitizeString(String input) {
        if (input == null) return null;
        
        // Remove potentially dangerous characters
        return input.replaceAll("[<>\"'%;()&+]", "").trim();
    }

    /**
     * Validate name (letters, spaces, hyphens, apostrophes only)
     */
    public boolean isValidName(String name) {
        if (name == null) return false;
        
        Pattern namePattern = Pattern.compile("^[a-zA-Z\\s\\-']{2,50}$");
        return namePattern.matcher(name.trim()).matches();
    }

    /**
     * Check if two strings are equal (null-safe)
     */
    public boolean areEqual(String str1, String str2) {
        if (str1 == null && str2 == null) return true;
        if (str1 == null || str2 == null) return false;
        return str1.equals(str2);
    }

    /**
     * Check for SQL injection patterns
     */
    public boolean containsSqlInjection(String input) {
        if (input == null) {
            return false;
        }
        
        String cleanInput = input.toLowerCase().trim();
        for (Pattern pattern : SQL_INJECTION_PATTERNS) {
            if (pattern.matcher(cleanInput).matches()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check for XSS patterns
     */
    public boolean containsXss(String input) {
        if (input == null) {
            return false;
        }
        
        for (Pattern pattern : XSS_PATTERNS) {
            if (pattern.matcher(input).matches()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Sanitize input string
     */
    public String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        return input.trim()
                   .replaceAll("[<>\"'&]", "")
                   .replaceAll("\\s+", " ");
    }

    /**
     * Get password strength description
     */
    public String getPasswordStrengthDescription(String password) {
        if (password == null || password.length() < 8) {
            return "Too short (minimum 8 characters)";
        }
        
        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSpecial = password.matches(".*[@$!%*?&].*");
        
        int score = (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasDigit ? 1 : 0) + (hasSpecial ? 1 : 0);
        
        switch (score) {
            case 4: return "Strong";
            case 3: return "Good";
            case 2: return "Fair";
            default: return "Weak";
        }
    }
}