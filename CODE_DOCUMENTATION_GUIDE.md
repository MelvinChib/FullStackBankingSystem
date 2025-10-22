# Code Documentation Guide - SwiftBank

This guide explains the documentation standards for the SwiftBank Full-Stack Banking System codebase.

---

## 📚 Documentation Standards

### Backend (Java)

**Use JavaDoc for all public classes, methods, and interfaces:**

```java
/**
 * Service class for managing user accounts in the banking system.
 * Handles account creation, updates, and retrieval operations.
 * 
 * @author Melvin Musonda Chibanda
 * @version 2.0.0
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
public class AccountService {
    
    private final AccountRepository accountRepository;
    
    /**
     * Creates a new bank account for a user.
     * 
     * @param userId The ID of the user creating the account
     * @param accountRequest The account details including type and initial balance
     * @return AccountResponseDTO containing the created account details
     * @throws ResourceNotFoundException if user is not found
     * @throws CustomBusinessException if account creation fails
     */
    public AccountResponseDTO createAccount(Long userId, AccountRequestDTO accountRequest) {
        // Implementation
    }
}
```

### Frontend (JavaScript/React)

**Use JSDoc for all components and functions:**

```javascript
/**
 * Login component for SwiftBank authentication.
 * Handles user login with email/password and 2FA verification.
 * 
 * @component
 * @author Melvin Musonda Chibanda
 * @version 2.0.0
 * 
 * @example
 * <Login />
 * 
 * @returns {JSX.Element} The login page with form and 2FA support
 */
const Login = () => {
    /**
     * Handles user login submission.
     * Validates credentials and initiates 2FA if required.
     * 
     * @param {Object} formData - The login form data
     * @param {string} formData.email - User's email address
     * @param {string} formData.password - User's password
     * @returns {Promise<void>}
     */
    const handleLogin = async (formData) => {
        // Implementation
    };
}
```

---

## 🗂️ File-Level Documentation

### Every file should start with a header comment:

**Java:**
```java
/**
 * SwiftBank - Full-Stack Banking System
 * 
 * File: AccountController.java
 * Package: com.bankinghub.backend.controller
 * 
 * Description: REST controller for account management operations.
 * Provides endpoints for creating, reading, updating, and deleting accounts.
 * 
 * @author Melvin Musonda Chibanda
 * @version 2.0.0
 * @since 1.0.0
 */
package com.bankinghub.backend.controller;
```

**JavaScript:**
```javascript
/**
 * SwiftBank - Full-Stack Banking System
 * 
 * File: api.js
 * Path: frontend/src/services/api.js
 * 
 * Description: API service for handling all HTTP requests to the backend.
 * Provides methods for authentication, account management, and transactions.
 * 
 * @author Melvin Musonda Chibanda
 * @version 2.0.0
 * @since 1.0.0
 */
```

---

## 📝 Inline Comments

### When to add inline comments:

1. **Complex Logic:**
```java
// Calculate compound interest using the formula: A = P(1 + r/n)^(nt)
// where P = principal, r = rate, n = compounds per year, t = time
double interest = principal * Math.pow(1 + (rate / compoundsPerYear), compoundsPerYear * years);
```

2. **Business Rules:**
```java
// Business rule: Minimum balance for savings account is $100
if (accountType == AccountType.SAVINGS && balance < 100) {
    throw new CustomBusinessException("Savings account requires minimum $100 balance");
}
```

3. **Security Considerations:**
```java
// Security: Hash password with BCrypt strength 12 before storing
String hashedPassword = passwordEncoder.encode(rawPassword);
```

4. **TODO and FIXME:**
```java
// TODO: Implement email notification for large transactions
// FIXME: Handle edge case when account is locked
```

---

## 🎯 Method Documentation

### Required for all public methods:

**Parameters:**
- `@param` - Describe each parameter
- Include type and purpose

**Returns:**
- `@return` - Describe what is returned
- Include type and meaning

**Exceptions:**
- `@throws` - List all exceptions that can be thrown
- Explain when each exception occurs

**Example:**
```java
/**
 * Transfers funds between two accounts.
 * Validates sufficient balance and account status before transfer.
 * 
 * @param fromAccountId The source account ID
 * @param toAccountId The destination account ID
 * @param amount The amount to transfer (must be positive)
 * @return TransferResponseDTO containing transfer details and confirmation
 * @throws ResourceNotFoundException if either account is not found
 * @throws InsufficientFundsException if source account has insufficient balance
 * @throws AccountLockedException if either account is locked
 * @throws IllegalArgumentException if amount is negative or zero
 */
public TransferResponseDTO transferFunds(Long fromAccountId, Long toAccountId, BigDecimal amount) {
    // Implementation
}
```

---

## 🔧 Configuration Files

### Document all configuration properties:

**application.yml:**
```yaml
# Database Configuration
spring:
  datasource:
    # PostgreSQL connection URL for production database
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:swiftbank}
    # Database username (set via environment variable)
    username: ${DB_USERNAME}
    # Database password (set via environment variable)
    password: ${DB_PASSWORD}

# JWT Security Configuration
app:
  jwt:
    # Secret key for JWT token signing (minimum 256 bits)
    secret: ${JWT_SECRET}
    # Token expiration time in milliseconds (24 hours)
    expiration: 86400000
```

---

## 📊 API Endpoint Documentation

### Document all REST endpoints:

```java
/**
 * Creates a new bank account for the authenticated user.
 * 
 * Endpoint: POST /api/v1/accounts
 * Authentication: Required (JWT Bearer token)
 * 
 * Request Body:
 * {
 *   "accountType": "CHECKING",
 *   "accountName": "My Checking Account",
 *   "initialBalance": 1000.00
 * }
 * 
 * Response: 201 Created
 * {
 *   "id": 1,
 *   "accountNumber": "SWB1234567890",
 *   "accountType": "CHECKING",
 *   "balance": 1000.00,
 *   "createdAt": "2025-01-01T00:00:00Z"
 * }
 * 
 * Error Responses:
 * - 400 Bad Request: Invalid account data
 * - 401 Unauthorized: Missing or invalid JWT token
 * - 409 Conflict: Account already exists
 * 
 * @param accountRequest The account creation request
 * @return ResponseEntity with created account details
 */
@PostMapping
public ResponseEntity<AccountResponseDTO> createAccount(@RequestBody AccountRequestDTO accountRequest) {
    // Implementation
}
```

---

## 🧪 Test Documentation

### Document test cases:

```java
/**
 * Test suite for AccountService.
 * Tests account creation, retrieval, updates, and deletion.
 */
@SpringBootTest
class AccountServiceTest {
    
    /**
     * Test: Creating a new checking account with valid data.
     * Expected: Account is created successfully with generated account number.
     */
    @Test
    void testCreateAccount_ValidData_Success() {
        // Arrange
        AccountRequestDTO request = new AccountRequestDTO();
        request.setAccountType(AccountType.CHECKING);
        request.setInitialBalance(BigDecimal.valueOf(1000));
        
        // Act
        AccountResponseDTO response = accountService.createAccount(1L, request);
        
        // Assert
        assertNotNull(response);
        assertEquals(AccountType.CHECKING, response.getAccountType());
        assertTrue(response.getAccountNumber().startsWith("SWB"));
    }
}
```

---

## 🎨 Component Documentation (React)

### Document React components:

```javascript
/**
 * AccountCard Component
 * 
 * Displays a single bank account with balance, account number, and quick actions.
 * Supports multiple account types (Checking, Savings, Credit Card, etc.)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.account - Account data object
 * @param {string} props.account.id - Account ID
 * @param {string} props.account.accountNumber - Account number
 * @param {string} props.account.accountType - Type of account
 * @param {number} props.account.balance - Current balance
 * @param {Function} props.onViewDetails - Callback when view details is clicked
 * @param {Function} props.onTransfer - Callback when transfer is clicked
 * 
 * @example
 * <AccountCard 
 *   account={accountData}
 *   onViewDetails={handleViewDetails}
 *   onTransfer={handleTransfer}
 * />
 * 
 * @returns {JSX.Element} Rendered account card
 */
const AccountCard = ({ account, onViewDetails, onTransfer }) => {
    // Implementation
};
```

---

## 🔐 Security Documentation

### Document security-related code:

```java
/**
 * Security Configuration for SwiftBank.
 * 
 * Implements:
 * - JWT-based authentication
 * - BCrypt password hashing (strength 12)
 * - CORS protection
 * - CSRF protection
 * - Security headers (HSTS, X-Frame-Options, CSP)
 * 
 * Security Features:
 * - All endpoints require authentication except /auth/login and /auth/register
 * - Passwords are hashed with BCrypt before storage
 * - JWT tokens expire after 24 hours
 * - Rate limiting applied to prevent brute force attacks
 * 
 * @author Melvin Musonda Chibanda
 * @version 2.0.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Implementation
}
```

---

## 📋 Documentation Checklist

Before committing code, ensure:

- [ ] File header comment added
- [ ] All public classes documented
- [ ] All public methods documented
- [ ] Complex logic has inline comments
- [ ] Security considerations noted
- [ ] API endpoints documented
- [ ] Error handling documented
- [ ] Examples provided where helpful
- [ ] TODOs and FIXMEs marked
- [ ] Version and author information included

---

## 🛠️ Tools for Documentation

### Backend (Java):
- **JavaDoc**: Generate HTML documentation
  ```bash
  mvn javadoc:javadoc
  ```

### Frontend (JavaScript):
- **JSDoc**: Generate HTML documentation
  ```bash
  npm run docs
  ```

### API Documentation:
- **Swagger/OpenAPI**: Auto-generated from annotations
  - Access at: http://localhost:8080/swagger-ui.html

---

## 📖 Documentation Examples by File Type

### Controllers:
- Document each endpoint
- Include request/response examples
- List all possible error codes

### Services:
- Document business logic
- Explain validation rules
- Note transaction boundaries

### Repositories:
- Document custom queries
- Explain complex JPA operations

### DTOs:
- Document each field
- Include validation rules
- Provide example JSON

### Components:
- Document props
- Include usage examples
- Note state management

---

## 🎯 Best Practices

1. **Keep it concise** - Don't over-document obvious code
2. **Update regularly** - Keep docs in sync with code
3. **Use examples** - Show how to use the code
4. **Explain why** - Not just what, but why
5. **Link related docs** - Reference other files/methods
6. **Version changes** - Note when features were added/changed

---

**SwiftBank - Full-Stack Banking System**

*Documentation Standards v2.0.0*

*Author: Melvin Musonda Chibanda*
