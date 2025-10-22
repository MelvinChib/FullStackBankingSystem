# 🔒 SwiftBank - Security Configuration Guide

## 🛡️ Production Security Setup

### **Environment Variables (Required)**

#### **Frontend (.env)**
```bash
# API Configuration
VITE_API_URL=https://api.melvinbank-zambia.com/api/v1
VITE_APP_NAME=SwiftBank

# Demo Mode (DISABLE in production)
VITE_ENABLE_DEMO=false

# Google Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### **Backend Environment Variables**
```bash
# Database
DB_USERNAME=secure_db_user
DB_PASSWORD=secure_db_password_2024
DATABASE_URL=jdbc:postgresql://db-host:5432/melvinbank_prod

# JWT Security
JWT_SECRET=very-long-secure-jwt-secret-key-for-production-2024
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=https://melvinbank-zambia.com,https://www.melvinbank-zambia.com

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=noreply@melvinbank-zambia.com
MAIL_PASSWORD=secure_app_password

# Optional: AI Support
OPENAI_API_KEY=sk-your-openai-key-here
```

## 🔐 AWS Secrets Manager Integration (Recommended)

### **Backend Integration**
```java
// Add to pom.xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>secretsmanager</artifactId>
    <version>2.20.0</version>
</dependency>

// Create SecretsManagerConfig.java
@Configuration
public class SecretsManagerConfig {
    
    @Value("${aws.secretsmanager.secret-name:melvinbank-secrets}")
    private String secretName;
    
    @Bean
    public SecretsManagerClient secretsManagerClient() {
        return SecretsManagerClient.builder()
            .region(Region.US_EAST_1)
            .build();
    }
    
    @PostConstruct
    public void loadSecrets() {
        // Load secrets and set system properties
        GetSecretValueRequest request = GetSecretValueRequest.builder()
            .secretId(secretName)
            .build();
            
        GetSecretValueResponse response = secretsManagerClient().getSecretValue(request);
        // Parse JSON and set environment variables
    }
}
```

### **AWS Secrets Structure**
```json
{
  "db_username": "secure_db_user",
  "db_password": "secure_db_password",
  "jwt_secret": "very-long-secure-jwt-secret",
  "openai_api_key": "sk-your-openai-key",
  "mail_password": "secure_app_password"
}
```

## 🚫 Security Violations Removed

### **Before (Insecure)**
```javascript
// ❌ Hardcoded credentials
const demoEmail = 'demo@bankinghub.com';
const demoPassword = 'demo123';
const accessToken = 'demo-access-token';
```

### **After (Secure)**
```javascript
// ✅ Environment-based only
const demoEmail = import.meta?.env?.VITE_DEMO_EMAIL;
const demoPassword = import.meta?.env?.VITE_DEMO_PASSWORD;
const accessToken = `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
```

## 🔧 Production Deployment Checklist

### **Security Configuration**
- [ ] All environment variables set from secure sources
- [ ] No hardcoded credentials in codebase
- [ ] Demo mode disabled (`VITE_ENABLE_DEMO=false`)
- [ ] HTTPS enabled for all communications
- [ ] Strong JWT secret (minimum 32 characters)
- [ ] Database credentials secured
- [ ] CORS properly configured for production domains

### **Infrastructure Security**
- [ ] Database access restricted to application servers
- [ ] API rate limiting enabled
- [ ] Security headers configured
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Monitoring and alerting enabled

### **Code Security**
- [ ] Dependencies updated to latest secure versions
- [ ] Security scanning completed
- [ ] Input validation enabled
- [ ] Error handling sanitized
- [ ] Logging configured (no sensitive data)

## 🔍 Security Verification Commands

### **Check for Hardcoded Secrets**
```bash
# Scan for potential hardcoded credentials
grep -r "password\|secret\|key\|token" --include="*.js" --include="*.jsx" --include="*.java" src/
```

### **Environment Variable Validation**
```bash
# Verify all required environment variables are set
node -e "
const required = ['VITE_API_URL', 'DB_USERNAME', 'DB_PASSWORD', 'JWT_SECRET'];
required.forEach(env => {
  if (!process.env[env]) console.error(\`Missing: \${env}\`);
});
"
```

## 🚨 Security Monitoring

### **Application Monitoring**
- Monitor failed login attempts
- Track API rate limits
- Alert on security exceptions
- Log security events (without sensitive data)

### **Infrastructure Monitoring**
- Database connection monitoring
- SSL certificate expiration alerts
- Unusual traffic pattern detection
- Security patch notifications

## 📋 Compliance Standards

### **OWASP Top 10 Protection**
- ✅ A01: Broken Access Control - Role-based access implemented
- ✅ A02: Cryptographic Failures - BCrypt password hashing
- ✅ A03: Injection - Input validation and sanitization
- ✅ A04: Insecure Design - Secure architecture patterns
- ✅ A05: Security Misconfiguration - Proper configuration management
- ✅ A06: Vulnerable Components - Dependency management
- ✅ A07: Authentication Failures - JWT with proper validation
- ✅ A08: Software Integrity Failures - Secure build process
- ✅ A09: Logging Failures - Security-aware logging
- ✅ A10: Server-Side Request Forgery - Input validation

### **Banking Security Standards**
- PCI DSS compliance considerations
- Data encryption at rest and in transit
- Audit trail maintenance
- Incident response procedures
- Regular security assessments

---

**⚠️ Important**: Never commit `.env` files or any files containing actual credentials to version control. Use `.env.example` as templates only.