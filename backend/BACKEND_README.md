y# Banking Hub Backend API

A comprehensive banking backend API built with **Java 17**, **Spring Boot 3.2**, **PostgreSQL**, and **JWT Authentication**. This API provides all the necessary endpoints for a modern banking web application.

## 🏗️ Architecture

The project follows a **layered architecture** pattern with clear separation of concerns:

- **Controller Layer**: REST endpoints and request/response handling
- **Service Layer**: Business logic and transaction management
- **Repository Layer**: Data access using JPA/Hibernate
- **Security Layer**: JWT-based authentication and authorization
- **Exception Handling**: Global exception handlers with structured error responses

## 🚀 Features

### Authentication & Security
- ✅ JWT-based authentication
- ✅ Password encryption (BCrypt)
- ✅ User registration and login
- ✅ Role-based access control
- 🔄 Two-factor authentication support (entities ready)
- ✅ Secure password validation

### Core Banking Features
- ✅ **User Management**: Registration, authentication, profile management
- 🔄 **Account Management**: Multiple account types (Checking, Savings, Credit Card, Loan, Investment)
- 🔄 **Transaction Processing**: Deposits, withdrawals, transfers, payments
- 🔄 **Bill Management**: Bill payments, recurring bills, auto-pay
- 🔄 **Budget Tracking**: Category-based budgeting, alerts, analytics
- 🔄 **Fund Transfers**: Internal, external, and P2P transfers

### Technical Features
- ✅ Comprehensive API documentation (Swagger/OpenAPI)
- ✅ Global exception handling
- ✅ Input validation
- ✅ Database auditing (created/updated timestamps)
- ✅ CORS configuration
- ✅ Multiple environment profiles (dev, prod, test)

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Language** | Java 17 |
| **Framework** | Spring Boot 3.2 |
| **Security** | Spring Security + JWT |
| **Database** | PostgreSQL (Production), H2 (Testing) |
| **ORM** | JPA/Hibernate |
| **Documentation** | SpringDoc OpenAPI 3 |
| **Build Tool** | Maven |
| **Validation** | Jakarta Bean Validation |
| **Testing** | JUnit 5, Spring Boot Test |

## 📋 Prerequisites

- **Java 17** or higher
- **Maven 3.8+**
- **PostgreSQL 12+** (for production)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd bankinghub
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended for Development)
```bash
# Create database
createdb banking_hub

# Update application.yml with your credentials
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Option B: Use H2 In-Memory Database
```bash
# Run with test profile (uses H2)
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### 3. Environment Variables
Create a `.env` file or set environment variables:

```env
DB_USERNAME=banking_user
DB_PASSWORD=banking_password
JWT_SECRET=your-very-long-and-secure-secret-key-here
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Run the Application

```bash
# Development mode
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or build and run
mvn clean package
java -jar target/banking-backend-0.0.1-SNAPSHOT.jar
```

The API will be available at: `http://localhost:8080/api/v1`

## 📚 API Documentation

### Swagger UI
Visit `http://localhost:8080/api/v1/swagger-ui.html` for interactive API documentation.

### Core Endpoints

#### Authentication
```http
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
GET  /api/v1/auth/me          # Get current user
GET  /api/v1/auth/health      # Health check
```

#### Accounts (Planned)
```http
GET    /api/v1/accounts           # List user accounts
POST   /api/v1/accounts           # Create account
GET    /api/v1/accounts/{id}      # Get account details
PUT    /api/v1/accounts/{id}      # Update account
DELETE /api/v1/accounts/{id}      # Delete account
```

#### Transactions (Planned)
```http
GET    /api/v1/accounts/{id}/transactions    # List transactions
POST   /api/v1/transactions                  # Create transaction
GET    /api/v1/transactions/{id}             # Get transaction
GET    /api/v1/transactions/export           # Export transactions
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and authentication
- `accounts` - Bank accounts (checking, savings, etc.)
- `transactions` - All financial transactions
- `bills` - Bill payments and payees
- `budgets` - Budget categories and tracking
- `transfers` - Fund transfers between accounts

### Key Relationships
- User (1) → Accounts (Many)
- Account (1) → Transactions (Many)
- User (1) → Bills (Many)
- User (1) → Budgets (Many)
- Account (Many) → Transfer (Many) - From/To relationship

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with specific profile
mvn test -Dspring.profiles.active=test

# Run with coverage
mvn clean test jacoco:report
```

## 🌍 Environment Profiles

### Development (`dev`)
- Uses PostgreSQL
- DDL auto-generation enabled
- Debug logging
- SQL logging enabled

### Production (`prod`)
- Uses production database URL
- DDL validation only
- Minimal logging
- Performance optimized

### Test (`test`)
- Uses H2 in-memory database
- Fast startup
- Comprehensive logging

## 📁 Project Structure

```
src/main/java/com/bankinghub/backend/
├── BankingBackendApplication.java      # Main application class
├── config/                             # Configuration classes
│   └── OpenApiConfig.java             # Swagger configuration
├── controller/                         # REST controllers
│   └── AuthController.java            # Authentication endpoints
├── dto/                                # Data Transfer Objects
│   ├── request/                        # Request DTOs
│   └── response/                       # Response DTOs
├── exception/                          # Exception handling
│   ├── GlobalExceptionHandler.java    # Global error handling
│   ├── CustomBusinessException.java   # Business logic exceptions
│   └── ResourceNotFoundException.java # Resource not found
├── model/                              # JPA entities
│   ├── User.java                      # User entity
│   ├── Account.java                   # Account entity
│   ├── Transaction.java               # Transaction entity
│   ├── Bill.java                      # Bill entity
│   ├── Budget.java                    # Budget entity
│   └── Transfer.java                  # Transfer entity
├── repository/                         # JPA repositories
│   ├── UserRepository.java           # User data access
│   ├── AccountRepository.java        # Account data access
│   └── ... (other repositories)
├── security/                          # Security configuration
│   ├── SecurityConfig.java           # Spring Security config
│   ├── JwtTokenProvider.java         # JWT token handling
│   ├── JwtAuthenticationFilter.java  # JWT filter
│   ├── CustomUserDetailsService.java # User details service
│   ├── UserPrincipal.java            # User principal
│   └── AuthEntryPointJwt.java        # Auth entry point
└── service/                           # Business logic
    └── AuthService.java               # Authentication service
```

## 🔐 Security Features

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Password Hashing**: BCrypt with strength 12
- **CORS Protection**: Configurable CORS policies
- **Input Validation**: Jakarta Bean Validation with custom validators
- **SQL Injection Protection**: JPA/Hibernate parameterized queries
- **Exception Sanitization**: Structured error responses without sensitive data

## 🚀 Deployment

### Local Development
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production
```bash
# Build
mvn clean package -Dspring.profiles.active=prod

# Run
java -jar -Dspring.profiles.active=prod target/banking-backend-0.0.1-SNAPSHOT.jar
```

### Docker (Optional)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/banking-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 📈 Next Steps

### Immediate Priorities
1. ✅ Complete remaining service implementations (Account, Transaction, Bill, Budget, Transfer)
2. ✅ Implement MapStruct mappers for DTO conversions
3. ✅ Add comprehensive unit and integration tests
4. ✅ Implement utility classes (validation, email, file export)

### Advanced Features
- Email notifications for transactions and alerts
- Transaction categorization with AI/ML
- Real-time transaction processing
- Advanced reporting and analytics
- API rate limiting
- Audit logging
- Multi-currency support
- Integration with external payment processors

## 👨‍💻 Author

**Melvin Musonda Chibanda**
- Email: melvinchibanda@gmail.com
- GitHub: [Your GitHub Profile]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: melvinchibanda@gmail.com

---

**Status**: 🚧 **Under Development** - Core authentication and user management features are complete. Additional banking features are being implemented.