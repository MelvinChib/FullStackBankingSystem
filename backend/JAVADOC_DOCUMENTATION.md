# JavaDoc Documentation Guide

## Overview
This document provides a comprehensive guide to the JavaDoc documentation added to all classes in the SwiftBank backend application.

## Documentation Standards

All classes follow these JavaDoc standards:
- **Class-level documentation**: Describes the purpose, functionality, and relationships
- **Field documentation**: Explains each field's purpose and constraints
- **Method documentation**: Describes parameters, return values, and exceptions
- **Author**: Melvin Musonda Chibanda
- **Version**: 2.0.0
- **Since**: 1.0.0

## Package Structure

### 1. Model Package (`com.bankinghub.backend.model`)

#### User.java
- **Purpose**: Represents a banking system user with authentication and personal details
- **Key Features**:
  - JWT authentication support
  - BCrypt password hashing (strength 12)
  - Role-based access control (USER/ADMIN)
  - Two-factor authentication support
  - Relationships: accounts, bills, budgets

#### Account.java
- **Purpose**: Represents a bank account
- **Key Features**:
  - Multiple account types (CHECKING, SAVINGS, CREDIT_CARD, LOAN, INVESTMENT)
  - Balance tracking with BigDecimal precision
  - Credit limit and interest rate support
  - Relationships: transactions, transfers

#### Transaction.java
- **Purpose**: Represents a financial transaction
- **Key Features**:
  - Multiple transaction types (DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT, etc.)
  - Transaction status tracking (PENDING, COMPLETED, FAILED, CANCELLED)
  - Balance tracking after transaction
  - Category and merchant information

#### Bill.java
- **Purpose**: Represents a bill payment
- **Key Features**:
  - Recurring bill support
  - Auto-pay functionality
  - Bill status tracking (PENDING, PAID, OVERDUE, CANCELLED, SCHEDULED)
  - Recurrence frequencies (WEEKLY, MONTHLY, QUARTERLY, ANNUALLY)

#### Budget.java
- **Purpose**: Represents a budget for expense tracking
- **Key Features**:
  - Category-based budgeting
  - Alert thresholds
  - Budget period support (WEEKLY, MONTHLY, QUARTERLY, YEARLY)
  - Automatic spent percentage calculation
  - Over-budget detection

#### Transfer.java
- **Purpose**: Represents money transfers between accounts
- **Key Features**:
  - Internal and external transfers
  - Transfer status tracking
  - Fee calculation
  - Scheduled transfers
  - External bank details support

### 2. Repository Package (`com.bankinghub.backend.repository`)

All repositories extend `JpaRepository` and provide:
- CRUD operations
- Custom query methods
- Spring Data JPA integration

#### UserRepository.java
- Find by email
- Check email existence
- User authentication queries

#### AccountRepository.java
- Find by user
- Find by account number
- Active account queries

#### TransactionRepository.java
- Find by account
- Date range queries
- Transaction type filtering

#### BillRepository.java
- Find by user
- Due date queries
- Status filtering

#### BudgetRepository.java
- Find by user and category
- Active budget queries
- Date range filtering

#### TransferRepository.java
- Find by account
- Status filtering
- Date range queries

### 3. Service Package (`com.bankinghub.backend.service`)

#### AuthService.java
- **Purpose**: Handles user authentication and authorization
- **Key Methods**:
  - `login()`: Authenticates user and generates JWT token
  - `register()`: Creates new user account
  - `validateToken()`: Validates JWT token

#### AccountService.java
- **Purpose**: Manages account operations
- **Key Methods**:
  - `createAccount()`: Creates new bank account
  - `getAccountsByUser()`: Retrieves user accounts
  - `updateBalance()`: Updates account balance
  - `deactivateAccount()`: Deactivates account

#### StatementExportService.java
- **Purpose**: Generates account statements in multiple formats
- **Key Methods**:
  - `exportPDF()`: Generates PDF statement
  - `exportCSV()`: Generates CSV statement
  - `exportText()`: Generates text statement

#### CustomerSupportService.java
- **Purpose**: Provides AI-powered customer support
- **Key Methods**:
  - `chat()`: Processes customer support queries
  - `getQuickHelp()`: Returns quick help topics
  - `getCategories()`: Returns support categories

#### EmailService.java
- **Purpose**: Sends email notifications
- **Key Methods**:
  - `sendWelcomeEmail()`: Sends welcome email to new users
  - `sendAccountCreatedEmail()`: Notifies account creation
  - `sendTransactionAlert()`: Sends transaction notifications

#### BudgetService.java
- **Purpose**: Manages budget operations
- **Key Methods**:
  - `createBudget()`: Creates new budget
  - `updateSpent()`: Updates spent amount
  - `checkAlerts()`: Checks budget alerts

#### UserRegistrationService.java
- **Purpose**: Handles user registration workflow
- **Key Methods**:
  - `registerUser()`: Registers new user
  - `createDefaultAccount()`: Creates default checking account
  - `generateAccountNumber()`: Generates unique account number

### 4. Controller Package (`com.bankinghub.backend.controller`)

All controllers follow REST API best practices:
- Proper HTTP status codes
- Request/Response DTOs
- Exception handling
- JWT authentication

#### AuthController.java
- **Endpoints**:
  - `POST /api/v1/auth/register`: User registration
  - `POST /api/v1/auth/login`: User login
  - `GET /api/v1/auth/me`: Get current user

#### AccountController.java
- **Endpoints**:
  - `GET /api/v1/accounts`: List accounts
  - `POST /api/v1/accounts`: Create account
  - `GET /api/v1/accounts/{id}`: Get account details
  - `PUT /api/v1/accounts/{id}`: Update account
  - `DELETE /api/v1/accounts/{id}`: Delete account
  - `GET /api/v1/accounts/{id}/statement/{format}`: Export statement

#### CustomerSupportController.java
- **Endpoints**:
  - `POST /api/v1/customer-support/chat`: AI chat
  - `GET /api/v1/customer-support/categories`: Support categories
  - `GET /api/v1/customer-support/quick-help`: Quick help topics

#### BudgetController.java
- **Endpoints**:
  - `GET /api/v1/budgets`: List budgets
  - `POST /api/v1/budgets`: Create budget
  - `GET /api/v1/budgets/{id}`: Get budget details
  - `PUT /api/v1/budgets/{id}`: Update budget
  - `DELETE /api/v1/budgets/{id}`: Delete budget

#### UserRegistrationController.java
- **Endpoints**:
  - `POST /api/v1/registration/register`: Register new user

### 5. Security Package (`com.bankinghub.backend.security`)

#### JwtTokenProvider.java
- **Purpose**: Generates and validates JWT tokens
- **Key Methods**:
  - `generateToken()`: Creates JWT token
  - `validateToken()`: Validates token
  - `getUserIdFromToken()`: Extracts user ID
  - `getExpirationDate()`: Gets token expiration

#### JwtAuthenticationFilter.java
- **Purpose**: Filters and validates JWT tokens in requests
- **Key Features**:
  - Extracts token from Authorization header
  - Validates token
  - Sets authentication in SecurityContext

#### SecurityConfig.java
- **Purpose**: Configures Spring Security
- **Key Features**:
  - JWT authentication
  - CORS configuration
  - Password encoding (BCrypt strength 12)
  - Public/protected endpoints
  - Security headers

#### CustomUserDetailsService.java
- **Purpose**: Loads user details for authentication
- **Key Methods**:
  - `loadUserByUsername()`: Loads user by email

#### UserPrincipal.java
- **Purpose**: Represents authenticated user principal
- **Key Features**:
  - Implements UserDetails interface
  - Provides user authorities
  - Account status checks

#### AuthEntryPointJwt.java
- **Purpose**: Handles authentication errors
- **Key Features**:
  - Returns 401 Unauthorized for invalid tokens
  - Structured error responses

### 6. DTO Package (`com.bankinghub.backend.dto`)

#### Request DTOs
- **Purpose**: Validate and transfer request data
- **Key Features**:
  - Jakarta Bean Validation annotations
  - Input sanitization
  - Custom validators

#### Response DTOs
- **Purpose**: Structure response data
- **Key Features**:
  - Exclude sensitive information
  - Consistent response format
  - Proper serialization

### 7. Exception Package (`com.bankinghub.backend.exception`)

#### GlobalExceptionHandler.java
- **Purpose**: Centralized exception handling
- **Key Features**:
  - Handles all application exceptions
  - Returns structured error responses
  - Proper HTTP status codes
  - No sensitive information leakage

#### CustomBusinessException.java
- **Purpose**: Custom business logic exceptions
- **Key Features**:
  - Custom error messages
  - HTTP status code mapping

#### ResourceNotFoundException.java
- **Purpose**: Handles resource not found scenarios
- **Key Features**:
  - Returns 404 status
  - Descriptive error messages

#### ErrorResponse.java
- **Purpose**: Standardized error response structure
- **Key Features**:
  - Timestamp
  - Status code
  - Error message
  - Request path

### 8. Config Package (`com.bankinghub.backend.config`)

#### SecurityProperties.java
- **Purpose**: Externalized security configuration
- **Key Features**:
  - JWT configuration
  - CORS settings
  - Password strength requirements
  - Validation annotations

#### OpenApiConfig.java
- **Purpose**: Swagger/OpenAPI documentation configuration
- **Key Features**:
  - API information
  - Server URLs
  - Security schemes
  - Contact information

### 9. Mapper Package (`com.bankinghub.backend.mapper`)

#### AccountMapper.java
- **Purpose**: Maps between Account entity and DTOs
- **Key Methods**:
  - `toDTO()`: Converts entity to DTO
  - `toEntity()`: Converts DTO to entity

#### UserMapper.java
- **Purpose**: Maps between User entity and DTOs
- **Key Methods**:
  - `toDTO()`: Converts entity to DTO
  - `toEntity()`: Converts DTO to entity

### 10. Util Package (`com.bankinghub.backend.util`)

#### ValidationUtils.java
- **Purpose**: Custom validation utilities
- **Key Methods**:
  - `validateEmail()`: Email format validation
  - `validatePassword()`: Password strength validation
  - `sanitizeInput()`: Input sanitization

#### DateUtils.java
- **Purpose**: Date and time utilities
- **Key Methods**:
  - `formatDate()`: Formats dates
  - `parseDate()`: Parses date strings
  - `getDateRange()`: Calculates date ranges

## Documentation Generation

### Generate JavaDoc HTML
```bash
cd backend
mvn javadoc:javadoc
```

### View Generated Documentation
Open: `backend/target/site/apidocs/index.html`

### Generate JavaDoc JAR
```bash
mvn javadoc:jar
```

## Best Practices

1. **Keep documentation up-to-date**: Update JavaDoc when modifying code
2. **Be descriptive**: Explain the "why" not just the "what"
3. **Include examples**: Add code examples for complex methods
4. **Document exceptions**: List all possible exceptions
5. **Link related classes**: Use `@see` and `{@link}` tags
6. **Version tracking**: Update `@since` and `@version` tags

## Additional Resources

- [Oracle JavaDoc Guide](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Jakarta EE Documentation](https://jakarta.ee/)

---

**Author**: Melvin Musonda Chibanda  
**Email**: melvinchibanda@gmail.com  
**Version**: 2.0.0  
**Last Updated**: January 2025
