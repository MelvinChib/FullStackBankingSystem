# 🏦 SwiftBank - Backend

Spring Boot backend for SwiftBank banking application.

## 🚀 Features

- **Spring Boot 3.2** - Modern Java framework with latest features
- **Spring Security** - JWT-based authentication and authorization
- **JPA/Hibernate** - Advanced ORM with entity relationships
- **PostgreSQL** - Production database support
- **H2 Database** - In-memory database for testing
- **Spring Actuator** - Health checks and metrics
- **OpenAPI/Swagger** - API documentation
- **BCrypt** - Secure password hashing (strength 12)
- **iText7** - PDF statement generation
- **OpenAI Integration** - AI-powered customer support
- **Email Support** - SMTP email notifications

## 📋 Prerequisites

- **Java 17** (JDK) - Required, not Java 21
- **Maven 3.8+**
- **PostgreSQL 12+** (optional, H2 available for testing)

## 🛠️ Quick Start

### Option A: Using Helper Script (Recommended)

```bash
chmod +x run-backend.sh
./run-backend.sh
```

### Option B: Manual Setup

**1. Verify Java Version:**
```bash
java -version  # Must be Java 17

# If not Java 17, set JAVA_HOME:
export JAVA_HOME=$(/usr/libexec/java_home -v 17)  # macOS
# export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64  # Linux
```

**2. Build Application:**
```bash
mvn clean install
```

**3. Run with H2 (Testing):**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

**4. Run with PostgreSQL (Production):**
```bash
# Set environment variables
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
export JWT_SECRET=your-256-bit-secret-key

mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 📁 Project Structure

```
backend/
├── src/main/java/com/bankinghub/backend/
│   ├── controller/          # REST API Controllers
│   │   ├── AuthController.java
│   │   ├── AccountController.java
│   │   ├── TransactionController.java
│   │   ├── BillController.java
│   │   └── CustomerSupportController.java
│   ├── service/             # Business Logic Layer
│   │   ├── UserService.java
│   │   ├── AccountService.java
│   │   ├── TransactionService.java
│   │   └── CustomerSupportService.java
│   ├── repository/          # Data Access Layer (JPA)
│   │   ├── UserRepository.java
│   │   ├── AccountRepository.java
│   │   └── TransactionRepository.java
│   ├── model/               # JPA Entities
│   │   ├── User.java
│   │   ├── Account.java
│   │   ├── Transaction.java
│   │   └── Bill.java
│   ├── dto/                 # Data Transfer Objects
│   │   ├── request/
│   │   └── response/
│   ├── security/            # Security Configuration
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   ├── config/              # Application Configuration
│   │   ├── SecurityProperties.java
│   │   └── OpenApiConfig.java
│   ├── exception/           # Exception Handling
│   │   ├── GlobalExceptionHandler.java
│   │   └── CustomExceptions.java
│   └── util/                # Utility Classes
│       └── ValidationUtils.java
├── src/main/resources/
│   ├── application.yml              # Main configuration
│   ├── application-test.yml         # Test profile (H2)
│   ├── application-dev.yml          # Development profile
│   └── application-prod.yml         # Production profile
├── src/test/                        # Unit and Integration Tests
├── pom.xml                          # Maven dependencies
└── run-backend.sh                   # Helper startup script
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | Yes | test | Active profile: test, dev, prod |
| `DB_HOST` | Prod | localhost | Database host |
| `DB_PORT` | Prod | 5432 | Database port |
| `DB_NAME` | Prod | swiftbank | Database name |
| `DB_USERNAME` | Prod | - | Database username |
| `DB_PASSWORD` | Prod | - | Database password |
| `JWT_SECRET` | Yes | - | JWT signing key (256-bit min) |
| `JWT_EXPIRATION` | No | 86400000 | Token expiration (milliseconds) |
| `OPENAI_API_KEY` | No | - | OpenAI API key for AI support |
| `SMTP_HOST` | Prod | - | Email server host |
| `SMTP_PORT` | Prod | 587 | Email server port |
| `SMTP_USERNAME` | Prod | - | Email username |
| `SMTP_PASSWORD` | Prod | - | Email password |

### Application Profiles

**test** - H2 in-memory database (no setup required):
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

**dev** - PostgreSQL development:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**prod** - PostgreSQL production:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Account Management
- `GET /api/v1/accounts` - List user accounts
- `POST /api/v1/accounts` - Create account
- `GET /api/v1/accounts/{id}` - Get account details
- `PUT /api/v1/accounts/{id}` - Update account
- `DELETE /api/v1/accounts/{id}` - Delete account

### Transactions
- `GET /api/v1/transactions` - List transactions
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions/{id}` - Get transaction details

### Statement Export
- `GET /api/v1/accounts/{id}/statement/pdf` - Export PDF
- `GET /api/v1/accounts/{id}/statement/csv` - Export CSV
- `GET /api/v1/accounts/{id}/statement/text` - Export Text

### Customer Support
- `POST /api/v1/customer-support/chat` - AI chat
- `GET /api/v1/customer-support/categories` - Support categories
- `GET /api/v1/customer-support/quick-help` - Quick help topics

### Health & Monitoring
- `GET /actuator/health` - Health check
- `GET /actuator/metrics` - Application metrics
- `GET /actuator/info` - Application info

## 📚 API Documentation

Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn clean test jacoco:report

# Run specific test
mvn test -Dtest=UserServiceTest
```

## 🐛 Troubleshooting

### Port 8080 already in use
```bash
lsof -ti:8080 | xargs kill -9
```

### Java version mismatch
```bash
# Verify Java 17
java -version

# Set JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Recompile
mvn clean install
```

### Database connection failed
```bash
# Use H2 for testing
mvn spring-boot:run -Dspring-boot.run.profiles=test

# Check PostgreSQL
psql -U postgres -c "SELECT version();"
```

## 🔒 Security Features

- JWT authentication with secure token management
- BCrypt password hashing (strength 12)
- SQL injection protection (JPA parameterized queries)
- XSS protection (input sanitization)
- CSRF protection (Spring Security)
- Rate limiting
- Security headers (HSTS, X-Frame-Options, CSP)
- Input validation (Jakarta Bean Validation)
- Comprehensive error handling

## 📦 Dependencies

- Spring Boot 3.2.0
- Spring Security 6.x
- Spring Data JPA
- PostgreSQL Driver
- H2 Database
- Lombok
- iText7 (PDF generation)
- SpringDoc OpenAPI
- Jakarta Validation

## 📞 Support

For issues and questions:
- 📧 Email: melvinchibanda@gmail.com
- 📚 Documentation: See main README.md
- 🐛 Issues: Create GitHub issue

---

**Developed by Melvin Musonda Chibanda**

*SwiftBank Backend - Secure & Scalable* 🇿🇲
